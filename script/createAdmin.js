require('dotenv').config()
const mongoose = require('mongoose')
const readline = require('readline')
const User = require('../models/User')
const db = require('../config/db')
const chalk = require('chalk')

db().then(() => promptAdminDetails())

// CLI input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

function prompt(question) {
    return new Promise((resolve) => rl.question(question, resolve))
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

async function promptAdminDetails() {
    try {
        let username
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

        let email
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

        let password
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
    } catch (err) {
        console.error(chalk.red('Failed to create admin:', err.message))
    } finally {
        rl.close()
        mongoose.disconnect()
    }
}
