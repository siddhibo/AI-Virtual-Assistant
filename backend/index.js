import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import geminiResponse from "./gemini.js"
import fs from "fs"
import path from "path"

const app = express()

// CORS configuration for deployment
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true)
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            // For dummy project, allow all origins
            callback(null, true)
        }
    },
    credentials: true
}))

const port = process.env.PORT || 8000

app.use(express.json())
app.use(cookieParser())

// Create public folder if it doesn't exist
const publicDir = path.join(process.cwd(), 'public')
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
}

// Health check route (useful for deployment)
app.get("/", (req, res) => {
    res.json({ message: "API is running!", status: "ok" })
})

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

app.listen(port, () => {
    connectDb()
    console.log(`Server started on port ${port}`)
})