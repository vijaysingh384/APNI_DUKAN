import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, CheckCircle, XCircle, Clock, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ListItemSkeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { ordersAPI } from '@/lib/api';
import type { Order } from '@/lib/mockData';

const statusConfig: Record<Order['status'], { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  preparing: { label: 'Preparing', color: 'bg-purple-100 text-purple-800', icon: Package },
  ready: { label: 'Ready', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  delivered: { label: 'Delivered', color: 'bg-green-500 text-white', icon: Truck },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const statusFlow: Order['status'][] = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];

export default function OrderManagementPage() {
  const navigate = useNavigate();
  const toast = useToast();
  
  // Get shop ID from localStorage (in real app, from auth context)
  const shopId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('shop_profile') || '{}')?.id || '1' : '1';
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const response = await ordersAPI.getByShopId(shopId);
        if (!cancelled) {
          setOrders(response.orders || []);
        }
      } catch (error: any) {
        if (!cancelled) {
          toast.error(error.message || 'Failed to load orders');
          setOrders([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    loadOrders();
    
    return () => {
      cancelled = true;
    };
  }, [shopId]);

  const filteredOrders =
    selectedStatus === 'all'
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    // Optimistic update - update immediately
    const originalOrders = [...orders];
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      )
    );

    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      toast.success(`Order ${newStatus} successfully!`);
    } catch (error: any) {
      // Revert on error
      setOrders(originalOrders);
      toast.error(error.message || 'Failed to update order status');
    }
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) return null;
    return statusFlow[currentIndex + 1];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-muted/5 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/shopkeeper/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Order Management</h1>
          </div>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <Button
            variant={selectedStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus('all')}
          >
            All ({orders.length})
          </Button>
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = orders.filter((o) => o.status === status).length;
            return (
              <Button
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(status)}
              >
                {config.label} ({count})
              </Button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ListItemSkeleton key={i} />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders found</h3>
              <p className="text-gray-600">
                {selectedStatus === 'all'
                  ? "You don't have any orders yet"
                  : `No orders with status "${statusConfig[selectedStatus as Order['status']]?.label}"`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => {
              const statusInfo = statusConfig[order.status];
              const StatusIcon = statusInfo.icon;
              const nextStatus = getNextStatus(order.status);

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Info */}
                        <div>
                          <h3 className="font-semibold mb-2">Customer Information</h3>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Name:</span> {order.customerName}</p>
                            <p><span className="font-medium">Email:</span> {order.customerEmail}</p>
                            <p><span className="font-medium">Phone:</span> {order.customerPhone}</p>
                            <p><span className="font-medium">Address:</span> {order.customerAddress}, {order.customerCity} - {order.customerPincode}</p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div>
                          <h3 className="font-semibold mb-2">Order Items</h3>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm border-b pb-2">
                                <span>{item.productName} x{item.quantity}</span>
                                <span className="font-medium">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                            <div className="flex justify-between font-bold text-lg pt-2">
                              <span>Total:</span>
                              <span className="text-orange-600">₹{order.total}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {nextStatus && order.status !== 'cancelled' && (
                        <div className="mt-4 pt-4 border-t flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, nextStatus)}
                          >
                            Mark as {statusConfig[nextStatus].label}
                          </Button>
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            >
                              Cancel Order
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

