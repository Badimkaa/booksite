
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const dataDir = path.join(process.cwd(), 'data');
const usersFile = path.join(dataDir, 'users.json');

async function createAdmin() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    let users = [];
    if (fs.existsSync(usersFile)) {
        users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    }

    const username = 'admin';
    const password = 'adminpassword'; // Change this!

    if (users.find(u => u.username === username)) {
        console.log('Admin user already exists.');
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
        id: uuidv4(),
        username,
        passwordHash,
        role: 'SUPER_ADMIN',
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    console.log(`Admin user created with username: ${username} and password: ${password}`);
}

createAdmin().catch(console.error);
