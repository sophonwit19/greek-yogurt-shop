"use client";
import { useTransition } from "react";
import { deleteMenu } from "./actions";
export default function DeleteButton({ id }: { id: number }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => {
        if (window.confirm("ยืนยันการลบเมนูนี้?"))
          start(async () => {
            try {
              await deleteMenu(id);
            } catch {
              window.alert("ลบเมนูไม่สำเร็จ");
            }
          });
      }}
      className="text-red-700 hover:underline disabled:opacity-50"
    >
      {pending ? "กำลังลบ..." : "ลบ"}
    </button>
  );
}
