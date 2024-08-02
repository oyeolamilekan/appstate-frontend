"use client"

import { authenticateUser } from '@/endpoints'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'
import { FieldValues, useForm } from "react-hook-form";
import { Input, Form, Modal, Button } from '@/components/ui'
import { APP_NAME } from '@/config/app'
import { setCookie } from 'cookies-next'
import { useModals, useSessionStorage } from '@/hooks'
import { redirectUrl } from '@/lib'

export default function Login() {
  const { updateValue } = useSessionStorage(APP_NAME);

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const { modals, updateModals } = useModals();

  const toggleSuccessModal = () => updateModals({ successModal: !modals.successModal })

  const onSubmit = async (data: FieldValues) => {
    const { email, password } = data
    mutate({ email, password });
  };

  const { isPending, mutate } = useMutation({
    mutationFn: authenticateUser,
    async onSuccess({ data }) {
      updateValue({ ...data });
      setCookie("token", data.token)
      reset()
      redirectUrl("/dashboard/stores")
    },
    onError(err: any) {
      const { message } = err.response?.data;
      toast.error(message);
    },
  })

  return (
    <div className="h-screen fixed bg-slate-100 dark:bg-neutral-900 w-full">
      <div className="bg-white md:max-w-lg w-[90%]  mx-auto mt-10 shadow shadow-gray-300 rounded-xl px-10 py-8 flex justify-center flex-col dark:bg-black">
        <h3 className="text-xl font-semibold space-x-9 text-center mb-8">Sign in to your account.</h3>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            placeHolder="Email"
            type="email"
            name="email"
            register={register}
            errors={errors}
            validationSchema={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address'
              }
            }}
          />
          <Input
            placeHolder="Password"
            type="password"
            name="password"
            register={register}
            errors={errors}
            validationSchema={{
              required: "Password is required",
              minLength: {
                value: 10,
                message: "Password must be at least 10 characters"
              },
            }}
          />
          <Button className='w-full' variant={'dark'} loading={isPending} disabled={isPending}>
            Sign in
          </Button>
          <p className="mt-5 text-center">
            Don&apos;t have an account? <Link href="/auth/sign-up" className="text-gray-500 underline font-semibold">Sign Up</Link>
          </p>
        </Form>
      </div>
      <Modal isShown={modals.successModal} onClose={toggleSuccessModal}>
        <div className="flex flex-col items-center mb-5">
          <p className="text-center">
            You account has successfully been created, kindly check your mail for activation.
          </p>
        </div>
      </Modal>
    </div>
  )
}

