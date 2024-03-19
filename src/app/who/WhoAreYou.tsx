"use client";

import { Button } from "@/components/ui/button";
import type { RouterOutputs } from "@/server/api/root";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

type WhoAreYouProps = {
  user: RouterOutputs["user"]["getUserWithCollege"];
};
export default function WhoAreYou({ user }: WhoAreYouProps) {
  const router = useRouter();
  if (!user) {
    return "No User Found";
  }

  const updateRole = api.user.updateRole.useMutation({
    onSuccess() {
      router.push("/");
    },
  });

  function handleRoleChange(role: "STUDENT" | "ALUMNI") {
    updateRole.mutate({
      role,
    });
  }

  return (
    <div className="container flex h-[90vh] w-full  flex-col justify-center gap-10">
      <div>
        <p>Hey,</p>
        <p className="text-lg font-semibold">{user.name}</p>
      </div>
      <p>
        Are You currently studying at{" "}
        <span className="font-bold">{user.college?.name}</span> or are you an
        alumni ?
      </p>
      <div className="flex flex-col gap-5">
        <Button
          variant="outline"
          size="lg"
          className="text-lg"
          onClick={() => handleRoleChange("STUDENT")}
          loading={updateRole.isPending}
        >
          Studying
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="text-lg"
          onClick={() => handleRoleChange("ALUMNI")}
          loading={updateRole.isPending}
        >
          Alumni
        </Button>
      </div>
    </div>
  );
}
