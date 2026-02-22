# 🚀 TaskFlow – Distributed Task & Job Processing Platform

TaskFlow is a production-grade backend system built with **Node.js, PostgreSQL, Redis, and BullMQ**.

It is not a simple CRUD API.  
It is a **distributed job processing platform** designed using real-world backend engineering principles:

- Stateless JWT Authentication
- Refresh Token Rotation
- Relational Data Modeling with Indexes
- Background Job Processing
- Retry-safe & Idempotent Execution
- Structured Logging
- Graceful Shutdown
- Dockerized Deployment

---

# 🏗 Architecture Overview

TaskFlow follows a distributed architecture where each component has a single responsibility.

            ┌──────────────────────┐
            │      Client (UI)     │
            │   Postman / Frontend │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │     API Server       │
            │  (Node.js + Express) │
            │                      │
            │ - JWT Authentication │
            │ - Input Validation   │
            │ - Task Creation      │
            │ - Job Enqueue        │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │    PostgreSQL DB     │
            │  (Source of Truth)   │
            │                      │
            │ - Users              │
            │ - Tasks              │
            │ - Refresh Tokens     │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │        Redis         │
            │   (Queue Broker)     │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │    Worker Process    │
            │      (BullMQ)        │
            │                      │
            │ - Atomic Claiming    │
            │ - Retry Logic        │
            │ - Idempotency        │
            │ - Failure Handling   │
            └──────────────────────┘

            
Each component can scale independently.

---

# 🎯 Core Features

## 🔐 Authentication & Security
- JWT-based stateless authentication
- Access + Refresh token strategy
- DB-backed refresh token revocation
- Password hashing using bcrypt
- Role-based access control (RBAC)
- Environment-based secret management

---

## 📦 Task Management
- Create tasks (`EMAIL`, `REPORT`, `SYNC`)
- Explicit state machine:
  - `PENDING → RUNNING → COMPLETED`
  - `PENDING → RUNNING → FAILED`
- Indexed relational schema
- Pagination support
- Zod v3 request validation

---

## ⚙️ Background Job Processing
- Redis-backed queue (BullMQ)
- Separate worker process
- Exponential retry logic
- Job deduplication using `jobId`
- Idempotent execution with atomic DB updates

---

## 🛡 Reliability & Safety
- Conditional task claiming (`updateMany` with status guard)
- Transaction-aware updates
- Structured logging using Pino
- Graceful shutdown (API + Worker)
- Environment validation on startup

---

## 🐳 Dockerized Deployment
- PostgreSQL container
- Redis container
- API container
- Worker container
- Production-ready docker-compose setup

---

# 🧠 Engineering Principles Applied

### 1️⃣ Separation of Concerns
- API handles requests
- Database stores truth
- Redis manages queue
- Worker executes jobs

---

### 2️⃣ Stateless API Design
JWT authentication enables:
- Horizontal scaling
- Multiple API instances
- No shared session state

---

### 3️⃣ Idempotent Distributed Processing
Worker ensures:
- Safe retries
- Crash resilience
- Duplicate execution protection
- Exactly-once execution semantics (practical guarantee)

---

### 4️⃣ Indexed Relational Modeling
Indexes added for:
- `userId`
- `(status, createdAt)`

Optimized for:
- Worker polling
- Task listing
- Scalable queries

---

### 5️⃣ Observability
- Structured JSON logs
- HTTP request logging
- Worker lifecycle logging
- Error metadata tracking

---

## 📂 Project Structure

```
taskflow-backend/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── routes/
│   ├── validations/
│   ├── middleware/
│   ├── prisma/
│   ├── queue/
│   ├── worker/
│   └── utils/
│
├── docker-compose.yml
├── Dockerfile
└── README.md
```

**Folder descriptions:**

- `prisma/` → Database schema & migrations  
- `src/routes/` → API endpoints  
- `src/validations/` → Zod request schemas  
- `src/middleware/` → Auth & validation middleware  
- `src/prisma/` → Prisma client singleton  
- `src/queue/` → BullMQ queue setup  
- `src/worker/` → Background worker logic  
- `src/utils/` → Logger & helpers  


---

# 🚀 Getting Started

## 1️⃣ Clone Repository

```bash
git clone https://github.com/smrutiranjan1132001/taskflow-backend.git
cd taskflow-backend
```

---

## 2️⃣ Configure Environment

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://taskflow:taskflow@localhost:5435/taskflow
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## 3️⃣ Start Infrastructure

```bash
docker compose up -d
```

---

## 4️⃣ Run Database Migrations

```bash
npx prisma migrate dev
```

---

## 5️⃣ Start API Server

```bash
node src/server.js
```

---

## 6️⃣ Start Worker Process

```bash
node src/worker/task.worker.js
```

