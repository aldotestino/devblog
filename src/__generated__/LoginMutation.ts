/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LoginMutation
// ====================================================

export interface LoginMutation_login_user {
  __typename: "User";
  id: string;
  name: string;
  surname: string;
  email: string;
  username: string;
  avatar: string | null;
}

export interface LoginMutation_login {
  __typename: "AuthPayload";
  user: LoginMutation_login_user;
  token: string;
}

export interface LoginMutation {
  login: LoginMutation_login | null;
}

export interface LoginMutationVariables {
  username: string;
  password: string;
}
