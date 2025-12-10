import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button5 } from '@/components/ui/button-5';
import { MediaButton } from '@/components/ui/media-button';
import TextLoop from '@/components/ui/text-loop';
import { ImagePlayer } from '@/components/ui/image-player';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-16">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-sans leading-tight">
            Bring your shop online — <TextLoop className="inline-block font-sans">{['in minutes.', 'today.', 'effortlessly.'].map((t)=> <span key={t}>{t}</span>)}</TextLoop>
          </h1>
          <p className="mt-4 text-gray-600 max-w-xl">Create a beautiful shop listing, get discovered by local customers, and manage orders easily — no code required.</p>

          <div className="mt-8 flex gap-3 flex-wrap">
            <Button5
              onClick={() => navigate('/create-shop')}
              hoverText="Get Started"
              hoverBgColor="bg-orange-500"
              showIcon
              className="w-auto min-w-[160px] font-sans"
            >
              Submit Your Shop
            </Button5>
            <MediaButton
              label="Browse Shops"
              mediaUrl="https://media.tenor.com/8olq8_f0kdQAAAAi/sports-sportsmanias.gif"
              onClick={() => navigate('/shops')}
              className="font-sans"
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-gradient-to-tr from-white to-gray-50 rounded-xl shadow-lg p-6">
            <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
              <ImagePlayer
                images={[
                  'https://cdn.pixabay.com/photo/2017/06/22/18/06/indian-boy-2431906_1280.jpg',
                  'https://cdn.pixabay.com/photo/2018/04/13/17/09/people-3317048_1280.jpg',
                  'https://cdn.pixabay.com/photo/2020/03/03/11/37/india-4898438_1280.jpg',
                  'https://cdn.pixabay.com/photo/2019/03/21/20/16/india-4071840_1280.jpg',
                  'https://cdn.pixabay.com/photo/2015/05/21/14/42/singapore-777315_1280.jpg'
                ]}
                interval={3000}
                loop={true}
                renderImage={(src) => (
                  <img
                    src={src}
                    alt="Shop showcase"
                    className="object-cover w-full h-full rounded-sm transition-opacity duration-500"
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
