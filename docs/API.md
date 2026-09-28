# REST API Specification

All endpoints return a uniform JSON envelope:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "error": null
}
```

---

## Authentication Endpoints

### Register User
* **Method**: `POST`
* **Path**: `/api/auth/register`
* **Body**:
  ```json
  {
    "email": "analyst@fintechnews.com",
    "password": "StrongPassword123!",
    "full_name": "Arya Stark"
  }
  ```
* **Status**: `201 Created`

### Login User
* **Method**: `POST`
* **Path**: `/api/auth/login`
* **Body**:
  ```json
  {
    "email": "analyst@fintechnews.com",
    "password": "StrongPassword123!"
  }
  ```
* **Status**: `200 OK`

### Refresh Token
* **Method**: `POST`
* **Path**: `/api/auth/refresh`
* **Body**: `{ "refresh_token": "..." }`

---

## Financial News & Intelligence Endpoints

### List News Articles
* **Method**: `GET`
* **Path**: `/api/news`
* **Query Parameters**:
  * `page` (int, default: 1)
  * `page_size` (int, default: 10)
  * `category` (string, optional: e.g. "equities")
  * `search` (string, optional: search text)
  * `ticker` (string, optional: e.g. "NVDA")
  * `source` (string, optional)
  * `trending` (boolean, optional)

### Get Article Details
* **Method**: `GET`
* **Path**: `/api/news/article/{id}`
* **Returns**: Complete article object including structured `ai_summary`, `sentiment`, `company`, and `detected_terms`.

### Contextual AI Chat ("Ask AI About This Article")
* **Method**: `POST`
* **Path**: `/api/news/chat`
* **Body**:
  ```json
  {
    "article_id": 1,
    "question": "What is the expected quarterly revenue from Blackwell GPUs?",
    "history": []
  }
  ```
* **Returns**:
  ```json
  {
    "answer": "According to the article, Wall Street analysts project Blackwell will contribute over $10 billion in incremental quarterly data center revenue.",
    "is_in_scope": true,
    "context_used": ["Wall Street analysts project Blackwell will contribute over $10 billion..."],
    "confidence": 0.96
  }
  ```

### Executive Daily Brief
* **Method**: `GET`
* **Path**: `/api/news/daily-brief`

### Export Daily Brief as PDF
* **Method**: `GET`
* **Path**: `/api/news/daily-brief/pdf`
* **Content-Type**: `application/pdf`

---

## Bookmarks & Collections

### List Bookmarks
* **Method**: `GET`
* **Path**: `/api/bookmarks`
* **Headers**: `Authorization: Bearer <token>`

### Add Bookmark
* **Method**: `POST`
* **Path**: `/api/bookmarks`
* **Body**:
  ```json
  {
    "article_id": 1,
    "folder": "AI Infrastructure",
    "tags": ["Semis", "Hardware"]
  }
  ```

### Delete Bookmark
* **Method**: `DELETE`
* **Path**: `/api/bookmarks/{article_id}`

### Export Bookmarks Digest PDF
* **Method**: `GET`
* **Path**: `/api/bookmarks/pdf`

---

## Financial Glossary

### List All Terms
* **Method**: `GET`
* **Path**: `/api/glossary`

### Get Specific Term
* **Method**: `GET`
* **Path**: `/api/glossary/{slug}`
