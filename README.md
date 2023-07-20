# Simple Node API 🐼​

A simple REST API built with nodejs/express and mongodb..

## Requirements

- You will need to create a database in mongodb with a collection called `users`
- Node `v14 <`

## Features

- Perform tests with Jest and Supertest
- Users CRUD

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_USER`

`DB_PASSWORD`

`DB_HOST`

`DB_PORT`

`DB_NAME`

## Run Locally

Clone the project

```bash
  git clone https://github.com/tomlima/NodeAPI
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## API Reference

#### Get all users

```http
  GET /api/users
```

#### Get user

```http
  GET /api/users/${id}
```

#### Delete a user

```http
  DELETE /api/users/${id}
```

#### Update a user

```http
  PUT /api/users/${id}
```

#### Create new user

```http
  POST /api/users
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

{
"sqlServerTableName": "Materias",
"columns" : [
{
"CodMateria" : "id"
},
{
"Titulo": "title"
},
{
"chamada": "call_text"
},
{
"save_as": "slug"
},
{
"Data": "created_at"
}
]
}
