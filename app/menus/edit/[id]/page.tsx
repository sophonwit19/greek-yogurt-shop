import prisma from "@/app/lib/prisma";
import { currentUser, canManageMenus } from "@/app/lib/permissions";
import { redirect, notFound } from "next/navigation";
import MenuForm from "../../menu-form";
import { saveMenu } from "../../actions";
export default async function EditMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (!canManageMenus(user.role)) redirect("/unauthorized");
  const { id } = await params;
  const number = Number(id);
  if (!Number.isSafeInteger(number) || number <= 0) notFound();
  const menu = await prisma.menu.findUnique({ where: { id: number } });
  if (!menu) notFound();
  return (
    <section className="max-w-2xl mx-auto space-y-5">
      <h1 className="text-3xl font-bold">แก้ไข {menu.name}</h1>
      <MenuForm menu={menu} action={saveMenu.bind(null, menu.id)} />
    </section>
  );
}
