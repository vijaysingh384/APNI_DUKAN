import React from 'react';
import { Button } from '@/components/ui/button';

const Plan: React.FC<{name:string, price:string, features:string[]}> = ({ name, price, features }) => (
  <div className="bg-white rounded-xl shadow p-6 flex flex-col">
    <h3 className="text-xl font-semibold">{name}</h3>
    <div className="mt-4 text-3xl font-bold">{price}</div>
    <ul className="mt-4 space-y-2 text-gray-600 flex-1">
      {features.map((f,i) => <li key={i}>• {f}</li>)}
    </ul>
    <div className="mt-6">
      <Button variant="default" className="w-full">Choose</Button>
    </div>
  </div>
);

const Pricing: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Pricing plans</h2>
        <p className="mt-2 text-gray-600">Simple pricing: Free for basic shops, Pro for advanced features.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Plan name="Free" price="$0/mo" features={["Up to 10 products","Basic discovery","Order alerts"]} />
        <Plan name="Pro" price="$19/mo" features={["Unlimited products","Priority listing","Order management dashboard"]} />
      </div>
    </div>
  );
};

export default Pricing;
