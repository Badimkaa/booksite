
import { saveUser, getUser } from '../src/lib/db';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
    console.error('Usage: ts-node scripts/create-admin.ts <username> <password>');
    process.exit(1);
}

async function createAdmin() {
    const existingUser = await getUser(username);
    if (existingUser) {
        console.error('User already exists');
        process.exit(1);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await saveUser({
        id: uuidv4(),
        username,
        passwordHash,
        role: 'SUPER_ADMIN',
        createdAt: new Date().toISOString(),
    });

    console.log(`Admin user created with username: ${username} and password: ${password}`);
}

createAdmin().catch(console.error);
