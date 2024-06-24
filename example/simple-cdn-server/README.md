# Simple CDN service

A simple CDN service built with Expression.js and Typescript.

## Table of Contents

- [Simple CDN service](#simple-cdn-service)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Development](#development)
  - [Running the Application](#running-the-application)
  - [Docker](#docker)
    - [Building and Running with Docker Compose](#building-and-running-with-docker-compose)
  - [API Routes](#api-routes)
    - [Upload a File](#upload-a-file)
    - [Retrieve a File](#retrieve-a-file)

## Getting Started

### Prerequisites

- Node.js (version 22 or later)
- pnpm (version 6 or later)
- Docker (version 20 or later)
- Docker Compose (version 1.29 or later)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/timekeeperjs/timekeeper-plugin.git
   cd timekeeper-plugin/example/simple-cdn-server
   ```

2. Install dependencies:

    ```sh
    pnpm install
    ```

## Development

To start the development server with hot-reloading, run:

```sh
pnpm run dev
```

This will start the server on `http://localhost:7777`.

## Running the Application

To build and run the application, follow these steps:

1. Build the TypeScript code:

   ```sh
   pnpm run build
   ```

2. Start the application:

   ```sh
   pnpm run start
   ```

The server will be running on `http://localhost:7777`.

## Docker

### Building and Running with Docker Compose

1. Build and run the Docker container using Docker Compose:

    ```sh
    docker-compose up --build
    ```

This will build the Docker image and start the container, mapping port 7777 on your host to port 7777 in the container. The `uploads` directory on your host will be mounted to the `/app/uploads` directory in the container, allowing you to persist uploaded files.

## API Routes

### Upload a File

- **URL**: `/upload`
- **Method**: `POST`
- **Description**: Upload a file to the server.
- **Request**:
  - **Form Data**:
    - `file`: The file to upload.
- **Response**:
  - `200 OK`: File uploaded successfully.
  - `400 Bad`: Request: No file uploaded.

Example using curl:

```sh
curl -F 'file=@/path/to/your/file' http://localhost:7777/upload
```

### Retrieve a File

- **URL**: `/file/:filename`
- **Method**: `GET`
- **Description**: Upload a file to the server.
- **Response**:
  - `200 OK`: The requested file.
  - `404 Not Found`: File not found.

Example using curl:

```sh
curl http://localhost:7777/file/<filename>
```