def test_analytics_data_integrity(client):
    res = client.get("/api/analytics")
    assert res.status_code == 200
    data = res.json()["data"]
    assert "top_sectors" in data
    assert "sentiment_distribution" in data
    assert "weekly_activity" in data
    assert "trending_companies" in data
    assert len(data["top_sectors"]["labels"]) > 0

def test_bookmarks_flow_and_pdf(client, auth_headers):
    # 1. Bookmark article
    list_res = client.get("/api/news?page=1&page_size=1")
    article_id = list_res.json()["data"]["items"][0]["id"]

    add_res = client.post(
        "/api/bookmarks",
        json={"article_id": article_id, "folder": "Equities Watchlist", "tags": ["Tech", "Earnings"]},
        headers=auth_headers
    )
    assert add_res.status_code in [200, 201]

    # 2. List bookmarks
    get_res = client.get("/api/bookmarks", headers=auth_headers)
    assert get_res.status_code == 200
    b_items = get_res.json()["data"]
    assert any(b["article_id"] == article_id for b in b_items)

    # 3. Export PDF
    pdf_res = client.get("/api/bookmarks/pdf", headers=auth_headers)
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    assert len(pdf_res.content) > 500

    # 4. Remove bookmark
    del_res = client.delete(f"/api/bookmarks/{article_id}", headers=auth_headers)
    assert del_res.status_code == 200
