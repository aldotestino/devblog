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
  }

  type Query {
    hello: String
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Mutation {
    signup(name: String!, surname: String!, email: String!, username: String! password: String!, avatar: String): Boolean!
    login(username: String!, password: String!): AuthPayload
  }
`;

