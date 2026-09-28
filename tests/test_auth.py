import uuid

def test_register_and_login_flow(client):
    unique_email = f"user_{uuid.uuid4().hex[:8]}@example.com"
    reg_payload = {
        "email": unique_email,
        "password": "StrongPassword123!",
        "full_name": "Alexander Hamilton"
    }
    
    # 1. Register
    reg_res = client.post("/api/auth/register", json=reg_payload)
    assert reg_res.status_code == 201
    reg_json = reg_res.json()
    assert reg_json["success"] is True
    assert "access_token" in reg_json["data"]
    assert reg_json["data"]["user"]["email"] == unique_email

    # 2. Login
    login_res = client.post("/api/auth/login", json={"email": unique_email, "password": "StrongPassword123!"})
    assert login_res.status_code == 200
    login_json = login_res.json()
    assert login_json["success"] is True
    token = login_json["data"]["access_token"]
    refresh = login_json["data"]["refresh_token"]

    # 3. Refresh token
    refresh_res = client.post("/api/auth/refresh", json={"refresh_token": refresh})
    assert refresh_res.status_code == 200
    assert "access_token" in refresh_res.json()["data"]

    # 4. Authenticated profile lookup
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["data"]["email"] == unique_email

def test_invalid_login(client):
    res = client.post("/api/auth/login", json={"email": "nonexistent@example.com", "password": "WrongPassword!"})
    assert res.status_code == 401
    assert res.json()["success"] is False
