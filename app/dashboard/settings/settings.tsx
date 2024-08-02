"use client"

import { Button, FileUploadButton, ImagePreview, Input, Modal, TextArea } from '@/components/ui'
import { CURRENT_STORE } from '@/config/app'
import { useModals, useSessionStorage } from '@/hooks'
import React, { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { FieldValues, useForm } from 'react-hook-form'
import { changeStoreLogo, updateStore } from '@/endpoints'
import { toast } from 'sonner'
import { Pencil } from 'lucide-react'
import Image from 'next/image';

export default function Settings() {

  const { modals, updateModals } = useModals();

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const { value, updateValue } = useSessionStorage<{ name: string, public_id: string, slug: string, description: string, logo_url: string }>(CURRENT_STORE);

  const onSubmit = async (data: FieldValues) => {
    const { name, description } = data;
    mutate({ name, description, public_id: value?.public_id })
  }

  const { isPending, mutate } = useMutation({
    mutationFn: updateStore,
    async onSuccess({ data }) {
      updateValue({ ...data });
      toast.success("Store successfully updated")
    },
    onError(err: any) {
      const { message } = err.response?.data;
      toast.error(message);
    },
  })

  useEffect(() => {
    if (value) {
      reset({
        name: value?.name,
        description: value?.description,
      })
    }
  }, [reset, value])

  const [selectedGalaryFile, setSelectedGalaryFile] = useState<File[]>([]);

  const toggleEditStoreImageModal = () => updateModals({ editStoreImageModal: !modals.editStoreImageModal });

  useEffect(() => {
    setSelectedGalaryFile([])
  }, [modals])

  const removeGalleryFile = (fileToRemove: File) => {
    setSelectedGalaryFile(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };

  const handleSelectMultipleFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedGalaryFile(prevFiles => {
        const existingFileNames = new Set(prevFiles.map(file => file.name));
        const uniqueNewFiles = newFiles.filter(file => !existingFileNames.has(file.name));
        return [...uniqueNewFiles, ...prevFiles];
      });
    }
  };

  const { isPending: isChangingLogo, mutate: changeStoreLogoAction } = useMutation({
    mutationFn: changeStoreLogo,
    async onSuccess({ data }) {
      updateValue({ ...data });
      toast.success("Image Successfully changed.")
      toggleEditStoreImageModal()
    },
    onError(err: any) {
      const { message } = err.response?.data;
      toast.error(message);
    },
  })

  const changeStoreLogoFunc = () => {
    const form = new FormData()
    if (selectedGalaryFile) selectedGalaryFile.forEach((file: File, _: number) => form.append('file', file))
    changeStoreLogoAction({ public_id: value!.public_id, formData: form })
  }

  return (
    <div className="max-w-[30rem]">
      <h3 className="font-semibold text-2xl mb-4 dark:text-white">Update Store</h3>
      <div className="relative w-20 h-20 mb-7">
        <Image
          src={value?.logo_url as string}
          layout="fill"
          objectFit="cover"
          alt="Description of the image"
          className="object-cover rounded-lg cursor-pointer"
        />
        <button
          type="button"
          onClick={toggleEditStoreImageModal}
          className="absolute top-1 right-2 bg-secondary-dark text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
          aria-label="Remove image"
        >
          <Pencil size={16} />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Name"
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
          label="Description"
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
        <Button size={"full"} variant={"dark"} loading={isPending}>
          Update store
        </Button>
      </form>
      <Modal isShown={modals.editStoreImageModal} onClose={toggleEditStoreImageModal} title='Change store logo'>
        <div>
          <div className="flex flex-wrap flex-col gap-4 mb-4 items-center">
            {selectedGalaryFile.map((file, index) => (
              <ImagePreview
                key={`${file.name}-${index}`}
                file={file}
                isRemoveButtonVisible={true}
                onRemove={() => removeGalleryFile(file)}
              />
            ))}
            {selectedGalaryFile.length <= 0 && <FileUploadButton
              onFileSelect={handleSelectMultipleFiles}
              accept=".jpg,.png,.pdf"
              variant="outline"
              size="small"
            >
              Add Store Logo
            </FileUploadButton>}
          </div>
          <div className='flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-2 mt-10'>
            <Button onClick={changeStoreLogoFunc} loading={isChangingLogo} size={'full'}>Yes</Button>
            <Button variant='outline' onClick={toggleEditStoreImageModal} size={'full'}>No, take me back.</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
