/* eslint-disable import/first */
import dotenv from 'dotenv';

const result = dotenv.config();
if (result.error) {
  dotenv.config({ path: '.env.default' });
}

import util from 'util';
import app from './app';
import logger from './logger';

if (!process.env.COS_API_KEY || !process.env.SERVICE_INSTANCE_ID || !process.env.ENDPOINT) {
  logger.error('ENV VARIABLES NOT FOUND - YOUR SETUP IS INCORRECT');
  logger.info(process.env);
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
let debugCallback;
if (process.env.NODE_ENV === 'development') {
  debugCallback = (collectionName: string, method: string, query: any, doc: string): void => {
    const message = `${collectionName}.${method}(${util.inspect(query, { colors: true, depth: null })})`;
    logger.log({
      level: 'verbose',
      message,
      consoleLoggerOptions: { label: 'MONGO' }
    });
  };
}

const serve = () => app.listen(PORT, () => {
  logger.info(`🌏 Express server started at http://localhost:${PORT}`);

  if (process.env.NODE_ENV === 'development') {
    // This route is only present in development mode
    logger.info(`⚙️  Swagger UI hosted at http://localhost:${PORT}/docs`);
  }
});

serve();

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', () => {
  console.log('\n'); /* eslint-disable-line */
  logger.info('Gracefully shutting down');
  process.exit(0);
});
