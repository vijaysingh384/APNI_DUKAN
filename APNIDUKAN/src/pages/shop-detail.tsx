import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Star, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ProductCardSkeleton, Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { shopsAPI, productsAPI } from '@/lib/api';
import { useStore } from '@/store/useStore';
import { useState, useEffect } from 'react';
import type { Product, Shop } from '@/lib/mockData';

export default function ShopDetailPage() {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    
    const loadData = async () => {
      if (!shopId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const [shopResponse, productsResponse] = await Promise.all([
          shopsAPI.getById(shopId),
          productsAPI.getAll({ shopId }),
        ]);
        if (!cancelled) {
          setShop(shopResponse.shop || null);
          setProducts(productsResponse.products || []);
        }
      } catch (error: any) {
        if (!cancelled) {
          toast.error(error.message || 'Failed to load shop data');
          setShop(null);
          setProducts([]);
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
  }, [shopId]);

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/5 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Shop not found</h2>
          <Button onClick={() => navigate('/shops')}>Browse Shops</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async (product: Product) => {
    // Optimistic update - add to cart immediately
    setAddingProductId(product.id);
    addToCart({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      price: product.price,
      image: product.image,
      shopId: shop.id,
      shopName: shop.shopName,
    });
    
    try {
      // Simulate API call in background
      await new Promise((resolve) => setTimeout(resolve, 300));
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setAddingProductId(null);
    }
  };

  return (
    <div className="min-h-screen bg-muted/5">
      {/* Shop Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/shops')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shops
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={shop.logo || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop'}
                  alt={shop.shopName}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{shop.shopName}</h1>
                  {shop.rating && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{shop.rating}</span>
                      </div>
                      {shop.reviewCount && (
                        <span className="text-sm text-gray-600">
                          ({shop.reviewCount} reviews)
                        </span>
                      )}
                      {shop.isVerified && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Verified
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-gray-600">{shop.description}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{shop.address}, {shop.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <a href={`tel:${shop.phone}`} className="text-orange-600 hover:underline">
                      {shop.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{shop.timings}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Products ({products.length})</h2>
          
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'All' : cat}
              </Button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {!product.inStock && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-orange-600">
                          ₹{product.price}
                        </span>
                        {product.stock && (
                          <span className="text-xs text-gray-500">
                            {product.stock} in stock
                          </span>
                        )}
                      </div>
                      <Button
                        className="w-full"
                        disabled={!product.inStock || addingProductId === product.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        {addingProductId === product.id ? (
                          <span className="flex items-center justify-center gap-2">
                            <LoadingSpinner size="sm" />
                            Adding...
                          </span>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

