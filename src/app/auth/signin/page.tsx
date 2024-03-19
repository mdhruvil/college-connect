"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
export default function Page() {
  return (
    <Button
      onClick={() =>
        signIn("google", {
          callbackUrl: "/who",
        })
      }
    >
      Sign In With Google
    </Button>
  );
}
