
import { auth } from "@/app/auth";

// ① ตรวจสอบ Session และดึงข้อมูลผู้ใช้ที่เข้าสู่ระบบ
export async function currentUser() {
  const session = await auth();
  return session?.user ?? null;
}

// ② บังคับให้ผู้ใช้ต้อง Login ก่อนใช้งาน
export async function requireUser() {
  const user = await currentUser();

  if (!user) throw new Error("UNAUTHORIZED");

  return user;
}

// ③ อนุญาตให้ ADMIN และ STAFF เพิ่มหรือแก้ไขเมนูได้
export function canManageMenus(role?: string) {
  return role === "ADMIN" || role === "STAFF";
}

// ④ อนุญาตให้เฉพาะ ADMIN ลบเมนูได้
export function canDeleteMenus(role?: string) {
  return role === "ADMIN";
}
