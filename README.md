# Greek Yogurt Shop — Menu Management

พัฒนาต่อยอดจากโปรเจกต์ Student CRUD โดยเปลี่ยนเป็นระบบจัดการเมนูร้านกรีกโยเกิร์ตแบบพื้นฐาน

## ฟังก์ชันครบตามโจทย์ 5 ข้อ
1. CRUD: `/menus` เพิ่ม/ดู/แก้ไข/ลบเมนู
2. Validation: Zod ตรวจ code, name, category, price และการซ้ำของรหัส
3. Authentication: Credentials / GitHub ใช้ NextAuth เดิม; ADMIN, STAFF, USER (เฉพาะ ADMIN ลบได้)
4. Search & Filter: ชื่อ/รหัส, หมวดหมู่ และสถานะพร้อมขาย
5. REST API: `/api/menus` และ `/api/menus/:id` รองรับ GET POST PUT DELETE

## วิธีติดตั้ง
1. `npm install`
2. คัดลอก `.env.example` เป็น `.env` และตั้ง `DATABASE_URL="file:./dev.db"`, `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` (สามารถนำค่าเดิมที่ใช้งานได้มาใส่)
3. **ใช้ฐานข้อมูลใหม่** เพราะ migrations ชุดนี้สร้างตารางใหม่ตั้งแต่ต้น อย่าใช้ไฟล์ SQLite ของระบบ Student เดิม
4. `npx prisma migrate deploy`
5. `npx prisma generate`
6. `npm run dev` แล้วเปิด http://localhost:3000
7. สมัครบัญชีใหม่จะเป็น USER; หากต้องการสิทธิ์แก้ไขให้แก้ role ใน SQLite เป็น STAFF/ADMIN ด้วย Prisma Studio (`npx prisma studio`) ภายใต้การควบคุมของเจ้าของร้าน

**GitHub Login:** ผู้ใช้ GitHub ไม่ได้เป็น ADMIN อัตโนมัติ โปรแกรมค้น Role จาก User email ในฐานข้อมูล; ถ้าไม่มีบัญชีตรงกันจะเป็น USER (ดูเมนูเท่านั้น)

## ตัวอย่าง Postman
- `GET /api/menus` (ต้องมี Session)
- `GET /api/menus?search=berry&category=FRUIT&available=true`
- `POST /api/menus` (ADMIN หรือ STAFF):
```json
{"code":"GY001","name":"Strawberry Bliss","description":"สตรอว์เบอร์รีสด","category":"FRUIT","price":99,"available":true}
```
- `PUT /api/menus/1` (ADMIN หรือ STAFF): ส่ง JSON ครบทุกฟิลด์
- `DELETE /api/menus/1` (เฉพาะ ADMIN)

## หมายเหตุ
- ไฟล์สำรองโปรเจกต์ Student ต้นฉบับจัดแยกเป็นอีก ZIP
- โครงสร้าง API ตอบ 401 เมื่อไม่ Login / 403 เมื่อไม่มีสิทธิ์
- สำหรับงานตัวอย่างใช้ Float เก็บราคา; โปรเจกต์ธุรกิจจริงควรใช้หน่วยสตางค์เป็นจำนวนเต็ม
