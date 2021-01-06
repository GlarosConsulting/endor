import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import Input from '@/components/Input';
import Select from '@/components/Select';
import { useAuthentication } from '@/hooks/authentication';
import ICompany from '@/interfaces/Company';
import getValidationErrors from '@/utils/getValidationErrors';

import api from '../../../services/api';

interface IFormData {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  company_id: string;
}

interface ICreateEmpployeesModalProps {
  isOpen: boolean;
  onClose?: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
  onSave: () => void;
}

const CreateEmpployeesModal: React.FC<ICreateEmpployeesModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const formRef = useRef<FormHandles>(null);
  const { user } = useAuthentication();
  const toast = useToast();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [mngRole, setmngRole] = useState<boolean>(false);

  const [companies, setCompanies] = useState<ICompany[]>([] as ICompany[]);
  const [isFuneral, setIsFuneral] = useState<boolean>(true);

  useEffect(() => {
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
  }, [user, isFuneral]);

  const handleSubmit = useCallback(
    async (data: IFormData, event) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string().email().required('E-mail obrigatória'),
          password: Yup.string().required('Senha obrigatório'),
          company_id: !isFuneral
            ? Yup.string().uuid().required('Empresa obrigatória')
            : Yup.string().uuid(),
          passwordConfirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'As senhas devem ser iguais',
          ),
        });

        await schema.validate(data, { abortEarly: false });

        let requestBodyData;

        if (!isFuneral) {
          if (mngRole) {
            requestBodyData = {
              name: data.name,
              role: 'gerente',
              email: data.email,
              password: data.password,
              company_id: data.company_id,
            };
          } else {
            requestBodyData = {
              name: data.name,
              role: 'funcionario',
              email: data.email,
              password: data.password,
              company_id: data.company_id,
            };
          }
        } else if (mngRole) {
          requestBodyData = {
            name: data.name,
            role: 'gerente',
            email: data.email,
            password: data.password,
          };
        } else {
          requestBodyData = {
            name: data.name,
            role: 'funcionario',
            email: data.email,
            password: data.password,
          };
        }
        await api.post('employees', requestBodyData);

        toast({
          status: 'success',
          title: 'Funcionário registrado com sucesso!',
          position: 'top',
          duration: 3000,
        });

        onClose(event);
        onSave();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        toast({
          status: 'error',
          title: 'Erro no registro do funcionário',
          description:
            'Ocorreu um erro ao tentar registrar o funcionário, tente novamente.',
          position: 'top',
          duration: 5000,
        });
      }
    },
    [mngRole],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent borderRadius="md">
        <ModalHeader>Registrar funcionário</ModalHeader>
        <ModalCloseButton />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <ModalBody paddingBottom={4}>
            <Input
              name="name"
              placeholder="Nome"
              containerProps={{
                border: '1px solid',
                borderColor: 'gray.400',
                bg: 'white',
              }}
            />

            <Input
              name="email"
              placeholder="E-mail"
              containerProps={{
                border: '1px solid',
                borderColor: 'gray.400',
                bg: 'white',
                marginTop: 3,
              }}
            />

            <Input
              name="password"
              type="password"
              placeholder="Senha"
              containerProps={{
                border: '1px solid',
                borderColor: 'gray.400',
                bg: 'white',
                marginTop: 3,
              }}
            />

            <Input
              name="passwordConfirmation"
              type="password"
              placeholder="Confirme a senha do funcionário"
              containerProps={{
                border: '1px solid',
                borderColor: 'gray.400',
                bg: 'white',
                marginTop: 3,
              }}
            />

            {!isFuneral && (
              <Select
                backgroundColor="White"
                name="company_id"
                placeholder="Selecione a funerária"
                containerProps={{
                  marginTop: 3,
                  border: '1px solid',
                  borderColor: 'gray.400',
                  bg: 'white',
                }}
              >
                {companies.map(company => (
                  <option value={company.id}>{company.name}</option>
                ))}
              </Select>
            )}
          </ModalBody>

          <ModalFooter>
            <Checkbox
              color="green"
              hidden={userRole !== 'administrador' && userRole !== 'master'}
              isChecked={mngRole}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setmngRole(event.target.checked);
              }}
            >
              Gerente
            </Checkbox>
            <Button variant="ghost" onClick={onClose} marginRight={4}>
              Cancelar
            </Button>

            <Button type="submit" variantColor="green">
              Confirmar
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default CreateEmpployeesModal;
