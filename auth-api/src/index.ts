import express, { Express, NextFunction, Request, Response } from "express";
import { configDotenv } from "dotenv";
import amqp from "amqplib";

configDotenv();

const app: Express = express();
const port = process.env.PORT;
const RABBITMQ_URI = process.env.RABBITMQ_URI;

app.use(express.json());

let channel, connection;

async function connectToRabbitMQ() {
  const amqpServer = RABBITMQ_URI;
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("email-queue");
  ////////////////////////////////////
  ///////// Direct Exchange //////////
  ////////////////////////////////////
  // await channel.assertExchange('directExchange', 'direct', { durable: false });
  // await channel.assertQueue("email-queue");
  // await channel.bindQueue('myQueue', 'directExchange', 'routingKey');
}

connectToRabbitMQ();

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/login", async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const payload = {
      to: email,
      title: "OTP Verification",
      body: "<h3>Verify your OPT: 720913</h3>",
      ccEmail: [],
    };

    channel.sendToQueue(
      "email-queue",
      Buffer.from(
        JSON.stringify({
          payload,
        })
      )
    );
    return res.json({
      message: "email added to queue, email will be sent soon",
    });
  } catch (error) {
    console.log(error);
  }
});

// for error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Internal server error";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
