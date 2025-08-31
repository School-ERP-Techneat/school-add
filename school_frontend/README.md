# SchoolConnect Frontend
(https://deepwiki.com/ankit2pandey/school_frontend)

SchoolConnect is a modern, responsive frontend for a school management application. It features a public-facing landing page, user authentication, and an administrative dashboard. This project is built with Next.js 15, TypeScript, and styled with Tailwind CSS.

## Key Features

*   **Public Landing Page**: A welcoming home page that includes a hero section, an "About Us" section, and a "Latest News" feed.
*   **User Authentication**: Secure and user-friendly signup and login pages.
*   **Administrative Dashboard**: A comprehensive dashboard for managing school operations, including:
    *   Staff Management
    *   Course Management
    *   Student Management
*   **School Profile Management**: A dedicated page for administrators to update school details like name, address, and contact information.
*   **Component-Based Architecture**: Built with reusable React components for a consistent and maintainable codebase.

## Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [React](https://react.dev/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and a package manager (like npm or bun) installed on your machine.

### Installation & Setup

1.  Clone the repository:
    ```sh
    git clone https://github.com/ankit2pandey/school_frontend.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd school_frontend
    ```
3.  Install NPM packages:
    ```sh
    npm install
    ```
4.  Run the development server:
    ```sh
    npm run dev
    ```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Starts the application in development mode with Turbopack.
*   `npm run build`: Builds the application for production.
*   `npm run start`: Starts the production server after a build.
*   `npm run lint`: Lints the code using Next.js's built-in ESLint configuration.

## Project Structure

The project uses the Next.js App Router for routing and layout management.

```
/app
├── components/      # Reusable UI components (Header, Footer, etc.)
├── dashboard/       # Dashboard pages and components
├── login/           # Login page
├── school/          # School details management page
├── signup/          # Signup page
├── globals.css      # Global styles
├── layout.tsx       # Root layout
└── page.tsx         # Main landing page
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
