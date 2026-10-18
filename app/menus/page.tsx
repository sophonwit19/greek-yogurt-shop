import prisma from "@/app/lib/prisma";
import {
  currentUser,
  canManageMenus,
  canDeleteMenus,
} from "@/app/lib/permissions";
import { redirect } from "next/navigation";
import Link from "next/link";
import SearchForm from "./search-form";
import DeleteButton from "./delete-button";
import { categoryLabels, categories } from "./validation";
export default async function MenusPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
  }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/login");
  const p = await searchParams;
  const search = p.search?.trim() ?? "";
  const category = categories.includes(
    p.category as (typeof categories)[number],
  )
    ? p.category!
    : "";
  const status = ["active", "inactive"].includes(p.status ?? "")
    ? p.status!
    : "";
  const menus = await prisma.menu.findMany({
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
        status ? { available: status === "active" } : {},
      ],
    },
    orderBy: { id: "asc" },
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">จัดการเมนูกรีกโยเกิร์ต</h1>
          <p className="text-stone-600 mt-1">พบ {menus.length} เมนู</p>
        </div>
        {canManageMenus(user.role) && (
          <Link
            href="/menus/create"
            className="rounded-xl bg-emerald-800 text-white px-5 py-3"
          >
            + เพิ่มเมนู
          </Link>
        )}
      </div>
      <SearchForm search={search} category={category} status={status} />
      <div className="bg-white rounded-2xl border border-stone-200 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-emerald-50">
            <tr>
              {["รหัส", "ชื่อเมนู", "หมวดหมู่", "ราคา", "สถานะ", "จัดการ"].map(
                (h) => (
                  <th key={h} className="p-4">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {menus.map((m) => (
              <tr key={m.id} className="border-t border-stone-100">
                <td className="p-4 font-mono">{m.code}</td>
                <td className="p-4">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-stone-500">{m.description || "—"}</div>
                </td>
                <td className="p-4">
                  {categoryLabels[m.category] ?? m.category}
                </td>
                <td className="p-4">฿{m.price.toFixed(2)}</td>
                <td className="p-4">
                  <span
                    className={
                      m.available ? "text-emerald-700" : "text-stone-500"
                    }
                  >
                    {m.available ? "พร้อมขาย" : "หยุดขาย"}
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap space-x-3">
                  {canManageMenus(user.role) && (
                    <Link
                      href={`/menus/edit/${m.id}`}
                      className="text-emerald-800 hover:underline"
                    >
                      แก้ไข
                    </Link>
                  )}
                  {canDeleteMenus(user.role) && <DeleteButton id={m.id} />}
                </td>
              </tr>
            ))}
            {menus.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-stone-500">
                  ไม่พบเมนูที่ค้นหา
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
