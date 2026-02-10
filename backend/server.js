const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Task = require("./models/Task");

const app = express();
const JWT_SECRET = "MY_SUPER_SECRET_KEY";

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE"
    );
    next();
});

/* =========================
   MONGODB
========================= */
mongoose
    .connect("mongodb://127.0.0.1:27017/calender_planner")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

/* =========================
   JWT VERIFY MIDDLEWARE
========================= */
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

/* =========================
   AUTH
========================= */

// SIGNUP
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
        name,
        email,
        password: hashed
    });

    res.json({ message: "Signup successful" });
});

// LOGIN
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({
        message: "Login successful",
        token,
        name: user.name
    });
});

/* =========================
   TASKS (USER)
========================= */

app.get("/tasks", verifyToken, async (req, res) => {
    const tasks = await Task.find({ createdBy: req.userId });
    res.json(tasks);
});

app.post("/tasks", verifyToken, async (req, res) => {
    const task = new Task({
        text: req.body.text,
        date: req.body.date,
        createdBy: req.userId,
        assignedTo: req.userId
    });

    await task.save();
    res.json(task);
});

app.delete("/tasks/:id", verifyToken, async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    if (task.createdBy.toString() !== req.userId) {
        return res.status(403).json({ message: "Not allowed" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
});

/* =========================
   TEAM DASHBOARD (ALL TASKS)
========================= */
app.get("/tasks/all", verifyToken, async (req, res) => {
    const tasks = await Task.find()
        .populate("createdBy", "name")
        .populate("assignedTo", "name");

    res.json(tasks);
});

/* =========================
   SERVER
========================= */
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
