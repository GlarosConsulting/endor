import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { Column } from 'react-table';

import { Box, Button, Flex, Tooltip, useDisclosure } from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import Input from '@/components/Input';
import CreateCemeteriesModal from '@/components/Modals/CreateCemeteriesModal';
import SEO from '@/components/SEO';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import Title from '@/components/Title';

import api from '../../services/api';

interface ICemeteries {
  id: string;
  name: string;
}

const CEMETERY_TABLE_COLUMNS = [
  {
    Header: 'Lista de cemitérios',
    accessor: 'name',
  },
] as Column[];

const Cemeteries: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const {
    isOpen: isCreateCemeteriesModalOpen,
    onOpen: onOpenCreateCemeteriesModal,
    onClose: onCloseCemeteriesModal,
  } = useDisclosure();

  const [cemeteries, setCemeteries] = useState<ICemeteries[]>(
    [] as ICemeteries[],
  );

  const getCemeteries = useCallback(() => {
    api.get('cemeteries').then(response => {
      const cemeteriesResponse: ICemeteries[] = response.data;

      setCemeteries(cemeteriesResponse);
    });
  }, [setCemeteries]);

  useEffect(() => {
    getCemeteries();
  }, [getCemeteries]);

  const handleSearch = useCallback(async (data, { reset }) => {
    if (!data.cemetery_name_for_search) {
      getCemeteries();
      return;
    }

    const response = await api.get(
      `cemeteries/?name=${data.cemetery_name_for_search}`,
    );

    setCemeteries(response.data);

    reset();
  }, []);

  return (
    <>
      <SEO
        title="Endor"
        image="og/boost.png"
        shouldExcludeTitleSuffix
        description="Fazer o registro de cemitérios na plataforma"
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
            <Title css={{ color: 'gray.200' }}>Cemitérios</Title>
          </Box>

          <Form ref={formRef} onSubmit={handleSearch}>
            <Flex>
              <Input
                name="cemetery_name_for_search"
                placeholder="Nome"
                containerProps={{
                  width: 300,
                  height: 10,
                  border: '1px solid',
                  borderColor: 'gray.400',
                  bg: 'white',
                }}
              />

              <Tooltip
                label="Pesquisar cemitérios por nome"
                aria-label="Pesquisar cemitérios por nome"
              >
                <Button marginLeft={4} type="submit">
                  <FiSearch />
                </Button>
              </Tooltip>

              <Tooltip
                label="Registrar novo cemitério"
                aria-label="Registrar novo cemitério"
              >
                <Button marginLeft={4} onClick={onOpenCreateCemeteriesModal}>
                  <FiPlus />
                </Button>
              </Tooltip>

              <CreateCemeteriesModal
                isOpen={isCreateCemeteriesModalOpen}
                onClose={onCloseCemeteriesModal}
                onSave={getCemeteries}
              />
            </Flex>
            <Flex
              marginTop={6}
              maxHeight={{
                sm: 300,
                md: 400,
                lg: 500,
                xl: 600,
              }}
            >
              <Table columns={CEMETERY_TABLE_COLUMNS} data={cemeteries}></Table>
            </Flex>
          </Form>
        </Flex>
      </Flex>
    </>
  );
};

export default Cemeteries;
