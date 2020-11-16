import React, {
  /* useCallback, */ useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FiSearch, FiUserPlus } from 'react-icons/fi';
import { Column } from 'react-table';

import { Button, Flex, Tooltip, useDisclosure } from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
// eslint-disable-next-line
import { format } from 'date-fns';
// eslint-disable-next-line
import { ptBR } from 'date-fns/locale'

// import * as Yup from 'yup';

import Input from '@/components/Input';
import CreateCustomerModal from '@/components/Modals/CreateCustomersModal';
import SEO from '@/components/SEO';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
// import Title from '@/components/Title';
// import getValidationErrors from '@/utils/getValidationErrors';

import api from '../../services/api';
// eslint-disable-next-line
interface Customers {
  name: string;
  email: string;
  telephone: string;
  gender: string;
  cpf: string;
  birth_date_formatted: string;
}

// eslint-disable-next-line
interface CustomersResponseData {
  name: string;
  email: string;
  telephone: string;
  gender: string;
  cpf: string;
  birth_date: string;
}

const CUSTOMERS_TABLE_COLUMNS = [
  {
    Header: 'nome',
    accessor: 'name',
  },
  {
    Header: 'E-mail',
    accessor: 'email',
  },
  {
    Header: 'Telefone',
    accessor: 'telephone',
  },
  {
    Header: 'Gênero',
    accessor: 'gender',
  },
  {
    Header: 'CPF',
    accessor: 'cpf',
  },
  {
    Header: 'Data de nascimento',
    accessor: 'birth_date_formatted',
  },
] as Column[];

const Users: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const {
    isOpen: isCreateCustomerOpen,
    onOpen: onOpenCreateCustomer,
    onClose: onCloseCreateCustomer,
  } = useDisclosure();

  const [userSelected, setUserSelected] = useState<'customer' | 'employee'>(
    'customer',
  );

  const [customers, setCustomers] = useState<Customers[]>([] as Customers[]);
  // const toast = useToast();

  useEffect(() => {
    api.get('customers').then(response => {
      const responseData = response.data;

      const customersData: Customers[] = [];

      responseData.forEach((data: CustomersResponseData) => {
        const birth_date_formatted = format(
          new Date(data.birth_date),
          "dd'/'MM'/'yyyy'",
          { locale: ptBR },
        );

        customersData.push({
          name: data.name,
          cpf: data.cpf,
          email: data.cpf,
          gender: data.gender,
          telephone: data.telephone,
          birth_date_formatted,
        });
      });
      setCustomers(customersData);
    });
  }, []);

  const handleChangeToEmployeeScreen = useCallback(() => {
    setUserSelected('employee');
  }, [setUserSelected]);

  const handleChangeToCustomerScreen = useCallback(() => {
    setUserSelected('customer');
  }, [setUserSelected]);

  const handleSearchUser = useCallback(async data => {
    if (data.customers_search) {
      const response = await api.get(
        `http://localhost:3333/customers?name=${data.customers_search}`,
      );

      const responseData = response.data;

      const customersData: Customers[] = [];

      responseData.forEach((customersResponseData: CustomersResponseData) => {
        const birth_date_formatted = format(
          new Date(customersResponseData.birth_date),
          "dd'/'MM'/'yyyy'",
          { locale: ptBR },
        );

        customersData.push({
          name: customersResponseData.name,
          cpf: customersResponseData.cpf,
          email: customersResponseData.cpf,
          gender: customersResponseData.gender,
          telephone: customersResponseData.telephone,
          birth_date_formatted,
        });
      });
      setCustomers(customersData);
    } else {
      console.log();
    }
  }, []);

  const handleOpenCreateCustomerModal = useCallback(() => {
    onOpenCreateCustomer();
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
            <Button
              width="49.8%"
              backgroundColor="gray.800"
              borderRadius={0}
              borderBottom="2px solid "
              borderColor={
                userSelected === 'customer' ? 'green.200' : 'gray.500'
              }
              color={userSelected === 'customer' ? 'green.200' : 'White'}
              _hover={{
                bg: 'gray.800',
                color: 'White',
              }}
              _focusWithin={{
                bg: 'gray.800',
                color: 'White',
              }}
              onClick={handleChangeToCustomerScreen}
            >
              Clientes
            </Button>
            <Button
              width="49.8%"
              backgroundColor="gray.800"
              borderRadius={0}
              borderBottom="2px solid"
              borderColor={
                userSelected === 'employee' ? 'green.200' : 'gray.500'
              }
              color={userSelected === 'employee' ? 'green.200' : 'White'}
              _hover={{
                bg: 'gray.800',
                color: 'White',
              }}
              _focusWithin={{
                border: '0px ',
                bg: 'gray.800',
                color: 'White',
              }}
              onClick={handleChangeToEmployeeScreen}
            >
              Funcionários
            </Button>
          </Flex>
          <Flex flexDirection="column" marginTop={6} height="100%">
            <Form ref={formRef} onSubmit={handleSearchUser}>
              {userSelected === 'customer' ? (
                <>
                  <Flex>
                    <Input
                      placeholder="Pesquisar clientes por nome"
                      name="customers_search"
                      containerProps={{ width: 300, height: 40.5 }}
                    />
                    <Tooltip
                      label="Pesquisar clientes por nome."
                      aria-label="Pesquisar clientes por nome."
                    >
                      <Button marginLeft={4} type="submit">
                        <FiSearch />
                      </Button>
                    </Tooltip>

                    <Tooltip
                      label="Adicionar novo cliente."
                      aria-label="Adicionar novo cliente."
                    >
                      <Button
                        marginLeft={4}
                        type="submit"
                        onClick={handleOpenCreateCustomerModal}
                      >
                        <FiUserPlus />
                      </Button>
                    </Tooltip>
                  </Flex>

                  <CreateCustomerModal
                    isOpen={isCreateCustomerOpen}
                    onClose={onCloseCreateCustomer}
                  />

                  <Flex marginTop={6}>
                    <Table
                      columns={CUSTOMERS_TABLE_COLUMNS}
                      data={customers}
                    ></Table>
                  </Flex>
                </>
              ) : (
                <>
                  <Flex>
                    <Input
                      placeholder="Pesquisar funcionários por nome"
                      name="employees_search"
                      containerProps={{ width: 300, height: 40.5 }}
                    />
                    <Tooltip
                      label="Pesquisar funcionários por nome."
                      aria-label="Pesquisar funcionários por nome."
                    >
                      <Button marginLeft={4} type="submit">
                        <FiSearch />
                      </Button>
                    </Tooltip>

                    <Tooltip
                      label="Adicionar novo funcionário."
                      aria-label="Adicionar novo funcionário."
                    >
                      <Button marginLeft={4} type="submit">
                        <FiUserPlus />
                      </Button>
                    </Tooltip>
                  </Flex>
                </>
              )}
            </Form>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Users;
