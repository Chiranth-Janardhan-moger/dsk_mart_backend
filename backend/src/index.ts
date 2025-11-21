import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { connectDatabase } from './config/database';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { setupRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimiter';
import { logger } from './utils/logger';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

async function startServer() {
  const app = express();

  // ------------------------------------
  // GLOBAL MIDDLEWARES
  // ------------------------------------
  app.use(cors());
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Connect Database
  await connectDatabase();

  // Homepage
  app.get("/", (req, res) => {
    res.json({
      status: 'ok',
      message: 'Server is running 🚀',
      endpoints: {
        graphql: '/graphql',
        api: '/api',
        health: '/health'
      }
    });
  });

  // Apply rate limiter to API routes only
  app.use('/api', apiRateLimiter);

  // Setup REST API routes
  setupRoutes(app);

  // ------------------------------------
  // APOLLO SERVER
  // ------------------------------------
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });

  await apolloServer.start();

  // GraphQL endpoint
  app.use(
    "/graphql",
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ req }),
    })
  );

  // Error Handler (MUST BE LAST)
  app.use(errorHandler);

  // Start server
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
    logger.info(`📊 GraphQL: http://localhost:${PORT}/graphql`);
    logger.info(`🔌 REST API: http://localhost:${PORT}/api`);
  });
}


startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

