import fs from 'fs'
import path from 'path'
import Department from '../models/Department'
import Book from '../models/Book'
import connectDB from '../config/db'

// Normalize strings for case-insensitive matching
const normalize = (str: string) => str.trim().toLowerCase()

const loadJSON = (filename: string) =>
    JSON.parse(
        fs.readFileSync(path.join(__dirname, '..', 'data', filename), 'utf-8')
    )

async function seedDatabase() {
    await connectDB()

    console.log('Clearing existing data...')
    await Department.deleteMany({})
    await Book.deleteMany({})

    // Load and insert departments
    const departmentsData = loadJSON('departments.json')
    const insertedDepartments = await Department.insertMany(departmentsData)
    console.log(`Inserted ${insertedDepartments.length} departments.`)

    // Create map for quick department name -> ObjectId lookup
    const departmentMap = new Map(
        insertedDepartments.map((dept) => [normalize(dept.name), dept._id])
    )

    // Load book data and map to schema fields
    const booksData = loadJSON('books.json')

    const booksToInsert = Array.isArray(booksData)
        ? booksData
              .map((book: any) => {
                  if (!book.category) {
                      console.warn(
                          `Book "${book.name}" missing category, skipping.`
                      )
                      return null
                  }

                  const deptId = departmentMap.get(normalize(book.category))
                  if (!deptId) {
                      console.warn(
                          `Department "${book.category}" not found for book "${book.name}", skipping.`
                      )
                      return null
                  }

                  return {
                      title: book.name,
                      author: book.author,
                      genre: book.genre,
                      image_url: book.image,
                      description: book.details,
                      book_link: book.link,
                      department: deptId,
                      stock: book.quantity,
                  }
              })
              .filter(Boolean)
        : []

    const insertedBooks = await Book.insertMany(booksToInsert)
    console.log(`Inserted ${insertedBooks.length} books.`)

    console.log('Fake data creation complete!')
    process.exit(0)
}

void seedDatabase()
