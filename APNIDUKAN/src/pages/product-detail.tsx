import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { productsAPI, shopsAPI } from '@/lib/api';
import { useStore } from '@/store/useStore';
import { useState, useEffect } from 'react';
import type { Shop } from '@/lib/mockData';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const toast = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [shop, setShop] = useState<Shop | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    
    const loadData = async () => {
      if (!productId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const productResponse = await productsAPI.getById(productId);
        const productData = productResponse.product;
        
        if (!cancelled) {
          setProduct(productData);

          if (productData?.shopId) {
            try {
              const shopResponse = await shopsAPI.getById(productData.shopId);
              if (!cancelled) {
                setShop(shopResponse.shop);
              }
            } catch (error) {
              if (!cancelled) {
                console.error('Failed to load shop:', error);
              }
            }
          }
        }
      } catch (error: any) {
        if (!cancelled) {
          toast.error(error.message || 'Failed to load product');
          setProduct(null);
          setShop(undefined);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    loadData();
    
    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Skeleton className="w-full h-96 rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product not found</h2>
          <Button onClick={() => navigate('/shops')}>Browse Shops</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!product || !shop) return;
    
    setIsAddingToCart(true);
    
    // Optimistic update - add to cart immediately
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: `${product.id}-${Date.now()}-${i}`,
        productId: product.id,
        productName: product.name,
        price: product.price,
        image: product.image,
        shopId: shop.id,
        shopName: shop.shopName,
      });
    }
    
    try {
      // Simulate API call in background
      await new Promise((resolve) => setTimeout(resolve, 300));
      toast.success(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart!`);
      setTimeout(() => navigate('/cart'), 500);
    } catch (error) {
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/5 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/shop/${shop.id}`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {shop.shopName}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  {product.category}
                </span>
                {product.inStock ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    In Stock
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    Out of Stock
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold text-orange-600">
                  ₹{product.price}
                </span>
                {product.stock && (
                  <span className="text-sm text-gray-600">
                    {product.stock} available
                  </span>
                )}
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Shop Information</h3>
                <div
                  className="flex items-center gap-2 text-orange-600 cursor-pointer hover:underline"
                  onClick={() => navigate(`/shop/${shop.id}`)}
                >
                  <span>{shop.shopName}</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </div>
                <p className="text-sm text-gray-600 mt-1">{shop.city}</p>
              </CardContent>
            </Card>

            {product.inStock && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center gap-3 border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    className="flex-1 h-12 text-lg"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <span className="flex items-center justify-center gap-2">
                        <LoadingSpinner size="sm" />
                        Adding...
                      </span>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-600">
                  Total: <span className="font-bold text-lg text-orange-600">
                    ₹{product.price * quantity}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

