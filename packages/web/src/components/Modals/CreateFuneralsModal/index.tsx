import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Button,
  Flex,
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
  url_cam: string;
  cemetery_id: string;
}

interface ICemeteries {
  id: string;
  name: string;
}

interface ICreateFuneralsModalProps {
  isOpen: boolean;
  onClose?: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
  onSave: () => void;
}

const CreateFuneralsModal: React.FC<ICreateFuneralsModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const formRef = useRef<FormHandles>(null);

  const { user } = useAuthentication();

  const toast = useToast();

  const [companies, setCompanies] = useState<ICompany[]>([] as ICompany[]);
  const [isFuneral, setIsFuneral] = useState<boolean>(true);
  const [cemeteries, setCemeteries] = useState<ICemeteries[]>(
    [] as ICemeteries[],
  );

  useEffect(() => {
    if (user?.company_id) {
      api.get(`companies/${user.company_id}`).then(response => {
        const company = response.data;

        setIsFuneral(company.isFuneral);

        if (!company.isFuneral) {
          api.get('companies').then(companiesResponse => {
            const companiesData = companiesResponse.data.filter(
              data => data.isFuneral,
            );

            setCompanies(companiesData);
          });
        }
      });
    }
  }, [user, isFuneral]);

  const handleSubmit = useCallback(async (data: IFormData, event) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        url_cam: Yup.string().required('Link da camêra obrigatório'),
        cemetery_id: Yup.string().uuid().required('Cemitério obrigatório'),
        company_id: !isFuneral
          ? Yup.string().uuid().required('Nome obrigatório')
          : Yup.string().uuid(),
      });

      await schema.validate(data, { abortEarly: false });

      await api.post('funerals', data);

      toast({
        status: 'success',
        title: 'Velório criado com sucesso',
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
        title: 'Erro ao registrar o velório',
        description: 'Ocorreu um erro ao registrar o velório, tente novamente.',
        position: 'top',
        duration: 5000,
      });
    }
  }, []);

  const handleCompanyChange = useCallback(
    async e => {
      const selected = e.target.value;

      if (!selected) {
        setCemeteries([]);

        return;
      }

      const response = await api.get(`/cemeteries/?company_id=${selected}`);

      const cemeteriesResponse = response.data;

      setCemeteries(cemeteriesResponse);
    },
    [setCemeteries],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent maxWidth={900} borderRadius="md">
        <ModalHeader>Registrar velório</ModalHeader>
        <ModalCloseButton />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <ModalBody paddingBottom={4}>
            <Flex>
              {!isFuneral && (
                <Select
                  backgroundColor="White"
                  name="company_id"
                  placeholder="Selecione a funerária"
                  onChange={handleCompanyChange}
                  containerProps={{
                    marginRight: '16px',
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
                name="url_cam"
                placeholder="Link da camêra do velório"
                containerProps={{
                  marginLeft: '16px',
                  border: '1px solid',
                  borderColor: 'gray.400',
                  bg: 'white',
                }}
              />
              <Select
                isDisabled={!(cemeteries.length > 0)}
                backgroundColor="White"
                name="cemetery_id"
                placeholder="Selecione o cemitério"
                containerProps={{
                  marginLeft: '16px',
                  border: '1px solid',
                  borderColor: 'gray.400',
                  bg: 'white',
                }}
              >
                {cemeteries.map(cemetery => (
                  <option value={cemetery.id}>{cemetery.name}</option>
                ))}
              </Select>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose} marginRight={4}>
              Cancelar
            </Button>

            <Button type="submit" variantColor="green">
              Salvar
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default CreateFuneralsModal;
