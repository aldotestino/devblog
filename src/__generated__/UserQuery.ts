/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserQuery
// ====================================================

export interface UserQuery_user_posts_likes_user {
  __typename: "User";
  avatar: string | null;
  username: string;
}

export interface UserQuery_user_posts_likes {
  __typename: "Like";
  user: UserQuery_user_posts_likes_user;
}

export interface UserQuery_user_posts {
  __typename: "Post";
  id: string;
  title: string;
  description: string;
  content: string;
  createdAt: any | null;
  likes: UserQuery_user_posts_likes[];
}

export interface UserQuery_user {
  __typename: "User";
  id: string;
  username: string;
  email: string;
  name: string;
  surname: string;
  avatar: string | null;
  posts: UserQuery_user_posts[];
}

export interface UserQuery {
  user: UserQuery_user | null;
}

export interface UserQueryVariables {
  username: string;
}
