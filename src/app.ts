import bodyParser from 'body-parser';
import compression from 'compression';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import ApplicationError from './errors/application-error';
import logger from './logger';
import { RegisterRoutes } from '../dist/routes';
import swaggerUi from "swagger-ui-express";
import cors, { CorsOptions, CorsRequest } from 'cors';

const app = express();

function logResponseTime(req: Request, res: Response, next: NextFunction) {
  const startHrTime = process.hrtime();

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    const message = `${req.method} ${res.statusCode} ${elapsedTimeInMs}ms\t${req.path}`;
    logger.log({
      level: 'debug',
      message,
      consoleLoggerOptions: { label: 'API' }
    });
  });

  next();
}

const whitelist = [
  'https://pdf-frontend-default.carlos-cluster0-2bef1f4b4097001da9502000c44fc2b2-0000.us-east.containers.appdomain.cloud'
];

function corsOptionsDelegate<T extends Request = Request>(
  req: T,
  callback: (err: Error | null, options?: CorsOptions) => void
): void {
  let corsOptions: boolean = false;
  const originDomain = req.header('Origin') || '';

  const isDomainAllowed = whitelist.indexOf(originDomain) !== -1;

  if (isDomainAllowed && process.env.NODE_ENV !== 'development') {
    // Enable CORS for this request
    corsOptions = true;
  }

  logger.info(`CORS options:`, corsOptions);

  callback(null, { origin: corsOptions });
}

app.use(cors<Request>(corsOptionsDelegate));
app.use(logResponseTime);
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

if (process.env.NODE_ENV === 'development') {
  app.use("/docs", swaggerUi.serve, async (_req: Request, res: Response) => {
    return res.send(
      swaggerUi.generateHTML(await import("../dist/swagger.json"))
    );
  });
}

RegisterRoutes(app)

app.use(function notFoundHandler(_req, res: Response) {
  res.status(404).send({
    message: "Not Found",
  });
});


app.use((err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).json({
    error: err.message
  });
});

export default app;
