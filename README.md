
# 🥣 Greek Yogurt Shop — Menu Management System

ระบบจัดการเมนูร้านกรีกโยเกิร์ต พัฒนาด้วย Next.js, TypeScript, Prisma, SQLite, NextAuth และ Zod โดยต่อยอดจากโปรเจกต์ Student CRUD เพื่อสร้างระบบจัดการข้อมูลร้านค้า

## คุณสมบัติของระบบ

### 1. CRUD — จัดการข้อมูลเมนู
- แสดงรายการเมนูทั้งหมด
- เพิ่มเมนูใหม่
- แก้ไขชื่อ ราคา หมวดหมู่ และสถานะ
- ลบเมนูตามสิทธิ์ผู้ใช้งาน

### 2. Validation — ตรวจสอบข้อมูล
ใช้ Zod ตรวจสอบข้อมูลก่อนบันทึก เช่น
- รหัสเมนูและชื่อเมนูห้ามว่าง
- รหัสเมนูต้องไม่ซ้ำกัน
- ราคาต้องมากกว่า 0 บาท
- หมวดหมู่ต้องตรงกับที่ระบบกำหนด

### 3. Authentication & Authorization
ใช้ NextAuth (Auth.js) รองรับ
- เข้าสู่ระบบด้วย Email และ Password
- เข้าสู่ระบบผ่าน GitHub OAuth
- ออกจากระบบ (Logout)
- ตรวจสอบ Session และกำหนดสิทธิ์ผู้ใช้

| สิทธิ์ | ดูข้อมูล | เพิ่ม | แก้ไข | ลบ |
|---|---|---|---|---|
| ADMIN | ✅ | ✅ | ✅ | ✅ |
| STAFF | ✅ | ✅ | ✅ | ❌ |
| USER | ✅ | ❌ | ❌ | ❌ |

บัญชีที่สมัครใหม่ได้รับสิทธิ์ USER เป็นค่าเริ่มต้น

### 4. Search & Filter
- ค้นหาจากชื่อเมนูหรือรหัสเมนู
- กรองตามหมวดหมู่
- กรองตามสถานะพร้อมขาย/หยุดขาย
- สามารถใช้เงื่อนไขร่วมกันได้

### 5. REST API
รองรับ HTTP Methods ได้แก่ GET, POST, PUT และ DELETE

| Method | Endpoint | หน้าที่ |
|---|---|---|
| GET | /api/menus | แสดงเมนูทั้งหมด |
| GET | /api/menus/:id | แสดงเมนูตาม ID |
| POST | /api/menus | เพิ่มเมนูใหม่ |
| PUT | /api/menus/:id | แก้ไขข้อมูลเมนู |
| DELETE | /api/menus/:id | ลบเมนู |

API ใช้ Session Authentication และตรวจสอบ Role ก่อนอนุญาตให้จัดการข้อมูล

## เทคโนโลยีที่ใช้

- Next.js — พัฒนาเว็บไซต์และ REST API
- TypeScript — เขียนโปรแกรมแบบกำหนดชนิดข้อมูล
- Tailwind CSS — ออกแบบหน้าตาเว็บไซต์
- Prisma ORM — จัดการฐานข้อมูล
- SQLite — จัดเก็บข้อมูล
- NextAuth (Auth.js) — ระบบเข้าสู่ระบบ
- Zod — ตรวจสอบข้อมูล
- Postman — ทดสอบ REST API

## วิธีติดตั้งและใช้งาน

### 1. ดาวน์โหลดโปรเจกต์

Clone Repository จาก GitHub หรือดาวน์โหลด ZIP แล้วแตกไฟล์

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. ตั้งค่า Environment Variables

คัดลอกไฟล์ `.env.example` เป็น `.env`

```dotenv
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-auth-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
```

สร้าง AUTH_SECRET ใหม่ด้วยคำสั่ง:

```bash
npx auth secret
```

ตรวจสอบว่าค่าถูกบันทึกเป็น `AUTH_SECRET`
ไม่ใช่ `BETTER_AUTH_SECRET`

สำหรับ GitHub OAuth ให้สร้าง OAuth App ที่:
https://github.com/settings/developers

Homepage URL:
http://localhost:3000

Authorization Callback URL:
http://localhost:3000/api/auth/callback/github

ห้าม Commit ไฟล์ `.env` ที่มี Secret จริงขึ้น GitHub

### 4. สร้างฐานข้อมูล

ใช้ฐานข้อมูล SQLite ใหม่ ไม่ควรนำไฟล์ฐานข้อมูล Student CRUD เดิมมาใช้โดยตรง

```bash
npx prisma migrate deploy
```

### 5. สร้าง Prisma Client

```bash
npx prisma generate
```

### 6. เปิดเว็บไซต์

```bash
npm run dev
```

เข้าใช้งานที่:

http://localhost:3000

## การกำหนดสิทธิ์ ADMIN

บัญชีที่สมัครใหม่จะมี Role เป็น USER

สำหรับการทดสอบในเครื่อง ผู้ดูแลโปรเจกต์สามารถเปลี่ยน Role ของบัญชีที่กำหนดให้เป็น ADMIN โดยแก้ไขฐานข้อมูล SQLite โดยตรง

ตัวอย่างใช้ Python ซึ่งรองรับ SQLite:

```python
import sqlite3

db = sqlite3.connect("dev.db")

email = "admin@example.com"

db.execute(
    "UPDATE User SET role = ? WHERE email = ?",
    ("ADMIN", email)
)

db.commit()
db.close()
```

ให้เปลี่ยน `admin@example.com` เป็นอีเมลของบัญชีที่ต้องการกำหนดเป็น ADMIN

ควรสำรองฐานข้อมูลก่อนแก้ไข Role และทำเฉพาะบัญชีที่ได้รับอนุญาตเท่านั้น

หลังเปลี่ยน Role ให้ Logout แล้ว Login ใหม่

หมายเหตุ: ตัวอย่างนี้ใช้สำหรับการตั้งค่าระบบในเครื่องเพื่อการศึกษา ไม่ควรเปิดให้ผู้ใช้ทั่วไปแก้ไข Role ด้วยตนเอง

## ตัวอย่างทดสอบ REST API ด้วย Postman

### GET — แสดงเมนูทั้งหมด

```http
GET http://localhost:3000/api/menus
```

### Search & Filter

```http
GET http://localhost:3000/api/menus?search=berry
GET http://localhost:3000/api/menus?category=FRUIT
GET http://localhost:3000/api/menus?available=true
```

### POST — เพิ่มเมนู

```http
POST http://localhost:3000/api/menus
```

Body (JSON):

```json
{
  "code": "GY001",
  "name": "Strawberry Bliss",
  "description": "กรีกโยเกิร์ตพร้อมสตรอว์เบอร์รีสด",
  "category": "FRUIT",
  "price": 99,
  "available": true
}
```

### PUT — แก้ไขเมนู

```http
PUT http://localhost:3000/api/menus/1
```

ส่ง JSON ที่มีข้อมูลเมนูครบทุกฟิลด์ตาม Schema

### DELETE — ลบเมนู

```http
DELETE http://localhost:3000/api/menus/1
```

อนุญาตเฉพาะ ADMIN

หมายเหตุ: API ต้องใช้ Session Cookie จากการเข้าสู่ระบบที่ถูกต้อง และไม่ควรเผยแพร่ค่า Session Token

## HTTP Status Codes

| Status | ความหมาย |
|---|---|
| 200 | ดำเนินการสำเร็จ |
| 201 | เพิ่มข้อมูลสำเร็จ |
| 400 | ข้อมูลไม่ถูกต้อง |
| 401 | ยังไม่ได้เข้าสู่ระบบ |
| 403 | ไม่มีสิทธิ์ดำเนินการ |
| 404 | ไม่พบข้อมูล |
| 409 | รหัสเมนูซ้ำ |
| 500 | ข้อผิดพลาดภายในเซิร์ฟเวอร์ |

## การทดสอบ Production Build

```bash
npm run build
```

## หมายเหตุ

- โปรเจกต์นี้จัดทำเพื่อการศึกษา
- ใช้ SQLite สำหรับเก็บข้อมูลตัวอย่าง
- ไฟล์ฐานข้อมูลจริงและ Environment Secrets ไม่ถูกจัดเก็บใน Repository
- ผู้ใช้ GitHub ที่ไม่มีบัญชี Email ตรงกับฐานข้อมูลจะได้รับ Role USER
- ตัวอย่างนี้ใช้ Float เก็บราคา หากพัฒนาสำหรับธุรกิจจริงควรใช้จำนวนเต็มหน่วยสตางค์หรือชนิดข้อมูลที่เหมาะกับการเงิน
- โค้ดต้นฉบับ Student CRUD สำรองไว้แยกจากโปรเจกต์นี้
