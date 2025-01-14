import { Code2Icon, Sparkles } from "lucide-react";
import { Button } from "../ui";
import React from 'react'
import { pushToNewTab } from "@/lib";

export function Hero() {

  return (
    <>
      <section className="flex flex-col items-center md:my-36 my-9 p-3">
        <h1 className="md:text-6xl text-3xl font-semibold text-center max-w-6x dark:text-white">A Storefront to sell your code.</h1>
        <p className="my-6 text-lg max-w-4xl text-center text-gray-500 dark:text-gray-300">An easy way to sell your code without the hassle of complicated workflows. Focus on creating amazing product while we take care of the details.</p>
        <Button className="md:my-3 my-2 w-40 p-3 space-x-12 group" variant={'dark'} onClick={() => pushToNewTab("https://github.com/oyeolamilekan/appstate-frontend")}>
          <Code2Icon className="mr-2"/> View Code
        </Button>
      </section>
    </>
  )
}
