require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./src/models/Admin');

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/feedback-system');
        
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists. Updating password...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();
            console.log('Admin password updated successfully!');
        } else {
            console.log('Creating new admin user...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = new Admin({
                username: 'admin',
                password: hashedPassword
            });
            await admin.save();
            console.log('Admin user created successfully!');
        }
        
        console.log('Admin credentials: username=admin, password=admin123');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createAdmin(); 