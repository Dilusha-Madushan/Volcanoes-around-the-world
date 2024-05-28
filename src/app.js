const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const knex = require('./config/db');
const runSqlFile = require('./utils/runSqlFile')

const dataRoutes = require('./api/routes/dataRoutes');
const userRoutes = require('./api/routes/userRoutes');
const errorHandler = require('./api/middleware/errorHandlingMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerDocument = YAML.load('./public/docs/swagger.yaml');
//const swaggerDocument = require('.public/docs/swagger.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedPaths = [
    '/', '/countries', '/volcanoes', '/volcano/{id}', '/user/register', '/user/login', '/user/{email}/profile', '/me'
];

// Middleware to check if the path is allowed
app.use((req, res, next) => {
    if (allowedPaths.includes(req.path) || allowedPaths.some(path => req.path.startsWith(path))) {
        next();
    } else {
        res.status(404).json({
            error: true,
            message: "Not Found"
        });
    }
});

// API Routes
app.use('/', dataRoutes);
app.use('/user', userRoutes);

app.get('/me', (req, res) => {
    res.status(200).json({
        name: process.env.STD_NAME,
        student_number: process.env.STD_ID
    });
});

// Swagger UI setup
app.use('/', swaggerUI.serve);
app.get('/', swaggerUI.setup(swaggerDocument));

// Error Handling Middleware
app.use(errorHandler);


// Start server
// Function to run initial setup like migrations and SQL files
async function runInitialSetup() {
    try {
        // Run database migrations
        await knex.migrate.latest();

        // Execute SQL file
        await runSqlFile();

        // Start server after setup is complete
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the application due to initial setup failure:', error);
        process.exit(1);
    }
}

// Execute the initial setup then start the server
runInitialSetup();

module.exports = app;