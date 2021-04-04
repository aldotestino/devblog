import { ResolverFunc } from '../../utils/types';
import { UserQueryVariables } from '../../__generated__/UserQuery';
import prisma from '../../lib/prisma';
import { PostQueryVariables } from '../../__generated__/PostQuery';


const user: ResolverFunc<unknown, UserQueryVariables> = (_, { username }) => {
  return prisma.user.findUnique({
    where: {
      username
    }
  });
};

const post: ResolverFunc<unknown, PostQueryVariables> = (_, { id }) => {
  return prisma.post.findUnique({
    where: {
      id
    }
  });
};

export {
  user,
  post
};