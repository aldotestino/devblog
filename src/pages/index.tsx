import Link from 'next/link';
import { Text, Heading, Box, Stack, Button, Flex } from '@chakra-ui/react';
import React from 'react';
import { COLOR_SCHEME } from '../styles/theme';
import HomeImage from '../svg/HomeImage';
import SEO from '../components/SEO';
import { useAuth } from '../store/Auth';

function Home() {

  const { isAuth } = useAuth();

  return (
    <>
      <SEO title="devBlog" description="The Blog for Developers" />

      <Stack direction={['column', 'column', 'row']} spacing={['10', '10', '10']}>
        <Box textAlign={['center', 'center', 'left']}>
          <Heading fontSize="6xl" bgGradient="linear(to-r, indigo.500, green.500)" bgClip="text">
            The Blog for Developers
          </Heading>
          <Text fontSize="2xl" maxW={['full', 'full', 'xl']}>
            The perfect place to share yuor thoughts, interests and experiences with the newest technologies in web developement and not only!
            Share your code thanks to the powerful markdown & code renderer for your posts.
          </Text>
          <Stack spacing="4" direction="row" mt="4" justify={['center', 'center', 'flex-start']}> 
            {!isAuth && <Link href="/signup" passHref>        
              <Button colorScheme={COLOR_SCHEME} as="a" size="lg">     
                Sign up
              </Button>
            </Link>}
            <Button as="a" target="blank" href="https://github.com/aldotestino/devblog" size="lg">
              Follow on GitHub
            </Button>
          </Stack>
        </Box>
        <Flex flex="1" justify="center">
          <HomeImage w="md" display={['none', 'none', 'block']} />
        </Flex>
      </Stack>
    </>
  );
}

export default Home;
