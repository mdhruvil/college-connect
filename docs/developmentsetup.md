# Development Setup Guide

This guide provides step-by-step instructions for setting up your local development environment for the College Connect application. Follow these instructions to ensure a smooth and efficient development experience.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

-   **Node.js:** Ensure you have Node.js version 18 or higher. You can download it from the [official Node.js website](https://nodejs.org/).
-   **npm** or **yarn:** Node.js usually comes with npm. Alternatively, you can use yarn.  If you prefer yarn, install it globally using npm:

    ```bash
    npm install -g yarn
    ```

-   **Git:**  You'll need Git to clone the repository.  If you don't have it, download it from [git-scm.com](https://git-scm.com/).
-   **PostgreSQL:** The application uses PostgreSQL as its database. You need to have a local instance running. You can download it from the [official PostgreSQL website](https://www.postgresql.org/).

## Step-by-Step Setup

### 1. Clone the Repository

First, clone the College Connect repository from GitHub to your local machine. Open your terminal and run the following command:

```bash
git clone <repository-url>
cd college-connect
```

Replace `<repository-url>` with the actual URL of the College Connect repository.

### 2. Install Dependencies

Navigate to the project directory and install the required dependencies. You can use either `npm` or `yarn`.

#### Using npm:

```bash
npm install
```

#### Using yarn:

```bash
yarn install
```

This command will install all the necessary packages listed in the `package.json` file.

### 3. Set Up Environment Variables

The application requires several environment variables to be set up correctly. Create a `.env` file in the root directory of the project.  You can start by copying the `.env.example` file:

```bash
cp .env.example .env
```

Edit the `.env` file and add the following variables with your specific values:

```
DATABASE_URL="<your-database-url>"
NODE_ENV="development"
NEXTAUTH_SECRET="<your-nextauth-secret>"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="<your-google-client-id>"
GOOGLE_CLIENT_SECRET="<your-google-client-secret>"
UPLOADTHING_SECRET="<your-uploadthing-secret>"
UPLOADTHING_APP_ID="<your-uploadthing-app-id>"
```

Replace the placeholder values with your actual credentials and settings. Here’s a breakdown of each variable:

-   `DATABASE_URL`: The connection string to your PostgreSQL database.  Example: `postgresql://user:password@host:port/database`
-   `NODE_ENV`: Set to `development` for local development.
-   `NEXTAUTH_SECRET`: A secret key used for NextAuth.js.  Generate a random string for this.
-   `NEXTAUTH_URL`: The URL of your NextAuth.js instance.  For local development, this is usually `http://localhost:3000`.
-   `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
-   `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret.
-   `UPLOADTHING_SECRET`: Your Uploadthing secret key.
-   `UPLOADTHING_APP_ID`: Your Uploadthing App ID.

**Note:** Ensure your `.env` file is added to `.gitignore` to prevent sensitive information from being committed to the repository.

### 4. Database Configuration

#### Create the Database

Make sure you have a PostgreSQL database created locally. You can use a tool like pgAdmin or the command line to create a new database.

#### Run Database Migrations

Apply the database migrations to create the necessary tables. Run the following command:

```bash
npm run db:push
```

This command uses Drizzle ORM to push the schema defined in `server/db/schema.ts` to your PostgreSQL database.

### 5. Run the Development Server

Start the development server using the following command:

#### Using npm:

```bash
npm run dev
```

#### Using yarn:

```bash
yarn dev
```

This will start the Next.js development server, and you can access the application by navigating to `http://localhost:3000` in your web browser.

## Additional Commands

Here are some other useful commands for development:

-   `npm run build`: Builds the application for production.
-   `npm run start`: Starts the production server.
-   `npm run lint`: Lints the code using ESLint.
-   `npm run format`: Formats the code using Prettier.

## Troubleshooting

-   **Dependency Issues:** If you encounter issues with dependencies, try deleting the `node_modules` folder and running `npm install` or `yarn install` again.
-   **Database Connection Issues:** Ensure your `DATABASE_URL` is correctly configured and that your PostgreSQL server is running.
-   **Port Conflicts:** If port 3000 is already in use, the development server will attempt to use a different port. Check the console output for the new port number.

## Conclusion

Your development environment should now be set up correctly. You can start making changes to the code and testing them locally. Refer to the other documentation files, such as [codearchitecture.md](codearchitecture.md) and [apireference.md](apireference.md), for more information on the project structure and API endpoints.