import { exec } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { promisify } from 'node:util';
import readline from 'node:readline';
import crypto from 'node:crypto';
import path from 'node:path';

const execAsync = promisify(exec);

function question(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

async function getPostgresURL(): Promise<string> {
  console.log('Step 1: Setting up Postgres for ENDOFLOW');
  const dbChoice = await question(
    'Do you want to use a local Postgres instance with Docker (L) or a remote Postgres instance (R)? (L/R): '
  );

  if (dbChoice.toLowerCase() === 'l') {
    console.log('Setting up local Postgres instance with Docker...');
    await setupLocalPostgres();
    return 'postgres://postgres:postgres@localhost:54322/endoflow';
  } else {
    console.log(
      'You can find Postgres databases at: https://vercel.com/marketplace?category=databases or use Supabase'
    );
    return await question('Enter your POSTGRES_URL: ');
  }
}

async function setupLocalPostgres() {
  console.log('Checking if Docker is installed...');
  try {
    await execAsync('docker --version');
    console.log('Docker is installed.');
  } catch (error) {
    console.error(
      'Docker is not installed. Please install Docker and try again.'
    );
    console.log(
      'To install Docker, visit: https://docs.docker.com/get-docker/'
    );
    process.exit(1);
  }

  console.log('Creating docker-compose.yml file...');
  const dockerComposeContent = `
services:
  postgres:
    image: postgres:16.4-alpine
    container_name: endoflow_postgres
    environment:
      POSTGRES_DB: endoflow
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "54322:5432"
    volumes:
      - endoflow_postgres_data:/var/lib/postgresql/data

volumes:
  endoflow_postgres_data:
`;

  await fs.writeFile(
    path.join(process.cwd(), 'docker-compose.yml'),
    dockerComposeContent
  );
  console.log('docker-compose.yml file created.');

  console.log('Starting Docker container with `docker compose up -d`...');
  try {
    await execAsync('docker compose up -d');
    console.log('Docker container started successfully.');
  } catch (error) {
    console.error(
      'Failed to start Docker container. Please check your Docker installation and try again.'
    );
    process.exit(1);
  }
}

function generateSessionSecret(): string {
  console.log('Step 2: Generating SESSION_SECRET...');
  return crypto.randomBytes(32).toString('hex');
}

async function writeEnvFile(envVars: Record<string, string>) {
  console.log('Step 3: Writing environment variables to .env');
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  await fs.writeFile(path.join(process.cwd(), '.env'), envContent);
  console.log('.env file created with the necessary variables.');
}

async function main() {
  console.log('🦷 Welcome to ENDOFLOW Database Setup!');
  console.log('This will set up your PostgreSQL database for the dental clinic management system.\n');

  const POSTGRES_URL = await getPostgresURL();
  const SESSION_SECRET = generateSessionSecret();
  const BASE_URL = 'http://localhost:3000';

  await writeEnvFile({
    POSTGRES_URL,
    SESSION_SECRET,
    BASE_URL,
  });

  console.log('\n🎉 ENDOFLOW database setup completed successfully!');
  console.log('Next steps:');
  console.log('1. Run: npm run db:generate - to generate database migrations');
  console.log('2. Run: npm run db:migrate - to apply migrations');
  console.log('3. Run: npm run db:seed - to seed with initial data');
  console.log('4. Run: npm run dev - to start the development server');
}

main().catch(console.error);
