import { AddIcon, ChevronDownIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Stack, Flex, Heading, Button, Menu, MenuItem, MenuButton, MenuList, MenuDivider, Avatar, Text, useColorMode, useColorModeValue, Switch, LinkOverlay, Icon } from '@chakra-ui/react';
import { LogoutIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '../store/User';
import { COLOR_SCHEME } from '../styles/theme';

function Navbar() {

  const { user, isAuth, logout } = useAuth();
  const { toggleColorMode, colorMode } = useColorMode();
  const theme = useColorModeValue('dark', 'light');
  const ThemeIcon = useColorModeValue(MoonIcon, SunIcon);
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  return (
    <Flex h={['16', '20']} px={['2', '4', '16']} transition="background-color .2s ease" bg={bgColor} align="center" position="sticky" top="0" zIndex="10" justify="space-between">
      <Heading size="lg">
        <Link href="/">
          devBlog
        </Link>
      </Heading>
      <Flex align="center">
        {!isAuth && <Switch size="lg" isChecked={colorMode === 'dark'} onChange={toggleColorMode} colorScheme={COLOR_SCHEME} mr="4" />}
        <Link href="/posts/feed" passHref>  
          <Button mr="4" as="a">       
            Feed 
          </Button>
        </Link> 
        {!isAuth ?
          <Button colorScheme={COLOR_SCHEME} variant="outline"> 
            <Link href="/login" passHref>                
              <LinkOverlay>
                Login
              </LinkOverlay>      
            </Link>
          </Button> : 
          <Menu>
            <MenuButton variant="outline" colorScheme={COLOR_SCHEME} as={Button} rightIcon={<ChevronDownIcon />}>
              Profile
            </MenuButton>
            <MenuList>
              <Link href={`/@${user.username}`} passHref> 
                <MenuItem as="a">     
                  <Stack spacing="2" direction="row">
                    <Avatar src={user.avatar} name={user.username} />
                    <Text>Signed in as<br/>@{user.username}</Text>
                  </Stack>   
                </MenuItem>
              </Link>
              <MenuDivider />
              <MenuItem icon={<ThemeIcon />} onClick={toggleColorMode}>   
                Use {theme} mode
              </MenuItem>
              <Link href="/posts/create" passHref>   
                <MenuItem as="a" icon={<AddIcon />}>
                  New Post
                </MenuItem>
              </Link>
              <MenuItem onClick={logout} icon={<Icon as={LogoutIcon} />}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        }
      </Flex> 
    </Flex>
  );
}

export default Navbar;
