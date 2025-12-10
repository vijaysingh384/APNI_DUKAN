import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';
import { validateCheckoutForm } from '@/lib/validation';
import { ordersAPI } from '@/lib/api';
import { useStore } from '@/store/useStore';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { cart, getCartTotal, getCartItemCount, clearCart } = useStore();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'cod',
  });

  const cartTotal = getCartTotal();
  const itemCount = getCartItemCount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateCheckoutForm({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
    });

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsPlacingOrder(true);
    
    try {
      // Get shop info from first item (assuming all items are from same shop)
      const firstItem = cart[0];
      if (!firstItem) {
        throw new Error('Cart is empty');
      }

      const orderData = {
        items: cart.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
        })),
        shopId: firstItem.shopId,
        shopName: firstItem.shopName,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        customerCity: formData.city,
        customerPincode: formData.pincode,
        paymentMethod: formData.paymentMethod,
      };

      await ordersAPI.create(orderData);
      
      setOrderPlaced(true);
      clearCart();
      toast.success('Order placed successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <Button onClick={() => navigate('/cart')}>Go to Cart</Button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-muted/5 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-6"
          >
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/shops')}>
              Continue Shopping
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Go Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <LoadingOverlay isLoading={isPlacingOrder} message="Placing your order..." />
      <div className="min-h-screen bg-muted/5 py-8">
        <div className="max-w-7xl mx-auto px-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/cart')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="House/Flat No., Street"
                    />
                    {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Delhi"
                      />
                      {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="110001"
                      />
                      {errors.pincode && <p className="text-sm text-red-600 mt-1">{errors.pincode}</p>}
                    </div>
                  </div>

                  <div>
                    <Label>Payment Method</Label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                          className="w-4 h-4"
                        />
                        <span>Cash on Delivery</span>
                      </label>
                      <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                        <input
                          type="radio"
                          name="payment"
                          value="online"
                          disabled
                          className="w-4 h-4"
                        />
                        <span>Online Payment (Coming Soon)</span>
                      </label>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg"
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? (
                      <span className="flex items-center justify-center gap-2">
                        <LoadingSpinner size="sm" />
                        Placing Order...
                      </span>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Items ({itemCount})</span>
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

                <div className="space-y-2 text-sm text-gray-600">
                  {cart.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="truncate">{item.productName} x{item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  {cart.length > 3 && (
                    <div className="text-center text-xs text-gray-500">
                      +{cart.length - 3} more items
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

