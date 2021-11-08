import { ApolloServer } from 'apollo-server-micro';
import { schema } from '../../schema';
import { getUserId } from '../../utils/authHelpers';
import cookies from '../../utils/cookiesHelper';

const apolloServer = new ApolloServer({
  schema,
  context: ({ req, res }) => {
    return ({
      req,
      res,
      userId: req ? getUserId(req) : null
    });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler =  apolloServer.createHandler({ path: '/api/graphql' });
export default cookies(handler);