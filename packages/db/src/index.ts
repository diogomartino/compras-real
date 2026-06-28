import { logger } from '@myapp/logger';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

let db: PostgresJsDatabase;

type TLoadOptions = {
  runMigrations: boolean;
  migrationsFolder?: string;
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
};

const loadDb = async (options: TLoadOptions) => {
  const queryClient = postgres(
    `postgres://${options.user}:${options.password}@${options.host}:${options.port}/${options.database}`
  );

  db = drizzle({ client: queryClient });

  if (options.runMigrations && options.migrationsFolder) {
    await migrate(db, {
      migrationsFolder: options.migrationsFolder
    });
  }

  logger.info('Database is ready');
};

export { and, eq, sql } from 'drizzle-orm';
export * from './schema';
export { db, loadDb };
