🚀 Dragin List Frontend (Admin Portal)
This is a Next.js project bootstrapped with create-next-app, designed as an admin portal for managing lists in the Dragin List application.
A modern, production-ready admin interface featuring:

⚡️ Next.js (App Router) + TypeScript  
🎨 Tailwind CSS + ESLint  
🐳 Docker support  
🌗 Light/Dark theme toggle  
🔐 NextAuth.js (Credentials, Google, Facebook)  
🧾 Form handling with react-hook-form + Yup  
🔄 Token refresh mechanism for secure authentication


📁 Project Structure Highlights
components/common/       # Reusable, responsive UI components (Button, InputField, etc.)
lib/
├── api/axios.ts        # Central Axios instance for API calls
├── services/           # API interactions for list management and other features
├── schemas/            # Yup validation schemas for forms
├── types/              # TypeScript types/interfaces for lists and teams
├── routes.ts           # Centralized route constants
├── constants/          # Shared values (dropdowns, sidebar data, etc.)
├── helpers/            # Utility functions (formatDate, etc.)
└── staticData.ts       # Mock data for testing
layouts/                # Admin layout for consistent UI


✅ Features

🔌 Plug-and-play setup via .env
📋 Admin dashboard for managing lists (create, edit, delete, view)
🔒 Authentication with NextAuth.js (Credentials, Google, Facebook)
🔄 Automatic token refresh every 15 minutes for secure API access
🌙 Light/Dark theme toggle
🐳 Dockerized for easy development and deployment
📊 Responsive tables and forms for list management
🔐 Protected routes with authentication middleware


Getting Started
First, set up the environment variables by creating a .env file based on .env.example and configuring the necessary API endpoints and secrets (e.g., NEXTAUTH_SECRET, API base URL).
Then, run the development server:
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

Open http://localhost:3000 with your browser to see the admin portal.
You can start editing the admin dashboard by modifying app/page.tsx. The page auto-updates as you edit the file.
This project uses next/font to automatically optimize and load Geist, a new font family for Vercel.

🛠️ Key Functionality

List Management: Create, update, delete, and view lists through an intuitive admin interface.
Authentication: Secure login with Credentials, Google, or Facebook providers, with automatic token refresh for seamless API access.
Responsive Design: Fully responsive UI with Tailwind CSS, supporting light and dark themes.
Form Validation: Robust form handling with react-hook-form and Yup for list creation and updates.


🐳 Running with Docker
To run the project using Docker:

Ensure Docker is installed.
Build and run the container:

docker-compose up --build


Access the app at http://localhost:3000.


🔧 API Integration
The admin portal integrates with the backend API at https://web-production-67a12.up.railway.app. Ensure the API base URL and authentication endpoints (e.g., /api/v1/auth/refresh) are correctly configured in .env.
The project uses a centralized Axios instance (lib/api/axios.ts) for API calls, with automatic token refresh handled via NextAuth.js callbacks.

Learn More
To learn more about the technologies used:

Next.js Documentation - Learn about Next.js features and API.
Learn Next.js - An interactive Next.js tutorial.
Tailwind CSS Documentation - Styling with Tailwind CSS.
NextAuth.js Documentation - Authentication for Next.js.
React Hook Form - Form handling.
Yup - Schema validation.

You can check out the Next.js GitHub repository - your feedback and contributions are welcome!

Deploy on Vercel
The easiest way to deploy this Next.js admin portal is to use the Vercel Platform from the creators of Next.js.
Check out the Next.js deployment documentation for more details.

📬 Support
For issues or feature requests, please open an issue on the GitHub repository or contact the development team.
