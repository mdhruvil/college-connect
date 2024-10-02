"use client";

import { signIn } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

type ErrorWithLoginProps = {
  errorMsg: string;
};

export const ErrorWithLogin = ({ errorMsg }: ErrorWithLoginProps) => {
  return (
    <>
      <Card className="p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {errorMsg === "UNAUTHORIZED"
              ? "You need to be logged in to access this content."
              : errorMsg}
          </AlertDescription>
        </Alert>
        {errorMsg === "UNAUTHORIZED" && (
          <div className="mt-4 flex justify-center">
            <Button onClick={() => signIn("google")}>Log In</Button>
          </div>
        )}
      </Card>
    </>
  );
};
