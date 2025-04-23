import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
	const [todos, setTodos] = useState([]);
	const [newTodo, setNewTodo] = useState("");

	// Fetch todos from backend
	useEffect(() => {
		fetch("http://localhost:5000/todos")
			.then((res) => res.json())
			.then((data) => setTodos(data))
			.catch((err) => console.error("Error fetching todos:", err));
	}, []);

	// Handle adding a new todo
	const handleAddTodo = async () => {
		if (!newTodo.trim()) return;
		try {
			const res = await fetch("http://localhost:5000/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: newTodo }),
			});
			const addedTodo = await res.json();
			setTodos([...todos, addedTodo]);
			setNewTodo("");
		} catch (err) {
			console.error("Error adding todo:", err);
		}
	};

	// Handle deleting a todo
	const handleDeleteTodo = async (id) => {
		try {
			await fetch(`http://localhost:5000/todos/${id}`, {
				method: "DELETE",
			});
			setTodos(todos.filter((todo) => todo._id !== id));
		} catch (err) {
			console.error("Error deleting todo:", err);
		}
	};

	return (
		<div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
			<h1>MERN Todo App</h1>
			<div>
				<input
					type="text"
					value={newTodo}
					onChange={(e) => setNewTodo(e.target.value)}
					placeholder="Add a new todo"
				/>
				<button onClick={handleAddTodo}>Add Todo</button>
			</div>
			<ul style={{ listStyle: "none", padding: 0 }}>
				{todos.map((todo) => (
					<li key={todo._id} style={{ margin: "10px 0" }}>
						{todo.text}{" "}
						<button onClick={() => handleDeleteTodo(todo._id)}>
							Delete
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
