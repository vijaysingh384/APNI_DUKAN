import { Button5 } from '@/components/ui/button-5';

export const DemoOne = () => {
  return (
    <div className="p-12 flex items-center justify-center gap-4">
      <Button5>Our Work</Button5>
      <Button5 hoverText="Get Started" hoverBgColor="bg-orange-500" showIcon>
        Submit Your Shop
      </Button5>
      <Button5 hoverText="Explore" hoverBgColor="bg-blue-500">
        Browse Shops
      </Button5>
    </div>
  );
};

export default DemoOne;

