import { ApolloServer } from 'apollo-server-micro';
import { schema } from '../../schema';
import { getUserId } from '../../utils/authHelpers';

const apolloServer = new ApolloServer({ 
  schema,
  context: ({ req }) => ({
    ...req,
    userId: req ? getUserId(req) : null
  })
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });