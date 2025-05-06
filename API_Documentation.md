# TA Application – API Summary

Since we have not deployed, now is http://localhost:5000

for example: http://localhost:5000/api/auth/register

---

## Auth Header Required
For all protected routes, add this HTTP header:

```
Authorization: Bearer <JWT_TOKEN>
```
---

### 📋 API Endpoints Overview

| Method | Endpoint                                       | Description                                             | Role         |
|--------|------------------------------------------------|---------------------------------------------------------|--------------|
| POST   | `/api/auth/register`                           | Register new user and return JWT                        | Public       |
| POST   | `/api/auth/login`                              | Login and return JWT                                    | Public       |
| POST   | `/api/assistantships/`                         | Create new assistantship                                | Professor    |
| GET    | `/api/assistantships/all_professor`            | Get professor's assistantships + applicant count        | Professor    |
| GET    | `/api/assistantships/:id/professor`            | Get one assistantship with applications                 | Professor    |
| PUT    | `/api/assistantships/:id`                      | Update assistantship info                               | Professor    |
| DELETE | `/api/assistantships/:id`                      | Delete assistantship                                    | Professor    |
| GET    | `/api/assistantships/search`                   | Search assistantships by title or domain                | Professor    |
| POST   | `/api/applications/`                           | Apply to assistantship (PDF upload)                     | Student      |
| GET    | `/api/applications/:id/professor`              | Professor views single application                      | Professor    |
| PUT    | `/api/applications/:id/status`                 | Accept or reject an application                         | Professor    |
| GET    | `/api/user/`                                   | Get user's profile                                      | User         |
| PUT    | `/api/user/`                                   | Update user's infomation                                | User         |
| GET    | `/api/applications/:id/student`                | Student can view single application                     | Student   Unfinished  |
| DELETE | `/api/applications/:id`                        | Student can withdraw his application                    | Student   Unfinished  |
| GET    | `/api/applications/`                           | Student can view all application applied by him         | Student   Unfinished  |
| GET    | `/api/assistantships/search/student`           | Search assistantships by title or domain                | Student   Unfinished  |
| GET    | `/api/assistantships/:id/student`              | View details of single assistantship                    | Student   Unfinished  |
| GET    | `/api/assistantships/student`                  | Student can see view all assistantships                 | Student   Unfinished  |
---

## Authentication

### POST `/api/auth/register`
Register a new user and receive token

#### Request Body:
```json
{
  "name": "Dr. Carole",
  "email": "carole@univ.edu",
  "password": "drcarol123",
  "role": "professor"   // or student
}
```

#### Response:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjgxNTY4ODFkNTNmZTYzMjMxYjIwMDY0Iiwicm9sZSI6InByb2Zlc3NvciJ9LCJpYXQiOjE3NDYyMzM0NzQsImV4cCI6MTc0NjMxOTg3NH0.pXk1u-1dQanAJM4hlH6BFwotT8tX063iuyj-Ifq6KvU"
}
```

---

### POST `/api/auth/login`
Login and receive a token.

#### Request Body:
```json
{
  "email": "alan@example.com",
  "password": "securePassword123"
}
```

#### Response:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjgxM2E0NDA2MjgyMmM4MGY1ZGVkNTNiIiwicm9sZSI6InByb2Zlc3NvciJ9LCJpYXQiOjE3NDYyMzQwNDEsImV4cCI6MTc0NjMyMDQ0MX0.pQxz6pHe2teRPTCkQUnRa-l2YlNifnsPn-zbg2B3eZg"
}
```

---

## Assistantships 

### POST `/api/assistantships/`
Professor creates a new assistantship.

#### Request Body:
```json
{
  "title": "RA for Operating Systems",
  "description": "Conduct weekly recitations and help manage labs (CS301).",
  "domain": "Systems Programming",
  "endTime": "2025-06-05T23:59:59.000Z"
}
```

#### Response (the assistantship):
```json
{
    "title": "RA for Operating Systems",
    "description": "Conduct weekly recitations and help manage labs (CS301).",
    "domain": "Systems Programming",
    "endTime": "2025-06-05T23:59:59.000Z",
    "status": "open",
    "professor": "68156881d53fe63231b20064",
    "_id": "681569fad53fe63231b20068",
    "createdAt": "2025-05-03T00:57:30.150Z",
    "__v": 0
}
```

---

### GET `/api/assistantships/all_professor`
Professor views all their assistantships + application count

Page and Limit are optional. Default value are 1 and 5

For example: /api/assistantships/all_professor?page=1&limit=5

#### Response:
```json
{
    "total": 2,
    "page": 1,
    "limit": 5,
    "totalPages": 1,
    "data": [
        {
            "_id": "68156921d53fe63231b20066",
            "title": "TA for Operating Systems",
            "domain": "Systems Programming",
            "endTime": "2025-06-05T23:59:59.000Z",
            "status": "open",
            "createdAt": "2025-05-03T00:53:53.615Z",
            "applicantCount": 1
        },
        {
            "_id": "681569fad53fe63231b20068",
            "title": "RA for Operating Systems",
            "domain": "Systems Programming",
            "endTime": "2025-06-05T23:59:59.000Z",
            "status": "open",
            "createdAt": "2025-05-03T00:57:30.150Z",
            "applicantCount": 0
        }
    ]
}
```

### GET `/api/assistantships/:id/professor`
Professor view a single assistantship + applications

The id will be the assistantship id.

For example: /api/assistantships/68156921d53fe63231b20066/professor

#### Response:
```json
{
    "title": "TA for Operating Systems",
    "description": "Conduct weekly recitations and help manage labs (CS301).",
    "domain": "Systems Programming",
    "endTime": "2025-06-05T23:59:59.000Z",
    "createdAt": "2025-05-03T00:53:53.615Z",
    "status": "open",
    "applications": [
        {
            "studentName": "Mary Smithe",
            "studentEmail": "marye@student.edu",
            "motivation": "My capstone project involved SLAM algorithms with ROS. I’m passionate about real-time control systems and would love to assist in your robotics research.",
            "status": "rejected",
            "submittedAt": "2025-05-03T01:02:51.978Z",
            "applicationId": "68156b3bd53fe63231b20073"
        }
    ]
}
```

---

### PUT `/api/assistantships/:id`
Professor update assistantship fields.

the id is assistantship id.

for example: /api/assistantships/68156921d53fe63231b20066

#### Request Body (any subset):
```json
{
  "title": "TA for Operating Systems change",
  "description": "Conduct weekly recitations and help manage labs (CS301).",
  "domain": "Systems Programming",
  "endTime": "2025-06-05T23:59:59.000Z",
  "status": "open"
}
```

#### Response (the assistantship):
```json
{
    "msg": "Assistantship updated",
    "assistantship": {
        "_id": "68156921d53fe63231b20066",
        "title": "TA for Operating Systems change",
        "description": "Conduct weekly recitations and help manage labs (CS301).",
        "domain": "Systems Programming",
        "endTime": "2025-06-05T23:59:59.000Z",
        "status": "open",
        "professor": "68156881d53fe63231b20064",
        "createdAt": "2025-05-03T00:53:53.615Z",
        "__v": 0
    }
}
```

---

### DELETE `/api/assistantships/:id`
Professor delete assistantship.

the id is assistantship id.

#### Response:
```json
{
    "msg": "Assistantship deleted"
}
```

---

### GET `/api/assistantships/search?query=ai`
Professor searches for assistantships by title/domain.

page and limit are optional and default value are 1 and 5.

for example: /api/assistantships/search?query=ai&page=1&limit=5

#### Response: same as `all_professor`

---

## Applications

### POST `/api/applications/`
Student applies to assistantship (multipart/form-data)


#### Form Fields:
- `assistantshipId`: string (required)
- `motivation`: string (required)
- `resume`: PDF file (required)

#### Response:
```json
{
    "assistantship": "68156921d53fe63231b20066",
    "student": "68156ad6d53fe63231b2006f",
    "motivation": "My capstone project involved SLAM algorithms with ROS. I’m passionate about real-time control systems and would love to assist in your robotics research.",
    "resumePath": "/uploads/resumes/1746234171789-sample_resume_alice.pdf",
    "status": "pending",
    "_id": "68156b3bd53fe63231b20073",
    "createdAt": "2025-05-03T01:02:51.978Z",
    "__v": 0
}
```

---

### GET `/api/applications/:id/professor`
Professor views a specific application

the id is application id.

#### Response:
```json
{
    "student": {
        "name": "Mary Smithe",
        "email": "marye@student.edu"
    },
    "assistantship": {
        "title": "TA for Operating Systems change",
        "domain": "Systems Programming"
    },
    "motivation": "My capstone project involved SLAM algorithms with ROS. I’m passionate about real-time control systems and would love to assist in your robotics research.",
    "resumePath": "/uploads/resumes/1746234171789-sample_resume_alice.pdf",
    "status": "rejected",
    "submittedAt": "2025-05-03T01:02:51.978Z"
}
```

---

### PUT `/api/applications/:id/status`
Professor accept or reject application. changing the status

the id is application id.

#### Request Body:
```json
{
    "status":"accepted"
}
```

#### Response:
```json
{
    "msg": "Application accepted",
    "application": {
        "_id": "68156b3bd53fe63231b20073",
        "assistantship": {
            "_id": "68156921d53fe63231b20066",
            "title": "TA for Operating Systems change",
            "description": "Conduct weekly recitations and help manage labs (CS301).",
            "domain": "Systems Programming",
            "endTime": "2025-06-05T23:59:59.000Z",
            "status": "open",
            "professor": "68156881d53fe63231b20064",
            "createdAt": "2025-05-03T00:53:53.615Z",
            "__v": 0
        },
        "student": "68156ad6d53fe63231b2006f",
        "motivation": "My capstone project involved SLAM algorithms with ROS. I’m passionate about real-time control systems and would love to assist in your robotics research.",
        "resumePath": "/uploads/resumes/1746234171789-sample_resume_alice.pdf",
        "status": "accepted",
        "createdAt": "2025-05-03T01:02:51.978Z",
        "__v": 0
    }
}
```

# 🎓 TA Application – Student API Documentation

> 🔐 All endpoints below **require authentication**  
Add the following HTTP header to every request:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📄 Assistantship Endpoints (Student)

### GET `/api/assistantships/student`  
Get all available assistantships.

**Query Parameters (optional)**:
- `page`: Page number (default 1)
- `limit`: Results per page (default 5)

**Response**
```json
{
  "total": 10,
  "page": 1,
  "limit": 5,
  "data": [
    {
      "_id": "...",
      "title": "...",
      "domain": "...",
      "endTime": "...",
      "status": "open"
    }
  ]
}
```

---

### GET `/api/assistantships/:id/student`  
Get details of a specific assistantship.

**URL Parameter**
- `:id` – Assistantship ID

**Response**
```json
{
  "_id": "...",
  "title": "RA for Operating Systems",
  "description": "...",
  "domain": "...",
  "endTime": "...",
  "status": "open"
}
```

---

### GET `/api/assistantships/search/student?query=<text>`  
Search assistantships by title or domain.

**Query Parameters**:
- `query`: Search keyword
- `page`, `limit`: (optional)

---

## 📝 Application Endpoints (Student)


### GET `/api/applications/student`  
View all applications submitted by the student.

**Response**
```json
[
  {
    "_id": "...",
    "assistantship": {
      "title": "...",
      "domain": "..."
    },
    "status": "pending",
    "submittedAt": "..."
  }
]
```

---

### GET `/api/applications/:id/student`  
View a single application submitted by the student.

**URL Parameter**
- `:id` – Application ID

**Response**
```json
{
  "assistantship": {
    "title": "...",
    "domain": "...",
    "endTime": "..."
  },
  "motivation": "...",
  "resumePath": "...",
  "status": "pending",
  "submittedAt": "..."
}
```

---

### DELETE `/api/applications/:id`  
Withdraw (delete) your own application.

**URL Parameter**
- `:id` – Application ID

**Response**
```json
{
  "msg": "Application withdrawn successfully"
}
```

---

## ✅ Notes
- All protected routes require a valid JWT token in the Authorization header.
- Resume upload must be a `.pdf` file under 5MB.
- Each student can only apply to a specific assistantship once.

---
