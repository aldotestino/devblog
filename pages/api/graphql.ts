import { PrismaClient } from '.prisma/client';
import { ApolloServer } from 'apollo-server-micro';
import { schema } from '../../src/server/schema';
import { getUserId } from '../../src/utils/authHelpers';

const prisma = new PrismaClient();

const apolloServer = new ApolloServer({ 
  schema,
  context: ({ req }) => ({
    ...req,
    prisma,
    userId: req ? getUserId(req) : null
  })
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });