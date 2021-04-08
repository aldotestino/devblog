/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EditPostMutation
// ====================================================

export interface EditPostMutation_editPost {
  __typename: "Post";
  title: string;
  description: string;
  content: string;
}

export interface EditPostMutation {
  editPost: EditPostMutation_editPost | null;
}

export interface EditPostMutationVariables {
  postId: string;
  title: string;
  description: string;
  content: string;
}
