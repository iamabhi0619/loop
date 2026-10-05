# Milaap

Milaap is a modern real-time messaging application built to deliver a production-style chat experience with clean UX, responsive layouts, and a practical full-stack architecture. It combines a polished Next.js frontend with Supabase for realtime data and storage, plus a separate authentication API that manages login, token refresh, and social sign-in.

The goal of this project is not just to send messages. It is to demonstrate how to design a messaging product that handles realtime updates, chat state management, media workflows, authentication flows, and scalable UI composition in a way that is credible in an interview and extensible in a real product.

## Why This Project Stands Out

Most portfolio chat apps stop at a static interface or basic CRUD messaging. Milaap goes further by focusing on product thinking and engineering depth:

- Realtime message delivery using Supabase channels
- Direct messaging flow with searchable user discovery
- Voice notes and file attachment support
- Stateful chat UI optimized for mobile and desktop
- Dedicated Zustand stores for auth, chats, messages, and composer state
- Token refresh flow for persistent authenticated sessions
- Social login entry point with Google OAuth
- Production-minded metadata, theming, and responsive layout structure

This makes Milaap a strong discussion project for interviews because it shows how frontend architecture, async state, external services, and user experience come together in one system.

## Core Features

### Authentication

- Email and password login
- Registration flow for new users
- Logout and forgot-password flows
- Google sign-in integration
- Access token handling with automatic refresh via Axios interceptors

### Messaging Experience

- Real-time chat updates
- Direct message creation between users
- Paginated message history loading
- Responsive two-pane desktop layout and mobile-first single-pane flow
- Empty-state handling for first-time and inactive users

### Rich Communication

- Text messaging
- Voice message support
- File attachments for images, audio, video, and documents
- Attachment staging and preview before send
- Reply and reaction data model support in the messaging layer

### Product and UX Details

- Animated landing page built with Framer Motion
- Search-driven user discovery to start new conversations
- Toast feedback for important user actions
- Theme provider support
- SEO and metadata setup for a production-facing web app

## Tech Stack

### Frontend

- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- shadcn/ui and Radix-based UI primitives

### State and Data

- Zustand for client-side state management
- Supabase Database for chat and user data
- Supabase Realtime for live message delivery
- Supabase Storage for media uploads

### Networking and Auth

- Axios for API communication
- Cookie-based refresh token flow
- Bearer token injection through request interceptors
- Google OAuth entry through backend auth routes

## Architecture Overview

Milaap is structured as a frontend-first application with clear separation between UI, state, and integrations.

### 1. App Layer

The application uses the Next.js App Router for route-driven composition. The landing page, auth flow, chat screen, and user area are isolated into route segments, which keeps the UI modular and easier to scale.

### 2. State Layer

Zustand is used to separate responsibilities cleanly:

- User store manages authentication state and user bootstrap logic
- Chat store manages chat fetching and direct message creation
- Message store manages selected chat state, pagination, and realtime subscriptions
- Messaging composer store manages attachment uploads, text input, and voice note staging

This separation is one of the strongest engineering decisions in the project because it keeps UI components focused on rendering while business logic stays centralized and reusable.

### 3. Data Layer

Supabase powers three important workflows:

- Database queries for users, chats, messages, and attachments
- Realtime subscriptions for instant message delivery
- Storage buckets for media and file uploads

### 4. API Layer

Authentication is handled through a separate backend API. The frontend communicates with that API for login, signup, logout, refresh token rotation, and Google auth redirects.

This hybrid approach is worth highlighting in interviews because it shows an understanding that not every concern should live inside a single frontend codebase.

## Project Structure

```text
src/
	app/                Next.js routes, layouts, landing page, auth, chats
	components/         Reusable UI and chat-specific components
	lib/                API client, Supabase client, utilities, actions
	stores/             Zustand stores for auth, chats, and messages
	types/              Shared TypeScript types for app and database models
```

## Notable Engineering Decisions

### Realtime Without Overcomplicating the Stack

Instead of building a custom WebSocket server, the app uses Supabase Realtime to subscribe to new message events per chat. That reduces backend complexity while still delivering a live chat experience.

### Store-Driven UI Coordination

The chat experience depends on synchronized state across multiple screens and interaction surfaces. Using small focused Zustand stores avoids prop-drilling and makes chat selection, message loading, and composer state easier to reason about.

### Media as a First-Class Feature

Attachments and voice notes are not bolted on. The codebase includes upload handling, preview states, file metadata, and message persistence paths for richer communication workflows.

### Responsive Product Thinking

The chat view adapts between mobile and desktop layouts instead of simply shrinking the same interface. That is a practical product decision and a useful talking point in interviews.

## Local Development

### Prerequisites

- Node.js 18 or newer
- npm, pnpm, yarn, or bun
- A Supabase project
- A running backend auth API compatible with the configured endpoints

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_BASE_URL=http://localhost:5050
NEXT_PUBLIC_API_URL=http://localhost:5050
JWT_SECRET=your_jwt_secret_if_used_server_side
```

Notes:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required for database, realtime, and storage access.
- `NEXT_PUBLIC_API_BASE_URL` is used for login, logout, refresh token, and Google auth.
- `NEXT_PUBLIC_API_URL` is referenced by the user profile flow.
- `JWT_SECRET` appears in the codebase for JWT verification logic. If that path is only used server-side, keep it out of client exposure.

### 3. Run the App

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Interview Talking Points

If you present this project in an interview, these are the strongest angles to lead with:

### Problem Framing

Milaap solves a realistic communication problem rather than being a generic UI clone. The product is centered around realtime interaction, account-based identity, and rich media messaging.

### Frontend Architecture

The application shows clear state boundaries, reusable component composition, and responsive route-driven structure using modern React and Next.js patterns.

### System Integration

The project integrates a frontend application with external infrastructure for auth, realtime data, and storage. That demonstrates practical engineering beyond static UI work.

### Product Depth

Features like token refresh, user discovery, empty states, mobile adaptation, media attachments, and voice recording reflect product-minded development instead of tutorial-level implementation.

## What I Would Build Next

These are the most natural next steps if this project continues:

- Group chat creation and role management UI
- Read receipts and presence indicators
- Typing indicators wired end-to-end
- Message editing and soft delete UI
- Better search across messages and conversations
- Test coverage for stores, auth flows, and critical chat interactions
- Rate limiting, abuse prevention, and attachment validation hardening

## Deployment Notes

For production deployment, make sure the following are in place:

- Supabase database tables, policies, storage buckets, and realtime enabled on required tables
- Backend auth API deployed with correct CORS and cookie settings
- Frontend environment variables configured in the hosting platform
- Google OAuth callback and redirect URLs aligned between frontend and backend

## Summary

Milaap is a strong full-stack frontend project because it demonstrates more than component styling. It shows state architecture, realtime communication, external service integration, authentication flows, responsive UX, and feature design that maps closely to real product development.

If you are using this project in interviews, position it as a system you designed to handle the messy parts of real-world messaging, not just as a chat interface.
