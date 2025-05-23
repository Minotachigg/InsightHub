

const mongoose = require('mongoose');
const User = require('../models/userModel');

const DB_URI = 'mongodb+srv://admin:admin33@cluster0.bdfgfcd.mongodb.net/BlogNest?retryWrites=true&w=majority';

mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    seedUsers();  // 🔁 Move this inside the .then to be sure it's run after connect
}).catch((err) => {
    console.error('❌ Error connecting to MongoDB:', err);
});

const seedUsers = async () => {
    try {
        const names = [
            'Alice',
            'Jane',
            'Bob',
            'Charlie',
            'David',
            'Eva',
            'Frank',
            'Grace',
            'Hank'
        ];

        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const email = name.toLowerCase().replace(' ', '.') + '@email.com';
            const password = name + '123';

            console.log(`🔄 Creating user: ${name}, password: ${password}`);

            const user = new User({
                name,
                email,
                password: password,
                isVerified: true,
            });

            try {
                await user.save();
                console.log(`✅ Saved user: ${email}`);
            } catch (saveErr) {
                console.error(`❌ Error saving user ${email}:`, saveErr.message);
            }
        }

        console.log('✅ All users processed');
    } catch (err) {
        console.error('❌ Error in seedUsers:', err);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
};


