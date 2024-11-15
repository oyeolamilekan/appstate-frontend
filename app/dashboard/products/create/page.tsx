"use client"

import { Button, ImagePreview, Input, FileUploadButton, TextArea } from '@/components/ui'
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useSessionStorage } from "@/hooks";
import { CURRENT_STORE } from '@/config/app'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createProduct } from '@/endpoints'
import { formatPrice, removeCommasAndConvertToNumber, validateGitHubRepoUrl } from '@/lib'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm()

  const { value } = useSessionStorage<{ name: string, public_id: string, slug: string }>(CURRENT_STORE);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [selectedGalaryFile, setSelectedGalaryFile] = useState<File[]>([]);

  const onSubmit = async (data: FieldValues) => {
    const { name, description, repo_link, price } = data;
    const form = new FormData();
    form.append('name', name);
    form.append('description', description);
    form.append('repo_link', repo_link);
    form.append('price', removeCommasAndConvertToNumber(price));
    if (!selectedFile) return toast.error("Product thumbnail is required.");
    if (selectedGalaryFile.length <= 0) return toast.error("Please upload atleast on image gallery.");
    if (selectedGalaryFile) selectedGalaryFile.forEach((file: File, index: number) => form.append(`files[${index}]`, file))
    if (selectedFile) form.append('file', selectedFile)
    mutate({ slug: value?.slug as string, formData: form });
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
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

  const { isPending, mutate } = useMutation({
    mutationFn: createProduct,
    async onSuccess() {
      toast.success("Successfully create product.")
      router.push('/dashboard/products')
    },
    onError(err: any) {
      const { message } = err.response?.data;
      toast.error(message)
    },
  })

  const removeThumbnail = () => {
    setSelectedFile(null)
  }

  const removeGalleryFile = (fileToRemove: File) => {
    setSelectedGalaryFile(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };

  return (
    <div className='overflow-y-auto h-screen'>
      <div className="max-w-[30rem]">
        <h3 className="font-semibold text-2xl mb-4 dark:text-white">Create Product</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label='Name'
            placeHolder="Name of your software"
            type="text"
            name="name"
            register={register}
            errors={errors}
            validationSchema={{
              required: "Email is required",
            }}
          />
          <Input
            label='Price'
            placeHolder="Price of your software"
            type="text"
            name="price"
            register={register}
            errors={errors}
            onChange={(e) => {
              e.target.value = formatPrice(e.target.value)
            }}
            validationSchema={{
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
            }}
          />
          <Input
            label='Repo'
            placeHolder="Github of your software"
            type="text"
            name="repo_link"
            register={register}
            errors={errors}
            validationSchema={{
              required: "Repo Link is required",
              validate: validateGitHubRepoUrl
            }}
          />
          <TextArea
            label='Description'
            placeHolder="Description of your software"
            name="description"
            register={register}
            errors={errors}
            validationSchema={{
              required: "Description is required",
            }}
          />
          <ImagePreview 
            file={selectedFile} 
            onRemove={removeThumbnail}
            isRemoveButtonVisible={false}
           />
          <FileUploadButton
            onFileSelect={handleFileSelect}
            accept=".jpg,.png,.pdf"
            multiple
            variant="outline"
            size="small"
          >
            {selectedFile?.name ?? "Add Product thumbnail"}
          </FileUploadButton>
          <br />
          <div className="flex flex-wrap gap-4">
            {selectedGalaryFile.map((file, index) => (
              <ImagePreview
                key={`${file.name}-${index}`}
                file={file}
                isRemoveButtonVisible={true}
                onRemove={() => removeGalleryFile(file)}
              />
            ))}
          </div>
          <br />
          <FileUploadButton
            onFileSelect={handleSelectMultipleFiles}
            accept=".jpg,.png,.pdf"
            multiple
            variant="outline"
            size="small"
          >
            {selectedGalaryFile.length <= 0 ? "Add Product Gallery" : `${selectedGalaryFile.length} selected image`}
          </FileUploadButton>
          <br />
          <br />
          <Button loading={isPending} size={'full'}>Create</Button>
        </form>
      </div>
    </div>
  )
}
