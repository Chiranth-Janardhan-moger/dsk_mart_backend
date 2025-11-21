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
  // GLOBAL MIDDLEWARES (MUST BE FIRST)
  // ------------------------------------
  app.use(cors());
  app.use(helmet({ contentSecurityPolicy: false }));
  
  // Connect Database
  await connectDatabase();

  // ------------------------------------
  // APOLLO SERVER (BEFORE REST ROUTES)
  // ------------------------------------
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });

  await apolloServer.start();

  // GraphQL endpoint with its own body parser
  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ req }),
    })
  );

  // Body parsers for REST API routes
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(apiRateLimiter);

  // Setup REST API routes
  setupRoutes(app);

  // Homepage
  app.get("/", (req, res) => {
    res.send(`
      <html>
        <body>
          <h1>Server is running 🚀</h1>
          <script>console.log("Server is running!")</script>
        </body>
      </html>
    `);
  });

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
