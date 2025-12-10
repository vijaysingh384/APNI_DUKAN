import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/5 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card>
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-6"
            >
              <div className="text-8xl font-bold text-orange-500 mb-4">404</div>
              <Search className="w-16 h-16 text-gray-400 mx-auto" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
            <p className="text-gray-600 mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/')}>
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button variant="outline" onClick={() => navigate('/shops')}>
                Browse Shops
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

