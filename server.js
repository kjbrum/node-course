var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

// HOME: Display the home page
app.get('/', function(req, res) {
    res.send('Todo API');
});

// LIST ALL: List all the todos
// Query Parameters: completed, q
app.get('/todos', function(req, res) {
    var queryParams = req.query;
    var filteredTodos = todos;

    // Filter todos by completed
    if (queryParams.hasOwnProperty('completed')) {
        if (queryParams.completed === 'true') {
            filteredTodos = _.where(todos, {
                completed: true
            });
        } else if (queryParams.completed === 'false') {
            filteredTodos = _.where(todos, {
                completed: false
            });
        }
    }

    // Filter todos by description query
    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
        filteredTodos = _.filter(filteredTodos, function(todo) {
            return (todo.description.indexOf(queryParams.q) !== -1);
        });
    }

    if (todos.length > 0) {
        res.json({
            "status": "success",
            "data": filteredTodos
        });
    } else {
        res.status(404).json({
            "status": "error",
            "message": "No todos found."
        });
    }
});

// LIST SINGLE: List a single todo
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id);
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });

    if (matchedTodo) {
        res.json({
            "status": "success",
            "data": matchedTodo
        });
    } else {
        res.status(404).json({
            "status": "error",
            "message": "No todo found with that ID."
        });
    }
});

// CREATE: Create a new todo item
app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    // Make sure the correct information is being supplied
    if (!_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(404).json({
            "status": "error",
            "message": "The description field must be a non-empty string."
        });
    }
    if (!_.isBoolean(body.completed)) {
        return res.status(404).json({
            "status": "error",
            "message": "The completed field must be a boolean."
        });
    }

    // Trim whitespace from description
    body.description = body.description.trim();

    // Add the todo id
    body.id = todoNextId++;

    // Push the new todo item
    todos.push(body);

    // Return the new item
    res.json({
        "status": "success",
        "data": body
    });
});

// DELETE: Remove a todo item
app.delete('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id);
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });

    if (matchedTodo) {
        todos = _.without(todos, matchedTodo);
        res.json({
            "status": "success",
            "data": matchedTodo
        });
    } else {
        res.status(404).json({
            "status": "error",
            "message": "No todo found with that ID."
        });
    }
});

// UPDATE: Update a todo item
app.put('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id);
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });
    var body = _.pick(req.body, 'description', 'completed');
    var updatedValues = {};

    // Look for todo with supplies id
    if (!matchedTodo) {
        res.status(404).json({
            "status": "error",
            "message": "No todo found with that ID."
        });
    }

    // Check what info should be updated
    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length !== 0) {
        updatedValues.description = body.description.trim();
    } else if (body.hasOwnProperty('description')) {
        return res.status(404).json({
            "status": "error",
            "message": "The description field must be a non-empty string."
        });
    }
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        updatedValues.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(404).json({
            "status": "error",
            "message": "The completed field must be a boolean."
        });
    }

    // Update the todo item
    _.extend(matchedTodo, updatedValues);

    // Return the updated item
    res.json({
        "status": "success",
        "data": matchedTodo
    });
});

// Listen on our specified port
app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
});
