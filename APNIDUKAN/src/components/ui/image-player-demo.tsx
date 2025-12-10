import { ImagePlayer } from '@/components/ui/image-player';

const IMAGES = [
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1494&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1617869763329-8e8160d32adb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1705675742522-b0bdc228f2ed?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1705615791178-d32cc2cdcd9c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

export default function ImagePlayerDemo() {
  return (
    <div className="h-screen p-12 flex items-center justify-center">
      <ImagePlayer
        images={IMAGES}
        interval={2000}
        renderImage={(src) => (
          <img
            src={src}
            className="size-full h-auto max-h-full max-w-xl object-cover inline-block align-middle rounded-lg"
            alt="showcase"
          />
        )}
      />
    </div>
  );
}

