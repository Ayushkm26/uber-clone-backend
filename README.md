# User & Captain Authentication API

This API provides endpoints for user and captain registration, login, profile retrieval, and logout. All endpoints return JSON responses.

---

## User Endpoints

### 1. Register User

**POST** `/users/register`

Registers a new user and returns a JWT token and user object.

#### Request Body

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

#### Responses

- **201 Created**
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
- **400 Bad Request**
  ```json
  {
    "errors": [
      {
        "msg": "Name is required",
        "param": "fullname.firstname",
        "location": "body"
      }
    ]
  }
  ```
- **409 Conflict**
  ```json
  {
    "message": "User already exists"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "message": "Internal server error"
  }
  ```

#### Example Request

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

### 2. Login User

**POST** `/users/login`

Authenticates a user and returns a JWT token and user object.

#### Request Body

```json
{
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)"
}
```

#### Responses

- **200 OK**
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
- **400 Bad Request**
  ```json
  {
    "errors": [
      {
        "msg": "Invalid email format",
        "param": "email",
        "location": "body"
      }
    ]
  }
  ```
- **401 Unauthorized**
  ```json
  {
    "message": "invalid email or password"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "message": "Internal server error"
  }
  ```

#### Example Request

```bash
curl -X POST http://localhost:4000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

---

### 3. Get User Profile

**GET** `/users/profile`

Returns the authenticated user's profile.  
**Authentication required:** Send JWT token in the `Authorization` header as `Bearer <token>` or as a cookie named `token`.

#### Response

- **200 OK**
  ```json
  {
    "_id": "62f3c0e3f1a3b15a46d7b0ea",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
  ```
- **401 Unauthorized**
  ```json
  {
    "message": "Unauthorized access"
  }
  ```
- **401 Token Blacklisted**
  ```json
  {
    "message": "Token is blacklisted"
  }
  ```
- **404 Not Found**
  ```json
  {
    "message": "User not found"
  }
  ```
- **401 Invalid Token**
  ```json
  {
    "message": "Invalid token"
  }
  ```

#### Example Request

```bash
curl -X GET http://localhost:4000/users/profile \
  -H "Authorization: Bearer <your_jwt_token>"
```

---

### 4. Logout User

**GET** `/users/logout`

Logs out the authenticated user by blacklisting the JWT token and clearing the cookie.

**Authentication required:** Send JWT token in the `Authorization` header as `Bearer <token>` or as a cookie named `token`.

#### Response

- **200 OK**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
- **401 Unauthorized**
  ```json
  {
    "message": "Unauthorized access"
  }
  ```
- **401 Token Blacklisted**
  ```json
  {
    "message": "Token is blacklisted"
  }
  ```
- **401 Invalid Token**
  ```json
  {
    "message": "Invalid token"
  }
  ```

#### Example Request

```bash
curl -X GET http://localhost:4000/users/logout \
  -H "Authorization: Bearer <your_jwt_token>"
```

---

## Captain Endpoints

### 1. Register Captain

**POST** `/captains/register`

Registers a new captain (driver) and returns a JWT token and captain object.

#### Request Body

```json
{
  "fullname": {
    "firstname": "string (required)",
    "lastname": "string (optional, min 3 chars)"
  },
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)",
  "vehicle": {
    "color": "string (required)",
    "plate": "string (required)",
    "vehicleType": "string (required)",
    "capacity": "integer (min 1, required)"
  }
}
```

#### Responses

- **201 Created**
  ```json
  {
    "message": "Captain registered successfully",
    "captain": {
      "_id": "62f3c0e3f1a3b15a46d7b0ea",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Smith"
      },
      "email": "jane.smith@example.com",
      "vehicle": {
        "color": "Red",
        "plate": "ABC123",
        "vehicleType": "Sedan",
        "capacity": 4
      }
      // ...other fields
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **400 Bad Request**
  ```json
  {
    "errors": [
      {
        "msg": "First name is required",
        "param": "fullname.firstname",
        "location": "body"
      }
    ]
  }
  ```
- **409 Conflict**
  ```json
  {
    "message": "Captain with this email already exists"
  }