import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import WhoAreYou from "./WhoAreYou";

export default async function Page() {
  const user = await api.user.getUserWithCollege();
  if (!user) {
    redirect("/api/auth/signin");
  }

  // redirect to home if user is not current student or alumni
  if (user.role === "UPCOMING_STUDENT") {
    redirect("/home");
  }
  return (
    <div>
      <WhoAreYou user={user} />
    </div>
  );
}
