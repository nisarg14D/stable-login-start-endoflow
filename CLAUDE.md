# Claude Code Configuration

This file contains project-specific information for Claude Code.

## Project Overview
Next.js application with authentication and database integration.

## Development Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server

## Database Commands
- `npm run db:setup` - Setup database
- `npm run db:seed` - Seed database with initial data
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio

## Tech Stack
- Next.js 15 (Canary)
- React 19
- TypeScript
- Drizzle ORM
- PostgreSQL
- Tailwind CSS
- Authentication with JWT (jose)
- bcryptjs for password hashing

## 📋 Complete ENDOFLOW Implementation Plan

### 👩‍⚕️ PHASE 2: Dentist Dashboard (MAJOR)

Based on screenshots, dentist has 10 main sections:

**2A. Core Navigation & Layout**
- Main dashboard structure
- Tab navigation system
- Today's view overview

**2B. Patient Management**
- Patient list and search
- Patient profiles and history
- Patient data management

**2C. Consultation System**
- New consultation workflow
- History taking (AI voice-to-text)
- Clinical examination forms
- Pain characteristic assessment
- Clinical Extraoral assessment
- Other investigation (Xrays, lab, test)

**2D. Diagnosis & Treatment**
- Interactive dental chart
- Tooth-specific diagnosis
- Treatment planning
- Endo AI Copilot integration

**2E. Prescription & Follow-up**
- Add a prescription tab which opens similar table like diagnosis and treatment for medication
- Add follow up assessment tab (that I missed with v.0)

**2F. Appointment Management**
- Appointment organizer
- Scheduling system
- Calendar integration

**2G. Assistant Task Management**
- Task creation and assignment
- Task status tracking (drag & drop)
- Daily task hub

**2H. Template System**
- Template creation and editing
- Template management
- Save and update functionality

**2I. Research Projects**
- Project creation dashboard
- Ongoing project tracking
- Analysis and reporting

**2J. Clinic Analysis**
- Endo AI Copilot
- Analytics dashboard
- Performance metrics

**2K. Messages & Communication**
- Internal messaging system
- Patient communication

### 👩‍💼 PHASE 3: Assistant Dashboard (MEDIUM)

Based on screenshots:
- Home tab overview
- Patient registration system
- Appointment booking for patients
- Daily task management
- Treatment scheduling
- File upload system

### 🔐 PHASE 4: Enhanced Authentication

- QR code login system
- Role-based routing
- Welcome screens