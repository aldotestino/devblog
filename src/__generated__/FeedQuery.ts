/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FeedQuery
// ====================================================

export interface FeedQuery_feed_user {
  __typename: "User";
  username: string;
  avatar: string | null;
}

export interface FeedQuery_feed_likes_user {
  __typename: "User";
  avatar: string | null;
  username: string;
}

export interface FeedQuery_feed_likes {
  __typename: "Like";
  user: FeedQuery_feed_likes_user;
}

export interface FeedQuery_feed {
  __typename: "Post";
  id: string;
  title: string;
  description: string;
  content: string;
  createdAt: any | null;
  user: FeedQuery_feed_user;
  likes: FeedQuery_feed_likes[];
}

export interface FeedQuery {
  feed: FeedQuery_feed[];
}
