
import { handlers } from "@/app/auth";
// ① นำเข้า handlers จากไฟล์ auth.ts เพื่อจัดการระบบ Authentication

export const { GET, POST } = handlers;
// ② เปิด API GET และ POST สำหรับการเข้าสู่ระบบ
// และจัดการคำขอเกี่ยวกับ Authentication ผ่าน NextAuth
