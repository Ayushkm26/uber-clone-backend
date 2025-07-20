# User Registration API

## Endpoint

`POST /users/register`

---

## Description

Registers a new user. Returns a JWT token and the created user object on success.

---

## Request Body

Send as JSON:

```json
{
  "fullname": {
    "firstname": "string (min 3 chars, required)",
    "lastname": "string (optional)"
  },
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)"
}
```

---

## Responses

### 201 Created

- **Description:** User registered successfully.
- **Body Example:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "62f3c0e3f1a3b15a46d7b0ea",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
    }
  }
  ```

### 400 Bad Request

- **Description:** Missing required fields.
- **Body Example:**
  ```json
  {
    "message": "All fields are required"
  }
  ```

### 409 Conflict

- **Description:** User already exists.
- **Body Example:**
  ```json
  {
    "message": "User already exists"
  }
  ```

### 500 Internal Server Error

- **Description:** Unexpected server error.
- **Body Example:**
  ```json
  {
    "message": "Internal server error"
  }
  ```

---

## Example Request

```bash
curl -X POST http://localhost:4000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

---

## Example Response (Successful Registration)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "62f3c0e3f1a3b15a46d7b0ea",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```