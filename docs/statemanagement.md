# State Management in College Connect Frontend

This document outlines the state management approach used in the College Connect frontend, focusing on React Query (TanStack Query). We leverage React Query to handle data fetching, caching, and mutations, providing a streamlined and efficient user experience.

## Core Principles

-   **Centralized Data Fetching and Caching:** React Query acts as a central hub for managing server state, reducing the need for manual caching and invalidation.
-   **Declarative Data Dependencies:** Components declare their data dependencies using React Query hooks, simplifying data fetching logic.
-   **Optimistic Updates:** Mutations are handled with optimistic updates to provide immediate feedback to the user.
-   **Automatic Background Refetching:** React Query automatically refetches data in the background to ensure the UI stays up-to-date.

## React Query (TanStack Query)

React Query is a powerful data-fetching library for React that simplifies the process of fetching, caching, synchronizing, and updating server state in your React applications.

### Key Features Used in College Connect

-   **`useQuery`:**  Used for fetching data and automatically caching it.  It handles loading, error, and success states.
-   **`useMutation`:** Used for performing mutations (e.g., creating, updating, deleting data). It provides callbacks for handling success, error, and loading states.
-   **`QueryClient`:**  Manages the cache and provides methods for invalidating and refetching queries.
-   **Automatic Caching:** React Query automatically caches data, reducing the number of network requests.
-   **Background Refetching:**  Data is automatically refetched in the background when it becomes stale, ensuring the UI stays up-to-date.
-   **Optimistic Updates:**  Mutations can be performed optimistically, providing immediate feedback to the user while the request is being processed.

### Implementation Details

#### 1. Query Client Setup

The `QueryClient` is initialized in `trpc/query-client.ts`:

```typescript
import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import SuperJSON from "superjson";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
        retry: false,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
```

-   `staleTime`:  Sets the time after which the data is considered stale and will be refetched in the background.
-   `dehydrate` and `hydrate`: Configured to use `SuperJSON` for serialization and deserialization, enabling the transfer of complex data types.

#### 2.  Data Fetching with `useQuery`

Components use the `useQuery` hook to fetch data. For example, fetching a list of clubs in `app/(app)/clubs/page.tsx`:

```typescript
import { api } from "~/trpc/react";

export default function Clubs() {
  const {
    data,
    isLoading,
    error,
    refetch: refetchClubs,
  } = api.club.getClubs.useQuery();

  // ...
}
```

-   `api.club.getClubs.useQuery()`:  This hook fetches the club data and automatically handles caching, loading, and error states.
-   `isLoading`:  Indicates whether the data is currently being fetched.
-   `error`:  Contains any error that occurred during the data fetching process.
-   `data`:  Contains the fetched data when the request is successful.
-   `refetch`: A function to manually refetch the data.

#### 3. Mutations with `useMutation`

The `useMutation` hook is used to perform mutations, such as joining or leaving a club.  Example from `components/club-card.tsx`:

```typescript
import { api } from "~/trpc/react";

export function ClubCard({ /* ... */ }) {
  const joinClub = api.club.joinClub.useMutation({
    onSettled: async () => await refetchClubs(),
  });
  const leaveClub = api.club.leaveClub.useMutation({
    onSettled: async () => await refetchClubs(),
  });

  // ...
}
```

-   `api.club.joinClub.useMutation()`:  This hook provides functions to trigger the mutation and handle its lifecycle.
-   `mutate`:  The function used to trigger the mutation.
-   `isLoading`:  Indicates whether the mutation is currently in progress.
-   `onSettled`:  A callback function that is called when the mutation is either successful or fails.  Here, it's used to refetch the clubs data after joining or leaving a club.

#### 4.  Invalidation and Refetching

After a mutation, it's often necessary to invalidate the cache and refetch the data.  This is typically done in the `onSuccess` or `onSettled` callbacks of the `useMutation` hook.  See the `refetchClubs` call in the `ClubCard` component.

## Benefits of Using React Query

-   **Improved Performance:**  Caching and background refetching reduce the number of network requests, improving the application's performance.
-   **Simplified Data Management:**  React Query handles the complexities of data fetching and caching, allowing developers to focus on building UI components.
-   **Enhanced User Experience:**  Optimistic updates and automatic background refetching provide a smooth and responsive user experience.
-   **Reduced Boilerplate:**  React Query eliminates the need for manual caching and state management, reducing the amount of boilerplate code.
-   **Centralized State Management:** React Query centralizes the management of server state, making it easier to reason about and maintain the application's data flow.

## Conclusion

React Query provides a robust and efficient solution for managing server state in the College Connect frontend. By leveraging its powerful features, we can improve performance, simplify data management, and enhance the user experience.