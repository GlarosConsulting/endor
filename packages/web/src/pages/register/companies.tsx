import React, { useCallback, useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { Column } from 'react-table';

import {
  Box,
  Button,
  Flex,
  Tooltip,
  useDisclosure,
  Text,
} from '@chakra-ui/core';

import CreateCompaniesModal from '@/components/Modals/CreateCompaniesModal';
import SEO from '@/components/SEO';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import Title from '@/components/Title';

import api from '../../services/api';

interface ICompanies {
  id: string;
  name: string;
  isFuneral: boolean;
}

const CEMETERY_TABLE_COLUMNS = [
  {
    Header: 'Lista de clientes',
    accessor: 'name',
  },
] as Column[];

const Companies: React.FC = () => {
  const {
    isOpen: isCreateCompaniesModalOpen,
    onOpen: onOpenCreateCompaniesModal,
    onClose: onCloseCompaniesModal,
  } = useDisclosure();

  const [companies, setCompanies] = useState<ICompanies[]>([] as ICompanies[]);

  const getCompanies = useCallback(() => {
    api.get('companies').then(response => {
      const companiesResponse: ICompanies[] = response.data;

      setCompanies(companiesResponse);
    });
  }, [setCompanies]);

  useEffect(() => {
    getCompanies();
  }, [getCompanies]);

  return (
    <>
      <SEO
        title="Endor"
        image="og/boost.png"
        shouldExcludeTitleSuffix
        description="Fazer o registro de novos clientes na plataforma"
      />
      <Flex
        as="main"
        height="100vh"
        width="100vw"
        position="relative"
        backgroundColor="gray.800"
      >
        <Sidebar />

        <Flex
          paddingLeft={2}
          paddingTop={15}
          paddingRight={65}
          width="calc(100vw - 310px)"
          height="100%"
          bg="gray.800"
          direction="column"
        >
          <Box width="100%" color="gray.200">
            <Title css={{ color: 'gray.200' }}>Clientes</Title>
          </Box>

          <Tooltip
            label="Registrar novo cliente"
            aria-label="Registrar novo cliente"
          >
            <Button width={250} onClick={onOpenCreateCompaniesModal}>
              <FiPlus />
              <Text marginLeft={2}>Adicionar novo cliente</Text>
            </Button>
          </Tooltip>

          <CreateCompaniesModal
            isOpen={isCreateCompaniesModalOpen}
            onClose={onCloseCompaniesModal}
            onSave={getCompanies}
          />

          <Flex
            marginTop={6}
            maxHeight={{
              sm: 300,
              md: 400,
              lg: 500,
              xl: 600,
            }}
          >
            <Table columns={CEMETERY_TABLE_COLUMNS} data={companies}></Table>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Companies;
