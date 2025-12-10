import { motion } from 'framer-motion'
import { User, ShoppingCart, Image, Link as LinkIcon } from 'lucide-react'

const steps = [
  {
    title: 'Enter your shop details',
    desc: 'Name, address, timings and basic info to set up your storefront.',
    Icon: User,
  },
  {
    title: 'Add products',
    desc: 'Create product listings with price, SKU and descriptions.',
    Icon: ShoppingCart,
  },
  {
    title: 'Upload images',
    desc: 'Add attractive photos to showcase each product.',
    Icon: Image,
  },
  {
    title: 'Share your store link',
    desc: 'Send your store URL to customers and on social media.',
    Icon: LinkIcon,
  },
]

export default function GetStarted() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <header className="text-center mb-12">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold leading-tight"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Create Your Online Shop in Minutes
        </motion.h1>
        <motion.p
          className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Follow four simple steps to set up your store, add products, and start sharing with customers.
        </motion.p>
      </header>

      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, idx) => {
          const Icon = s.Icon
          return (
            <motion.article
              key={s.title}
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-md text-indigo-600">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
              </div>
              <p className="mt-3 text-sm text-gray-600">{s.desc}</p>
            </motion.article>
          )
        })}
      </section>
    </div>
  )
}
