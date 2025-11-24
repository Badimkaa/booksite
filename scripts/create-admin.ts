
import { saveUser, getUserByUsername } from '../src/lib/db';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

async function createAdmin() {
    const username = 'admin';
    const password = 'adminpassword'; // Change this!

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
        console.log('Admin user already exists.');
        return;
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
