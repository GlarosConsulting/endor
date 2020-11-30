import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FiSearch, FiPlus, FiEdit } from 'react-icons/fi';
import { Column } from 'react-table';

import { Box, Button, Flex, Tooltip, useDisclosure } from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import CreateFuneralsModal from '@/components/Modals/CreateFuneralsModal';
import UpdateFuneralsModal from '@/components/Modals/UpdateFuneralsModal';
import Select from '@/components/Select';
import SEO from '@/components/SEO';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import Title from '@/components/Title';

import { useAuthentication } from '../../hooks/authentication';
import api from '../../services/api';

interface IFormData {
  name: string;
  url_cam: string;
}
// eslint-disable-next-line
interface Funerals {
  id: string;
  name: string;
  url_cam: string;
  cemetery: string;
  edit_button?: ReactElement;
}

interface ICemeteries {
  id: string;
  name: string;
}

const FUNERAL_TABLE_COLUMNS = [
  {
    Header: 'Nome',
    accessor: 'name',
  },
  {
    Header: 'Link da câmera',
    accessor: 'url_cam',
  },
  {
    Header: 'Cemitério',
    accessor: 'cemetery',
  },
  {
    Header: '',
    accessor: 'edit_button',
  },
] as Column[];

const Funerals: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { user } = useAuthentication();

  const [cemeteries, setCemeteries] = useState<ICemeteries[]>(
    [] as ICemeteries[],
  );

  const [updatedFuneralId, setUpdatedFuneralId] = useState<string>('');
  const [funerals, setFunerals] = useState<Funerals[]>([] as Funerals[]);
  const [userRole, setUserRole] = useState<string | null>(null);

  const {
    isOpen: isCreateFuneralsOpen,
    onOpen: onOpenCreateFunerals,
    onClose: onCloseCreateFunerals,
  } = useDisclosure();

  const {
    isOpen: isUpdateFuneralsModalOpen,
    onOpen: onOpenUpdateFuneralsModal,
    onClose: onCloseUpdateFuneralsModal,
  } = useDisclosure();

  const handleClickEditFunerlButton = useCallback((id: string) => {
    setUpdatedFuneralId(id);
    onOpenUpdateFuneralsModal();
  }, []);

  const getFunerals = useCallback(() => {
    api.get('funerals').then(response => {
      const funeralsResponse = response.data;
      const funeralsData: Funerals[] = [];

      funeralsResponse.forEach(data => {
        if (user.role === 'administrador') {
          funeralsData.push({
            id: data.id,
            name: data.name,
            url_cam: data.url_cam,
            cemetery: data.cemetery.name,
            edit_button: (
              <Button
                onClick={() => {
                  handleClickEditFunerlButton(data.id);
                }}
              >
                <FiEdit />
              </Button>
            ),
          });
        } else {
          funeralsData.push({
            id: data.id,
            name: data.name,
            url_cam: data.url_cam,
            cemetery: data.cemetery.name,
          });
        }
      });

      setFunerals(funeralsData);
    });
  }, [setFunerals]);

  useEffect(() => {
    getFunerals();

    api.get('cemeteries').then(response => {
      const cemeteriesResponse: ICemeteries[] = response.data;

      setUserRole(user.role);

      setCemeteries(cemeteriesResponse);
    });
  }, [setCemeteries]);

  const handleSearchFunerals = useCallback(async (data, { reset }) => {
    if (!data.cemetery_id_for_search) {
      getFunerals();
      return;
    }

    const response = await api.get(
      `funerals/cemetery/${data.cemetery_id_for_search}`,
    );

    const funeralsResponse = response.data;
    const funeralsData: Funerals[] = [];

    funeralsResponse.forEach(funeral => {
      if (user.role === 'administrador') {
        funeralsData.push({
          id: funeral.id,
          name: funeral.name,
          url_cam: funeral.url_cam,
          cemetery: funeral.cemetery.name,
          edit_button: (
            <Button
              onClick={() => {
                handleClickEditFunerlButton(funeral.id);
              }}
            >
              <FiEdit />
            </Button>
          ),
        });
      } else {
        funeralsData.push({
          id: funeral.id,
          name: funeral.name,
          url_cam: funeral.url_cam,
          cemetery: funeral.cemetery.name,
        });
      }
    });

    setFunerals(funeralsData);

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
          <Box width="100%" color="gray.200">
            <Title css={{ color: 'gray.200' }}>Velórios</Title>
          </Box>

          <Form onSubmit={handleSearchFunerals} ref={formRef}>
            <Flex>
              <Select
                height={8}
                backgroundColor="White"
                name="cemetery_id_for_search"
                placeholder="Selecione o cemitério"
                containerProps={{
                  width: 300,
                  height: 10,
                  border: '1px solid',
                  borderColor: 'gray.400',
                  bg: 'white',
                }}
              >
                {cemeteries.map(cemetery => (
                  <option key={cemetery.id} value={cemetery.id}>
                    {cemetery.name}
                  </option>
                ))}
              </Select>
              <Tooltip
                label="Pesquisar velórios por cemitério"
                aria-label="Pesquisar velórios por cemitério"
              >
                <Button marginLeft={4} type="submit">
                  <FiSearch />
                </Button>
              </Tooltip>

              <Tooltip
                label="Adicionar novo velório."
                aria-label="Adicionar novo velório."
              >
                <Button
                  hidden={userRole !== 'administrador'}
                  onClick={onOpenCreateFunerals}
                  marginLeft={4}
                >
                  <FiPlus />
                </Button>
              </Tooltip>

              <CreateFuneralsModal
                onSave={getFunerals}
                isOpen={isCreateFuneralsOpen}
                onClose={onCloseCreateFunerals}
                cemeteries={cemeteries}
              />

              <UpdateFuneralsModal
                updatedFuneralId={updatedFuneralId}
                onSave={getFunerals}
                isOpen={isUpdateFuneralsModalOpen}
                onClose={onCloseUpdateFuneralsModal}
              />
            </Flex>

            <Flex marginTop={6}>
              <Table columns={FUNERAL_TABLE_COLUMNS} data={funerals}></Table>
            </Flex>
          </Form>
        </Flex>
      </Flex>
    </>
  );
};

export default Funerals;
