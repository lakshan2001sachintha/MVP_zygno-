# Round 2: Full-Stack Developer Intern Assignment

## Project: Education Institute Management System (Mini-MVP)

Welcome to the second round of our interview process! In this round, we want to see how you build, structure, and design a functional full-stack web application. 

### Timeline
- **Expected Duration:** Take up to 3 days. 
- **Hard Limit:** There is no hard time limit. We want you to work at a comfortable pace without burning out. Just keep us updated on your progress!

### AI & Tooling Policy
We embrace modern development workflows, but we want to evaluate *your* engineering decisions and how you collaborate with AI, rather than evaluating an AI's ability to generate an app from scratch.
- **ALLOWED:** Coding assistants, inline copilots, and chat-based agents (e.g., GitHub Copilot, Cursor, Claude Code, ChatGPT, Antigravity, Supermaven).
- **NOT ALLOWED:** End-to-end (E2E) application generators (e.g., Lovable, Replit AI, v0, Bolt.new, Devin). You must scaffold, structure, and assemble the application yourself.

---

## Requirements & Guidelines

### Tech Stack
- **Required Starting Point:** You must use the provided codebase (this repository) as your starting point. Please fork this repository or clone it and push it to your own remote to begin.
- **Tech Stack:** You must stick to the core technologies already present in the repository (e.g., Tanstack Start, React, TypeScript, etc. - based on the repo setup). 
- **Database & Backend:** You are required to use **Supabase** for your database and backend needs. Please set up your own free Supabase project and connect it to your application. Make sure to include instructions in your README on what environment variables are needed and provide the database schema/SQL script so we can run the app with our own instance.
- **Packages & Libraries:** You are highly encouraged to use modern packages, component libraries (like TailwindCSS, Shadcn UI, MUI, Chakra), and state management tools as needed, provided they integrate well with the existing project structure. Don't reinvent the wheel!

### Core Features to Implement
We'd like you to use your imagination to build a simplified **Education Institute Management System**. It doesn't need to be fully production-ready, but it should demonstrate your ability to manage state, databases, and user interfaces. 

Please implement the following modules (and feel free to add your own flair!):

#### 1. User Management (Role-Based)
- Implement a basic way to handle different user types: **Admin**, **Teacher**, and **Student**. 
- *Note:* We encourage you to use Supabase Auth for managing these users. You don't have to build a complex JWT/OAuth flow from scratch; setting up basic email/password authentication or magic links with Supabase is perfectly fine.
- Admins should be able to view a list of all users and create new ones.

#### 2. Module / Course Management
- Create a system where Admins or Teachers can create new Educational Modules (e.g., "Intro to Computer Science", "Advanced Mathematics").
- Modules should have details like: Title, Description, Credits, and an Assigned Teacher.
- Users should be able to perform basic CRUD (Create, Read, Update, Delete) operations on these modules based on their roles.

#### 3. Dashboard Views
Create a few distinct views (pages/screens) to tie the app together:
- **Admin Dashboard:** A high-level overview showing total active students, total modules, and recent activity.
- **Module Explorer:** A view for Students to browse available modules and see who is teaching them.
- **Teacher Workspace:** A view where a Teacher can see only the modules assigned to them.

---

## Deliverables

1. **Source Code:** A link to a public GitHub repository (or invite us to a private one).
2. **README:** A `README.md` file containing:
   - Instructions on how to run your project locally (e.g., environment variables needed, database setup, install commands).
   - A brief explanation of the tech stack choices you made.
   - A short paragraph on how you utilized AI agents during the project.

Good luck, have fun with it, and let your creativity shine!