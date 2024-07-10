"use client";

import { Button, Form, Input, Modal } from "@/components/ui";
import CustomSupense from "@/components/ui/custom-suspense";
import { CURRENT_STORE } from "@/config/app";
import { createStore, fetchStores } from "@/endpoints/stores";
import { useSessionStorage } from "@/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BoxIcon } from "lucide-react";
import React, { useReducer } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { TextArea } from "@/components/ui/textarea";
import { redirectUrl } from "@/lib";


export default function Stores() {
  const { updateValue } = useSessionStorage(CURRENT_STORE);

  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const initState = { createStoreModal: false };

  const [modals, updateModals] = useReducer(
    (
      prev: typeof initState,
      next: Partial<typeof initState>,
    ): typeof initState => {
      return { ...prev, ...next };
    },
    initState,
  );

  const { isLoading, isError, data } = useQuery({
    queryKey: ["stores"],
    queryFn: fetchStores,
    retry: false,
  });

  const { isPending, mutate } = useMutation({
    mutationFn: createStore,
    async onSuccess() {
      reset();
      toast.success("Success created a store.");
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      toggleStoreModal();
    },
    onError(err: any) {
      const { message } = err.response?.data;
      toast.error(message);
    },
  });

  const onSubmit = async (data: FieldValues) => {
    const { name, description } = data;
    mutate({ name, description });
  };

  const toggleStoreModal = () =>
    updateModals({ createStoreModal: !modals.createStoreModal });

  const addCurrentStore = (data: any) => {
    updateValue(data)
    redirectUrl("/dashboard/home")
  }

  return (
    <div className="max-w-lg m-auto mt-10">
      <div className="p-5 rounded-xl md:m-0 m-3 shadow-md dark:shadow-white/20">
        <h3 className="text-2xl font-semibold mb-5 text-center dark:text-white">Your Stores</h3>
        <CustomSupense
          isLoading={isLoading}
          isError={isError}
          isEmpty={data?.data.length <= 0}
          fallBackEmpty={
            <div className="flex flex-col items-center mx-4">
              <div className="p-5 rounded-full dark:bg-neutral-800 bg-secondary">
                <BoxIcon />
              </div>
              <p className="m-3 font-medium dark:text-white">You have no store.</p>
            </div>
          }
        >
          {data?.data.map((store: any) => (
            <div key={store.id} className="my-3 flex space-x-4 cursor-pointer" onClick={() => addCurrentStore(store)}>
              <div className="text-lg font-semibold bg-secondary rounded-full w-[50px] h-[50px] flex items-center justify-center uppercase mt-[5px] dark:bg-neutral-700">
                {store?.name[0]}
              </div>
              <div>
                <h1 className="text-lg dark:text-white">{store?.name}</h1>
                <p className="text-gray-500">{store?.public_id}</p>
              </div>
            </div>
          ))}
        </CustomSupense>
        <Button
          size={"full"}
          className="mt-2"
          onClick={toggleStoreModal}
          loading={isPending}
        >
          Create Store
        </Button>
      </div>
      <Modal
        isShown={modals.createStoreModal}
        title="Create store"
        onClose={toggleStoreModal}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            placeHolder="Store name"
            type="text"
            name="name"
            register={register}
            errors={errors}
            validationSchema={{
              required: "Store is required",
              minLength: {
                value: 6,
                message: "Store name is too short.",
              },
            }}
          />
          <TextArea
            placeHolder="Store Description"
            name="description"
            register={register}
            errors={errors}
            validationSchema={{
              required: "Store description is required",
              minLength: {
                value: 6,
                message: "Store description is too short.",
              },
            }}
          />
          <Button size={"full"} variant={"dark"}>
            Create
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
