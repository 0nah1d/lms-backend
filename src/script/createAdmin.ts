import 'dotenv/config'
import mongoose from 'mongoose'
import readline from 'readline'
import chalk from 'chalk'
import User from '../models/User'
import db from '../config/db'

// Start DB and prompt admin
db().then(() => promptAdminDetails())

// CLI input setup
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

function prompt(question: string): Promise<string> {
    return new Promise((resolve) => rl.question(question, resolve))
}

function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

async function promptAdminDetails(): Promise<void> {
    try {
        let username: string
        while (true) {
            username = await prompt('Username: ')
            const existingUsername = await User.findOne({ username })
            if (existingUsername) {
                console.log(
                    chalk.red(
                        'Username already exists. Please choose another one.'
                    )
                )
            } else {
                break
            }
        }

        let email: string
        while (true) {
            email = await prompt('Email: ')
            const existingEmail = await User.findOne({ email })
            if (existingEmail) {
                console.log(
                    chalk.red('Email already exists. Please use another one.')
                )
            } else if (!validateEmail(email)) {
                console.log(
                    chalk.red(
                        'Invalid email format. Please enter a valid email.'
                    )
                )
            } else {
                break
            }
        }

        let password: string
        while (true) {
            password = await prompt('Password (min 8 characters): ')
            if (password.length < 8) {
                console.log(
                    chalk.red(
                        'Password must be at least 8 characters. Please try again.'
                    )
                )
            } else {
                break
            }
        }

        const admin = new User({
            username,
            email,
            password,
            role: 'admin',
        })

        await admin.save()
        console.log(chalk.green('✓ Admin user created successfully!'))
    } catch (err: any) {
        console.error(chalk.red('Failed to create admin:', err.message))
    } finally {
        rl.close()
        await mongoose.disconnect()
    }
}
