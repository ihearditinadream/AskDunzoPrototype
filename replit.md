# AskDunzo Website

## Overview

AskDunzo is a browser extension marketing website built as a full-stack React application with Express.js backend. The platform showcases a browser extension that allows users to add custom features to any website through simple requests. The website serves as both a marketing landing page and a user dashboard with authentication.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **API Architecture**: RESTful endpoints with typed responses

### Database Architecture
- **Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM with type-safe queries
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication System
- **Provider**: Replit Auth integration with OIDC
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Database-backed user profiles with social login data
- **Security**: HTTP-only cookies with secure session management

### Frontend Components
- **Landing Page**: Marketing-focused single-page application
- **User Dashboard**: Authenticated user interface
- **Navigation**: Responsive navigation with smooth scrolling
- **UI System**: Hand-drawn aesthetic with black/white color scheme

### Design System
- **Typography**: Patrick Hand SC for headings, Inter for body text
- **Color Palette**: Minimalist black and white with subtle accents
- **Visual Style**: Hand-drawn borders and containers for unique aesthetic
- **Responsive**: Mobile-first design with breakpoint considerations

## Data Flow

### Authentication Flow
1. User clicks login/signup → redirects to `/api/login`
2. Replit Auth handles OIDC flow
3. User data stored/updated in PostgreSQL users table
4. Session created and stored in database
5. Frontend receives user data via `/api/auth/user`

### Page Routing
- **Unauthenticated**: Landing page with marketing content
- **Authenticated**: User dashboard with profile information
- **Protected Routes**: Middleware checks authentication status

### API Integration
- TanStack Query manages server state and caching
- Custom query client with error handling for 401 responses
- Automatic retry logic and stale-while-revalidate caching

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **drizzle-orm**: Type-safe database queries and migrations
- **@radix-ui/***: Headless UI primitives for accessibility
- **@tanstack/react-query**: Server state management
- **express-session**: Session management middleware

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across frontend and backend
- **Tailwind CSS**: Utility-first CSS framework
- **Replit Integration**: Development environment support

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Assets**: Static files served from build output

### Environment Configuration
- **Development**: `tsx` for TypeScript execution with hot reload
- **Production**: Compiled JavaScript execution
- **Database**: Environment variable configuration for connection string

### Hosting Considerations
- Single server deployment serving both API and static files
- Session storage requires persistent PostgreSQL connection
- Static file serving with proper caching headers

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 02, 2025. Initial setup