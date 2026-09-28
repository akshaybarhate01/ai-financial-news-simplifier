def test_list_news_and_pagination(client):
    res = client.get("/api/news?page=1&page_size=3")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert len(data["data"]["items"]) <= 3
    assert data["data"]["total"] >= 1
    assert "three_line_summary" in data["data"]["items"][0]["ai_summary"]

def test_categories_endpoint(client):
    res = client.get("/api/news/categories")
    assert res.status_code == 200
    cats = res.json()["data"]
    assert len(cats) >= 5
    slugs = [c["slug"] for c in cats]
    assert "macroeconomics" in slugs
    assert "equities" in slugs

def test_article_detail_and_glossary_detection(client):
    # Retrieve first article id
    list_res = client.get("/api/news?page=1&page_size=1")
    article_id = list_res.json()["data"]["items"][0]["id"]

    detail_res = client.get(f"/api/news/article/{article_id}")
    assert detail_res.status_code == 200
    art = detail_res.json()["data"]
    assert art["id"] == article_id
    assert art["ai_summary"] is not None
    assert "three_line_summary" in art["ai_summary"]
    assert "eli15_explanation" in art["ai_summary"]
    assert "sentiment" in art
    assert "detected_terms" in art
    assert isinstance(art["detected_terms"], list)

def test_daily_brief_and_pdf(client):
    brief_res = client.get("/api/news/daily-brief")
    assert brief_res.status_code == 200
    brief_data = brief_res.json()["data"]
    assert "market_mood" in brief_data
    assert "top_stories" in brief_data

    pdf_res = client.get("/api/news/daily-brief/pdf")
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    assert len(pdf_res.content) > 1000
