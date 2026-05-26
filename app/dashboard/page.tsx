import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const headersList = await headers();
  const basePath = headersList.get("x-dashboard-base") || "/dashboard";
  redirect(`${basePath}/profile`);
}
