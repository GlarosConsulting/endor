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
import ICompany from '@/interfaces/Company';

import { useAuthentication } from '../../hooks/authentication';
import api from '../../services/api';

interface IFunerals {
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
  const [funerals, setFunerals] = useState<IFunerals[]>([] as IFunerals[]);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [companies, setCompanies] = useState<ICompany[]>([] as ICompany[]);
  const [isFuneral, setIsFuneral] = useState<boolean>(true);

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
      const funeralsData: IFunerals[] = [];

      funeralsResponse.forEach(data => {
        if (user.role !== 'funcionario') {
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

    if (user?.company_id) {
      setUserRole(user?.role);

      api.get(`companies/${user.company_id}`).then(response => {
        const company = response.data;

        setIsFuneral(company.isFuneral);

        if (!company.isFuneral) {
          api.get('companies').then(companiesResponse => {
            const companiesData = companiesResponse.data;

            setCompanies(companiesData);
          });
        }
      });
    }

    api.get('cemeteries').then(response => {
      const cemeteriesResponse: ICemeteries[] = response.data;

      setUserRole(user.role);

      setCemeteries(cemeteriesResponse);
    });
  }, [setCemeteries, user, isFuneral]);

  const handleSearchFunerals = useCallback(async (data, { reset }) => {
    if (isFuneral) {
      if (!data.cemetery_id_for_search) {
        getFunerals();
        return;
      }

      const response = await api.get(
        `funerals/cemetery/${data.cemetery_id_for_search}`,
      );

      const funeralsResponse = response.data;
      const funeralsData: IFunerals[] = [];

      funeralsResponse.forEach(funeral => {
        if (user.role !== 'funcionario') {
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
    } else {
      if (!data.company_id) {
        getFunerals();
        return;
      }

      const response = await api.get(`funerals?company_id=${data.company_id}`);

      const funeralsResponse = response.data;
      const funeralsData: IFunerals[] = [];

      funeralsResponse.forEach(funeral => {
        if (user.role !== 'funcionario') {
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
    }

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
        width="100vw"
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
            <Title css={{ color: 'gray.200' }}>Velórios</Title>
          </Box>

          <Form onSubmit={handleSearchFunerals} ref={formRef}>
            <Flex>
              {isFuneral ? (
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
              ) : (
                <Select
                  height={8}
                  backgroundColor="White"
                  name="company_id"
                  placeholder="Selecione o cliente"
                  containerProps={{
                    width: 300,
                    height: 10,
                    border: '1px solid',
                    borderColor: 'gray.400',
                    bg: 'white',
                  }}
                >
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </Select>
              )}
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
                  hidden={userRole === 'funcionario'}
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
              />

              <UpdateFuneralsModal
                updatedFuneralId={updatedFuneralId}
                onSave={getFunerals}
                isOpen={isUpdateFuneralsModalOpen}
                onClose={onCloseUpdateFuneralsModal}
              />
            </Flex>

            <Flex
              marginTop={6}
              height="100%"
              maxHeight={{
                sm: 300,
                md: 400,
                lg: 500,
                xl: 600,
              }}
            >
              <Table columns={FUNERAL_TABLE_COLUMNS} data={funerals}></Table>
            </Flex>
          </Form>
        </Flex>
      </Flex>
    </>
  );
};

export default Funerals;
