import Link from "next/link";
import { categories, categoryLabels } from "./validation";
export default function SearchForm({
  search,
  category,
  status,
}: {
  search: string;
  category: string;
  status: string;
}) {
  return (
    <form
      method="GET"
      className="flex flex-wrap gap-3 items-end bg-white p-4 rounded-xl border border-stone-200"
    >
      <label className="flex-1 min-w-48 text-sm">
        ค้นหาชื่อ/รหัส
        <input
          name="search"
          defaultValue={search}
          placeholder="เช่น Strawberry"
          className="block w-full rounded-lg border border-stone-300 px-3 py-2 mt-1"
        />
      </label>
      <label className="text-sm">
        หมวดหมู่
        <select
          name="category"
          defaultValue={category}
          className="block rounded-lg border border-stone-300 px-3 py-2 mt-1"
        >
          <option value="">ทั้งหมด</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {categoryLabels[c]}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        สถานะ
        <select
          name="status"
          defaultValue={status}
          className="block rounded-lg border border-stone-300 px-3 py-2 mt-1"
        >
          <option value="">ทั้งหมด</option>
          <option value="active">พร้อมขาย</option>
          <option value="inactive">หยุดขาย</option>
        </select>
      </label>
      <button className="rounded-lg bg-emerald-800 text-white px-5 py-2">
        ค้นหา
      </button>
      <Link
        href="/menus"
        className="rounded-lg border border-stone-300 px-4 py-2"
      >
        ล้าง
      </Link>
    </form>
  );
}
