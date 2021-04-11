import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { SignupMutationVariables } from '../__generated__/SignupMutation';
import { LoginMutationVariables } from '../__generated__/LoginMutation';
import { EditProfileMutationVariables } from '../__generated__/EditProfileMutation';

export const JWT_SECRET = 'devBlog2021';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const URL_REGEX = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;

export function validateSignupVariables(values: SignupMutationVariables): Partial<SignupMutationVariables> {
  const errors: Partial<SignupMutationVariables> = {}; 

  if (!values.email) {
    errors.email = 'Campo obbligatorio';
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'Email invalida';
  }

  if (!values.username) {
    errors.username = 'Campo obbligatorio';
  } else if (values.username.length < 2) {
    errors.username = 'Deve contenere almeno 3 caratteri';
  }

  if (!values.name) {
    errors.name = 'Campo obbligatorio';
  } else if (values.name.length < 2) {
    errors.name = 'Deve contenere almeno 3 caratteri';
  }

  if (!values.surname) {
    errors.surname = 'Campo obbligatorio';
  } else if (values.surname.length < 2) {
    errors.surname = 'Deve contenere almeno 3 caratteri';
  }

  if (!values.password) {
    errors.password = 'Campo obbligatorio';
  } else if (values.password.length < 5) {
    errors.password = 'Deve contenere almeno 5 caratteri';
  }

  if(values.avatar && !URL_REGEX.test(values.avatar) && values.avatar !== '') {
    errors.avatar = 'Url invalido';
  }

  return errors;
}

export function validateLoginVariables(values: LoginMutationVariables): Partial<LoginMutationVariables> {
  const errors: Partial<LoginMutationVariables> = {};

  if (!values.username) {
    errors.username = 'Campo obbligatorio';
  } else if (values.username.length < 2) {
    errors.username = 'Deve contenere almeno 3 caratteri';
  }

  if (!values.password) {
    errors.password = 'Campo obbligatorio';
  } else if (values.password.length < 5) {
    errors.password = 'Deve contenere almeno 5 caratteri';
  }

  return errors;
}

export function validateEditProfileVariables(values: EditProfileMutationVariables): Partial<EditProfileMutationVariables> {
  const errors: Partial<EditProfileMutationVariables> = {}; 

  if (!values.username) {
    errors.username = 'Campo obbligatorio';
  } else if (values.username.length < 2) {
    errors.username = 'Deve contenere almeno 3 caratteri';
  }

  if (!values.name) {
    errors.name = 'Campo obbligatorio';
  } else if (values.name.length < 2) {
    errors.name = 'Deve contenere almeno 3 caratteri';
  }

  if (!values.surname) {
    errors.surname = 'Campo obbligatorio';
  } else if (values.surname.length < 2) {
    errors.surname = 'Deve contenere almeno 3 caratteri';
  }

  if(values.avatar && !URL_REGEX.test(values.avatar) && values.avatar !== '') {
    errors.avatar = 'Url invalido';
  }

  return errors;
}

export function getUserId(req: Request): string | null {
  if(!req.headers.authorization || req.headers.authorization === '') {
    return null;
  }
  return String(jwt.verify(req.headers.authorization, JWT_SECRET));
}