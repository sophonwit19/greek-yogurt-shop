"use client";
import { useActionState } from "react";
import Link from "next/link";
import type { MenuFormState } from "./actions";
import { categories, categoryLabels } from "./validation";
type FormMenu = {
  code: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  available: boolean;
};
export default function MenuForm({
  action,
  menu,
}: {
  action: (state: MenuFormState, form: FormData) => Promise<MenuFormState>;
  menu?: FormMenu;
}) {
  const [state, submit, pending] = useActionState(action, {} as MenuFormState);
  const inputs = [
    { key: "code", label: "รหัสเมนู", value: menu?.code ?? "", type: "text" },
    { key: "name", label: "ชื่อเมนู", value: menu?.name ?? "", type: "text" },
    {
      key: "price",
      label: "ราคา (บาท)",
      value: menu?.price ?? "",
      type: "number",
    },
  ];
  return (
    <form
      action={submit}
      className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-5"
    >
      {state.message && (
        <p role="alert" className="text-red-700">
          {state.message}
        </p>
      )}
      {inputs.map((f) => (
        <div key={f.key}>
          <label htmlFor={f.key} className="block mb-1 font-medium">
            {f.label}
          </label>
          <input
            id={f.key}
            name={f.key}
            type={f.type}
            step={f.type === "number" ? "0.01" : undefined}
            min={f.type === "number" ? "0.01" : undefined}
            required
            defaultValue={f.value}
            className="w-full rounded-xl border border-stone-300 px-3 py-2"
            disabled={pending}
          />
          {state.errors?.[f.key] && (
            <p className="text-red-700 text-sm">{state.errors[f.key][0]}</p>
          )}
        </div>
      ))}
      <div>
        <label htmlFor="category" className="block mb-1 font-medium">
          หมวดหมู่
        </label>
        <select
          id="category"
          name="category"
          defaultValue={menu?.category ?? "CLASSIC"}
          className="w-full rounded-xl border border-stone-300 px-3 py-2"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {categoryLabels[c]}
            </option>
          ))}
        </select>
        {state.errors?.category && (
          <p className="text-red-700">{state.errors.category[0]}</p>
        )}
      </div>
      <div>
        <label htmlFor="description" className="block mb-1 font-medium">
          รายละเอียด
        </label>
        <textarea
          id="description"
          name="description"
          maxLength={500}
          defaultValue={menu?.description ?? ""}
          rows={3}
          className="w-full rounded-xl border border-stone-300 px-3 py-2"
        />
      </div>
      <label className="flex items-center gap-2">
        <input
          name="available"
          type="checkbox"
          defaultChecked={menu?.available ?? true}
        />{" "}
        พร้อมขาย
      </label>
      <div className="flex gap-3">
        <button
          disabled={pending}
          className="rounded-xl bg-emerald-800 text-white px-6 py-2 disabled:opacity-50"
        >
          {pending ? "กำลังบันทึก..." : "บันทึกเมนู"}
        </button>
        <Link
          href="/menus"
          className="rounded-xl border border-stone-300 px-6 py-2"
        >
          ยกเลิก
        </Link>
      </div>
    </form>
  );
}
