require('dotenv').config();
const fs =require('fs');
const yaml = require('yaml');
const swaggerUiExpress = require('swagger-ui-express');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');

// MIDDLEWARE
const errorHandler = require('./middleware/error-handler');


// ROUTERS
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');
const commentsRouter = require('./comments/comments-router');
const eventsRouter = require('./events/events-router');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(
  morgan(morganOption, {
    skip: () => NODE_ENV === 'test',
  })
);
app.use(cors());
app.use(helmet());

app.use(express.static('public'));

//SERVE API DOCUMENTATION
const documentation = fs.readFileSync('./ApiDocs/openapi.yaml', 'utf8');
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(yaml.parse(documentation)) );

// ROUTERS
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);
app.use('/events', eventsRouter);

// ERROR HANDLER
app.use(errorHandler);

module.exports = app;
