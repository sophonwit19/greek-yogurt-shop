
import { z } from "zod";

// ① กำหนดหมวดหมู่เมนูที่ระบบอนุญาตให้เลือก
export const categories = [
  "CLASSIC",
  "FRUIT",
  "GRANOLA",
  "SPECIAL",
] as const;

export const categoryLabels: Record<string, string> = {
  CLASSIC: "คลาสสิก",
  FRUIT: "ผลไม้",
  GRANOLA: "กราโนล่า",
  SPECIAL: "เมนูพิเศษ",
};

// ② สร้าง Schema ด้วย Zod เพื่อกำหนดเงื่อนไขตรวจสอบข้อมูลเมนู
export const menuSchema = z.object({
  // ③ ตรวจสอบรหัสเมนู ชื่อเมนู และรายละเอียด
  code: z.string().trim().min(1, "กรุณากรอกรหัสเมนู").max(20),
  name: z.string().trim().min(1, "กรุณากรอกชื่อเมนู").max(100),
  description: z.string().trim().max(500).optional(),

  category: z.enum(categories),

  // ④ ตรวจสอบว่าราคาต้องเป็นตัวเลขที่ถูกต้องและมากกว่า 0
  price: z.number().finite().positive("ราคาต้องมากกว่า 0 บาท"),

  available: z.boolean(),
});

// ⑤ รับข้อมูลจากฟอร์ม แปลงราคาและสถานะ แล้วตรวจสอบด้วย Zod
export function parseMenuForm(form: FormData) {
  const rawPrice = String(form.get("price") ?? "").trim();

  return menuSchema.safeParse({
    code: form.get("code"),
    name: form.get("name"),
    description: form.get("description"),
    category: form.get("category"),
    price: rawPrice === "" ? NaN : Number(rawPrice),
    available: form.get("available") === "on",
  });
}
