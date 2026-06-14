import os
import re
import time
import requests
import json
import google.generativeai as genai
from dotenv import load_dotenv
from wordpress_xmlrpc import Client, WordPressPost
from wordpress_xmlrpc.methods.posts import NewPost

# 1. Setup & Configuration
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# How many blogs to publish per run, and a safety net of niches in case
# automatic discovery fails (e.g. APIs are down or out of quota).
NUM_BLOGS = 5
FALLBACK_NICHES = [
    "wireless earbuds",
    "robot vacuums",
    "standing desks",
    "air fryers",
    "running shoes",
    "smart watches",
    "mens summer shorts",
    "portable power stations",
]


def get_gemini_model():
    """Pick the best available Gemini model that can generate content."""
    available_models = [
        m.name for m in genai.list_models()
        if 'generateContent' in m.supported_generation_methods
    ]
    selected_model = (
        'models/gemini-1.5-flash'
        if 'models/gemini-1.5-flash' in available_models
        else available_models[0]
    )
    print(f"🤖 Using model: {selected_model}")
    return genai.GenerativeModel(selected_model)


def get_top_niches(count=NUM_BLOGS):
    """Automatically discover the top trending, profitable niches.

    Searches the web for currently trending affiliate niches via Serper, then
    asks Gemini to distil the results into a clean list of niche names. Falls
    back to a curated list if either step fails.
    """
    print(f"🧭 Step 0: Discovering the top {count} trending niches...")
    api_key = os.getenv("SERPER_API_KEY")
    url = "https://google.serper.dev/search"
    payload = json.dumps({"q": "top trending profitable consumer product niches 2025"})
    headers = {'X-API-KEY': api_key, 'Content-Type': 'application/json'}

    search_context = ""
    try:
        response = requests.post(url, headers=headers, data=payload)
        results = response.json()
        organic = results.get("organic", [])
        search_context = "\n".join(
            f"- {r.get('title', '')}: {r.get('snippet', '')}" for r in organic
        )
    except Exception as e:
        print(f"⚠️ Serper Error while discovering niches: {e}")

    try:
        model = get_gemini_model()
        prompt = (
            f"Based on the search data below, list the top {count} trending, "
            "profitable consumer product niches that are well suited for an "
            "affiliate review blog. Each niche should be a short shoppable "
            "product category (2-4 words, e.g. 'wireless earbuds'). "
            "Return ONLY a JSON array of strings, no commentary.\n\n"
            f"Search data:\n{search_context}"
        )
        response = model.generate_content(prompt)
        niches = _parse_niche_list(response.text)
        if niches:
            niches = niches[:count]
            print(f"✅ Discovered niches: {', '.join(niches)}")
            return niches
    except Exception as e:
        print(f"⚠️ Gemini Error while discovering niches: {e}")

    print("↩️ Falling back to curated niche list.")
    return FALLBACK_NICHES[:count]


def _parse_niche_list(text):
    """Extract a list of niche strings from a model response."""
    if not text:
        return []
    # Strip code fences like ```json ... ```
    cleaned = re.sub(r"```(?:json)?", "", text).replace("```", "").strip()
    try:
        data = json.loads(cleaned)
        if isinstance(data, list):
            return [str(n).strip() for n in data if str(n).strip()]
    except Exception:
        pass
    # Fallback: parse bullet / numbered lines
    niches = []
    for line in cleaned.splitlines():
        line = line.strip(" \t-*0123456789.").strip(' "\'')
        if line:
            niches.append(line)
    return niches


def get_trending_topic(niche):
    print(f"🔎 Step 1: Researching trends in {niche}...")
    api_key = os.getenv("SERPER_API_KEY")
    url = "https://google.serper.dev/search"
    payload = json.dumps({"q": f"best {niche} 2025 reviews"})
    headers = {'X-API-KEY': api_key, 'Content-Type': 'application/json'}

    try:
        response = requests.post(url, headers=headers, data=payload)
        results = response.json()
        if "organic" in results and len(results["organic"]) > 0:
            topic = results['organic'][0]['title']
            print(f"✅ Found Topic: {topic}")
            return topic, results['organic']
        return None, None
    except Exception as e:
        print(f"❌ Serper Error: {e}")
        return None, None

def write_article(topic, search_data):
    print(f"✍️ Step 2: Writing article for: {topic}...")

    model = get_gemini_model()

    prompt = f"Write a 1200-word SEO-optimized blog post for 'The Daily Vetted' about: {topic}. Use this data: {search_data}. Format in Markdown with product reviews and pros/cons. Use [CHECK_PRICE] for links."

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"❌ Gemini Error: {e}")
        return None

def publish_to_wordpress(title, content):
    print(f"🚀 Step 3: Connecting to TheDailyVetted.wordpress.com via XML-RPC...")

    # Configuration
    url = "https://thedailyvetted.wordpress.com/xmlrpc.php"
    user = os.getenv("WP_USERNAME")
    password = os.getenv("WP_APP_PASSWORD") # Use the 16-char Application Password
    affiliate_tag = os.getenv("AFFILIATE_TAG")

    # Format Content
    amazon_link = f"https://www.amazon.com/s?k={title.replace(' ', '+')}&tag={affiliate_tag}"
    final_body = content.replace("[CHECK_PRICE]", f"[Check Price on Amazon]({amazon_link})")
    final_body += "\n\n---\n*Disclaimer: The Daily Vetted earns commissions from affiliate links.*"

    try:
        # Create XML-RPC Client
        wp = Client(url, user, password)

        # Create Post Object
        post = WordPressPost()
        post.title = title
        post.content = final_body
        post.post_status = 'publish' # Try 'publish', if it fails again, change to 'draft'

        # Send to WordPress
        wp.call(NewPost(post))
        print(f"🎉 SUCCESS! Your article '{title}' is now LIVE on TheDailyVetted.wordpress.com")
        return True

    except Exception as e:
        print(f"❌ WordPress Error: {e}")
        print("💡 Tip: Double check your WP_USERNAME is your actual username, not your email.")
        return False

def run_agent(num_blogs=NUM_BLOGS):
    niches = get_top_niches(num_blogs)

    published = 0
    seen_topics = set()
    for index, niche in enumerate(niches, start=1):
        print(f"\n===== Blog {index} of {len(niches)} — niche: {niche} =====")
        topic, data = get_trending_topic(niche)
        if not topic:
            print(f"⏭️ Skipping {niche}: no topic found.")
            continue
        # Avoid publishing duplicate topics across niches.
        if topic in seen_topics:
            print(f"⏭️ Skipping duplicate topic: {topic}")
            continue
        seen_topics.add(topic)

        article = write_article(topic, data)
        if not article:
            print(f"⏭️ Skipping {niche}: article generation failed.")
            continue

        if publish_to_wordpress(topic, article):
            published += 1

        # Be gentle with the APIs between posts.
        if index < len(niches):
            time.sleep(2)

    print(f"\n🏁 Done. Published {published} of {len(niches)} blogs.")

if __name__ == "__main__":
    run_agent()
