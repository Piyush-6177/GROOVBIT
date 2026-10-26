// Vercel serverless entry: reuses the Express app, connecting to MongoDB before each request
require('dotenv').config()
const app = require('../src/app')
const connectDB = require('../src/db/db')

module.exports = async (req, res) => {
    await connectDB()
    return app(req, res)
}
