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

// CORS configuration - Allow your frontend domain
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://ai-virtual-assistant-frontend-ym55.onrender.com",
        "https://ai-virtual-assistant-frontend-ten.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

// Render assigns a dynamic port via process.env.PORT, keep it available
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