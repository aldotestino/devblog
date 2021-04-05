import { ChevronDownIcon } from '@chakra-ui/icons';
import { Stack, Flex, Heading, Button, Menu, MenuItem, MenuButton, MenuList, MenuDivider, Avatar, Text, useColorMode, useColorModeValue, Switch, LinkOverlay, LinkBox } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '../store/User';

function Navbar() {

  const { user, isAuth, logout } = useAuth();
  const { toggleColorMode, colorMode } = useColorMode();
  const theme = useColorModeValue('dark', 'light');
  const bgColor = useColorModeValue('whiteAlpha.800', 'grayAlpha.800');

  return (
    <Flex h={['16', '20']} px={['2', '4', '16']} transition="all .2s ease" bg={bgColor} style={{ backdropFilter: 'blur(4px)' }} align="center" position="sticky" top="0" zIndex="10" justify="space-between">
      <Heading size="lg">
        <Link href="/">
          devBlog
        </Link>
      </Heading>
      <Flex align="center">
        {!isAuth && <Switch size="lg" isChecked={colorMode === 'dark'} onChange={toggleColorMode} colorScheme="blue" mr="4" />}
        <Button mr="4">  
          <Link href="/posts/feed" passHref>  
            <LinkOverlay>
              Feed
            </LinkOverlay>
          </Link>    
        </Button>
        {!isAuth ?
          <Button colorScheme="blue" variant="outline"> 
            <Link href="/login" passHref>                
              <LinkOverlay>
                Login
              </LinkOverlay>      
            </Link>
          </Button> : 
          <Menu>
            <MenuButton variant="outline" colorScheme="blue" as={Button} rightIcon={<ChevronDownIcon />}>
            Account
            </MenuButton>
            <MenuList>
              <Link href={`/@${user.username}`} passHref>
                <MenuItem>       
                  <Stack spacing="2" direction="row">
                    <Avatar src={user.avatar} name={user.username} />
                    <Text>Signed in as<br/>@{user.username}</Text>
                  </Stack>
                </MenuItem>
              </Link>
              <MenuDivider />
              <MenuItem onClick={toggleColorMode}>   
              Use {theme} mode
              </MenuItem>
              <Link href="/posts/create" passHref>      
                <MenuItem>
                New Post
                </MenuItem>
              </Link> 
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        }
      </Flex> 
    </Flex>
  );
}

export default Navbar;
