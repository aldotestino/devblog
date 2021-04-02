/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SignupMutation
// ====================================================

export interface SignupMutation {
  signup: boolean;
}

export interface SignupMutationVariables {
  name: string;
  surname: string;
  email: string;
  username: string;
  password: string;
  avatar?: string | null;
}
