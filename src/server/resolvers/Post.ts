import { Post } from '@prisma/client';
import { ResolverFunc } from '../../utils/types';
import prisma from '../../lib/prisma';


const user: ResolverFunc<Post, unknown> = ({ id }) => {
  return prisma.post.findUnique({
    where: {
      id
    }
  }).user();
};

const comments: ResolverFunc<Post, unknown> = ({ id } ) => {
  return prisma.post.findUnique({
    where: {
      id
    }
  }).comments();
};

const likes: ResolverFunc<Post, unknown> = ({ id } ) => {
  return prisma.post.findUnique({
    where: {
      id
    }
  }).likes();
};

export {
  user,
  comments,
  likes
};