import React from 'react';
import FlippingCard from '@/components/ui/flipping-card';

const Features: React.FC = () => {
  const items = [
    {
      title: 'Create your shop in 5 minutes',
      desc: 'A guided setup helps you list products quickly and easily.',
      imageSrc: 'https://images.unsplash.com/photo-1536662788222-6927ce05daea?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHRpbWV8ZW58MHx8MHx8fDA%3D',
      imageAlt: 'Quick setup',
    },
    {
      title: 'Local discovery',
      desc: 'Reach nearby customers who are searching for products like yours.',
      imageSrc: 'https://plus.unsplash.com/premium_photo-1682310091073-440a9483c983?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fGN1c3RvbWVyfGVufDB8fDB8fHww',
      imageAlt: 'Local discovery',
    },
    {
      title: 'Order management',
      desc: 'Accept and manage orders from a single dashboard.',
      imageSrc: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=60&auto=format&fit=crop',
      imageAlt: 'Order management',
    },
    {
      title: 'Built for small shops',
      desc: 'Simple, affordable and reliable tools for small businesses.',
      imageSrc: 'https://images.unsplash.com/photo-1613549276959-dfbb5199ff5d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNtYWxsJTIwc2hvcHMlMjBpbmRpYW58ZW58MHx8MHx8fDA%3D',
      imageAlt: 'Small shop',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8" id="features">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Key benefits</h2>
        <p className="mt-2 text-gray-600">Everything you need to sell locally and grow your shop.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {items.map((it) => (
          <FlippingCard
            key={it.title}
            width={300}
            height={220}
            frontContent={
              <div className="flex flex-col h-full w-full p-4">
                <img src={(it as any).imageSrc} alt={(it as any).imageAlt} loading="lazy" decoding="async" className="w-full h-20 object-cover rounded-md mb-3" />
                <div className="flex-grow">
                  <h3 className="text-md font-semibold">{it.title}</h3>
                  <p className="mt-2 text-gray-600">{it.desc}</p>
                </div>
              </div>
            }
            backContent={
              <div className="flex flex-col items-center justify-center h-full w-full p-4">
                <p className="text-sm text-muted-foreground text-center">Learn more about how this helps your shop.</p>
                <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded">Learn</button>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Features;
