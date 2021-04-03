import { ResolverFunc } from '../../utils/types';
import { UserQueryVariables } from '../../__generated__/UserQuery';
import prisma from '../../lib/prisma';


const user: ResolverFunc<unknown, UserQueryVariables> = (_, { username }) => {
  return prisma.user.findUnique({
    where: {
      username
    }
  });
};

export {
  user
};