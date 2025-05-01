# Authentication Flow

This document outlines the authentication and authorization mechanisms employed in the College Connect application. We leverage NextAuth.js for handling authentication, providing a secure and flexible way to manage user sessions and access control. Google Provider is used as the primary method for user authentication.

## Login Process

The login process is initiated when a user attempts to access a protected resource or explicitly clicks the "Log In" button. The following steps are involved:

1.  **Initiate Sign-in:** The user is redirected to the NextAuth.js sign-in page using the `signIn` function from `next-auth/react`.

    ```typescript
    import { signIn } from "next-auth/react";

    <Button onClick={() => signIn("google")}>Log In</Button>
    ```

2.  **Google Authentication:** NextAuth.js redirects the user to Google for authentication. The user is prompted to enter their Google credentials.

3.  **Callback Handling:** Upon successful authentication with Google, Google redirects the user back to the application with an authorization code.

4.  **Session Creation:** NextAuth.js exchanges the authorization code for an access token and user information from Google. It then creates a session in the database and sets a secure cookie in the user's browser.

## Session Management

NextAuth.js manages user sessions using secure cookies. The session data is stored in the database and associated with the user's account. The following aspects of session management are important:

*   **Session Token:** A unique session token is stored in a cookie in the user's browser. This token is used to identify the user on subsequent requests.
*   **Session Expiry:** Sessions have an expiration time. NextAuth.js automatically refreshes sessions before they expire to maintain user login state.
*   **Database Storage:** Session data is stored in the `sessions` table in the database. This allows sessions to be persisted across multiple devices and browser sessions.

## Protected Routes

Protected routes are implemented using server-side checks within the application. The `getServerAuthSession` function is used to verify the user's session before rendering a protected page or executing a protected API endpoint.

```typescript
import { getServerAuthSession } from "~/server/auth";

export default async function Profile() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div>
      {/* Profile content */}
    </div>
  );
}
```

If the user is not authenticated (i.e., `session` is null), they are redirected to the sign-in page.

### Protected API Endpoints

Similarly, API endpoints are protected using `protectedProcedure` in tRPC. This middleware ensures that only authenticated users can access these endpoints.

```typescript
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
```

If an unauthenticated user attempts to access a protected procedure, a `TRPCError` with an `UNAUTHORIZED` code is thrown.

## Google Provider

Google Provider is used as the primary authentication method. The configuration for Google Provider is defined in `authOptions` in `server/auth.ts`.

```typescript
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};
```

The `clientId` and `clientSecret` are obtained from the Google Cloud Console and stored as environment variables.

## Logout

Users can log out of the application by clicking the "Logout" button, which calls the `signOut` function from `next-auth/react`.

```typescript
import { signOut } from "next-auth/react";

<Button onClick={() => signOut()}>Logout</Button>
```

This function removes the session cookie from the user's browser and invalidates the session in the database.

## Onboarding

After the first login, users are redirected to the `/onboarding` page to complete their profile information. This information is then stored in the `users` table in the database.

## Database Schema

The following tables are relevant to authentication and authorization:

*   `users`: Stores user information, including ID, name, email, and profile details.
*   `accounts`: Stores account information for each user, including provider details (e.g., Google).
*   `sessions`: Stores session information, including session token, user ID, and expiry date.
*   `verificationTokens`: Stores verification tokens used for email verification (if implemented).

Refer to the [databaseschema.md](databaseschema.md) file for more details on the database schema.
