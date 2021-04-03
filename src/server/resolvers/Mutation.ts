import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../utils/authHelpers';
import { ResolverFunc } from '../../utils/types';
import { LoginMutationVariables } from '../../__generated__/LoginMutation';
import { SignupMutationVariables } from '../../__generated__/SignupMutation';
import prisma from '../../lib/prisma';
import { PostMutationVariables } from '../../__generated__/PostMutation';

const signup: ResolverFunc<unknown, SignupMutationVariables> = async (_, { password, ...rest }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      ...rest,
      password: hashedPassword
    }
  });

  return true;
};

const login: ResolverFunc<unknown, LoginMutationVariables> = async (_, { password, username }) => {
  const user = await prisma.user.findUnique({
    where: {
      username
    }
  });

  if(!user) {
    throw new Error('User doesn\'t exist');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if(!passwordMatch) {
    throw new Error('Wrong password');
  }

  const token = jwt.sign(user.id, JWT_SECRET);
  
  return {
    token,
    user
  };

};

const post: ResolverFunc<unknown, PostMutationVariables> = (_, args, { userId }) => {
  return prisma.post.create({
    data: {
      ...args,
      userId
    }
  });
};


export {
  signup,
  login,
  post
};