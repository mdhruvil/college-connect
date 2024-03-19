import { checkAuth } from "@/server/auth";

export default async function Page() {
  const session = await checkAuth();
  return <>{JSON.stringify(session)}</>;
}
