import path from 'path';

const LOGS_PATH = path.join(process.cwd(), 'logs');
const MIGRATIONS_PATH = path.join(process.cwd(), 'src', 'db', 'migrations');

export { LOGS_PATH, MIGRATIONS_PATH };
