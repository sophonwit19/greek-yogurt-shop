
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { currentUser, canManageMenus } from "@/app/lib/permissions";
import { menuSchema, categories } from "@/app/menus/validation";

// GET - แสดงเมนูทั้งหมด + Search + Filter
export async function GET(request: Request) {
  try {
    const user = await currentUser();
    // ① ตรวจสอบว่าผู้ใช้เข้าสู่ระบบหรือยัง

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const params = new URL(request.url).searchParams;
    // ② รับค่าค้นหาและตัวกรองจาก URL

    const search = params.get("search")?.trim() ?? "";
    const category = params.get("category") ?? "";
    const available = params.get("available");

    if (
      category &&
      !categories.includes(category as (typeof categories)[number])
    ) {
      return NextResponse.json(
        { message: "Invalid category" },
        { status: 400 },
      );
    }

    if (available !== null && !["true", "false"].includes(available)) {
      return NextResponse.json(
        { message: "Invalid available filter" },
        { status: 400 },
      );
    }

    const menus = await prisma.menu.findMany({
      // ③ ดึงข้อมูลเมนูจากฐานข้อมูลตามเงื่อนไข Search + Filter

      where: {
        AND: [
          search
            ? {
                OR: [
                  { code: { contains: search } },
                  { name: { contains: search } },
                ],
              }
            : {},

          category ? { category } : {},

          available !== null ? { available: available === "true" } : {},
        ],
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(menus, {
      status: 200,
    });
    // ④ ส่งข้อมูลเมนูกลับเป็น JSON เมื่อสำเร็จ
  } catch (error) {
    console.error("GET menus error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST - เพิ่มเมนูใหม่
export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!canManageMenus(user.role)) {
      // ⑤ ตรวจสอบสิทธิ์ว่าผู้ใช้สามารถจัดการเมนูได้หรือไม่
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    }

    const validation = menuSchema.safeParse(body);
    // ⑥ ตรวจสอบข้อมูลด้วย Zod เช่น ราคาและชื่อเมนู

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const existingMenu = await prisma.menu.findUnique({
      where: {
        code: validation.data.code,
      },
    });

    if (existingMenu) {
      return NextResponse.json(
        { message: "Menu code already exists" },
        { status: 409 },
      );
    }

    const newMenu = await prisma.menu.create({
      data: validation.data,
    });
    // ⑦ บันทึกเมนูใหม่ลงฐานข้อมูลด้วย Prisma

    return NextResponse.json(newMenu, {
      status: 201,
    });
  } catch (error) {
    console.error("POST menus error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
