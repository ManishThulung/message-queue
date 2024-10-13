import amqp from "amqplib";
import { configDotenv } from "dotenv";
import express, { Express } from "express";
import { mailSender } from "./email-service/email.service";

configDotenv();

const app: Express = express();
const port = process.env.PORT;
const RABBITMQ_URI = process.env.RABBITMQ_URI;

app.use(express.json());

let channel: any, connection: amqp.Connection;

async function connectToRabbitMQ() {
  const amqpServer = RABBITMQ_URI;
  try {
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("email-queue");
  } catch (error) {
    throw new Error(error);
  }
}

connectToRabbitMQ().then(() => {
  channel.consume("email-queue", async (data) => {
    const { payload } = JSON.parse(data.content);
    await mailSender(payload);
    channel.ack(data); // rabbitMQ deletes the message only ofter receiveing this ack
    console.log("DONE");
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
