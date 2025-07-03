# AskDunzo Platform

## Overview

AskDunzo is a comprehensive platform consisting of:
1. **Marketing Website & Dashboard** - A full-stack React application that serves as the landing page and user management interface
2. **Browser Extension** - A Chrome extension that allows users to add custom features to any website through simple requests
3. **AI Service Backend** - API endpoints that process feature requests and generate code using AI

The platform enables users to transform any website by simply describing what they want, like adding dark mode or removing ads. The AI service analyzes the website's structure and generates code that matches the site's existing style.

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

### Browser Extension Architecture
- **Manifest**: Chrome Extension Manifest V3 with broad host permissions
- **Content Script**: Injects floating button and feature code into websites
- **Background Service Worker**: Manages API communication and authentication
- **Popup Interface**: Extension management UI with feature toggles
- **Storage**: Chrome storage API for persisting user features per domain
- **Security**: Code validation and sandboxing before injection

### AI Feature Generation Pipeline
1. **Context Capture**: Extension captures DOM, CSS, and page metadata
2. **Request Processing**: Natural language request sent to AI service
3. **Code Generation**: AI analyzes context and generates matching code
4. **Validation**: Security checks for malicious patterns
5. **Injection**: Safe code injected into the page with proper styling

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
- **Extension Install Guide**: Step-by-step installation instructions

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

## Recent Changes

### January 03, 2025 - UI Enhancements
- ✓ Added accurate browser and OS logos to Chrome, Firefox, Windows, and macOS compatibility buttons
- ✓ Updated data sharing earnings display to focus on community contribution
- ✓ Updated footer copyright year to 2026

### July 02, 2025 - AskDunzo Product Implementation
- ✓ Created Chrome browser extension with manifest v3
- ✓ Implemented content script with floating button UI
- ✓ Built popup interface for extension management
- ✓ Added background service worker for API communication
- ✓ Implemented AI feature generation API endpoint
- ✓ Created mock feature generators for dark mode and ad blocking
- ✓ Built Electron desktop application for Windows, macOS, and Linux
- ✓ Created comprehensive download page with platform-specific installers
- ✓ Added prominent download button to navigation bar
- ✓ Generated installer files for all platforms
- ✓ Created Chrome extension installer page
- ✓ Fixed footer download link to route properly
- → Pending: Full AI integration with OpenAI/Gemini
- → Pending: WebSquare marketplace integration
- → Pending: Chrome Web Store submission

### July 02, 2025 - Back-End Implementation
- ✓ Expanded database schema with subscription, feature request, and WebSquare tables
- ✓ Implemented comprehensive API endpoints for all PRD features
- ✓ Set up Stripe integration for $10/month premium subscriptions
- ✓ Created user dashboard with tabbed interface
- ✓ Built feature request page with AI code generation
- ✓ Implemented subscription management page
- ✓ Created feature history page
- ✓ Built data sharing settings page
- → Pending: OpenAI API key for AI features
- → Pending: Stripe webhook configuration

### July 02, 2025 - Front-End Completion
- ✓ Implemented animated hero demo showing full AskDunzo workflow
- ✓ Updated lifetime premium pricing from $199 to $200
- ✓ Added AskDunzo logos throughout (black and white versions)
- ✓ Enhanced SEO with comprehensive meta tags and Open Graph
- ✓ Improved 404 page with brand-consistent design
- ✓ Added loading spinner component for better UX
- ✓ Implemented accessibility improvements (ARIA labels)
- ✓ All landing page sections complete with hand-drawn aesthetic

## Front-End Status

### Completed Components
1. **Landing Page**
   - Hero Section with animated demo (auto-loops showing icon → input → typing → processing → dark mode toggle)
   - How It Works (3-step process with logo integration)
   - Pricing Section (Free/$0, Premium/$10/month, Lifetime/$200)
   - Data Sharing Program (50/50 split vs 100% donation options)
   - WebSquare Marketplace (Coming Soon state)
   - Footer with complete navigation

2. **Navigation**
   - Fixed header with smooth scroll
   - Mobile-responsive hamburger menu
   - Login/Sign Up buttons redirect to Replit Auth

3. **Authentication**
   - Replit Auth integration complete
   - Protected routes configured
   - User dashboard for authenticated users

4. **Design System**
   - Hand-drawn borders throughout
   - Patrick Hand SC font for headings
   - Black/white minimalist color scheme
   - Grid background pattern
   - Consistent hover animations

5. **SEO & Accessibility**
   - Complete meta tags with Open Graph
   - ARIA labels on interactive elements
   - Semantic HTML structure
   - Mobile-responsive design

## Changelog

- July 02, 2025. Initial setup and front-end completion