# Hope - Client Management System

A comprehensive client management system for counseling and therapy services.

## Database Setup

This project uses Prisma as the ORM with PostgreSQL as the database.

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Set up your environment variables:

Create a `.env` file in the root directory with the following content:

```
DATABASE_URL="postgresql://username:password@localhost:5432/hope?schema=public"
```

Replace `username`, `password`, and other details with your PostgreSQL credentials.

3. Generate Prisma client:

```bash
npx prisma generate
```

4. Run database migrations:

```bash
npx prisma migrate dev --name init
```

This will create all the necessary tables in your database.

### Database Schema

The database schema includes the following models:

- Client
- Beneficiary
- Dependant
- User
- Session
- Document
- Note
- Message
- Resource

For detailed schema information, see `prisma/schema.prisma`.

### Working with the Database

The project includes a database client utility in `src/lib/db.ts`. You can import and use it in your components and API routes:

```typescript
import { prisma } from '@/lib/db';

// Example: Fetch all clients
const clients = await prisma.client.findMany();

// Example: Create a new client
const newClient = await prisma.client.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    status: 'ACTIVE',
    clientType: 'INDIVIDUAL',
    joinDate: new Date(),
    lastActive: new Date(),
  },
});
```

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Management

### Prisma Studio

You can use Prisma Studio to view and edit your database:

```bash
npx prisma studio
```

This will open a web interface at [http://localhost:5555](http://localhost:5555) where you can manage your database.

### Migrations

When you make changes to your schema, you need to create and apply migrations:

```bash
npx prisma migrate dev --name your_migration_name
```

This will create a new migration file and apply it to your database.

## License

This project is licensed under the MIT License. 