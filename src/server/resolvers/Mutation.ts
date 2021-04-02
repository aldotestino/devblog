import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../utils/authHelpers';
import { ResolverFunc } from '../../utils/types';
import { LoginMutationVariables } from '../../__generated__/LoginMutation';
import { SignupMutationVariables } from '../../__generated__/SignupMutation';

const signup: ResolverFunc<unknown, SignupMutationVariables> = async (_, args, { prisma }) => {
  const hashedPassword = await bcrypt.hash(args.password, 10);

  await prisma.user.create({
    data: {
      name: args.name,
      surname: args.username,
      username: args.username,
      email: args.email,
      avatar: args.avatar,
      password: hashedPassword
    }
  });

  return true;
};

const login: ResolverFunc<unknown, LoginMutationVariables> = async (_, { password, username }, { prisma }) => {
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


export {
  signup,
  login
};