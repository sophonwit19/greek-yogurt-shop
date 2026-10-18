
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import {
  currentUser,
  canManageMenus,
  canDeleteMenus,
} from "@/app/lib/permissions";
import { menuSchema } from "@/app/menus/validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// ① ตรวจสอบว่า ID ของเมนูเป็นจำนวนเต็มบวกที่ถูกต้อง
async function parseId(context: RouteContext) {
  const { id } = await context.params;
  const parsedId = Number(id);

  if (!/^\d+$/.test(id) || !Number.isSafeInteger(parsedId) || parsedId <= 0) {
    return null;
  }

  return parsedId;
}

// ========================================
// GET - ดึงข้อมูลเมนูตาม ID
// ========================================
export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = await parseId(context);

    if (id === null) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    // ② ค้นหาข้อมูลเมนูจากฐานข้อมูลตาม ID ที่ระบุ
    const menu = await prisma.menu.findUnique({
      where: { id },
    });

    if (!menu) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(menu, {
      status: 200,
    });
  } catch (error) {
    console.error("GET menu by ID error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// ========================================
// PUT - แก้ไขข้อมูลเมนู
// ========================================
export async function PUT(request: Request, context: RouteContext) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ③ ตรวจสอบสิทธิ์ว่าผู้ใช้สามารถแก้ไขเมนูได้หรือไม่
    if (!canManageMenus(user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const id = await parseId(context);

    if (id === null) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    }

    // ④ ตรวจสอบข้อมูลที่แก้ไขด้วย Zod ก่อนบันทึก
    const validation = menuSchema.safeParse(body);

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
      where: { id },
    });

    if (!existingMenu) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const duplicateMenu = await prisma.menu.findUnique({
      where: {
        code: validation.data.code,
      },
    });

    if (duplicateMenu && duplicateMenu.id !== id) {
      return NextResponse.json(
        { message: "Menu code already exists" },
        { status: 409 },
      );
    }

    // ⑤ อัปเดตข้อมูลเมนูในฐานข้อมูลด้วย Prisma
    const updatedMenu = await prisma.menu.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json(updatedMenu, {
      status: 200,
    });
  } catch (error) {
    console.error("PUT menu error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// ========================================
// DELETE - ลบข้อมูลเมนู
// ========================================
export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ⑥ ตรวจสอบสิทธิ์การลบเมนู หากไม่มีสิทธิ์จะตอบกลับ 403 Forbidden
    if (!canDeleteMenus(user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const id = await parseId(context);

    if (id === null) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const existingMenu = await prisma.menu.findUnique({
      where: { id },
    });

    if (!existingMenu) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // ⑦ ลบข้อมูลเมนูตาม ID ออกจากฐานข้อมูลด้วย Prisma
    await prisma.menu.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE menu error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
