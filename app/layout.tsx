import type { Metadata } from "next";
import Link from "next/link";
import { auth, signOut } from "@/app/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Greek Yogurt Shop",
  description: "ระบบจัดการเมนูร้านกรีกโยเกิร์ต",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="th">
      <body className="min-h-screen bg-[#f8f4ed] text-[#3d4039] font-sans">
        <nav className="bg-white border-b border-[#dce4d7]">
          <div className="max-w-7xl mx-auto p-4 flex flex-wrap gap-4 items-center justify-between">
            <Link href="/" className="font-bold text-xl text-emerald-900">
              🥣 Greek Yogurt Shop
            </Link>

            <div className="flex gap-5 items-center text-sm">
              {session && (
                <>
                  <Link href="/dashboard">Dashboard</Link>

                  <Link href="/menus">จัดการเมนู</Link>

                  {session.user?.role === "ADMIN" && (
                    <Link href="/admin">Admin</Link>
                  )}
                </>
              )}

              {session ? (
                <>
                  <span className="rounded-full bg-[#e8efe3] px-3 py-1">
                    {session.user?.name || session.user?.email} (
                    {session.user?.role})
                  </span>

                  <form
                    action={async () => {
                      "use server";
                      await signOut({
                        redirectTo: "/login",
                      });
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      ออกจากระบบ
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/login">เข้าสู่ระบบ</Link>
              )}
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-4 md:p-8">{children}</main>
      </body>
    </html>
  );
}
