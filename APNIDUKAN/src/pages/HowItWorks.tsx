import React from 'react';
import RadialOrbitalTimeline from '../components/ui/radial-orbital-timeline';
import Footer from '@/components/Footer';

const Step: React.FC<{index:number; title:string; desc:string}> = ({ index, title, desc }) => (
  <div className="flex-1">
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white font-bold">{index}</div>
    <h4 className="mt-4 font-semibold">{title}</h4>
    <p className="mt-2 text-gray-600">{desc}</p>
  </div>
);

const HowItWorks = () => {
  // sample data for the timeline demo
  const timelineData = [
    {
      id: 1,
      title: 'Shop Signup',
      date: 'Jan 2024',
      content: 'Create your shop profile and verify basic details.',
      category: 'Signup',
      icon: (props: any) => <svg {...props} />, // placeholder svg
      relatedIds: [2],
      status: 'completed' as const,
      energy: 100,
    },
    {
      id: 2,
      title: 'Add Products',
      date: 'Feb 2024',
      content: 'Add products with images, prices and descriptions.',
      category: 'Products',
      icon: (props: any) => <svg {...props} />,
      relatedIds: [1, 3],
      status: 'in-progress' as const,
      energy: 80,
    },
    {
      id: 3,
      title: 'Start Selling',
      date: 'Mar 2024',
      content: 'Publish your shop and receive local orders.',
      category: 'Selling',
      icon: (props: any) => <svg {...props} />,
      relatedIds: [2],
      status: 'pending' as const,
      energy: 40,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">How it works</h2>
        <p className="mt-2 text-gray-600">Get set up and start selling in three simple steps.</p>
      </div>

      <div className="mb-12">
        {/* keep the textual 3-step flow above or alongside the timeline as needed */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <Step index={1} title="Shop Signup" desc="Create your shop profile and verify basic details." />
          <Step index={2} title="Add Products" desc="Add products with images, prices and descriptions." />
          <Step index={3} title="Start Selling" desc="Publish your shop and receive local orders." />
        </div>

        {/* Radial orbital timeline demo (dark full-screen section) */}
        <div className="rounded-lg overflow-hidden">
          <RadialOrbitalTimeline timelineData={timelineData} />
        </div>
      </div>
      <Footer />
    </div>
   
  );
};

export default HowItWorks;
