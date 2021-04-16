import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { SignupMutationVariables } from '../__generated__/SignupMutation';
import { LoginMutationVariables } from '../__generated__/LoginMutation';
import { EditProfileMutationVariables } from '../__generated__/EditProfileMutation';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const URL_REGEX = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;

export function validateSignupVariables(values: SignupMutationVariables): Partial<SignupMutationVariables> {
  const errors: Partial<SignupMutationVariables> = {}; 

  if (!values.email) {
    errors.email = 'This field is required';
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'Invalid email';
  }

  if (!values.username) {
    errors.username = 'This field is required';
  } else if (values.username.length < 2) {
    errors.username = 'This field requires at least 3 characters';
  }

  if (!values.name) {
    errors.name = 'This field is required';
  } else if (values.name.length < 2) {
    errors.name = 'This field requires at least 3 characters';
  }

  if (!values.surname) {
    errors.surname = 'This field is required';
  } else if (values.surname.length < 2) {
    errors.surname = 'This field requires at least 3 characters';
  }

  if (!values.password) {
    errors.password = 'This field is required';
  } else if (values.password.length < 5) {
    errors.password = 'This field requires at least 3 characters';
  }

  if(values.avatar && !URL_REGEX.test(values.avatar) && values.avatar !== '') {
    errors.avatar = 'Invalid Url';
  }

  return errors;
}

export function validateLoginVariables(values: LoginMutationVariables): Partial<LoginMutationVariables> {
  const errors: Partial<LoginMutationVariables> = {};

  if (!values.username) {
    errors.username = 'This field is required';
  } else if (values.username.length < 2) {
    errors.username = 'This field requires at least 3 characters';
  }

  if (!values.password) {
    errors.password = 'This field is required';
  } else if (values.password.length < 5) {
    errors.password = 'This field requires at least 3 characters';
  }

  return errors;
}

export function validateEditProfileVariables(values: EditProfileMutationVariables): Partial<EditProfileMutationVariables> {
  const errors: Partial<EditProfileMutationVariables> = {}; 

  if (!values.username) {
    errors.username = 'This field is required';
  } else if (values.username.length < 2) {
    errors.username = 'This field requires at least 3 characters';
  }

  if (!values.name) {
    errors.name = 'This field is required';
  } else if (values.name.length < 2) {
    errors.name = 'This field requires at least 3 characters';
  }

  if (!values.surname) {
    errors.surname = 'This field is required';
  } else if (values.surname.length < 2) {
    errors.surname = 'This field requires at least 3 characters';
  }

  if(values.avatar && !URL_REGEX.test(values.avatar) && values.avatar !== '') {
    errors.avatar = 'Invalid Url';
  }

  return errors;
}

export function getUserId(req: Request): string | null {
  if(!req.headers.authorization || req.headers.authorization === '') {
    return null;
  }
  return String(jwt.verify(req.headers.authorization, process.env.JWT_SECRET));
}