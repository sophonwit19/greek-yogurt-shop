import Link from "next/link";
import { auth, signOut } from "@/app/auth";
export default async function Home() {
  const session = await auth();
  return (
    <section className="max-w-4xl mx-auto mt-12 rounded-3xl bg-white border border-stone-200 shadow-sm overflow-hidden">
      <div className="bg-[#e8efe3] px-8 py-12">
        <span className="text-5xl">🥣</span>
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-950 mt-4">
          Greek Yogurt Shop
        </h1>
        <p className="mt-3 text-lg text-stone-700">
          ระบบจัดการเมนูร้านกรีกโยเกิร์ต · Menu Management
        </p>
      </div>
      <div className="p-8 space-y-4">
        {session?.user ? (
          <>
            <p>
              ยินดีต้อนรับ {session.user.name || session.user.email} · สิทธิ์{" "}
              {session.user.role}
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/dashboard"
                className="bg-emerald-800 text-white rounded-xl px-5 py-3"
              >
                Dashboard
              </Link>
              <Link
                href="/menus"
                className="border border-emerald-800 text-emerald-900 rounded-xl px-5 py-3"
              >
                จัดการเมนู
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <button className="border border-stone-300 rounded-xl px-5 py-3">
                  ออกจากระบบ
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <p>เข้าสู่ระบบก่อนเพื่อดูเมนูและจัดการข้อมูล</p>
            <Link
              href="/login"
              className="inline-block bg-emerald-800 text-white rounded-xl px-5 py-3"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/signup"
              className="inline-block ml-3 border rounded-xl px-5 py-3"
            >
              สมัครสมาชิก
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
