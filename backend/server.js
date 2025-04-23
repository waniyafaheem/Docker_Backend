const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/todos";
mongoose
	.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("MongoDB connection error:", err));

const todoSchema = new mongoose.Schema({
	text: { type: String, required: true },
	completed: { type: Boolean, default: false },
});
const Todo = mongoose.model("Todo", todoSchema);

app.get("/todos", async (req, res) => {
	try {
		const todos = await Todo.find();
		res.json(todos);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch todos" });
	}
});

app.post("/todos", async (req, res) => {
	try {
		const newTodo = new Todo({ text: req.body.text });
		const savedTodo = await newTodo.save();
		res.status(201).json(savedTodo);
	} catch (err) {
		res.status(500).json({ error: "Failed to create todo" });
	}
});

app.delete("/todos/:id", async (req, res) => {
	try {
		await Todo.findByIdAndDelete(req.params.id);
		res.json({ message: "Todo deleted" });
	} catch (err) {
		res.status(500).json({ error: "Failed to delete todo" });
	}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Backend server running on port ${PORT}`);
});
