import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useStore } from '@/store/useStore';
import { useState } from 'react';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  } = useStore();
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const cartTotal = getCartTotal();
  const itemCount = getCartItemCount();

  const handleRemoveItem = async (itemId: string) => {
    // Optimistic update - remove immediately
    setRemovingItemId(itemId);
    removeFromCart(itemId);
    
    try {
      // Simulate API call in background
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      // Could revert on error if needed
    } finally {
      setRemovingItemId(null);
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    // Optimistic update - update immediately
    setUpdatingItemId(itemId);
    updateCartItemQuantity(itemId, quantity);
    
    try {
      // Simulate API call in background
      await new Promise((resolve) => setTimeout(resolve, 150));
    } catch (error) {
      // Could revert on error if needed
    } finally {
      setUpdatingItemId(null);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-muted/5 flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto px-6">
          <ShoppingCart className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button onClick={() => navigate('/shops')}>
            Browse Shops
          </Button>
        </div>
      </div>
    );
  }

  // Group items by shop
  const itemsByShop = cart.reduce((acc, item) => {
    if (!acc[item.shopId]) {
      acc[item.shopId] = {
        shopName: item.shopName,
        items: [],
      };
    }
    acc[item.shopId].items.push(item);
    return acc;
  }, {} as Record<string, { shopName: string; items: typeof cart }>);

  return (
    <div className="min-h-screen bg-muted/5 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h1>
          {cart.length > 0 && (
            <Button variant="ghost" onClick={clearCart}>
              Clear Cart
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {Object.entries(itemsByShop).map(([shopId, shopData]) => (
              <Card key={shopId}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">{shopData.shopName}</h3>
                  <div className="space-y-4">
                    {shopData.items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-4 pb-4 border-b last:border-0"
                      >
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&auto=format&fit=crop'}
                          alt={item.productName}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{item.productName}</h4>
                          <p className="text-sm text-gray-600 mb-2">{item.shopName}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 border rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                disabled={updatingItemId === item.id}
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              >
                                {updatingItemId === item.id ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  <Minus className="w-4 h-4" />
                                )}
                              </Button>
                              <span className="w-8 text-center font-semibold">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                disabled={updatingItemId === item.id}
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              >
                                {updatingItemId === item.id ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  <Plus className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                            <span className="font-bold text-lg">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removingItemId === item.id}
                          className="text-red-600 hover:text-red-700"
                        >
                          {removingItemId === item.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-orange-600">₹{cartTotal}</span>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full h-12 text-lg"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => navigate('/shops')}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

