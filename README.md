# 🥣 Greek Yogurt Shop — Menu Management System

ระบบจัดการเมนูร้านกรีกโยเกิร์ต พัฒนาด้วย Next.js, TypeScript, Prisma, Neon PostgreSQL, NextAuth (Auth.js) และ Zod โดยต่อยอดจากโปรเจกต์ Student CRUD เพื่อสร้างระบบจัดการข้อมูลร้านค้า

## 🌐 เว็บไซต์ที่ Deploy แล้ว

**Website:** https://greek-yogurt-shop.vercel.app/

**Menu Management:** https://greek-yogurt-shop.vercel.app/menus

**GitHub Repository:** https://github.com/sophonwit19/greek-yogurt-shop

เว็บไซต์ Deploy ผ่าน Vercel และเชื่อมต่อฐานข้อมูล PostgreSQL บน Neon

---

## คุณสมบัติของระบบ

### 1. CRUD — จัดการข้อมูลเมนู

- แสดงรายการเมนูทั้งหมด (Read)
- เพิ่มเมนูใหม่ (Create)
- แก้ไขชื่อ ราคา หมวดหมู่ และสถานะ (Update)
- ลบเมนูตามสิทธิ์ผู้ใช้งาน (Delete)
- ข้อมูลถูกจัดเก็บในฐานข้อมูล Neon PostgreSQL

### 2. Validation — ตรวจสอบข้อมูล

ใช้ Zod ตรวจสอบความถูกต้องของข้อมูลก่อนบันทึก เช่น

- รหัสเมนูและชื่อเมนูห้ามว่าง
- รหัสเมนูต้องไม่ซ้ำกัน
- ราคาต้องมากกว่า 0 บาท
- หมวดหมู่ต้องตรงกับค่าที่ระบบกำหนด
- ตรวจสอบรูปแบบ JSON ที่ส่งผ่าน API
- ตรวจสอบ ID ของเมนูว่าถูกต้องหรือไม่

หากข้อมูลไม่ถูกต้อง ระบบจะปฏิเสธคำขอและส่งข้อความแจ้งข้อผิดพลาด

### 3. Authentication & Authorization

ระบบใช้ NextAuth (Auth.js) สำหรับยืนยันตัวตนและตรวจสอบสิทธิ์

- เข้าสู่ระบบด้วย Email และ Password
- เข้าสู่ระบบด้วย GitHub OAuth
- สมัครสมาชิกใหม่ (Signup)
- ออกจากระบบ (Logout)
- ตรวจสอบ Session ของผู้ใช้งาน
- กำหนดสิทธิ์ด้วย Role-Based Access Control (RBAC)

| สิทธิ์ | ดูข้อมูล | เพิ่ม | แก้ไข | ลบ |
|---|---|---|---|---|
| ADMIN | ✅ | ✅ | ✅ | ✅ |
| STAFF | ✅ | ✅ | ✅ | ❌ |
| USER | ✅ | ❌ | ❌ | ❌ |

บัญชีที่สมัครใหม่จะได้รับสิทธิ์ USER เป็นค่าเริ่มต้น

### 4. Search & Filter

- ค้นหาจากชื่อเมนูหรือรหัสเมนู
- กรองตามหมวดหมู่
- กรองตามสถานะพร้อมขายหรือหยุดขาย
- สามารถใช้เงื่อนไขค้นหาและกรองข้อมูลร่วมกันได้

### 5. REST API

ระบบรองรับ REST API สำหรับจัดการข้อมูลเมนู

| Method | Endpoint | หน้าที่ |
|---|---|---|
| GET | `/api/menus` | แสดงเมนูทั้งหมด |
| GET | `/api/menus/:id` | แสดงเมนูตาม ID |
| POST | `/api/menus` | เพิ่มเมนูใหม่ |
| PUT | `/api/menus/:id` | แก้ไขข้อมูลเมนู |
| DELETE | `/api/menus/:id` | ลบเมนู |

API ใช้ Session Authentication และตรวจสอบ Role ก่อนอนุญาตให้ดำเนินการ

---

## เทคโนโลยีที่ใช้

- **Next.js** — พัฒนาเว็บไซต์และ REST API
- **TypeScript** — เขียนโปรแกรมแบบกำหนดชนิดข้อมูล
- **Tailwind CSS** — ออกแบบหน้าเว็บไซต์
- **Prisma ORM** — เชื่อมต่อและจัดการฐานข้อมูล
- **Neon PostgreSQL** — จัดเก็บข้อมูลออนไลน์
- **NextAuth (Auth.js)** — ยืนยันตัวตนและจัดการ Session
- **Zod** — ตรวจสอบความถูกต้องของข้อมูล
- **Postman** — ทดสอบ REST API
- **GitHub** — จัดเก็บ Source Code
- **Vercel** — Deploy เว็บไซต์ออนไลน์

