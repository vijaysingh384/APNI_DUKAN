import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, CheckCircle, Store, Navigation, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { ShopCardSkeleton } from '@/components/ui/skeleton';
import { shopsAPI } from '@/lib/api';
import { getUserLocation, calculateDistance, formatDistance } from '@/lib/geolocation';
import type { Shop } from '@/lib/mockData';

export default function ShopsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [useLocationFilter, setUseLocationFilter] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(5); // Default 5km
  const [isCalculatingDistances, setIsCalculatingDistances] = useState(false);

  // Enhanced categories with common shop types
  const categories = [
    'all',
    'Grocery',
    'Vegetables',
    'Medical',
    'Pharmacy',
    'Electronics',
    'Bakery',
    'Clothing',
    'Fruits',
    'Dairy',
  ];

  const [shops, setShops] = useState<Shop[]>([]);
  const [cities, setCities] = useState<string[]>(['all']);
  const [isLoadingShops, setIsLoadingShops] = useState(true);

  // Load shops on mount
  useEffect(() => {
    let cancelled = false;
    const loadShops = async () => {
      try {
        setIsLoadingShops(true);
        const response = await shopsAPI.getAll();
        if (!cancelled) {
          setShops(response.shops || []);
          const uniqueCities = ['all', ...Array.from(new Set((response.shops || []).map((s: Shop) => s.city)))];
          setCities(uniqueCities);
        }
      } catch (error: any) {
        if (!cancelled) {
          toast.error(error.message || 'Failed to load shops');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingShops(false);
        }
      }
    };
    loadShops();
    detectLocation();
    
    return () => {
      cancelled = true;
    };
  }, []);

  const detectLocation = async () => {
    setIsDetectingLocation(true);
    const location = await getUserLocation();
    if (location) {
      setUserLocation(location);
      setUseLocationFilter(true);
      toast.success('Location detected! Showing nearby shops.');
    } else {
      toast.error('Could not detect location. Showing all shops.');
    }
    setIsDetectingLocation(false);
  };

  // Calculate distances and filter shops
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);

  useEffect(() => {
    let cancelled = false;
    
    const calculateAndFilter = async () => {
      if (isLoadingShops || shops.length === 0) {
        if (!cancelled) {
          setFilteredShops([]);
        }
        return;
      }
      
      setIsCalculatingDistances(true);
      
      // Small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      if (cancelled) return;
      
      let filtered: Shop[] = [...shops];

      // Calculate distances if location is available
      if (userLocation && useLocationFilter) {
        filtered = filtered.map((shop) => {
          if (shop.latitude && shop.longitude) {
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              shop.latitude,
              shop.longitude
            );
            return { ...shop, distance };
          }
          return shop;
        });

        // Filter by distance
        filtered = filtered.filter((shop) => {
          if (!shop.distance) return false;
          return shop.distance <= maxDistance;
        });

        // Sort by distance (nearest first)
        filtered.sort((a, b) => {
          const distA = a.distance || Infinity;
          const distB = b.distance || Infinity;
          return distA - distB;
        });
      }

      // Apply search filter (client-side, no API call)
      if (searchQuery) {
        const searchTerm = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (shop) =>
            shop.shopName?.toLowerCase().includes(searchTerm) ||
            shop.category?.toLowerCase().includes(searchTerm) ||
            shop.city?.toLowerCase().includes(searchTerm) ||
            shop.address?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply category filter
      if (selectedCategory !== 'all') {
        filtered = filtered.filter((shop) => shop.category === selectedCategory);
      }

      // Apply city filter
      if (selectedCity !== 'all') {
        filtered = filtered.filter((shop) => shop.city === selectedCity);
      }

      if (!cancelled) {
        setFilteredShops(filtered);
        setIsCalculatingDistances(false);
      }
    };

    calculateAndFilter();
    
    return () => {
      cancelled = true;
    };
  }, [shops, userLocation, useLocationFilter, maxDistance, searchQuery, selectedCategory, selectedCity, isLoadingShops]);

  return (
    <div className="min-h-screen  top-16 w-full bg-muted/5">
      {/* Search and Filters Section */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            {/* Location Detection */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="outline"
                onClick={detectLocation}
                disabled={isDetectingLocation}
                className="flex items-center gap-2"
              >
                {isDetectingLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    {userLocation ? 'Update Location' : 'Detect My Location'}
                  </>
                )}
              </Button>
              {userLocation && (
                <>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Location Active
                  </Badge>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={useLocationFilter}
                      onChange={(e) => setUseLocationFilter(e.target.checked)}
                      className="rounded"
                    />
                    Show nearby shops only
                  </label>
                  {useLocationFilter && (
                    <select
                      value={maxDistance}
                      onChange={(e) => setMaxDistance(Number(e.target.value))}
                      className="px-3 py-1 border rounded-md text-sm"
                    >
                      <option value={3}>Within 3 km</option>
                      <option value={5}>Within 5 km</option>
                      <option value={10}>Within 10 km</option>
                    </select>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search shops by name, category, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-md h-12 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>

              {/* City Filter */}
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-6 py-2 border rounded-md h-12 bg-white"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city === 'all' ? 'All Cities' : city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Shops Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoadingShops || isCalculatingDistances ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ShopCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="text-center py-20">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No shops found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                {filteredShops.length} {filteredShops.length === 1 ? 'Shop' : 'Shops'} Found
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShops.map((shop, index) => (
                <motion.div
                  key={shop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col"
                    onClick={() => navigate(`/shop/${shop.id}`)}
                  >
                    <div className="relative">
                      <img
                        src={shop.logo || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop'}
                        alt={shop.shopName}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {shop.isVerified && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold">{shop.shopName}</h3>
                          {shop.distance !== undefined && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {formatDistance(shop.distance)}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{shop.address}, {shop.city}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          {shop.rating && (
                            <>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold">{shop.rating}</span>
                              </div>
                              {shop.reviewCount && (
                                <span className="text-sm text-gray-600">
                                  ({shop.reviewCount} reviews)
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{shop.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                            {shop.category}
                          </span>
                          <span className="text-xs text-gray-500">{shop.timings}</span>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/shop/${shop.id}`);
                        }}
                      >
                        View Shop
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

