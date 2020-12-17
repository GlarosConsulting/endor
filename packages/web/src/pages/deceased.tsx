import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FiSearch, FiUserPlus } from 'react-icons/fi';
import { Column } from 'react-table';

import { Button, Flex, Tooltip, useDisclosure, Box } from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Input from '@/components/Input';
import CreateDeceasedModal from '@/components/Modals/CreateDeceasedModal';
import SEO from '@/components/SEO';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import Title from '@/components/Title';

import api from '../services/api';

interface IDeceased {
  link: ReactElement;
  name: string;
  funeral_initial_date_formatted: string;
  funeral_final_date_formatted: string;
  sepulting_date_formatted: string;
  responsible_name: string;
  funeral: string;
  cemetery: string;
}

interface IDeceasedResponseData {
  id: string;
  name: string;
  funeral_initial_date: string;
  funeral_final_date: string;
  sepulting_date: string;
  responsible: {
    name: string;
  };
  funeral_location: {
    name: string;
    cemetery: {
      name: string;
    };
  };
  sepulting_location: {
    name: string;
  };
}

const DECEASED_TABLE_COLUMNS = [
  {
    Header: 'Link da live',
    accessor: 'link',
  },
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
    Header: 'Local do velório',
    accessor: 'funeral',
  },
  {
    Header: 'Data e  horário do sepultamento',
    accessor: 'sepulting_date_formatted',
  },
  {
    Header: 'Cemitério do sepultamento',
    accessor: 'cemetery',
  },
  {
    Header: 'Nome do responsável',
    accessor: 'responsible_name',
  },
] as Column[];

const Deceased: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const {
    isOpen: isCreateDeceasedOpen,
    onOpen: onOpenCreateDeceased,
    onClose: onCloseCreateDeceased,
  } = useDisclosure();

  const [deceased, setDeceased] = useState([]);

  const copyToClipboard = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
  }, []);

  const getDeceased = useCallback(() => {
    api.get('deceaseds').then(response => {
      const deceaseds = response.data;
      const deceasedData: IDeceased[] = [];

      deceaseds.forEach((data: IDeceasedResponseData) => {
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
          link: (
            <Button
              onClick={() => {
                copyToClipboard(
                  `${process.env.NEXT_PUBLIC_SITE_URL}/live?id=${data.id}`,
                );
              }}
            >
              Copiar Link da live
            </Button>
          ),
          name: data.name,
          funeral_initial_date_formatted,
          funeral_final_date_formatted,
          funeral: `${data.funeral_location.name} do ${data.funeral_location.cemetery.name}`,
          sepulting_date_formatted,
          cemetery: data.sepulting_location.name,
          responsible_name: data.responsible.name,
        });
      });
      setDeceased(deceasedData);
    });
  }, []);

  useEffect(() => {
    getDeceased();
  }, [getDeceased]);

  const handleSearchDeceased = useCallback(async (data, { reset }) => {
    if (!data.deceased_search) {
      return;
    }

    const deceasedsResponse = await api.get(
      `deceaseds?name=${data.deceased_search}`,
    );

    const deceasedData: IDeceased[] = [];

    const deceaseds: IDeceasedResponseData[] = deceasedsResponse.data;

    deceaseds.forEach((deceasedResponseData: IDeceasedResponseData) => {
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
        link: (
          <Button
            onClick={() => {
              copyToClipboard(
                `${process.env.NEXT_PUBLIC_SITE_URL}/live?id=${deceasedResponseData.id}`,
              );
            }}
          >
            Copiar link da live
          </Button>
        ),
        name: deceasedResponseData.name,
        funeral_initial_date_formatted,
        funeral_final_date_formatted,
        funeral: `${deceasedResponseData.funeral_location.name} do ${deceasedResponseData.funeral_location.cemetery.name}`,
        sepulting_date_formatted,
        cemetery: deceasedResponseData.sepulting_location.name,
        responsible_name: deceasedResponseData.responsible.name,
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
        width="100%"
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
                onSave={getDeceased}
                isOpen={isCreateDeceasedOpen}
                onClose={onCloseCreateDeceased}
              />
            </Flex>
          </Form>

          <Flex
            marginTop={6}
            maxHeight={{
              sm: 300,
              md: 400,
              lg: 500,
              xl: 600,
            }}
          >
            <Table columns={DECEASED_TABLE_COLUMNS} data={deceased}></Table>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Deceased;
