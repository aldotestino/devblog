/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CommentMutation
// ====================================================

export interface CommentMutation_comment {
  __typename: "Comment";
  id: string;
  content: string;
  createdAt: any | null;
}

export interface CommentMutation {
  comment: CommentMutation_comment;
}

export interface CommentMutationVariables {
  content: string;
  postId: string;
}
