const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES//

//create a todo

app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all todos

app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a todo

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      id
    ]);

    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a todo

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );

    res.json("Todo was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a todo

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
      id
    ]);
    res.json("Todo was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});
app.put("/todos/complete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Get the todo to mark as complete
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
    // Insert the todo into the complete table
    await pool.query("INSERT INTO complete (description) VALUES ($1)", [todo.rows[0].description]);
    // Delete the todo from the todo table
    await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
    
    res.json("Todo marked as complete!");
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});
// get all completed todos
app.get("/complete", async (req, res) => {
  try {
    const completedTodos = await pool.query("SELECT * FROM complete");
    res.json(completedTodos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

app.delete("/complete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM complete WHERE comp_id = $1", [id]);
    res.json("Completed todo deleted successfully!");
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});


app.listen(5000, () => {
  console.log("server has started on port 5000");
});