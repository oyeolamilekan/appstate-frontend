"use client"

import { Input, Form, Modal, Button } from '@/components/ui'
import React, { useMemo, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createIntegration, deleteIntegration, fetchIntegrations } from '@/endpoints';
import { useCopyToClipboard, useModals, useSessionStorage } from '@/hooks';
import { CURRENT_STORE } from '@/config/app';
import { FieldValues, useForm } from "react-hook-form";
import { toast } from 'sonner';
import { AlertOctagon } from 'lucide-react';
import { capitalize } from '@/lib';
import { FaGithub, FaStripeS } from 'react-icons/fa';
import { BASE_URL } from '@/config/url';

interface DeleteIntegrationParams {
  storeSlug: string;
  integrationPublicId: string;
}

export default function Integrations() {
  const [_, copy] = useCopyToClipboard()

  const queryClient = useQueryClient();

  const integrationId = useRef<string>('')

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const { modals, updateModals } = useModals();

  const { value } = useSessionStorage<{ name: string, public_id: string, slug: string }>(CURRENT_STORE);

  const { isLoading, data } = useQuery({
    queryKey: ["integrations", value?.slug],
    queryFn: () => fetchIntegrations(value?.slug as string),
    enabled: value?.slug != null,
    retry: false,
  });

  const toggleIntegrationModal = () => updateModals({ createIntegrationModal: !modals.createIntegrationModal })

  const toggleDeleteIntegrationModal = () => updateModals({ deleteIntegrationModal: !modals.deleteIntegrationModal })

  const integrations = useMemo(() => data?.data ?? [], [data?.data])

  const stripe = useMemo(() => {
    return integrations.find((i: any) => i.provider === 'stripe');
  }, [integrations]);

  const github = useMemo(() => {
    return integrations.find((i: any) => i.provider === 'github');
  }, [integrations]);;

  const onSubmit = async (data: FieldValues) => {
    const { api_key, endpoint_secret } = data
    mutate({ slug: value?.slug, provider: integrationId.current, key: api_key, endpoint_secret: endpoint_secret })
  };

  const setIntegrationId = (id: string) => {
    integrationId.current = id;
  }

  const processIntegration = (id: string) => {
    setIntegrationId(id)
    toggleIntegrationModal()
  }

  const processDeleteIntegration = (id: string) => {
    setIntegrationId(id)
    toggleDeleteIntegrationModal()
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createIntegration,
    async onSuccess() {
      toast.success("Success created a integration.");
      toggleIntegrationModal();
      reset()
      queryClient.invalidateQueries({ queryKey: ["integrations"] });

    },
    onError(err: any) {
      const { message } = err.response?.data;
      toast.error(message);
    },
  });

  const { isPending: isDeleting, mutate: deleteMutation } = useMutation({
    mutationFn: ({ storeSlug, integrationPublicId }: DeleteIntegrationParams) => deleteIntegration(storeSlug, integrationPublicId),
    onSuccess: async () => {
      toast.success("Integration successfully deleted.");
      toggleDeleteIntegrationModal();
      reset()
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "An error occurred.";
      toast.error(message);
    },
  });

  const deleteIntegrations = (publicId: string) => {
    deleteMutation({ storeSlug: value?.slug as string, integrationPublicId: publicId })
  }


  return (
    <>
      <h3 className="font-semibold text-2xl mb-4 dark:text-white">Integrations</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col px-5 py-10 rounded-2xl w-100 sm:col-span-3 lg:col-span-1 border dark:border-gray-700">
          <div className='mx-auto flex'>
            <div className="relative mx-auto flex size-16 rounded-full *:relative *:m-auto *:size-7 before:absolute before:inset-0 dark:before:border-white/20 dark:before:from-white/10 dark:before:to-transparent dark:before:shadow-gray-950 md:size-24">
              <FaGithub />
            </div>
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-xl font-semibold text-secondary-dark dark:text-white">Github</h2>
            <p className="dark:text-white">Connect your github integration and automatically add customers to your repo.</p>
            <div className="flex justify-center items-center my-16">
              <Button size={'small'} onClick={() => github ? processDeleteIntegration('github') : processIntegration('github')} loading={isLoading}>{github ? 'Disconnect' : 'Connect'}</Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col px-5 py-10 rounded-2xl w-100 sm:col-span-3 lg:col-span-1 border dark:border-gray-700">
          <div className='mx-auto flex'>
            <div className="relative mx-auto flex size-16 rounded-full *:relative *:m-auto *:size-7 before:absolute before:inset-0 dark:before:border-white/20 dark:before:from-white/10 dark:before:to-transparent dark:before:shadow-gray-950 md:size-24">
              <FaStripeS />
            </div>
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-xl font-semibold text-secondary-dark dark:text-white">Stripe</h2>
            <p className="dark:text-white">Connect your stripe integration and start accepting payments.</p>
            <div className="flex justify-center items-center my-16 space-x-5">
              <Button size={'small'} onClick={() => stripe ? processDeleteIntegration('stripe') : processIntegration('stripe')} loading={isLoading}>{stripe ? 'Disconnect' : 'Connect'}</Button>
              {stripe && <Button size={'small'} onClick={() => { 
                copy(`${BASE_URL}merchants/stripe_webhook/${value?.slug}`)
                toast.success("Webhook url copied.")
              }}>Copy webhook url</Button>}
            </div>
          </div>
        </div>
      </div>
      <Modal isShown={modals.createIntegrationModal} onClose={toggleIntegrationModal} title={`Add ${capitalize(integrationId.current)} integration`}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            placeHolder="API key"
            type="text"
            name="api_key"
            register={register}
            errors={errors}
            validationSchema={{
              required: "API key is required"
            }}
          />
          {integrationId.current === 'stripe' && <Input
            placeHolder="Endpoint Secret"
            type="text"
            name="endpoint_secret"
            register={register}
            errors={errors}
            validationSchema={{
              required: "Webhook Key Secret is required"
            }}
          />}
          <Button className='w-full my-2' variant={'dark'} loading={isPending} disabled={isPending}>
            Add Integration
          </Button>
        </Form>
      </Modal>
      <Modal isShown={modals.deleteIntegrationModal} onClose={toggleDeleteIntegrationModal}>
        <div className="flex flex-col items-center space-y-8">
          <AlertOctagon size={"20%"} />
          <p className='text-center'>Are you sure you want to delete this integration?</p>
          <div className='flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-2 mt-5 w-full'>
            <Button onClick={() => deleteIntegrations(integrationId.current === 'stripe' ? stripe?.public_id : github?.public_id)} loading={isDeleting} size={'full'}>Yes</Button>
            <Button variant='outline' onClick={toggleDeleteIntegrationModal} size={'full'}>No, take me back.</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
