import { Box, Layers, ClipboardList, Users, CreditCard, BarChart2 } from 'lucide-react';

const products = [
  {
    title: 'Online Store Builder',
    desc: 'Build a beautiful, mobile-friendly storefront without any coding.',
    icon: Box,
  },
  {
    title: 'Product Management',
    desc: 'Add, edit and organize products with images, prices and categories.',
    icon: ClipboardList,
  },
  {
    title: 'Order Tracking',
    desc: 'Track incoming orders, update statuses and manage fulfillment.',
    icon: Layers,
  },
  {
    title: 'Customer Dashboard',
    desc: 'View customer details, order history and contact information in one place.',
    icon: Users,
  },
  {
    title: 'Payment Integration (coming soon)',
    desc: 'Secure payments via multiple providers — coming soon.',
    icon: CreditCard,
  },
  {
    title: 'Store Analytics',
    desc: 'Get insights on visits, orders and revenue to grow your business.',
    icon: BarChart2,
  },
];

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold">Products</h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Everything you need to launch and run a local online store.
        </p>
      </header>

      <main>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const Icon = p.icon as any;
            return (
              <article
                key={p.title}
                className="p-6 bg-white rounded-lg border transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-md bg-orange-50 inline-flex items-center justify-center">
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                </div>
                <p className="mt-4 text-gray-600">{p.desc}</p>
              </article>
            );
          })}
        </section>

        {/* CTA section */}
       
      </main>
    </div>
  );
}
