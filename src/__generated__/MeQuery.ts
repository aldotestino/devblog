/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MeQuery
// ====================================================

export interface MeQuery_me {
  __typename: "User";
  id: string;
  name: string;
  surname: string;
  email: string;
  username: string;
  avatar: string | null;
}

export interface MeQuery {
  me: MeQuery_me | null;
}
