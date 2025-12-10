// Page: Shopkeeper dashboard
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, Store, Edit, Plus, List } from 'lucide-react';
import { productsAPI, ordersAPI } from '@/lib/api';
import { useToast } from '@/components/ui/toast';
import { useState, useEffect } from 'react';

export default function ShopkeeperDashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const shop = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('shop_profile') || 'null') : null;
  const shopId = shop?.id || '1';
  
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    
    const loadData = async () => {
      try {
        const [productsResponse, ordersResponse] = await Promise.all([
          productsAPI.getAll({ shopId }),
          ordersAPI.getByShopId(shopId),
        ]);
        if (!cancelled) {
          setProducts(productsResponse.products || []);
          setOrders(ordersResponse.orders || []);
        }
      } catch (error: any) {
        if (!cancelled) {
          toast.error(error.message || 'Failed to load dashboard data');
        }
      }
    };
    loadData();
    
    return () => {
      cancelled = true;
    };
  }, [shopId]);

  const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-muted/5 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Shopkeeper Dashboard</h1>
            {shop && (
              <p className="text-gray-600 mt-1">Welcome back, {shop.ownerName}!</p>
            )}
          </div>
          <div className="space-x-3">
            <Button variant="outline" onClick={() => navigate('/shopkeeper/products')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
            <Button variant="default" onClick={() => navigate('/shopkeeper/orders')}>
              <List className="w-4 h-4 mr-2" />
              Manage Orders
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/shopkeeper/profile')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Store className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Shop Profile</h3>
                  {shop ? (
                    <p className="text-sm text-muted-foreground">{shop.shopName}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not set up</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/shopkeeper/products')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Products</h3>
                  <p className="text-sm text-muted-foreground">{products.length} products</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/shopkeeper/orders')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Orders</h3>
                  <p className="text-sm text-muted-foreground">
                    {orders.length} total • {pendingOrders} pending
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/shopkeeper/products')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/shopkeeper/orders')}
                >
                  <List className="w-4 h-4 mr-2" />
                  View All Orders
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/shopkeeper/profile')}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Shop Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-gray-600">{order.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{order.total}</p>
                        <p className="text-xs text-gray-500 capitalize">{order.status}</p>
                      </div>
                    </div>
                  ))}
                  {orders.length > 3 && (
                    <Button
                      variant="ghost"
                      className="w-full mt-2"
                      onClick={() => navigate('/shopkeeper/orders')}
                    >
                      View All Orders
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No recent orders</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
