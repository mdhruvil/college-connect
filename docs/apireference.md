# API Reference

This document provides a comprehensive reference for the backend API endpoints, implemented using tRPC. It covers the available queries and mutations, their inputs, outputs, and descriptions. Special attention is given to the `club`, `event`, `ticket`, and `user` routers. Authentication and authorization requirements are also detailed for each endpoint.

## Authentication and Authorization

Most API endpoints require authentication. This is enforced using tRPC's protected procedures. To access these endpoints, the user must be logged in. The `ctx.session.user` object will be available in the backend, containing user information.

## Router: club

### 1. `create` (Mutation)

- **Description**: Creates a new club.
- **Input**: `createClubSchema` (extended with `image: z.string().url()`)
  ```typescript
  const createClubSchema = z.object({
    name: z
      .string()
      .min(1, "Club name is required")
      .max(255, "Club name must be 255 characters or less"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(255, "Max 255 Characters allowed"),
    image: z
      .array(
        z
          .instanceof(File)
          .refine((file) => file.type.startsWith("image/"), "Please Select Image")
          .refine(
            (file) => file.size <= 1024 * 1024,
            "Image size must be less than 1MB",
          ),
      )
      .nonempty({ message: "Please select an image" }),
  });
  ```
  - `name`: Club name (string, required, min 1, max 255 characters).
  - `description`: Club description (string, required, min 1, max 255 characters).
  - `image`: URL of the club's image (string, required, must be a valid URL).
- **Output**: None (void).  Creates a club and adds the creator to the clubToMembers table.
- **Authentication**: Required.  User must be logged in.
- **Authorization**: Only logged-in users can create clubs. The user creating the club automatically becomes the creator.

### 2. `getClubs` (Query)

- **Description**: Retrieves a list of all clubs.
- **Input**: None.
- **Output**: Array of club objects with the following properties:
  ```typescript
  {
    id: string;
    name: string;
    description: string;
    image: string;
    createdById: string;
    createdAt: Date;
    memberCount: number;
    eventCount: number;
    isMember: boolean;
  }
  ```
  - `id`: Club ID (string).
  - `name`: Club name (string).
  - `description`: Club description (string).
  - `image`: URL of the club's image (string).
  - `createdById`: ID of the user who created the club (string).
  - `createdAt`: Date the club was created (Date).
  - `memberCount`: Number of members in the club (number).
  - `eventCount`: Number of events organized by the club (number).
  - `isMember`: Indicates if the current user is a member of the club (boolean).
- **Authentication**: Required. User must be logged in.
- **Authorization**: Any logged-in user can retrieve the list of clubs.

### 3. `joinClub` (Mutation)

- **Description**: Allows a user to join a club.
- **Input**: 
  ```typescript
  z.object({ clubId: z.string() })
  ```
  - `clubId`: ID of the club to join (string, required).
- **Output**: None (void).
- **Authentication**: Required. User must be logged in.
- **Authorization**: Any logged-in user can join a club.

### 4. `leaveClub` (Mutation)

- **Description**: Allows a user to leave a club.
- **Input**: 
  ```typescript
  z.object({ clubId: z.string() })
  ```
  - `clubId`: ID of the club to leave (string, required).
- **Output**: None (void).
- **Authentication**: Required. User must be logged in.
- **Authorization**: Any logged-in user can leave a club, unless they are the creator of the club.

### 5. `getClubById` (Query)

- **Description**: Retrieves a specific club by its ID.
- **Input**: 
  ```typescript
  z.object({ clubId: z.string() })
  ```
  - `clubId`: ID of the club to retrieve (string, required).
- **Output**: Club object with the following properties:
  ```typescript
  {
    id: string;
    name: string;
    description: string;
    image: string;
    createdById: string;
    createdAt: Date;
    memberCount: number;
    eventCount: number;
    isMember: boolean;
    members: Array<{
      id: string;
      name: string | null;
      image: string | null;
      position: string | null;
      joinedAt: Date;
    }>;
    userId: string;
  }
  ```
  - `id`: Club ID (string).
  - `name`: Club name (string).
  - `description`: Club description (string).
  - `image`: URL of the club's image (string).
  - `createdById`: ID of the user who created the club (string).
  - `createdAt`: Date the club was created (Date).
  - `memberCount`: Number of members in the club (number).
  - `eventCount`: Number of events organized by the club (number).
  - `isMember`: Indicates if the current user is a member of the club (boolean).
  - `members`: Array of member objects, each with `id`, `name`, `image`, `position`, and `joinedAt`.
  - `userId`: The current user's ID.
- **Authentication**: Required. User must be logged in.
- **Authorization**: Any logged-in user can retrieve a club by its ID.

### 6. `getClubsOwnedByUser` (Query)

- **Description**: Retrieves a list of clubs owned by the current user.
- **Input**: None.
- **Output**: Array of club objects (same structure as `getClubs`).
- **Authentication**: Required. User must be logged in.
- **Authorization**: Only the logged-in user can retrieve the clubs they own.

## Router: event

### 1. `create` (Mutation)

- **Description**: Creates a new event.
- **Input**: `createEventSchema` (extended with `image: z.string().url()`)
  ```typescript
  const createEventSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z
      .string()
      .max(255, "Description must be less than 255 characters"),
    image: z
      .array(
        z
          .instanceof(File)
          .refine((file) => file.type.startsWith("image/"), "Please Select Image")
          .refine(
            (file) => file.size <= 1024 * 1024,
            "Image size must be less than 1MB",
          ),
      )
      .nonempty({ message: "Please select an image" }),
    clubId: z.string().min(1, "Club is required"),
    eventDate: z.date({
      required_error: "Event date is required",
    }),
    location: z.string().optional(),
    type: z.enum(["ONLINE", "OFFLINE"], {
      required_error: "Event type is required",
    }),
  });
  ```
  - `name`: Event name (string, required).
  - `description`: Event description (string, max 255 characters).
  - `image`: URL of the event's image (string, required, must be a valid URL).
  - `clubId`: ID of the club organizing the event (string, required).
  - `eventDate`: Date and time of the event (Date, required).
  - `location`: Event location (string, optional).
  - `type`: Event type (enum: `"ONLINE"`, `"OFFLINE"`, required).
- **Output**: None (void). Creates an event and registers the creator.
- **Authentication**: Required. User must be logged in.
- **Authorization**: Only logged-in users who are owners of a club can create events for that club.

### 2. `getEvents` (Query)

- **Description**: Retrieves a list of all events.
- **Input**: None.
- **Output**: Array of event objects with the following properties:
  ```typescript
  {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    createdById: string;
    createdAt: Date;
    clubId: string;
    eventDate: Date;
    location: string | null;
    type: "ONLINE" | "OFFLINE" | null;
    shortCode: number;
    eventRegistrations: EventRegistration[];
    club: Club;
  }
  ```
  - `id`: Event ID (string).
  - `name`: Event name (string).
  - `description`: Event description (string, nullable).
  - `image`: URL of the event's image (string, nullable).
  - `createdById`: ID of the user who created the event (string).
  - `createdAt`: Date the event was created (Date).
  - `clubId`: ID of the club organizing the event (string).
  - `eventDate`: Date and time of the event (Date).
  - `location`: Event location (string, nullable).
  - `type`: Event type (enum: `"ONLINE"`, `"OFFLINE"`, nullable).
  - `shortCode`: Short code for the event (number).
  - `eventRegistrations`: Array of event registrations.
  - `club`: Club object.
- **Authentication**: Required. User must be logged in.
- **Authorization**: Any logged-in user can retrieve the list of events.

### 3. `getEventById` (Query)

- **Description**: Retrieves a specific event by its ID.
- **Input**: 
  ```typescript
  z.object({ eventId: z.string() })
  ```
  - `eventId`: ID of the event to retrieve (string, required).
- **Output**: Event object with the following properties:
  ```typescript
  {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    createdById: string;
    createdAt: Date;
    clubId: string;
    eventDate: Date;
    location: string | null;
    type: "ONLINE" | "OFFLINE" | null;
    shortCode: number;
    eventRegistrations: EventRegistration[];
    club: Club;
    isRegistered: boolean;
    isCreator: boolean;
  }
  ```
  - `id`: Event ID (string).
  - `name`: Event name (string).
  - `description`: Event description (string, nullable).
  - `image`: URL of the event's image (string, nullable).
  - `createdById`: ID of the user who created the event (string).
  - `createdAt`: Date the event was created (Date).
  - `clubId`: ID of the club organizing the event (string).
  - `eventDate`: Date and time of the event (Date).
  - `location`: Event location (string, nullable).
  - `type`: Event type (enum: `"ONLINE"`, `"OFFLINE"`, nullable).
  - `shortCode`: Short code for the event (number).
  - `eventRegistrations`: Array of event registrations.
  - `club`: Club object.
  - `isRegistered`: Indicates if the current user is registered for the event (boolean).
  - `isCreator`: Indicates if the current user is the creator of the event (boolean).
- **Authentication**: Required. User must be logged in.
- **Authorization**: Any logged-in user can retrieve an event by its ID.

### 4. `registerForEvent` (Mutation)

- **Description**: Allows a user to register for an event.
- **Input**: 
  ```typescript
  z.object({ eventId: z.string() })
  ```
  - `eventId`: ID of the event to register for (string, required).
- **Output**: None (void).
- **Authentication**: Required. User must be logged in.
- **Authorization**: Any logged-in user can register for an event.

### 5. `unregisterForEvent` (Mutation)

- **Description**: Allows a user to unregister from an event.
- **Input**: 
  ```typescript
  z.object({ eventId: z.string() })
  ```
  - `eventId`: ID of the event to unregister from (string, required).
- **Output**: None (void).
- **Authentication**: Required. User must be logged in.
- **Authorization**: Any logged-in user can unregister from an event.

## Router: ticket

### 1. `getTickets` (Query)

- **Description**: Retrieves a list of tickets for the current user.
- **Input**: None.
- **Output**: Array of ticket objects with the following properties:
  ```typescript
  {
    eventId: string;
    memberId: string;
    registeredAt: Date;
    status: string;
    event: Event;
    id: string; // Concatenation of eventId and memberId with '..' separator
  }
  ```
  - `eventId`: Event ID (string).
  - `memberId`: Member ID (string).
  - `registeredAt`: Date the user registered for the event (Date).
  - `status`: Registration status (string).
  - `event`: Event object.
  - `id`: Ticket ID (string, concatenation of `eventId` and `memberId` with `..` separator).
- **Authentication**: Required. User must be logged in.
- **Authorization**: Only the logged-in user can retrieve their tickets.

### 2. `getTicketById` (Query)

- **Description**: Retrieves a specific ticket by its ID.
- **Input**: 
  ```typescript
  z.object({ ticketId: z.string() })
  ```
  - `ticketId`: ID of the ticket to retrieve (string, required).
- **Output**: Ticket object with the following properties:
  ```typescript
  {
    eventId: string;
    memberId: string;
    registeredAt: Date;
    status: string;
    event: Event;
    member: User;
    qrSvg: string;
  }
  ```
  - `eventId`: Event ID (string).
  - `memberId`: Member ID (string).
  - `registeredAt`: Date the user registered for the event (Date).
  - `status`: Registration status (string).
  - `event`: Event object.
  - `member`: User object.
  - `qrSvg`: QR code SVG (string).
- **Authentication**: Required. User must be logged in.
- **Authorization**: Any logged-in user can retrieve a ticket by its ID.

### 3. `checkTicketValidity` (Mutation)

- **Description**: Checks the validity of a ticket.
- **Input**: 
  ```typescript
   z.object({
        ticketId: z.string(),
        eventCode: z.number(),
      })
  ```
  - `ticketId`: ID of the ticket to check (string, required).
  - `eventCode`: Event short code (number, required).
- **Output**: Boolean indicating whether the ticket is valid.
- **Authentication**: Required. User must be logged in.
- **Authorization**: Any logged-in user can check the validity of a ticket.

## Router: user

### 1. `onboarding` (Mutation)

- **Description**: Updates user profile information during onboarding.
- **Input**: `onboardingSchema` (merged with `z.object({ userId: z.string() })`)
  ```typescript
  const onboardingSchema = z.object({
    degree: z.string({ required_error: "Please select your degree" }),
    department: z.string({ required_error: "Please select your department" }),
    enrollmentNo: z.string({
      required_error: "Please enter your enrollment number",
    }),
    yearOfStudy: z.string({ required_error: "Please select your year of study" }),
  });
  ```
  - `degree`: User's degree (string, required).
  - `department`: User's department (string, required).
  - `enrollmentNo`: User's enrollment number (string, required).
  - `yearOfStudy`: User's year of study (string, required).
  - `userId`: User ID (string, required).
- **Output**: Updated user object.
- **Authentication**: Required. User must be logged in.
- **Authorization**: Only the logged-in user can update their profile information.

### 2. `profile` (Query)

- **Description**: Retrieves the profile information of the current user.
- **Input**: None.
- **Output**: Object containing user information, clubs, and events:
  ```typescript
  {
    user: User;
    clubs: Array<{
      id: string;
      name: string;
      description: string | null;
      image: string | null;
      createdById: string;
      createdAt: Date;
      postition: string | null;
    }>;
    events: Array<{
      id: string;
      name: string;
      description: string | null;
      image: string | null;
      createdById: string;
      createdAt: Date;
      clubId: string;
      eventDate: Date;
      location: string | null;
      type: "ONLINE" | "OFFLINE" | null;
      shortCode: number;
      registeredAt: Date;
      status: string;
    }>;
  }
  ```
  - `user`: User object.
  - `clubs`: Array of club objects the user is a member of.
  - `events`: Array of event objects the user is registered for.
- **Authentication**: Required. User must be logged in.
- **Authorization**: Only the logged-in user can retrieve their profile information.