import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Text,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Flex,
  useToast,
  CircularProgress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { setHours, setMinutes, formatISO } from 'date-fns';
import * as Yup from 'yup';

import DatePicker from '@/components/DatePicker';
import Input from '@/components/Input';
import Select from '@/components/Select';
import TimePicker from '@/components/TimePicker';
import getValidationErrors from '@/utils/getValidationErrors';

import api from '../../../services/api';

// eslint-disable-next-line
interface Customers {
  id: string;
  name: string;
}

// eslint-disable-next-line
interface Cemetery {
  id: string;
  name: string;
}

// eslint-disable-next-line
interface Funeral {
  id: string;
  name: string;
}

interface IFormData {
  name: string;
  responsible_id: string;
  cemetery_id: string;
  funeral_id: string;
  funeral_date: Date;
  funeral_initial_time: string;
  funeral_final_time: string;
  sepulting_date: Date;
  sepulting_time: string;
}

interface ICreateDeceasedModalProps {
  isOpen: boolean;
  onClose?: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
}

const CreateDeceasedModal: React.FC<ICreateDeceasedModalProps> = ({
  isOpen,
  onClose,
}) => {
  const formRef = useRef<FormHandles>(null);

  const toast = useToast();

  const [cemeteries, setCemeteries] = useState<Cemetery[]>([] as Cemetery[]);
  const [customers, setCustomers] = useState<Customers[]>([] as Customers[]);
  const [funerals, setFunerals] = useState<Funeral[]>([] as Funeral[]);

  const [createdLink, setCreatedLink] = useState<string>('');

  const [requestStatus, setRequestStatus] = useState<
    'Loading' | 'Finished' | null
  >(null);

  const handleSubmit = useCallback(async (data: IFormData, event) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome do falecido obrigatório'),
        responsible_id: Yup.string().uuid().required('Responsável obrigatório'),
        cemetery_id: Yup.string().uuid().required('Cemitério obrigatório'),
        funeral_id: Yup.string().uuid().required('Velório obrigatório'),
        funeral_date: Yup.date().required('Data do velório obrigatório'),
        funeral_initial_time: Yup.string().required(
          'Horário inicial do velório obrigatório',
        ),
        funeral_final_time: Yup.string().required(
          'Horário final do velório obrigatório',
        ),
        sepulting_date: Yup.date().required('Data do sepultamento obrigatório'),
        sepulting_time: Yup.string().required(
          'Horário do sepultamento obrigatório',
        ),
      });

      await schema.validate(data, { abortEarly: false });

      setRequestStatus('Loading');

      const funeralInitialDateTime = formatISO(
        setMinutes(
          setHours(
            new Date(data.funeral_date),
            Number(data.funeral_initial_time.substr(0, 2)),
          ),
          Number(data.funeral_initial_time.substr(3)),
        ),
      );

      const funeralFinalDateTime = formatISO(
        setMinutes(
          setHours(
            new Date(data.funeral_date),
            Number(data.funeral_final_time.substr(0, 2)),
          ),
          Number(data.funeral_final_time.substr(3)),
        ),
      );

      const sepultingDateTime = formatISO(
        setMinutes(
          setHours(
            new Date(data.sepulting_date),
            Number(data.sepulting_time.substr(0, 2)),
          ),
          Number(data.sepulting_time.substr(3)),
        ),
      );

      const submitData = {
        name: data.name,
        responsible_id: data.responsible_id,
        funeral_initial_date: funeralInitialDateTime,
        funeral_final_date: funeralFinalDateTime,
        sepulting_date: sepultingDateTime,
        funeral_id: data.funeral_id,
      };

      const response: { data: { live_chat_link: string } } = await api.post(
        'deceaseds',
        submitData,
      );

      const live_link = response.data.live_chat_link;

      if (!live_link) {
        toast({
          status: 'error',
          title: 'Erro no registro de falecido',
          description:
            'Ocorreu um erro ao tentar registrar o falecido, tente novamente.',
          position: 'top',
          duration: 5000,
        });
        onClose(event);
        setFunerals([]);
        setRequestStatus(null);
        return;
      }

      setCreatedLink(live_link);
      setRequestStatus('Finished');
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
  }, []);

  useEffect(() => {
    setRequestStatus(null);
    setFunerals([] as Funeral[]);

    api.get('cemeteries').then(response => {
      const cemeteriesResponse: Cemetery[] = response.data;

      setCemeteries(cemeteriesResponse);
    });

    api.get('customers').then(response => {
      const customersResponse: Cemetery[] = response.data;

      setCustomers(customersResponse);
    });
  }, []);

  const handleCemeteryChange = useCallback(
    async e => {
      const selected = e.target.value;
      const response = await api.get(`funerals/cemetery/${selected}`);
      const funeralsResponse = response.data;

      setFunerals(funeralsResponse);
    },
    [setFunerals],
  );

  return (
    <Modal
      size="full"
      isOpen={isOpen}
      onClose={event => {
        if (requestStatus === 'Loading') {
          onClose(event);
          setFunerals([]);
          setRequestStatus(null);
        }
      }}
    >
      <ModalOverlay />

      <ModalContent maxWidth={900} borderRadius="md">
        <ModalHeader>Gerar link do live chat</ModalHeader>
        <ModalCloseButton
          onClick={event => {
            onClose(event);
            setFunerals([]);
            setRequestStatus(null);
          }}
          isDisabled={requestStatus !== 'Finished' && requestStatus !== null}
        />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <ModalBody paddingBottom={4}>
            <Flex>
              <Input
                name="name"
                placeholder="Nome do falecido"
                containerProps={{
                  width: 460,
                  border: '1px solid',
                  borderColor: 'gray.400',
                  bg: 'white',
                }}
              />

              <Select
                name="responsible_id"
                placeholder="Cliente responsável"
                bg="white"
                containerProps={{
                  marginLeft: 4,
                  width: 460,
                  border: '1px solid',
                  borderColor: 'gray.400',
                  bg: 'white',
                }}
              >
                {customers.map(customer => (
                  <option value={customer.id} key={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </Select>

              <Select
                name="cemetery_id"
                placeholder="Cemitério"
                bg="white"
                containerProps={{
                  marginLeft: 4,
                  width: 460,
                  border: '1px solid',
                  borderColor: 'gray.400',
                  bg: 'white',
                }}
                onChange={handleCemeteryChange}
              >
                {cemeteries.map(cemetery => (
                  <option key={cemetery.id} value={cemetery.id}>
                    {cemetery.name}
                  </option>
                ))}
              </Select>

              <Select
                name="funeral_id"
                isDisabled={!(funerals.length > 0)}
                placeholder="Velório"
                bg="white"
                containerProps={{
                  marginLeft: 4,
                  width: 460,
                  border: '1px solid',
                  borderColor: 'gray.400',
                  bg: 'white',
                }}
              >
                {funerals.map(funeral => (
                  <option value={funeral.id} key={funeral.id}>
                    {funeral.name}
                  </option>
                ))}
              </Select>
            </Flex>

            <Flex marginTop={4}>
              <DatePicker
                name="funeral_date"
                placeholderText="Data do velório"
                containerProps={{ marginTop: 3, width: '100%', color: 'black' }}
              />
              <TimePicker
                name="funeral_initial_time"
                label="Horário do início do velório"
                containerProps={{
                  marginLeft: 4,
                  marginTop: 3,
                  color: 'black',
                }}
              />
              <TimePicker
                name="funeral_final_time"
                label="Horário do final do velório"
                containerProps={{
                  marginLeft: 4,
                  marginTop: 3,
                  color: 'black',
                }}
              />
            </Flex>

            <Flex marginTop={4}>
              <DatePicker
                name="sepulting_date"
                placeholderText="Data do sepultamento"
                containerProps={{ marginTop: 3, color: 'black' }}
              />
              <TimePicker
                name="sepulting_time"
                label="Horário dosepultamento"
                containerProps={{
                  marginLeft: 4,
                  marginTop: 3,
                  color: 'black',
                }}
              />
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              onClick={event => {
                onClose(event);
                setFunerals([]);
                setRequestStatus(null);
              }}
              marginRight={4}
              isDisabled={
                requestStatus !== 'Finished' && requestStatus !== null
              }
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variantColor="green"
              isDisabled={
                requestStatus !== 'Finished' && requestStatus !== null
              }
            >
              Gerar link e enviar
            </Button>
          </ModalFooter>
        </Form>
        <Flex
          direction="column"
          hidden={requestStatus === null}
          alignItems="center"
          justifyContent="center"
          backgroundColor="white"
          width="100%"
          height={200}
        >
          {requestStatus === 'Loading' ? (
            <>
              <Text color="gray.900" marginBottom={2}>
                Gerando link...
              </Text>
              <CircularProgress color="gray.900" isIndeterminate />
            </>
          ) : (
            <>
              <Alert
                status="success"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height={200}
                width="100%"
                marginBottom={4}
                marginLeft={4}
                marginRight={4}
              >
                <AlertIcon mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  Link gerado!
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                  {`O cliente pode assistir a live nesse link ${createdLink}`}
                </AlertDescription>
                <Button
                  variant="ghost"
                  onClick={event => {
                    onClose(event);
                    setFunerals([]);
                    setRequestStatus(null);
                  }}
                  marginRight={4}
                >
                  Ok.
                </Button>
              </Alert>
            </>
          )}
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default CreateDeceasedModal;
