import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import { FiPower, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarFooter,
  SidebarHeader,
  SidebarContent,
} from 'react-pro-sidebar';

import { Flex, Box, Tooltip, Text } from '@chakra-ui/core';

import { useAuthentication } from '@/hooks/authentication';

import { Container } from './styles';

interface ISidebarProps {
  top?: React.ReactNode;
  middle?: React.ReactNode;
}

const Sidebar: React.FC<ISidebarProps> = () => {
  const { logOut } = useAuthentication();

  const [navBarCollapsed, setNavBarCollapsed] = useState<boolean>(false);

  const handleCollapseSideBar = useCallback(() => {
    setNavBarCollapsed(!navBarCollapsed);
  }, [navBarCollapsed]);

  return (
    <>
      <Container>
        <ProSidebar collapsed={navBarCollapsed}>
          <SidebarHeader
            css={{
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text fontWeight="bold" fontSize={24}>
              Menu
            </Text>
          </SidebarHeader>

          <SidebarContent>
            <Menu iconShape="square">
              <SubMenu title="Registrar">
                <Link href="/register/cemeteries">
                  <MenuItem>Cemitérios</MenuItem>
                </Link>
                <Link href="/register/funerals">
                  <MenuItem>Velórios</MenuItem>
                </Link>
                <Link href="/register/users">
                  <MenuItem>Usuários</MenuItem>
                </Link>
              </SubMenu>

              <SubMenu title="Movimentações">
                <Link href="/deceased">
                  <MenuItem>Novo Falecido</MenuItem>
                </Link>
              </SubMenu>
            </Menu>
          </SidebarContent>

          <SidebarFooter
            css={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Tooltip label="Sair" aria-label="Sair">
              <Box cursor="pointer" onClick={logOut} padding={3}>
                <FiPower size={20} color="gray.200" />
              </Box>
            </Tooltip>
          </SidebarFooter>
        </ProSidebar>
      </Container>
      <Flex direction="column" height="100vh" justifyContent="flex-end">
        <Tooltip
          label={navBarCollapsed ? 'Abrir menu' : 'Fechar menu'}
          aria-label={navBarCollapsed ? 'Abrir menu' : 'Fechar menu'}
        >
          <Flex
            cursor="pointer"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="50%"
            height={8}
            width={8}
            marginLeft={2}
            marginBottom={2}
            backgroundColor="gray.900"
            onClick={handleCollapseSideBar}
          >
            {navBarCollapsed ? (
              <FiArrowRight size={16} color="White" />
            ) : (
              <FiArrowLeft size={16} color="White" />
            )}
          </Flex>
        </Tooltip>
      </Flex>
    </>
  );
};
export default Sidebar;
