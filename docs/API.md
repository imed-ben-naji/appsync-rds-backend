# API Reference

Complete API documentation for the AppSync RDS Backend GraphQL API.

## Table of Contents

- [Introduction](#introduction)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Data Types](#data-types)
- [Queries](#queries)
  - [getItem](#getitem)
  - [listItems](#listitems)
- [Mutations](#mutations)
  - [createItem](#createitem)
  - [updateItem](#updateitem)
  - [deleteItem](#deleteitem)
- [GraphQL Schema](#graphql-schema)

---

## Introduction

This is a GraphQL API built with AWS AppSync that provides CRUD operations for managing items. The API uses:

- **AWS AppSync** - GraphQL interface
- **AWS Lambda** - Business logic execution (containerized)
- **Amazon RDS (PostgreSQL)** - Data persistence with read replicas
- **AWS Secrets Manager** - Secure credential management

---

## Authentication

The API uses API Key authentication.

**Request Header:**
```http
x-api-key: your-api-key-here
```

**Example:**
```bash
curl -X POST https://your-api.appsync-api.region.amazonaws.com/graphql \
  -H "x-api-key: da2-xxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ listItems { id name } }"}'
```

---

## Base URL

**Local Development:**
```
http://localhost:20002/graphql
```

---

## Data Types

### Item

Represents an item in the database.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `ID!` | Yes | Unique identifier (auto-generated) |
| `name` | `String!` | Yes | Item name (max 100 characters) |
| `description` | `String` | No | Item description (max 5000 characters) |
| `createdAt` | `String` | Yes | ISO 8601 timestamp of creation |
| `updatedAt` | `String` | Yes | ISO 8601 timestamp of last update |

**Example:**
```json
{
  "id": "123",
  "name": "Sample Item",
  "description": "This is a sample item",
  "createdAt": "2025-12-14T12:00:00.000Z",
  "updatedAt": "2025-12-14T12:30:00.000Z"
}
```

---

## Queries

### getItem

Retrieves a single item by ID.

**Arguments:**
- `id` (ID!, required) - The item's unique identifier

**Returns:** `Item` or `null` if not found

**Query:**
```graphql
query GetItem($id: ID!) {
  getItem(id: $id) {
    id
    name
    description
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "123"
}
```

**Response:**
```json
{
  "data": {
    "getItem": {
      "id": "123",
      "name": "Sample Item",
      "description": "This is a sample item",
      "createdAt": "2025-12-14T12:00:00.000Z",
      "updatedAt": "2025-12-14T12:00:00.000Z"
    }
  }
}
```

**Error Response:**
```json
{
  "data": {
    "getItem": null
  }
}
```

---

### listItems

Retrieves all items, ordered by creation date (newest first).

**Arguments:** None

**Returns:** `[Item!]!` - Array of items (empty array if none exist)

**Query:**
```graphql
query ListItems {
  listItems {
    id
    name
    description
    createdAt
    updatedAt
  }
}
```

**Response:**
```json
{
  "data": {
    "listItems": [
      {
        "id": "124",
        "name": "Newest Item",
        "description": "Created most recently",
        "createdAt": "2025-12-14T13:00:00.000Z",
        "updatedAt": "2025-12-14T13:00:00.000Z"
      },
      {
        "id": "123",
        "name": "Older Item",
        "description": "Created earlier",
        "createdAt": "2025-12-14T12:00:00.000Z",
        "updatedAt": "2025-12-14T12:00:00.000Z"
      }
    ]
  }
}
```

---

## Mutations

### createItem

Creates a new item.

**Arguments:**
- `name` (String!, required) - Item name (1-100 characters)
- `description` (String, optional) - Item description (max 5000 characters)

**Returns:** `Item!` - The created item

**Mutation:**
```graphql
mutation CreateItem($name: String!, $description: String) {
  createItem(name: $name, description: $description) {
    id
    name
    description
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "name": "New Item",
  "description": "This is a new item"
}
```

**Response:**
```json
{
  "data": {
    "createItem": {
      "id": "125",
      "name": "New Item",
      "description": "This is a new item",
      "createdAt": "2025-12-14T14:00:00.000Z",
      "updatedAt": "2025-12-14T14:00:00.000Z"
    }
  }
}
```

**Validation Errors:**
```json
{
  "errors": [
    {
      "message": "Name is required",
      "errorType": "ValidationError"
    }
  ]
}
```

---

### updateItem

Updates an existing item.

**Arguments:**
- `id` (ID!, required) - The item's unique identifier
- `name` (String, optional) - New name (1-100 characters)
- `description` (String, optional) - New description (max 5000 characters)

**Returns:** `Item!` - The updated item

**Note:** Only provided fields are updated. Omitted fields remain unchanged.

**Mutation:**
```graphql
mutation UpdateItem($id: ID!, $name: String, $description: String) {
  updateItem(id: $id, name: $name, description: $description) {
    id
    name
    description
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "123",
  "name": "Updated Name"
}
```

**Response:**
```json
{
  "data": {
    "updateItem": {
      "id": "123",
      "name": "Updated Name",
      "description": "Original description unchanged",
      "createdAt": "2025-12-14T12:00:00.000Z",
      "updatedAt": "2025-12-14T14:30:00.000Z"
    }
  }
}
```

**Error Response:**
```json
{
  "errors": [
    {
      "message": "Item with id 999 not found",
      "errorType": "NotFoundError"
    }
  ]
}
```

---

### deleteItem

Deletes an item permanently.

**Arguments:**
- `id` (ID!, required) - The item's unique identifier

**Returns:** `Boolean!` - `true` if successful

**Mutation:**
```graphql
mutation DeleteItem($id: ID!) {
  deleteItem(id: $id)
}
```

**Variables:**
```json
{
  "id": "123"
}
```

**Response:**
```json
{
  "data": {
    "deleteItem": true
  }
}
```

**Error Response:**
```json
{
  "errors": [
    {
      "message": "Item with id 999 not found",
      "errorType": "NotFoundError"
    }
  ]
}
```

---

## GraphQL Schema

Complete GraphQL schema definition:
```graphql
type Item {
  id: ID!
  name: String!
  description: String
  createdAt: String!
  updatedAt: String!
}

type Query {
  getItem(id: ID!): Item
  listItems: [Item!]!
}

type Mutation {
  createItem(name: String!, description: String): Item!
  updateItem(id: ID!, name: String, description: String): Item!
  deleteItem(id: ID!): Boolean!
}

schema {
  query: Query
  mutation: Mutation
}
```

---