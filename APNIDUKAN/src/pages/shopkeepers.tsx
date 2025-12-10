import { motion } from 'framer-motion';
import { ShoppingCart, ArrowUpRight, CheckCircle, User, Image, Smartphone } from 'lucide-react';

const benefits = [
  {
    title: 'Grow your sales',
    desc: 'Reach more customers in your area and increase repeat orders with an online presence.',
    icon: ArrowUpRight,
  },
  {
    title: 'Accept online orders',
    desc: 'Receive and manage orders from customers directly — fast and reliable.',
    icon: ShoppingCart,
  },
  {
    title: 'Build trust',
    desc: 'Show verified shop information and collect reviews to earn customer confidence.',
    icon: CheckCircle,
  },
  {
    title: 'Zero tech knowledge needed',
    desc: 'We handle the tech — you focus on your shop. Simple onboarding and helpful support.',
    icon: User,
  },
  {
    title: 'Upload product photos easily',
    desc: 'Add attractive photos from your phone to showcase what you sell.',
    icon: Image,
  },
  {
    title: 'Works on mobile',
    desc: 'Built to work smoothly on any phone so you can manage your shop on-the-go.',
    icon: Smartphone,
  },
];

function Shopkeepers() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold">Made for Local Shopkeepers</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Simple tools to list products, accept orders, and grow your local business — no technical skills required.
        </p>
      </motion.section>

      {/* Benefits grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => {
            const Icon = b.icon as any;
            return (
              <article
                key={b.title}
                className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-50 rounded-md inline-flex items-center justify-center">
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-semibold">{b.title}</h3>
                </div>
                <p className="mt-4 text-gray-600">{b.desc}</p>
              </article>
            );
          })}
        </div>
      </section>
       <section className="mt-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to take your shop online?</h2>
          <a
            href="/get-started"
            className="inline-block mt-6 bg-orange-500 text-white px-8 py-3 rounded-lg shadow hover:bg-orange-600 transition-colors"
          >
            Get Started
          </a>
        </section>
    </div>
  );
}

export default Shopkeepers;
