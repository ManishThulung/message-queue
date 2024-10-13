This is a minimal implementation of Message Queue using RabbitMQ in Microservice Architecture.

# Getting Started

There are two folders `auth-api` and `email/api`

## 1. First, go the the `auth-api` folder then:

Setup the .env variables.

Install the necessary dependencies-

```bash
npm install
```
Run on the development-

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The server runs on the [http://localhost:8080](http://localhost:8080).

When you hit the `login` POST route it will publish the message to the queue called ``email-queue``.

## 2. Second, go the the `email-api` folder then:

Setup the .env variables.

Install the necessary dependencies-

```bash
npm install
```
Run on the development-

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The server runs on the [http://localhost:8090](http://localhost:8090).

The server automatically calls the ``email-queue`` queue and starts processing the messages.