"use server";
import prisma from "@/app/lib/prisma";
import {
  currentUser,
  canManageMenus,
  canDeleteMenus,
} from "@/app/lib/permissions";
import { parseMenuForm } from "./validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type MenuFormState = {
  message?: string;
  errors?: Record<string, string[]>;
};
export async function saveMenu(
  id: number | null,
  _state: MenuFormState,
  form: FormData,
): Promise<MenuFormState> {
  const user = await currentUser();
  if (!user) return { message: "กรุณาเข้าสู่ระบบ" };
  if (!canManageMenus(user.role)) return { message: "คุณไม่มีสิทธิ์แก้ไขเมนู" };
  const parsed = parseMenuForm(form);
  if (!parsed.success)
    return {
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  try {
    if (id === null) await prisma.menu.create({ data: parsed.data });
    else await prisma.menu.update({ where: { id }, data: parsed.data });
  } catch {
    return { message: "บันทึกไม่สำเร็จ: รหัสเมนูอาจซ้ำ หรือไม่พบข้อมูล" };
  }
  revalidatePath("/menus");
  revalidatePath("/dashboard");
  redirect("/menus");
}
export async function deleteMenu(id: number) {
  const user = await currentUser();
  if (!user || !canDeleteMenus(user.role)) throw new Error("FORBIDDEN");
  await prisma.menu.delete({ where: { id } });
  revalidatePath("/menus");
  revalidatePath("/dashboard");
}
