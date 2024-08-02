"use client"

import { addImage, changeProductLogo, deleteProduct, fetchProduct, fetchProductByPublicId, removeImage, updateProduct } from '@/endpoints'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2, UploadCloud } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import { Button, CustomSupense, FileUploadButton, ImagePreview, Modal, Gallery, Input, TextArea } from '@/components/ui'
import { toast } from 'sonner'
import { FieldValues, useForm } from 'react-hook-form'
import { formatPrice, removeCommasAndConvertToNumber, validateGitHubRepoUrl } from '@/lib'
import { useModals, useSessionStorage } from '@/hooks'
import { CURRENT_STORE } from '@/config/app'


type Props = {
  params: {
    slug: string
  }
}

const Page = ({ params: { slug } }: Props) => {
  const { value } = useSessionStorage<{ name: string, public_id: string, slug: string }>(CURRENT_STORE);

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const imageUrl = useRef<string>();

  const queryClient = useQueryClient();

  const { modals, updateModals } = useModals();

  const toggleDeleteProductModal = () => updateModals({ deleteProductModal: !modals.deleteProductModal })

  const toggleRemoveImageModal = () => updateModals({ removeImageModal: !modals.removeImageModal })

  const toggleAddImageModal = () => updateModals({ addImageModal: !modals.addImageModal })

  const toggleEditProductModal = () => updateModals({ editProductModal: !modals.editProductModal })

  const toggleChangeProductLogoModal = () => updateModals({ changeProductLogoModal: !modals.changeProductLogoModal })

  const [selectedGalaryFile, setSelectedGalaryFile] = useState<File[]>([]);

  const router = useRouter()

  const { isLoading, isError, data } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductByPublicId(slug as string),
    enabled: slug != null,
    retry: false,
  });


  useEffect(() => {
    if (data) {
      reset({
        name: data?.data?.name,
        description: data?.data?.description,
        price: formatPrice(data?.data?.price),
        repo_link: data?.data?.repo_link,
      })
    }
  }, [data, reset])

  useEffect(() => {
    setSelectedGalaryFile([])
  }, [modals])


  const { isPending, mutate } = useMutation({
    mutationFn: () => deleteProduct(slug),
    async onSuccess() {
      toast.success("Successfully deleted product.")
      router.push('/dashboard/products')
    },
    onError(err: any) {
      const { message } = err.response?.data;
      toast.error(message);
    },
  })

  const { isPending: isChangingLogo, mutate: changeProductLogoAction } = useMutation({
    mutationFn: changeProductLogo,
    async onSuccess() {
      toast.success("Image Successfully changed.")
      queryClient.invalidateQueries({ queryKey: ["product", slug] });
      toggleChangeProductLogoModal()
    },
    onError(err: any) {
      const { message } = err.response?.data;
      toast.error(message);
    },
  })


  const { isPending: isRemovingImage, mutate: removeImageAction } = useMutation({
    mutationFn: removeImage,
    async onSuccess() {
      toast.success("Image Successfully deleted.")
      queryClient.invalidateQueries({ queryKey: ["product", slug] });
      toggleRemoveImageModal()
    },
    onError(err: any) {
      const { message } = err.response?.data;
      toast.error(message);
    },
  })

  const { isPending: isAddingImage, mutate: addImageAction } = useMutation({
    mutationFn: addImage,
    async onSuccess() {
      toast.success("Image Successfully deleted.")
      queryClient.invalidateQueries({ queryKey: ["product", slug] });
      setSelectedGalaryFile([])
      toggleAddImageModal()
    },
    onError(err: any) {
      const { message } = err.response?.data;
      toast.error(message);
    },
  })

  const { isPending: isUpdatingProduct, mutate: updatingProductAction } = useMutation({
    mutationFn: updateProduct,
    async onSuccess() {
      toast.success("Product Successfully updated.")
      queryClient.invalidateQueries({ queryKey: ["product", slug] });
      toggleEditProductModal()
    },
    onError(err: any) {
      const { message } = err.response?.data;
      toast.error(message);
    },
  })

  const toggleImageUrl = (url: string) => {
    imageUrl.current = url;
    toggleRemoveImageModal()
  }

  const deleteImage = (image_url: string, product_slug: string) => {
    removeImageAction({ image_url, product_slug })
  }

  const addImageFunc = () => {
    const form = new FormData()
    if (selectedGalaryFile) selectedGalaryFile.forEach((file: File, index: number) => form.append(`files[${index}]`, file))
    addImageAction({ slug: slug, formData: form })
  }

  const changeProductLogoFunc = () => {
    const form = new FormData()
    if (selectedGalaryFile) selectedGalaryFile.forEach((file: File, index: number) => form.append('file', file))
    changeProductLogoAction({ public_id: slug as string, formData: form })
  }

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

  const removeGalleryFile = (fileToRemove: File) => {
    setSelectedGalaryFile(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };

  const onSubmit = async (data: FieldValues) => {
    const { name, description, repo_link, price } = data;
    updatingProductAction({ storeSlug: value?.slug, productSlug: slug, name, description, repo_link, price: removeCommasAndConvertToNumber(price) })
  }

  return (
    <div>
      <CustomSupense
        isLoading={isLoading}
        isError={isError}
      >
        <div className="relative w-20 h-20 mb-7">
          <Image
            src={data?.data?.image_url}
            layout="fill"
            objectFit="cover"
            alt="Description of the image"
            className="object-cover rounded-lg cursor-pointer"
          />
          <button
            type="button"
            onClick={toggleChangeProductLogoModal}
            className="absolute top-2 right-2 bg-secondary-dark text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
            aria-label="Remove image"
          >
            <Pencil size={16} />
          </button>
        </div>
        <h1 className="text-3xl font-semibold mb-5">{data?.data?.name}</h1>
        <div className="flex space-x-2 mb-4">
          <Button className="h-9" variant={"danger"} onClick={toggleDeleteProductModal} loading={isPending}><Trash2 height={17} /> Delete</Button>
          <Button className="h-9" onClick={toggleEditProductModal}><Pencil height={17} className="mr-1" /> Edit</Button>
        </div>
        <p>{data?.data?.description}</p>
        <div className="flex my-5 justify-between">
          <h5 className="font-semibold text-xl my-1">Screenshots {data?.data?.gallery_imaages.length}</h5>
          <Button className="h-9" onClick={toggleAddImageModal}><UploadCloud height={17} /> Add Image</Button>
        </div>
        <Gallery images={data?.data?.gallery_imaages ?? []} isRemoveButtonVisible={true} onDelete={(url: string) => toggleImageUrl(url)} />
      </CustomSupense>
      <Modal isShown={modals.deleteProductModal} onClose={toggleDeleteProductModal}>
        <>
          <p className='text-center'>Are you sure you want to delete this product?</p>
          <div className='flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-2 mt-10'>
            <Button onClick={() => mutate()} loading={isPending} size={'full'}>Yes</Button>
            <Button variant='outline' onClick={toggleDeleteProductModal} size={'full'}>No, take me back.</Button>
          </div>
        </>
      </Modal>
      <Modal isShown={modals.changeProductLogoModal} onClose={toggleRemoveImageModal}>
        <>
          <p className='text-center'>Are you sure you want to remove this image?</p>
          <div className='flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-2 mt-10'>
            <Button onClick={() => deleteImage(imageUrl.current as string, slug)} loading={isRemovingImage} size={'full'}>Yes</Button>
            <Button variant='outline' onClick={toggleRemoveImageModal} size={'full'}>No, take me back.</Button>
          </div>
        </>
      </Modal>
      <Modal isShown={modals.changeProductLogoModal} onClose={toggleChangeProductLogoModal} title='Change image logo'>
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
              Add Product Logo
            </FileUploadButton>}
          </div>
          <div className='flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-2 mt-10'>
            <Button onClick={changeProductLogoFunc} loading={isChangingLogo} size={'full'}>Yes</Button>
            <Button variant='outline' onClick={toggleChangeProductLogoModal} size={'full'}>No, take me back.</Button>
          </div>
        </div>
      </Modal>
      <Modal isShown={modals.addImageModal} onClose={toggleAddImageModal} title='Add image'>
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
              Add Product Gallery
            </FileUploadButton>}
          </div>
          <div className='flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-2 mt-10'>
            <Button onClick={addImageFunc} loading={isAddingImage} size={'full'}>Yes</Button>
            <Button variant='outline' onClick={toggleAddImageModal} size={'full'}>No, take me back.</Button>
          </div>
        </div>
      </Modal>
      <Modal isShown={modals.editProductModal} onClose={toggleEditProductModal} title="Update product">
        <>
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
            <Button loading={isUpdatingProduct} size={'full'}>Update</Button>
          </form>
        </>
      </Modal>
    </div>
  )
}

export default Page; 
