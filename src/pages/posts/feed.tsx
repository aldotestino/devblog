import { useQuery, gql } from '@apollo/client';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import { GetServerSideProps, GetStaticProps } from 'next';
import Head from 'next/head';
import React from 'react';
import PostCard from '../../components/PostCard';
import SEO from '../../components/SEO';
import { initializeApollo } from '../../utils/apolloConfig';
import { FeedQuery } from '../../__generated__/FeedQuery';

const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      id
      title
      description
      content
      createdAt
      user {
        username
        avatar
      }
      likes {
        user {
          avatar
          username
        }
      }
    }
  }
`;

function Feed() {

  const { data: { feed } } = useQuery<FeedQuery>(FEED_QUERY);

  return (
    <>
      <SEO title="devBlog - feed" description="View the latest posts" />

      <Heading fontStyle="italic" mb="4">Feed</Heading>
      <SimpleGrid spacing="4" columns={[1, 1, 2]}>
        {feed.map(p => <PostCard user={p.user} key={p.id} post={p} />)}
      </SimpleGrid>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const apolloClient = initializeApollo();


  await apolloClient.query<FeedQuery>({
    query: FEED_QUERY,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};

export default Feed;