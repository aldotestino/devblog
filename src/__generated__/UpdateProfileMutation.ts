/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateProfileMutation
// ====================================================

export interface UpdateProfileMutation_updateProfile {
  __typename: "User";
  name: string;
  surname: string;
  username: string;
  avatar: string | null;
}

export interface UpdateProfileMutation {
  updateProfile: UpdateProfileMutation_updateProfile | null;
}

export interface UpdateProfileMutationVariables {
  name: string;
  surname: string;
  username: string;
  avatar?: string | null;
}
