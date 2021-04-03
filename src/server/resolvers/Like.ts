import { Like } from '@prisma/client';
import { ResolverFunc } from '../../utils/types';
import prisma from '../../lib/prisma';


const post: ResolverFunc<Like, unknown> = ({ id }) => {
  return prisma.like.findUnique({
    where: {
      id
    }
  }).user();
};

const user: ResolverFunc<Like, unknown> = ({ id }) => {
  return prisma.like.findUnique({
    where: {
      id
    }
  }).user();
};

export {
  post,
  user
};