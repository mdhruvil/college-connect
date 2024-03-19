"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

function Page() {
  return (
    <Button
      onClick={() =>
        signOut({
          callbackUrl: "/auth/signin",
        })
      }
    >
      SignOut
    </Button>
  );
}

export default Page;
