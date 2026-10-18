
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";

import prisma from "@/app/lib/prisma";

// ① ตั้งค่าระบบ NextAuth สำหรับ Login, Logout และตรวจสอบ Session
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // ② กำหนดให้เข้าสู่ระบบด้วย Email และ Password
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // ③ ค้นหาบัญชีจากฐานข้อมูลและตรวจสอบรหัสผ่านด้วย bcrypt
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          return null;
        }

        const passwordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash,
        );

        if (!passwordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),

    // ④ เปิดให้เข้าสู่ระบบด้วยบัญชี GitHub ผ่าน OAuth
    GitHub,
  ],

  callbacks: {
    // ⑤ กำหนดข้อมูล ID และ Role ใน JWT โดยตรวจสิทธิ์จากฐานข้อมูล
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      const email = token.email;

      if (email) {
        const account = await prisma.user.findUnique({
          where: { email },
        });

        token.role = account?.role ?? "USER";

        if (account) {
          token.id = account.id;
        }
      } else {
        token.role = "USER";
      }

      return token;
    },

    // ⑥ นำ ID และ Role จาก JWT ไปใส่ใน Session เพื่อให้ระบบใช้ตรวจสิทธิ์
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },

  // ⑦ กำหนดให้ใช้หน้า /login ของเว็บไซต์เป็นหน้าเข้าสู่ระบบ
  pages: {
    signIn: "/login",
  },
});
