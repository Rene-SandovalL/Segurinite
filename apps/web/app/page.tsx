import { redirect } from "next/navigation";

/** Redirige la raíz a /groups */
export default function HomePage() {
  redirect("/groups");
}
