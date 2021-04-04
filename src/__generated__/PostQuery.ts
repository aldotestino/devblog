/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PostQuery
// ====================================================

export interface PostQuery_post_user {
  __typename: "User";
  id: string;
  username: string;
  avatar: string | null;
}

export interface PostQuery_post_likes_user {
  __typename: "User";
  id: string;
  username: string;
  avatar: string | null;
}

export interface PostQuery_post_likes {
  __typename: "Like";
  user: PostQuery_post_likes_user;
}

export interface PostQuery_post_comments_user {
  __typename: "User";
  id: string;
  username: string;
  avatar: string | null;
}

export interface PostQuery_post_comments {
  __typename: "Comment";
  id: string;
  content: string;
  createdAt: any | null;
  user: PostQuery_post_comments_user;
}

export interface PostQuery_post {
  __typename: "Post";
  id: string;
  title: string;
  description: string;
  content: string;
  createdAt: any | null;
  user: PostQuery_post_user;
  likes: PostQuery_post_likes[];
  comments: PostQuery_post_comments[];
}

export interface PostQuery {
  post: PostQuery_post | null;
}

export interface PostQueryVariables {
  id: string;
}
