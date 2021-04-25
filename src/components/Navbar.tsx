import { ChevronDownIcon } from '@chakra-ui/icons';
import { Stack, Flex, Heading, Button, Menu, MenuItem, MenuButton, MenuList, MenuDivider, Avatar, Text, useColorMode, useColorModeValue, Switch, LinkOverlay, Icon } from '@chakra-ui/react';
import { LogoutIcon, PlusIcon, SunIcon, MoonIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '../store/Auth';
import { COLOR_SCHEME } from '../styles/theme';

function Navbar() {

  const { user, isAuth, logout } = useAuth();
  const { toggleColorMode, colorMode } = useColorMode();
  const theme = useColorModeValue('dark', 'light');
  const ThemeIcon = useColorModeValue(MoonIcon, SunIcon);
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  return (
    <Flex h={['16', '20']} px={['2', '4', '16']} transition="background-color .2s ease" bg={bgColor} align="center" position="sticky" top="0" zIndex="10" justify="space-between">
      <Link href="/" passHref>
        <Flex as="a" align="center">
          <svg width="32" height="32" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="256" height="256" rx="25.6" fill="#818CF8"/>
            <path d="M48.7812 139.891C49.7188 132.062 51.8281 125.031 55.1094 118.797C58.3906 112.562 62.4453 107.922 67.2734 104.875C72.1016 101.781 77.4688 100.305 83.375 100.445C91.1094 100.633 97.1562 103.516 101.516 109.094L108.828 70H125.562L106.789 178H91.8828L93.0078 170.125C87.1016 176.547 80.1641 179.664 72.1953 179.477C65.1172 179.383 59.4453 176.664 55.1797 171.32C50.9609 165.93 48.6875 158.781 48.3594 149.875C48.2188 146.969 48.2891 144.133 48.5703 141.367L48.7812 139.891ZM64.9531 146.43C64.625 152.242 65.5156 156.859 67.625 160.281C69.7812 163.703 72.9688 165.461 77.1875 165.555C83.6094 165.742 89.1641 162.625 93.8516 156.203L99.5469 123.508C97.3438 117.648 93.0781 114.625 86.75 114.438C80.375 114.25 75.2422 117.062 71.3516 122.875C67.4609 128.688 65.3281 136.539 64.9531 146.43ZM126.336 178L144.125 75.625L175.555 75.6953C186.617 75.7422 194.914 78.1562 200.445 82.9375C206.023 87.6719 208.484 94.2578 207.828 102.695C206.984 112.633 200.914 120.109 189.617 125.125C193.836 126.625 197.094 129.367 199.391 133.352C201.688 137.336 202.672 142.094 202.344 147.625C201.688 157 197.914 164.406 191.023 169.844C184.18 175.281 175.133 178 163.883 178H126.336ZM151.719 131.805L146.164 163.797L164.375 163.867C169.859 163.867 174.523 162.414 178.367 159.508C182.211 156.602 184.484 152.617 185.188 147.555C185.844 142.727 185.117 138.953 183.008 136.234C180.898 133.516 177.406 132.062 172.531 131.875L151.719 131.805ZM153.969 118.727L169.93 118.797C175.648 118.797 180.312 117.438 183.922 114.719C187.531 112 189.664 108.32 190.32 103.68C191.492 94.9141 187.062 90.3672 177.031 90.0391L158.961 89.9688L153.969 118.727Z" fill="white"/>
          </svg>
          <Heading ml="2" size="lg" display={['none', 'none', 'block']}>
            devBlog
          </Heading>
        </Flex>
      </Link>
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
              <MenuItem icon={<Icon as={ThemeIcon} h="4" w="4" />} onClick={toggleColorMode}>   
                Use {theme} mode
              </MenuItem>
              <Link href="/posts/create" passHref>   
                <MenuItem as="a" icon={<Icon as={PlusIcon} h="4" w="4"  />}>
                  New Post
                </MenuItem>
              </Link>
              <MenuItem onClick={logout} icon={<Icon as={LogoutIcon} h="4" w="4" />}>
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
