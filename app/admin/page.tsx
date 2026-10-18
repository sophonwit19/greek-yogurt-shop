import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
export default async function Admin() {
  const s = await auth();
  if (!s?.user) redirect("/login");
  if (s.user.role !== "ADMIN") redirect("/unauthorized");
  return (
    <section className="bg-white rounded-2xl p-8">
      <h1 className="text-3xl font-bold">เจ้าของร้าน</h1>
      <p className="mt-3">
        คุณเข้าสู่ระบบด้วยสิทธิ์ ADMIN สามารถจัดการและลบเมนูได้
      </p>
      <Link
        className="inline-block mt-5 rounded-xl bg-emerald-800 px-5 py-3 text-white"
        href="/menus"
      >
        ไปหน้าจัดการเมนู
      </Link>
    </section>
  );
}
