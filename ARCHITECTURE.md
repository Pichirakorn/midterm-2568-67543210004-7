# Library Management System - Architecture

## C1: System Context Diagram

```
┌─────────────────────────────────────────────────────┐
│                     System User                    │
│                (ผู้ดูแล / ผู้ใช้ระบบ)                 │
└────────────┬────────────────────────────────────────┘
             │ HTTP/JSON (CRUD Operations)
             ▼
┌─────────────────────────────────────────────────────┐
│            Library Management System                │
│                                                     │
│  • จัดการข้อมูลหนังสือ (CRUD)                        │
│  • ยืม / คืน หนังสือ                                 │
│  • แสดงสถานะหนังสือ (available / borrowed)          │
│  • แสดงสถิติหนังสือ                                 │
│                                                     │
└────────────┬────────────────────────────────────────┘
             │ SQL Queries
             ▼
┌─────────────────────────────────────────────────────┐
│              SQLite Database                        │
│                (library.db)                         │
└─────────────────────────────────────────────────────┘
```

### Actors (ผู้ใช้งาน)

* **System User**: ผู้ดูแลระบบหรือผู้ใช้ที่จัดการหนังสือผ่าน Web UI

### System (ระบบ)

* **Library Management System**: ระบบจัดการหนังสือ

  * เพิ่ม / แก้ไข / ลบ หนังสือ
  * ยืมและคืนหนังสือ
  * ตรวจสอบสถานะหนังสือ
  * แสดงสถิติหนังสือทั้งหมด

### External Systems

* **SQLite Database**: ฐานข้อมูลสำหรับจัดเก็บข้อมูลหนังสือ

---

## C2: Container Diagram (Layered Architecture)

```
┌─────────────────────────────────────────────────────┐
│                CLIENT (Browser / UI)                │
└────────────┬────────────────────────────────────────┘
             │ HTTP/JSON
             ▼
╔═════════════════════════════════════════════════════╗
║           LIBRARY MANAGEMENT SYSTEM                 ║
║               (Express.js App)                      ║
╠═════════════════════════════════════════════════════╣
║                                                     ║
║  ┌───────────────────────────────────────────────┐ ║
║  │          📋 PRESENTATION LAYER                │ ║
║  │                                               │ ║
║  │  • Routes        (bookRoutes.js)              │ ║
║  │  • Controllers   (bookController.js)          │ ║
║  │  • Middlewares   (errorHandler.js)            │ ║
║  │                                               │ ║
║  └──────────────────────┬────────────────────────┘ ║
║                         │                            ║
║                         ▼                            ║
║  ┌───────────────────────────────────────────────┐ ║
║  │          🧠 BUSINESS LAYER                    │ ║
║  │                                               │ ║
║  │  • Services      (bookService.js)             │ ║
║  │  • Validators    (bookValidator.js)           │ ║
║  │                                               │ ║
║  │  Business Rules:                               │ ║
║  │   ✓ title, author, isbn required               │ ║
║  │   ✓ ISBN format validation                     │ ║
║  │   ✓ borrowed / available logic                 │ ║
║  │                                               │ ║
║  └──────────────────────┬────────────────────────┘ ║
║                         │                            ║
║                         ▼                            ║
║  ┌───────────────────────────────────────────────┐ ║
║  │           💾 DATA LAYER                       │ ║
║  │                                               │ ║
║  │  • Repositories  (bookRepository.js)          │ ║
║  │  • Database      (connection.js)              │ ║
║  │                                               │ ║
║  │  Methods:                                     │ ║
║  │   • findAll(status)                           │ ║
║  │   • findById(id)                              │ ║
║  │   • create(bookData)                          │ ║
║  │   • update(id, bookData)                      │ ║
║  │   • updateStatus(id, status)                  │ ║
║  │   • delete(id)                                │ ║
║  │                                               │ ║
║  └──────────────────────┬────────────────────────┘ ║
╚═════════════════════════╪═══════════════════════════╝
                          │ SQL
                          ▼
              ┌─────────────────────────┐
              │    SQLite Database      │
              │     (library.db)        │
              │                         │
              │  Table: books           │
              │  - id                   │
              │  - title                │
              │  - author               │
              │  - isbn                 │
              │  - status               │
              └─────────────────────────┘
```

---

## Responsibilities ของแต่ละ Layer

### 1️⃣ Presentation Layer

**หน้าที่:**

* รับ HTTP Request จาก Client
* เรียกใช้ Business Layer
* ส่ง HTTP Response กลับไปยัง Client
* จัดการ Error แบบรวมศูนย์

**ไฟล์:**

* `bookRoutes.js`
* `bookController.js`
* `errorHandler.js`

**สิ่งที่ห้ามทำ:**

* ❌ เขียน SQL Query
* ❌ เขียน Business Logic

---

### 2️⃣ Business Layer

**หน้าที่:**

* ตรวจสอบความถูกต้องของข้อมูล (Validation)
* บังคับใช้ Business Rules
* ประมวลผลตรรกะการยืม / คืน หนังสือ

**ไฟล์:**

* `bookService.js`
* `bookValidator.js`

**Business Rules:**

* title, author, isbn ต้องไม่ว่าง
* ISBN ต้องอยู่ในรูปแบบที่ถูกต้อง
* หนังสือที่ถูกยืมแล้วไม่สามารถยืมซ้ำได้

**สิ่งที่ห้ามทำ:**

* ❌ เขียน SQL Query
* ❌ จัดการ HTTP Request/Response

---

### 3️⃣ Data Layer

**หน้าที่:**

* ติดต่อฐานข้อมูล
* ทำ CRUD Operations
* แปลงผลลัพธ์จาก SQL เป็น Object

**ไฟล์:**

* `bookRepository.js`
* `connection.js`

**สิ่งที่ห้ามทำ:**

* ❌ เขียน Business Logic
* ❌ เขียน Validation

---

## Data Flow: Add Book

```
Client
  ↓ POST /api/books
Controller
  ↓ parse body
Service
  ↓ validate data
Repository
  ↓ INSERT SQL
Database
  ↑ result
Repository
  ↑ data
Service
  ↑ return
Controller
  ↑ JSON Response
Client
```

**ลำดับการทำงาน:**

1. Client ส่งคำขอเพิ่มหนังสือ
2. Controller รับ request และเรียก Service
3. Service ตรวจสอบข้อมูลและเรียก Repository
4. Repository บันทึกข้อมูลลงฐานข้อมูล
5. Response ถูกส่งกลับไปยัง Client

---

## Summary

* ระบบถูกออกแบบด้วย 3-tier Layered Architecture
* แต่ละ Layer มีหน้าที่ชัดเจนและไม่ซ้ำซ้อน
* โครงสร้างช่วยให้ระบบดูแลรักษาและขยายต่อได้ง่าย
