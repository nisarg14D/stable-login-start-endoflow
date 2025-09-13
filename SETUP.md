# ENDOFLOW Setup Guide

## Overview
ENDOFLOW is a comprehensive dental practice management system with role-based authentication, consultation management, prescription system, and follow-up care tracking.

## Features Implemented
- ✅ Role-based authentication (Dentist, Assistant, Patient)
- ✅ Comprehensive consultation management with AI voice-to-text
- ✅ Interactive dental chart with FDI tooth numbering
- ✅ Prescription management with drug interaction warnings
- ✅ Follow-up care management with automated workflows
- ✅ Patient management with medical history tracking
- ✅ Modern medical-themed UI with professional styling
- ✅ Database integration ready for both SQLite (dev) and Supabase (production)

## Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account (for production)
- Git

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/nisarg14D/stable-login-start-endoflow.git
cd stable-login-start-endoflow
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

For **local development** (SQLite), update `.env.local`:
```env
NEXT_PUBLIC_USE_SUPABASE=false
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_min_32_chars
```

### 4. Database Setup (Local Development)
```bash
# Generate database migrations
npm run db:generate

# Run migrations to create tables
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Production Setup (Supabase)

### 1. Create Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Note your Project URL and API Keys

### 2. Configure Environment Variables
Update `.env.local` for production:
```env
NEXT_PUBLIC_USE_SUPABASE=true
NODE_ENV=production

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
POSTGRES_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# JWT Secret
JWT_SECRET=your_production_jwt_secret
SESSION_SECRET=your_session_secret
```

### 3. Database Schema Setup (Supabase)
The application includes 17 comprehensive database tables:

#### Core Tables
- `users` - Authentication and user roles
- `patients` - Patient information
- `dentists` - Dentist profiles
- `assistants` - Assistant profiles

#### Clinical Tables
- `consultations` - Clinical consultations
- `clinical_examinations` - Detailed examination data
- `dental_chart` - Tooth status tracking
- `treatments` - Treatment records
- `patient_medical_history` - Medical history tracking

#### Prescription System
- `medicines` - Medicine database (with custom medicine support)
- `prescriptions` - Prescription headers
- `prescription_items` - Individual prescribed medicines

#### Follow-up System
- `follow_up_plans` - Follow-up care plans
- `follow_up_tasks` - Individual follow-up tasks

#### Supporting Tables
- `appointments` - Appointment scheduling
- `messages` - Patient communication
- `documents` - File attachments

### 4. Create Tables in Supabase
1. Go to your Supabase project's SQL editor
2. Run the following to create all tables:

```sql
-- Execute the migration files in order
-- 1. Copy content from drizzle/0000_dry_snowbird.sql
-- 2. Copy content from drizzle/0001_green_falcon.sql  
-- 3. Copy content from drizzle/0002_dapper_madame_web.sql
```

### 5. Set Row Level Security (RLS)
Enable RLS policies in Supabase for security:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_plans ENABLE ROW LEVEL SECURITY;
-- ... (repeat for all tables)

-- Example RLS policy for prescriptions
CREATE POLICY "Users can view their own prescriptions" ON prescriptions
    FOR SELECT USING (auth.uid() = patient_id::uuid);

CREATE POLICY "Dentists can create prescriptions" ON prescriptions
    FOR INSERT WITH CHECK (auth.uid() IN (
        SELECT id::uuid FROM users WHERE role = 'dentist'
    ));
```

### 6. Seed Production Database
```bash
# Generate initial medicine database
npm run db:seed
```

## Application Architecture

### Frontend Structure
```
app/
├── (login)/          # Authentication pages
├── (patient)/        # Patient dashboard
├── dentist/          # Dentist dashboard
├── assistant/        # Assistant dashboard
└── api/              # API routes

components/
├── consultation-form.tsx        # New consultation interface
├── prescription-manager.tsx     # Prescription system
├── follow-up-manager.tsx       # Follow-up care
├── interactive-dental-chart.tsx # Dental charting
├── dentist-dashboard.tsx       # Main dentist interface
└── ui/                         # Reusable UI components
```

### Backend Structure
```
lib/
├── db/
│   ├── schema.ts          # Database schema (17 tables)
│   ├── drizzle.ts         # Database connection
│   ├── supabase.ts        # Supabase client & types
│   └── queries.ts         # Database queries
├── services/
│   └── data-service.ts    # Data abstraction layer
└── store/
    └── patient-store.ts   # Patient data management
```

## Key Features Documentation

### 1. Authentication System
- Role-based access control (Dentist, Assistant, Patient)
- JWT-based session management
- Secure password hashing with bcryptjs

### 2. Consultation Management
- Comprehensive consultation forms
- AI voice-to-text integration ready
- Medical history tracking
- Pain assessment tools
- Clinical examination forms

### 3. Prescription System
- 5 pre-loaded common dental medicines
- Custom medicine addition capability
- Drug interaction warnings
- Professional prescription preview
- Print/PDF export ready

### 4. Follow-up Care Management
- Treatment-specific templates
- Automated task generation
- Progress tracking
- Multi-channel follow-ups (calls, messages, appointments)

### 5. Interactive Dental Chart
- FDI tooth numbering system
- Tooth condition tracking
- Visual tooth status indicators
- Click-to-diagnose interface

## Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database (Local SQLite)
npm run db:setup        # Setup database
npm run db:generate     # Generate migrations
npm run db:migrate      # Run migrations
npm run db:seed         # Seed with sample data
npm run db:studio       # Open Drizzle Studio
```

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_USE_SUPABASE` | Database type toggle | Yes | `false` (dev), `true` (prod) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Prod only | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Prod only | `eyJhbGci...` |
| `POSTGRES_URL` | PostgreSQL connection | Prod only | `postgresql://...` |
| `JWT_SECRET` | JWT signing secret | Yes | Min 32 characters |
| `SESSION_SECRET` | Session encryption | Yes | Min 32 characters |
| `NODE_ENV` | Environment | Yes | `development`/`production` |

## User Roles & Permissions

### Dentist
- Full access to all patient data
- Create/edit consultations
- Prescribe medications
- Manage follow-up plans
- View all clinical data

### Assistant
- Schedule appointments
- Register new patients
- Upload documents
- Manage daily tasks
- Limited patient data access

### Patient
- View own appointments
- Access medical records
- Message healthcare team
- Book new appointments
- View prescriptions

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check environment variables
echo $NEXT_PUBLIC_USE_SUPABASE
echo $POSTGRES_URL

# Test database connection
npm run db:studio
```

#### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npx tsc --noEmit
```

#### Supabase Connection Issues
- Verify project URL and API keys
- Check RLS policies
- Ensure tables exist
- Verify network connectivity

### Performance Optimization
- Enable database connection pooling
- Implement caching for frequently accessed data
- Optimize queries with proper indexing
- Use Supabase Edge Functions for complex operations

## Deployment Options

### 1. Vercel (Recommended)
```bash
# Connect GitHub repo to Vercel
# Add environment variables in Vercel dashboard
# Deploy automatically on push
```

### 2. Netlify
```bash
# Build command: npm run build
# Publish directory: .next
# Add environment variables in Netlify dashboard
```

### 3. Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Security Considerations

- All passwords are hashed with bcryptjs
- JWT tokens have expiration
- RLS policies control data access
- Input validation on all forms
- CORS properly configured
- Environment variables for sensitive data

## Future Enhancements

### Phase 3 Features (Planned)
- Real-time notifications
- Advanced reporting & analytics
- Inventory management
- Billing & insurance integration
- Mobile app support
- Telemedicine features

### Integration Opportunities
- Laboratory systems
- Imaging systems (X-ray, CBCT)
- Insurance providers
- Payment processors
- SMS/Email services
- Calendar systems

## Support & Maintenance

### Regular Maintenance Tasks
- Database backups
- Security updates
- Performance monitoring
- User access reviews
- Data cleanup

### Monitoring
- Application performance
- Database performance  
- User activity logs
- Error tracking
- Uptime monitoring

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**ENDOFLOW** - Your AI-Powered Dental Practice OS
Built with Next.js, React 19, TypeScript, Drizzle ORM, and Supabase