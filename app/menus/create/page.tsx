import { currentUser, canManageMenus } from "@/app/lib/permissions";
import { redirect } from "next/navigation";
import MenuForm from "../menu-form";
import { saveMenu } from "../actions";
export default async function CreateMenuPage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (!canManageMenus(user.role)) redirect("/unauthorized");
  return (
    <section className="max-w-2xl mx-auto space-y-5">
      <h1 className="text-3xl font-bold">เพิ่มเมนูใหม่</h1>
      <MenuForm action={saveMenu.bind(null, null)} />
    </section>
  );
}
