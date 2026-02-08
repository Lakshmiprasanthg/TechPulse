# API Quick Reference Card

Quick reference for Task1 Web Application REST API endpoints.

---

## 🔐 Authentication Endpoints

### Register New User
```
POST /api/auth/register
```
**Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars)"
}
```
**Returns:** User object + JWT token

---

### Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```
**Returns:** User object + JWT token

---

### Get Profile 🔒
```
GET /api/auth/profile
Authorization: Bearer {token}
```
**Returns:** User profile with recent posts

---

### Update Profile 🔒
```
PUT /api/auth/profile
Authorization: Bearer {token}
```
**Body:**
```json
{
  "name": "string (optional)",
  "email": "string (optional, valid email)"
}
```
**Returns:** Updated user object

---

## 📝 Posts Endpoints

### Get All Posts
```
GET /api/posts?page=1&limit=10&search=query&status=published
```
**Query Params:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search term (searches title, content, excerpt)
- `status` - Filter by status: `draft` or `published`

**Returns:** Posts array + pagination info

---

### Get Single Post
```
GET /api/posts/:id
```
**Returns:** Single post with author info

---

### Create Post 🔒
```
POST /api/posts
Authorization: Bearer {token}
```
**Body:**
```json
{
  "title": "string (required)",
  "content": "string (required, min 10 chars)",
  "excerpt": "string (optional)",
  "status": "draft|published (default: draft)"
}
```
**Returns:** Created post object

---

### Update Post 🔒
```
PUT /api/posts/:id
Authorization: Bearer {token}
```
**Body:** (all fields optional)
```json
{
  "title": "string",
  "content": "string",
  "excerpt": "string",
  "status": "draft|published"
}
```
**Returns:** Updated post object
**Note:** Only author can update

---

### Delete Post 🔒
```
DELETE /api/posts/:id
Authorization: Bearer {token}
```
**Returns:** Success message
**Note:** Only author can delete

---

## 🔧 Utility Endpoints

### Health Check
```
GET /health
```
**Returns:** Server status + timestamp

---

## 📤 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Optional message",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### Validation Error
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name"
    }
  ]
}
```

---

## 🔑 Authentication

Include JWT token in request header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Expiry:** 1 hour
**How to get token:** Login or Register endpoints return a token

---

## ❌ HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## 🚀 Quick Start Examples

### cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get Posts:**
```bash
curl http://localhost:5000/api/posts?page=1&limit=5
```

**Create Post (with auth):**
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"My Post","content":"Post content here","status":"published"}'
```

### JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Register
const { data } = await api.post('/auth/register', {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
});

const token = data.data.token;

// Get posts (authenticated)
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
const posts = await api.get('/posts?status=published');
```

### Python (requests)

```python
import requests

BASE_URL = "http://localhost:5000/api"

# Register
response = requests.post(f"{BASE_URL}/auth/register", json={
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
})

token = response.json()["data"]["token"]

# Get posts
headers = {"Authorization": f"Bearer {token}"}
posts = requests.get(f"{BASE_URL}/posts", headers=headers)
```

---

## ⚡ Rate Limits

- **Global:** 100 requests per 15 minutes per IP
- **Per endpoint:** No specific limits (global applies)

---

## 🔍 Search & Filter Examples

### Search posts by keyword
```
GET /api/posts?search=javascript
```

### Filter by published status
```
GET /api/posts?status=published
```

### Paginate results
```
GET /api/posts?page=2&limit=20
```

### Combine filters
```
GET /api/posts?status=published&search=react&page=1&limit=10
```

---

## 🛡️ Security Notes

✅ All passwords are hashed with bcrypt (10 rounds)
✅ JWT tokens expire after 1 hour
✅ CORS enabled only for configured origins
✅ Rate limiting prevents abuse
✅ Input validation on all endpoints
✅ SQL injection prevention via Prisma ORM

---

## 📚 Additional Resources

- **Postman Collection:** Import `postman_collection.json`
- **Full Documentation:** See `backend/README.md`
- **Setup Guide:** See `SETUP.md`
- **Scaling Guide:** See `SCALING.md`

---

## 🐛 Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `Access denied. No token provided` | Include Authorization header with valid JWT |
| `Invalid token` | Token expired or malformed, login again |
| `User with this email already exists` | Use different email or login instead |
| `Post not found` | Check post ID exists |
| `You do not have permission` | Can only edit/delete your own posts |
| `Too many requests` | Wait 15 minutes before retrying |

---

## 📞 Contact & Support

For issues or questions:
1. Check error message in response
2. Review API documentation
3. Check server logs
4. Verify request format matches examples

---

**Base URL:** `http://localhost:5000/api`
**Version:** 1.0.0
**Last Updated:** February 8, 2026
