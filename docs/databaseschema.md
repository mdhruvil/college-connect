# Database Schema

This document describes the database schema used by the College Connect application. The schema is defined in `server/db/schema.ts` and uses Drizzle ORM with a PostgreSQL database.

## Tables

### `users`

This table stores user information.

| Column        | Data Type        | Constraints                                  | Description                                                                 |
| ------------- | ---------------- | -------------------------------------------- | --------------------------------------------------------------------------- |
| `id`          | `varchar(255)`   | `NOT NULL`, `PRIMARY KEY`, `DEFAULT: uuid()` | Unique identifier for the user.                                             |
| `name`        | `varchar(255)`   |                                              | User's full name.                                                           |
| `email`       | `varchar(255)`   | `NOT NULL`                                   | User's email address.                                                       |
| `emailVerified` | `timestamp`      | `DEFAULT: CURRENT_TIMESTAMP`                   | Timestamp indicating when the email was verified.                            |
| `image`       | `varchar(255)`   |                                              | URL of the user's profile picture.                                           |
| `enrollmentNo`| `varchar(12)`    | `NOT NULL`, `DEFAULT: 'Not Added'`           | User's enrollment number.                                                   |
| `degree`      | `varchar(255)`   | `NOT NULL`, `DEFAULT: 'Not Added'`           | User's degree program (e.g., B.Tech, M.Sc).                                 |
| `yearOfStudy` | `varchar(255)`   | `NOT NULL`, `DEFAULT: 'Not Added'`           | User's current year of study (e.g., 1st, 2nd).                               |
| `department`  | `varchar(255)`   | `NOT NULL`, `DEFAULT: 'Not Added'`           | User's department or major.                                                 |

**Relationships:**

*   One-to-many relationship with `accounts` table (one user can have multiple accounts for different providers).
*   One-to-many relationship with `clubToMembers` table (one user can be a member of multiple clubs).
*   One-to-many relationship with `eventRegistrations` table (one user can register for multiple events).

### `accounts`

This table stores user account information for different authentication providers.

| Column            | Data Type        | Constraints                                                                 | Description                                                                                                |
| ----------------- | ---------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `userId`          | `varchar(255)`   | `NOT NULL`, `FOREIGN KEY references users(id)`                               | The ID of the user to which this account belongs.                                                           |
| `type`            | `varchar(255)`   | `NOT NULL`                                                                  | Type of account (e.g., `oauth`, `email`, `credentials`).                                                   |
| `provider`        | `varchar(255)`   | `NOT NULL`, `PART OF PRIMARY KEY`                                           | Authentication provider (e.g., `google`, `github`).                                                        |
| `providerAccountId` | `varchar(255)`   | `NOT NULL`, `PART OF PRIMARY KEY`                                           | Unique identifier for the user on the authentication provider.                                             |
| `refresh_token`   | `text`           |                                                                             | Refresh token for the account (if applicable).                                                              |
| `access_token`    | `text`           |                                                                             | Access token for the account (if applicable).                                                               |
| `expires_at`      | `integer`        |                                                                             | Timestamp indicating when the access token expires (if applicable).                                         |
| `token_type`      | `varchar(255)`   |                                                                             | Type of token (e.g., `bearer`).                                                                            |
| `scope`           | `varchar(255)`   |                                                                             | Scope of the access token.                                                                                 |
| `id_token`        | `text`           |                                                                             | ID token for the account (if applicable).                                                                 |
| `session_state`   | `varchar(255)`   |                                                                             | Session state for the account (if applicable).                                                              |

**Relationships:**

*   Many-to-one relationship with `users` table (multiple accounts can belong to one user).

### `sessions`

This table stores user session information.

| Column        | Data Type        | Constraints                                  | Description                                                                 |
| ------------- | ---------------- | -------------------------------------------- | --------------------------------------------------------------------------- |
| `sessionToken`| `varchar(255)`   | `NOT NULL`, `PRIMARY KEY`                    | Unique token for the session.                                               |
| `userId`      | `varchar(255)`   | `NOT NULL`, `FOREIGN KEY references users(id)` | The ID of the user to which this session belongs.                               |
| `expires`     | `timestamp`      | `NOT NULL`                                   | Timestamp indicating when the session expires.                                |

**Relationships:**

*   Many-to-one relationship with `users` table (multiple sessions can belong to one user).

### `verificationTokens`

This table stores verification tokens used for email verification and password reset.

| Column     | Data Type     | Constraints             | Description                                                                 |
| ---------- | ------------- | ----------------------- | --------------------------------------------------------------------------- |
| `identifier` | `varchar(255)`| `NOT NULL`, `PART OF PRIMARY KEY` | Identifier for the token (e.g., email address).                                 |
| `token`      | `varchar(255)`| `NOT NULL`, `PART OF PRIMARY KEY` | Unique token string.                                                          |
| `expires`    | `timestamp`   | `NOT NULL`              | Timestamp indicating when the token expires.                                |

**Relationships:**

*   None

### `clubs`

This table stores information about clubs.

| Column        | Data Type        | Constraints                                  | Description                                                                 |
| ------------- | ---------------- | -------------------------------------------- | --------------------------------------------------------------------------- |
| `id`          | `varchar(255)`   | `NOT NULL`, `PRIMARY KEY`, `DEFAULT: uuid()` | Unique identifier for the club.                                             |
| `name`        | `varchar(255)`   | `NOT NULL`                                   | Name of the club.                                                           |
| `description` | `varchar(255)`   |                                              | Description of the club.                                                      |
| `image`       | `varchar(255)`   |                                              | URL of the club's logo or image.                                             |
| `createdById` | `varchar(255)`   | `NOT NULL`, `FOREIGN KEY references users(id)` | The ID of the user who created the club.                                      |
| `createdAt`   | `timestamp`      | `NOT NULL`, `DEFAULT: CURRENT_TIMESTAMP`       | Timestamp indicating when the club was created.                               |

**Relationships:**

*   Many-to-one relationship with `users` table (multiple clubs can be created by one user).
*   One-to-many relationship with `clubToMembers` table (one club can have multiple members).
*   One-to-many relationship with `events` table (one club can host multiple events).

### `clubToMembers`

This table represents the many-to-many relationship between clubs and users (members).

| Column    | Data Type     | Constraints                                                                 | Description                                                                 |
| --------- | ------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `clubId`  | `varchar(255)`| `NOT NULL`, `FOREIGN KEY references clubs(id)`, `PART OF PRIMARY KEY`      | The ID of the club.                                                         |
| `memberId`| `varchar(255)`| `NOT NULL`, `FOREIGN KEY references users(id)`, `PART OF PRIMARY KEY`      | The ID of the user (member).                                                  |
| `position`| `varchar(255)`|                                                                             | The position of the member in the club (e.g., `Member`, `Creator`, `Head`). |
| `joinedAt`| `timestamp`   | `NOT NULL`, `DEFAULT: CURRENT_TIMESTAMP`                                     | Timestamp indicating when the user joined the club.                           |

**Relationships:**

*   Many-to-one relationship with `clubs` table (multiple clubToMembers entries can belong to one club).
*   Many-to-one relationship with `users` table (multiple clubToMembers entries can belong to one user).

### `events`

This table stores information about events.

| Column        | Data Type        | Constraints                                  | Description                                                                 |
| ------------- | ---------------- | -------------------------------------------- | --------------------------------------------------------------------------- |
| `id`          | `varchar(255)`   | `NOT NULL`, `PRIMARY KEY`, `DEFAULT: uuid()` | Unique identifier for the event.                                             |
| `name`        | `varchar(255)`   | `NOT NULL`                                   | Name of the event.                                                          |
| `description` | `varchar(255)`   |                                              | Description of the event.                                                     |
| `image`       | `varchar(255)`   |                                              | URL of the event's image.                                                     |
| `createdById` | `varchar(255)`   | `NOT NULL`, `FOREIGN KEY references users(id)` | The ID of the user who created the event.                                     |
| `createdAt`   | `timestamp`      | `NOT NULL`, `DEFAULT: CURRENT_TIMESTAMP`       | Timestamp indicating when the event was created.                               |
| `clubId`      | `varchar(255)`   | `NOT NULL`, `FOREIGN KEY references clubs(id)` | The ID of the club hosting the event.                                         |
| `eventDate`   | `timestamp`      | `NOT NULL`                                   | Date and time of the event.                                                   |
| `location`    | `varchar(255)`   |                                              | Location of the event.                                                        |
| `type`        | `varchar(255)`   | `ENUM('ONLINE', 'OFFLINE')`                   | Type of event (online or offline).                                            |
| `shortCode`   | `integer`        | `NOT NULL`, `DEFAULT: generateSixDigitUniqueNumber()` | Short code for the event, used for ticket validation.                       |

**Relationships:**

*   Many-to-one relationship with `users` table (multiple events can be created by one user).
*   Many-to-one relationship with `clubs` table (multiple events can be hosted by one club).
*   One-to-many relationship with `eventRegistrations` table (one event can have multiple registrations).

### `eventRegistrations`

This table represents the many-to-many relationship between events and users (attendees).

| Column        | Data Type        | Constraints                                                                 | Description                                                                 |
| ------------- | ---------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `eventId`     | `varchar(255)`   | `NOT NULL`, `FOREIGN KEY references events(id)`, `PART OF PRIMARY KEY`      | The ID of the event.                                                        |
| `memberId`    | `varchar(255)`   | `NOT NULL`, `FOREIGN KEY references users(id)`, `PART OF PRIMARY KEY`      | The ID of the user (attendee).                                                |
| `registeredAt`| `timestamp`      | `NOT NULL`, `DEFAULT: CURRENT_TIMESTAMP`                                     | Timestamp indicating when the user registered for the event.                  |
| `status`      | `varchar(255)`   | `NOT NULL`                                   | Status of the registration (e.g., `Registered`).                              |

**Relationships:**

*   Many-to-one relationship with `events` table (multiple eventRegistrations entries can belong to one event).
*   Many-to-one relationship with `users` table (multiple eventRegistrations entries can belong to one user).

### `posts`

This table stores example post data. It is not used in the current version of the application.

| Column        | Data Type        | Constraints                                  | Description                                                                 |
| ------------- | ---------------- | -------------------------------------------- | --------------------------------------------------------------------------- |
| `id`          | `serial`         | `NOT NULL`, `PRIMARY KEY`                    | Unique identifier for the post.                                             |
| `name`        | `varchar(256)`   |                                              | Name of the post.                                                           |
| `createdById` | `varchar(255)`   | `NOT NULL`, `FOREIGN KEY references users(id)` | The ID of the user who created the post.                                      |
| `createdAt`   | `timestamp`      | `NOT NULL`, `DEFAULT: CURRENT_TIMESTAMP`       | Timestamp indicating when the post was created.                               |
| `updatedAt`   | `timestamp`      | `$onUpdate: () => new Date()`                | Timestamp indicating when the post was last updated.                          |

**Relationships:**

*   Many-to-one relationship with `users` table (multiple posts can be created by one user).

## Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    users { 
        varchar id PK
        varchar name
        varchar email
        timestamp emailVerified
        varchar image
        varchar enrollmentNo
        varchar degree
        varchar yearOfStudy
        varchar department
    }
    accounts {
        varchar userId FK
        varchar type
        varchar provider
        varchar providerAccountId
        text refresh_token
        text access_token
        integer expires_at
        varchar token_type
        varchar scope
        text id_token
        varchar session_state
        PK(provider, providerAccountId)
    }
    sessions {
        varchar sessionToken PK
        varchar userId FK
        timestamp expires
    }
    verificationTokens {
        varchar identifier
        varchar token
        timestamp expires
        PK(identifier, token)
    }
    clubs {
        varchar id PK
        varchar name
        varchar description
        varchar image
        varchar createdById FK
        timestamp createdAt
    }
    clubToMembers {
        varchar clubId FK
        varchar memberId FK
        varchar position
        timestamp joinedAt
        PK(clubId, memberId)
    }
    events {
        varchar id PK
        varchar name
        varchar description
        varchar image
        varchar createdById FK
        timestamp createdAt
        varchar clubId FK
        timestamp eventDate
        varchar location
        varchar type
        integer shortCode
    }
    eventRegistrations {
        varchar eventId FK
        varchar memberId FK
        timestamp registeredAt
        varchar status
        PK(eventId, memberId)
    }
    posts {
        serial id PK
        varchar name
        varchar createdById FK
        timestamp createdAt
        timestamp updatedAt
    }

    users ||--o{ accounts : has
    users ||--o{ sessions : has
    users ||--o{ clubToMembers : has
    users ||--o{ eventRegistrations : has
    clubs ||--o{ clubToMembers : has
    clubs ||--o{ events : has
    events ||--o{ eventRegistrations : has
    users }o--|| posts : creates
    users }o--|| clubs : creates
    users }o--|| events : creates


```

**Note:**

*   `PK` denotes the primary key of the table.
*   `FK` denotes a foreign key referencing another table.
*   `||--o{` denotes a one-to-many relationship.
*   `}o--||` denotes a many-to-one relationship.
