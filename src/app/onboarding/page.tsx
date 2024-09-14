import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="mx-auto w-11/12">
      <OnboardingForm user={session.user} />
    </div>
  );
}
