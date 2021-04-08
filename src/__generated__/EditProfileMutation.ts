/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EditProfileMutation
// ====================================================

export interface EditProfileMutation_editProfile {
  __typename: "User";
  name: string;
  surname: string;
  username: string;
  avatar: string | null;
}

export interface EditProfileMutation {
  editProfile: EditProfileMutation_editProfile | null;
}

export interface EditProfileMutationVariables {
  name: string;
  surname: string;
  username: string;
  avatar?: string | null;
}
