import React from 'react';

const Demo: React.FC = () => {
  const images = [
    "https://cdn.pixabay.com/photo/2020/06/09/08/43/plum-5277599_1280.jpg",
    "https://cdn.pixabay.com/photo/2018/05/29/23/18/potato-3440360_1280.jpg",
    "https://cdn.pixabay.com/photo/2017/01/20/15/06/oranges-1995056_1280.jpg",
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Live demo</h2>
        <p className="mt-2 text-gray-600">
          A quick preview of product screens and listings.
        </p>
      </div>

      <div className="overflow-x-auto py-4">
        <div className="flex gap-4 px-2">
          {images.map((img, index) => (
            <div
              key={index}
              className="min-w-[320px] bg-zinc-200 rounded-xl shadow p-4"
            >
              <img
                className="px-4 py-3 rounded-xl object-cover h-60 w-full"
                src={img}
                alt={`Demo ${index + 1}`}
              />

              <div className="text-sm text-gray-600 mt-2 font-sans">
                Screenshot or mockup of the listing and product screens.
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Demo;
