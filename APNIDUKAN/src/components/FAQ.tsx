import React from 'react';

const QA: React.FC<{q:string,a:string}> = ({ q, a }) => (
  <div>
    <h4 className="font-semibold">{q}</h4>
    <p className="mt-1 text-gray-600">{a}</p>
  </div>
);

const FAQ: React.FC = () => {
  const items = [
    { q: 'How long does setup take?', a: 'You can create your shop in under 10 minutes with our guided flow.' },
    { q: 'Is there a transaction fee?', a: 'Free plan has no platform fee; Pro adds advanced features.' },
    { q: 'Can I use my own branding?', a: 'Yes — Pro supports custom branding and listing features.' },
    { q: 'How do customers place orders?', a: 'Customers place orders via the listing; you receive notifications and manage them from the dashboard.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Frequently asked questions</h2>
      </div>
      <div className="grid gap-4">
        {items.map((it, i) => <QA key={i} q={it.q} a={it.a} />)}
      </div>
    </div>
  );
};

export default FAQ;
