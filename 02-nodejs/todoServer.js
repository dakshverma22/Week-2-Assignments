/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

let todos = []
function createTodo(req,res){
    /**
     * This function handles the incoming request to create a todo
     * @param {req} the incoming request
     * @param {res} the outgoing response that we will set
     * @returns A JSON object with the data and success
     */
    let results = {}
    let response = null
    try {
        const id = Date.now()
        const todo = {...req.body, id: id}
        if (todo.title && todo.description) {
            todos.push(todo)
            results.success = true
            results.data = "Todo added successfully"
            results.id = id
            response = res.status(200).json(results)
        }else {
            results.success = false
            results.data = "Title or description missing"
            response = res.status(400).json(results)
        }
        return response
    }catch (e) {
        results.success = false
        results.error = "Not able to add Todo"
        return res.status(500).json(results)
    }
}

function getAllTodos(req,res) {
    let results = {}
    try {
        results.success = true
        results.data = todos
        return  res.status(200).json(results)
    }catch (e) {
        results.success = false
        results.error = "Not able to get all todos"
        return  res.status(500).json(results)
    }
}

function getTodo(req,res) {
    let results = {}
    let response = null
    try {
        const id = +req.param.id
        if (!id) {
            results.data = false;
            results.success = "Please provide an ID of TODO"
            response = res.status(401).json(results)
        }else {
            const todo = todos.filter(todo => todo.id === id)
            if (!todo) {
                results.success = false
                results.data = "No TODO found with the ID"
                response = res.status(404).send(results)
            }else {
                results.success = true
                results.data = todo
                response = res.status(200).json(results)
            }
        }
        return response
    }catch (e) {
        results.success = false
        results.data = "Error getting todo"
        return res.status(500).json(results)

    }
}

function updateTodo(req,res) {
    let results = {}
    let response = null
    try{
        const updatedTodo = {...req.body}
        const todoIndex = todos.findIndex(todo => todo.id === req.param.id)
        if(todoIndex){
            todos[todoIndex] = {...todos[todoIndex], ...updatedTodo}
            results.success = true
            results.data = "Updated Todo successfully"
            response = res.status(200).json(results)
        }else {
            results.success = false
            results.data = "Can not find a todo with the given ID"
            response = res.status(404).json(results)
        }
        return response
    }catch (e) {
        results.success = false
        results.error = "Could not update todo with the given ID"
        return res.status(500).json(results)
    }
}

function deleteTodo(req,res) {
    let results = {}
    try{
        const updatedTodos = todos.filter(todo => todo.id !== req.param.id)
        todos = [...updatedTodos]
        results.success = true
        results.data = "Deleted the todo successfully"
        return res.status(200).json(results)
    }catch (e) {
        results.success = false
        results.data = "Error while deleting the todo"
        return res.status(404).json(results)
    }
}
app.post('/todos', createTodo)
app.get('/todos', getAllTodos)
app.get('/todos/:id', getTodo)
app.put('/todos/:id', updateTodo)
app.delete('/todos/:id', deleteTodo)
app.use((req,res) => res.status(404))
app.listen(3000, () => {
    console.log('Application running on port 3000..')
})

module.exports = app;
