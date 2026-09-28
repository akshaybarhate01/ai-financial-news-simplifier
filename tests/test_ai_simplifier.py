from backend.services.groq_service import groq_service

def test_ai_simplifier_structured_output():
    title = "Central Bank Signals Pivot Toward Lower Benchmark Borrowing Rates"
    content = "The monetary authority announced that headline consumer price inflation has subsided to 2.1%, prompting discussions of an interest rate reduction."
    
    result = groq_service.simplify_article(title, content)
    
    assert "three_line_summary" in result
    assert len(result["three_line_summary"]) == 3
    assert "beginner_explanation" in result
    assert "eli15_explanation" in result
    assert "key_takeaways" in result
    assert "sentiment" in result
    assert result["sentiment"]["sentiment_label"] in ["Bullish", "Neutral", "Bearish"]
    assert "hindi_summary" in result
    assert "marathi_summary" in result

def test_article_contextual_chat(client):
    list_res = client.get("/api/news?page=1&page_size=1")
    article_id = list_res.json()["data"]["items"][0]["id"]

    # In-scope question
    chat_payload = {
        "article_id": article_id,
        "question": "What is the primary market impact mentioned in this report?"
    }
    chat_res = client.post("/api/news/chat", json=chat_payload)
    assert chat_res.status_code == 200
    data = chat_res.json()["data"]
    assert "answer" in data
    assert data["is_in_scope"] is True

    # Out-of-scope question
    out_payload = {
        "article_id": article_id,
        "question": "Can you bake me a chocolate cake recipe with strawberries?"
    }
    out_res = client.post("/api/news/chat", json=out_payload)
    assert out_res.status_code == 200
    out_data = out_res.json()["data"]
    assert out_data["is_in_scope"] is False
    assert "scoped to this financial article" in out_data["answer"]
