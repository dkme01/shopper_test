import { json, urlencoded } from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
import express, { type Express } from "express";
import morgan from "morgan";
import rideRoutes from "./routes/ride";

dotenv.config();

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())

  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  app.use('/ride', rideRoutes);

  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: 'The requested endpoint does not exist'
    });
  });

  app.use((req, res) => {
    res.status(403).json({
      error: 'Forbidden',
      message: `You're not allowed to access this route`
    });
  });

  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  });

  return app;
};
