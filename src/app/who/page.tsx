import { getServerAuthSession } from "@/server/auth";

export default async function Page() {
  const session = await getServerAuthSession();

  return <div>Who</div>;
}
