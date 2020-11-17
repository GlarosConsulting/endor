import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiSearch, FiUserPlus } from 'react-icons/fi';
import { Column } from 'react-table';

import { Button, Flex, Tooltip, useDisclosure, Box } from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
// eslint-disable-next-line
import { format } from 'date-fns';
// eslint-disable-next-line
import { ptBR } from 'date-fns/locale'

import Input from '@/components/Input';
import CreateDeceasedModal from '@/components/Modals/CreateDeceasedModal';
import SEO from '@/components/SEO';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import Title from '@/components/Title';

import api from '../services/api';

// eslint-disable-next-line
interface Deceased {
  name: string;
  funeral_initial_date_formatted: string;
  funeral_final_date_formatted: string;
  sepulting_date_formatted: string;
  responsible_name: string;
  funeral: string;
  cemetery: string;
}

// eslint-disable-next-line
interface DeceasedResponseData {
  name: string;
  funeral_initial_date: string;
  funeral_final_date: string;
  sepulting_date: string;
  responsible: {
    name: string;
  };
  funeral: {
    name: string;
    cemetery: {
      name: string;
    };
  };
}

const DECEASED_TABLE_COLUMNS = [
  {
    Header: 'Nome',
    accessor: 'name',
  },
  {
    Header: 'Data e horário de início do velório',
    accessor: 'funeral_initial_date_formatted',
  },
  {
    Header: 'Data e horário de final do velório',
    accessor: 'funeral_final_date_formatted',
  },
  {
    Header: 'Velório',
    accessor: 'funeral',
  },
  {
    Header: 'Data e  horário do sepultamento',
    accessor: 'sepulting_date_formatted',
  },
  {
    Header: 'Cemitério',
    accessor: 'cemetery',
  },
  {
    Header: 'Nome do responsável',
    accessor: 'responsible_name',
  },
] as Column[];

const Users: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const {
    isOpen: isCreateDeceasedOpen,
    onOpen: onOpenCreateDeceased,
    onClose: onCloseCreateDeceased,
  } = useDisclosure();

  const [deceased, setDeceased] = useState([]);

  useEffect(() => {
    api.get('deceaseds').then(response => {
      const deceaseds = response.data;
      const deceasedData: Deceased[] = [];

      deceaseds.forEach((data: DeceasedResponseData) => {
        const funeral_initial_date_formatted = format(
          new Date(data.funeral_initial_date),
          "dd'/'MM'/'yyyy '-' HH:mm'h'",
          { locale: ptBR },
        );

        const funeral_final_date_formatted = format(
          new Date(data.funeral_final_date),
          "dd'/'MM'/'yyyy '-' HH:mm'h'",
          { locale: ptBR },
        );

        const sepulting_date_formatted = format(
          new Date(data.sepulting_date),
          "dd'/'MM'/'yyyy '-' HH:mm'h'",
          { locale: ptBR },
        );

        deceasedData.push({
          name: data.name,
          funeral_initial_date_formatted,
          funeral_final_date_formatted,
          sepulting_date_formatted,
          responsible_name: data.name,
          funeral: data.funeral.name,
          cemetery: data.funeral.cemetery.name,
        });
      });
      setDeceased(deceasedData);
    });
  }, []);

  const handleSearchDeceased = useCallback(async (data, { reset }) => {
    if (!data.deceased_search) {
      return;
    }
    const deceasedsResponse = await api.get(
      `deceaseds?name=${data.deceased_search}`,
    );
    const deceasedData: Deceased[] = [];

    const deceaseds: DeceasedResponseData[] = deceasedsResponse.data;

    deceaseds.forEach((deceasedResponseData: DeceasedResponseData) => {
      const funeral_initial_date_formatted = format(
        new Date(deceasedResponseData.funeral_initial_date),
        "dd'/'MM'/'yyyy '-' HH:mm'h'",
        { locale: ptBR },
      );

      const funeral_final_date_formatted = format(
        new Date(deceasedResponseData.funeral_final_date),
        "dd'/'MM'/'yyyy '-' HH:mm'h'",
        { locale: ptBR },
      );

      const sepulting_date_formatted = format(
        new Date(deceasedResponseData.sepulting_date),
        "dd'/'MM'/'yyyy '-' HH:mm'h'",
        { locale: ptBR },
      );

      deceasedData.push({
        name: deceasedResponseData.name,
        funeral_initial_date_formatted,
        funeral_final_date_formatted,
        sepulting_date_formatted,
        responsible_name: deceasedResponseData.name,
        funeral: deceasedResponseData.funeral.name,
        cemetery: deceasedResponseData.funeral.cemetery.name,
      });
    });
    setDeceased(deceasedData);
    reset();
  }, []);

  return (
    <>
      <SEO
        title="Endor"
        image="og/boost.png"
        shouldExcludeTitleSuffix
        description="Fazer o registro de velórios na plataforma"
      />
      <Flex
        as="main"
        height="100vh"
        position="relative"
        backgroundColor="gray.800"
      >
        <Sidebar />

        <Flex
          paddingLeft={2}
          paddingTop={15}
          paddingRight={65}
          width="100%"
          height="100%"
          bg="gray.800"
          direction="column"
        >
          <Flex justifyContent="space-between" width="100%" color="gray.200">
            <Box width="100%" color="gray.200">
              <Title css={{ color: 'gray.200' }}>Falecidos</Title>
            </Box>
          </Flex>

          <Form ref={formRef} onSubmit={handleSearchDeceased}>
            <Flex>
              <Input
                placeholder="Pesquisar falecidos por nome"
                name="deceased_search"
                containerProps={{ width: 300, height: 40.5 }}
              />
              <Tooltip
                label="Pesquisar falecidos por nome"
                aria-label="Pesquisar falecidos por nome"
              >
                <Button marginLeft={4} type="submit">
                  <FiSearch />
                </Button>
              </Tooltip>

              <Tooltip
                label="Adicionar novo falecido."
                aria-label="Adicionar novo falecido."
              >
                <Button marginLeft={4} onClick={onOpenCreateDeceased}>
                  <FiUserPlus />
                </Button>
              </Tooltip>

              <CreateDeceasedModal
                isOpen={isCreateDeceasedOpen}
                onClose={onCloseCreateDeceased}
              />
            </Flex>
          </Form>

          <Flex marginTop={6}>
            <Table columns={DECEASED_TABLE_COLUMNS} data={deceased}></Table>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Users;
