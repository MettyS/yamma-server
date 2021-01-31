# Yamma Server

1. Working Prototype
You can access a working prototype of the React app here: https://yamma-client-23jelxwls.vercel.app/ and Node app here: https://yamma-server.herokuapp.com/

## [OpenAPI Docs](https://app.swaggerhub.com/apis/s-poveda/Yamma-API/1.0.0)

## How to set it up

1. Clone this repository to your local machine
2. Install the dependencies for the project:
   ```console
   npm install
   ```
3. If there are high vulnerabilities reported during the install:
   ```console
   npm audit fix --force
   ```
4. Ensure your PostgreSQL server is running:
   ```console
   pg_ctl restart
   ```
5. Create a User for this project:
   ```console
   createuser yamma_admin
   ```
6. Create a database for the project with your user as the owner:
   ```console
   createdb yamma_test
   ```
7. Grant all privileges for the new database
   ```console
   psql testdb
   ```
   ```sql
   alter user yamma_admin with encrypted password 'pass';
   grant all privileges on database yamma_test to yamma_admin;
   ```
8. Rename the `example.env` file to `.env` and update the following fields with your database credentials:
   ```console
   MIGRATION_DB_NAME=
   MIGRATION_DB_USER=
   MIGRATION_DB_PASS=
   DATABASE_URL=postgresql://USERNAME@localhost/DATABASE_NAME
   TEST_DATABASE_URL=postgresql://USERNAME@localhost/DATABASE_NAME
   WORKER_KEY=some-key
   ```
9. Create the database tables:
   ```console
   npm run migrate -- 4
   ```
10. Start the tests:
    ```console
    npm t
    ```
11. All the tests should pass

## App Structure

- **ApiDocs** folder containing media related to api documentation
- **migration** folder contains all the sql files necessary for the DB setup
- **public** folder contains the View related files
- **seeds** folder containing all seed files (necessary without the yamma-api-scraper)
- **src** folder contains the Controller related files
  - **server.js** is the entry point of the Controller logic (where all the general app settings live)
  - **app.js** is the starting point for the routes
  - **auth** folder containing router with all auth API endpoints
    - **auth-router.js** Auth Router
      - /login
        - POST Endpoint
        - PUT Endpoint
    - **auth-service.js** Service file for the Controller connection with the Model, and use of middleware
  - **comments** folder containing router with all comments API endpoints
    - **comments-router.js** Comments Router
      - /events/:eventId
        - GET Endpoint
        - POST Endpoint
      - /id/:commentId
        - GET Endpoint
    - **comments-service.js** Service file for the Controller connection with the Model
  - **events** folder containing router with all events API endpoints
    - **events-router** Events Router
      - GET Endpoint
      - POST Endpoint
      - /:event_id
        - GET Endpoint
    - **events-service** Service file for the Controller connection with the Model
  - **users** folder containing router with all users API endpoints
    - **users-router.js** Users Router
      - POST Endpoint
      - /:user_id
        - GET Endpoint
    - **users-service.js** Service file for the Controller connection with the Model, and use of middleware
  - **middleware** folder contains functions that are used by the controller in multiple places
- **test** folder contains the Test files

  ***

### Back-end Structure - Business Objects

- events (database table)

  - id (auto-generated, serial)
  - title (max 1000 chars, unique )
  - categories (text)
  - description (max 2000 chars)
  - event_img (varchar)
  - source_name (varchar)
  - source_url (varchar, unique)
  - date_created (now(), timestamptz)
  - date_published (timestamptz)
  - archived (default false)

- users (database table)

  - id (auto-generated)
  - username (max 16 chars, min 3 chars unique, no special chars or whitespace, unique)
  - password (max 255 chars, min 5 chars, require 1 capital, 1 special character, 1 digit)
  - email (max 255 chars, valid email, unique)
  - profile_img (varchar)
  - date_created (now())

- comments (database table)
  - id (auto-generated)
  - user_id (foreign key connected with user table)
  - event_id (foreign key connected with events table)
  - username (max 16 chars, username of user with user_id)
  - content (varchar max 1000)
  - date_created (now())
  - archived (default false)

![Documentation](./ApiDocs/images/app.swaggerhub.com_.png)
