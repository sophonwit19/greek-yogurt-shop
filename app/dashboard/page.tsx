import prisma from "@/app/lib/prisma";
import { currentUser } from "@/app/lib/permissions";
import { redirect } from "next/navigation";
import Link from "next/link";
export default async function Dashboard() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const [total, active, groups] = await Promise.all([
    prisma.menu.count(),
    prisma.menu.count({ where: { available: true } }),
    prisma.menu.groupBy({ by: ["category"] }),
  ]);
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ภาพรวมร้าน Greek Yogurt</h1>
        <p className="text-stone-600">จัดการเมนูของร้านได้ง่ายในที่เดียว</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "เมนูทั้งหมด", value: total },
          { title: "พร้อมขาย", value: active },
          { title: "หยุดขาย", value: total - active },
          { title: "หมวดหมู่", value: groups.length },
        ].map((x) => (
          <div
            key={x.title}
            className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200"
          >
            <p className="text-stone-500">{x.title}</p>
            <p className="text-4xl font-bold text-emerald-900 mt-2">
              {x.value}
            </p>
          </div>
        ))}
      </div>
      <Link
        href="/menus"
        className="inline-block bg-emerald-800 text-white rounded-xl px-6 py-3"
      >
        จัดการเมนู →
      </Link>
    </section>
  );
}
