/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LoginMutation
// ====================================================

export interface LoginMutation_user {
  __typename: "User";
  id: string;
  name: string;
  surname: string;
  email: string;
  username: string;
  avatar: string | null;
}

export interface LoginMutation {
  login: LoginMutation_user | null;
}

export interface LoginMutationVariables {
  username: string;
  password: string;
}
