import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    surname: String!
    email: String!
    username: String!
    avatar: String
    posts: [Post!]!
    comments: [Comment!]!
    likes: [Like!]!
  }

  type Post {
    id: ID!
    title: String!
    description: String!
    content: String!
    user: User!     
    likes: [Like!]!
    comments: [Comment!]!
    createdAt: DateTime
  }

  type Like {
    id: ID!
    post: Post!
    user: User!
  }

  type Comment {
    id: ID!
    content: String!
    user: User!
    post: Post!
    createdAt: DateTime
  }

  type Query {
    user(username: String!): User
    post(id: ID!): Post
    feed: [Post!]!
    me: User
  }

  type Mutation {
    signup(name: String!, surname: String!, email: String!, username: String! password: String!, avatar: String): Boolean!
    login(username: String!, password: String!): User
    logout: Boolean!
    editProfile(name: String!, surname: String!, username: String!, avatar: String): User
    post(title: String!, description: String!, content: String!): Post!
    comment(content: String!, postId: ID!): Comment!
    like(postId: ID!): Boolean!
    deletePost(postId: ID!): Boolean!
    deleteComment(commentId: ID!): Boolean!
    editPost(postId: ID!, title: String!, description: String!, content: String!): Post
    deleteProfile: Boolean!
  }

  scalar DateTime
`;

