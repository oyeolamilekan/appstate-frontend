import React from 'react'
import { FaStripeS } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa6'

export default function Integrations() {
  return (
    <div className="mx-auto max-w-6xl px-6 text-gray-500 my-44">
      <div className="text-center space-y-5">
        <h1 className="text-3xl font-semibold text-gray-950 dark:text-white">Integrate with your favourite tools</h1>
        <p className="mt-4 text-gray-500 dark:text-gray-300">Out-of-the-box integrations with popular third-party services like Zapier, Notion, and more.</p>
      </div>
      <div className="relative mt-7 items-center justify-center">
        <div className="mx-auto flex w-fit gap-3">
          <div className="relative mx-auto flex size-16  rounded-full border *:relative *:m-auto *:size-7 before:absolute before:inset-0 dark:before:border-white/20 dark:before:from-white/10 dark:before:to-transparent dark:before:shadow-gray-950 md:size-20 dark:border-gray-700">
            <FaStripeS />
          </div>
          <div className="relative mx-auto flex size-16 rounded-full border *:relative *:m-auto *:size-7 before:absolute before:inset-0 dark:before:border-white/20 dark:before:from-white/10 dark:before:to-transparent dark:before:shadow-gray-950 md:size-20 dark:border-gray-700">
            <FaGithub />
          </div>
        </div>
      </div>
    </div>
  )
}
