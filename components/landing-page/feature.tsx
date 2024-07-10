import { AppWindowMac, Rocket, Zap } from "lucide-react"

export function Feature() {
  return (
    <section className="my-5">
      <div className="mx-auto max-w-6xl px-6 text-gray-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col px-5 py-10 rounded-2xl w-100 sm:col-span-3 lg:col-span-1 border dark:border-gray-700">
            <Rocket className="w-40 h-40 mx-auto mb-5" />
            <div className="text-center space-y-2">
              <h2 className="text-xl font-medium text-secondary-dark dark:text-white">Zero Setup</h2>
              <p className="text-gray-700 dark:text-gray-300">Create a store front and start selling apps instantly.</p>
            </div>
          </div>
          <div className="flex flex-col px-5 py-10 rounded-2xl w-100 sm:col-span-3 lg:col-span-1 border dark:border-gray-700">
            <Zap className="w-40 h-40 mx-auto mb-5" />
            <div className="text-center space-y-2">
              <h2 className="text-xl font-medium text-secondary-dark dark:text-white">Sell Your Existing Code</h2>
              <p className="text-gray-700 dark:text-gray-300">Sell access to your code from your private GitHub repo.</p>
            </div>
          </div>
          <div className="flex flex-col px-5 py-10 rounded-2xl w-100 sm:col-span-3 lg:col-span-1 border dark:border-gray-700">
            <AppWindowMac className="w-40 h-40 mx-auto mb-5" />
            <div className="text-center space-y-2">
              <h2 className="text-xl font-medium text-secondary-dark dark:text-white">Manage Customers</h2>
              <p className="text-gray-700 dark:text-gray-300">Manage multiple customers, add and remove customers at will.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
