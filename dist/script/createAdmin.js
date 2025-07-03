"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const readline_1 = __importDefault(require("readline"));
const chalk_1 = __importDefault(require("chalk"));
const User_1 = __importDefault(require("../models/User"));
const db_1 = __importDefault(require("../config/db"));
// Start DB and prompt admin
(0, db_1.default)().then(() => promptAdminDetails());
// CLI input setup
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function prompt(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
async function promptAdminDetails() {
    try {
        let username;
        while (true) {
            username = await prompt('Username: ');
            const existingUsername = await User_1.default.findOne({ username });
            if (existingUsername) {
                console.log(chalk_1.default.red('Username already exists. Please choose another one.'));
            }
            else {
                break;
            }
        }
        let email;
        while (true) {
            email = await prompt('Email: ');
            const existingEmail = await User_1.default.findOne({ email });
            if (existingEmail) {
                console.log(chalk_1.default.red('Email already exists. Please use another one.'));
            }
            else if (!validateEmail(email)) {
                console.log(chalk_1.default.red('Invalid email format. Please enter a valid email.'));
            }
            else {
                break;
            }
        }
        let password;
        while (true) {
            password = await prompt('Password (min 8 characters): ');
            if (password.length < 8) {
                console.log(chalk_1.default.red('Password must be at least 8 characters. Please try again.'));
            }
            else {
                break;
            }
        }
        const admin = new User_1.default({
            username,
            email,
            password,
            role: 'admin',
        });
        await admin.save();
        console.log(chalk_1.default.green('✓ Admin user created successfully!'));
    }
    catch (err) {
        console.error(chalk_1.default.red('Failed to create admin:', err.message));
    }
    finally {
        rl.close();
        await mongoose_1.default.disconnect();
    }
}
