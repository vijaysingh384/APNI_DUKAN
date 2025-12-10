export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  shopId: string;
  inStock: boolean;
  stock?: number;
}

export interface Shop {
  id: string;
  shopName: string;
  ownerName: string;
  category: string;
  address: string;
  city: string;
  phone: string;
  timings: string;
  description: string;
  logo?: string;
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  latitude?: number;
  longitude?: number;
  distance?: number; // Calculated distance from user location
}

// Mock shops data with coordinates (Delhi area: ~28.6°N, 77.2°E)
export const mockShops: Shop[] = [
  {
    id: '1',
    shopName: 'Vijay Grocery Store',
    ownerName: 'Vijay Kumar',
    category: 'Grocery',
    address: '123 Main Street',
    city: 'Delhi',
    phone: '+91 98765 43210',
    timings: '9:00 AM - 9:00 PM',
    description: 'Fresh vegetables, fruits, and daily essentials. Home delivery available.',
    logo: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&auto=format&fit=crop',
    rating: 4.5,
    reviewCount: 120,
    isVerified: true,
    latitude: 28.6139,
    longitude: 77.2090,
  },
  {
    id: '2',
    shopName: 'Fresh Vegetables Mart',
    ownerName: 'Ramesh Kumar',
    category: 'Vegetables',
    address: '456 Vegetable Market',
    city: 'Delhi',
    phone: '+91 98765 43215',
    timings: '6:00 AM - 8:00 PM',
    description: 'Fresh seasonal vegetables, organic options available. Best quality guaranteed.',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop',
    rating: 4.6,
    reviewCount: 95,
    isVerified: true,
    latitude: 28.6200,
    longitude: 77.2150,
  },
  {
    id: '3',
    shopName: 'Raj Electronics',
    ownerName: 'Rajesh Singh',
    category: 'Electronics',
    address: '456 Market Road',
    city: 'Delhi',
    phone: '+91 98765 43211',
    timings: '10:00 AM - 8:00 PM',
    description: 'Mobile phones, accessories, and electronic gadgets. Best prices guaranteed.',
    logo: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 89,
    isVerified: true,
    latitude: 28.6050,
    longitude: 77.2050,
  },
  {
    id: '4',
    shopName: 'Sweet Corner Bakery',
    ownerName: 'Priya Sharma',
    category: 'Bakery',
    address: '789 Food Street',
    city: 'Delhi',
    phone: '+91 98765 43212',
    timings: '7:00 AM - 10:00 PM',
    description: 'Fresh baked goods, cakes, and pastries. Custom orders welcome.',
    logo: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 156,
    isVerified: true,
    latitude: 28.6250,
    longitude: 77.2200,
  },
  {
    id: '5',
    shopName: 'Green Pharmacy',
    ownerName: 'Dr. Amit Patel',
    category: 'Medical',
    address: '321 Health Avenue',
    city: 'Delhi',
    phone: '+91 98765 43213',
    timings: '8:00 AM - 10:00 PM',
    description: 'All medicines available. Prescription and OTC drugs. Home delivery.',
    logo: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&auto=format&fit=crop',
    rating: 4.6,
    reviewCount: 203,
    isVerified: true,
    latitude: 28.6100,
    longitude: 77.2100,
  },
  {
    id: '6',
    shopName: 'Fashion Hub',
    ownerName: 'Meera Devi',
    category: 'Clothing',
    address: '654 Style Boulevard',
    city: 'Delhi',
    phone: '+91 98765 43214',
    timings: '10:00 AM - 9:00 PM',
    description: 'Trendy clothes for men, women, and kids. Latest fashion at affordable prices.',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop',
    rating: 4.4,
    reviewCount: 98,
    isVerified: true,
    latitude: 28.6000,
    longitude: 77.2000,
  },
  {
    id: '7',
    shopName: 'Daily Needs Store',
    ownerName: 'Suresh Yadav',
    category: 'Grocery',
    address: '789 Local Market',
    city: 'Delhi',
    phone: '+91 98765 43216',
    timings: '8:00 AM - 9:00 PM',
    description: 'All daily essentials, groceries, and household items. Quick delivery.',
    logo: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&auto=format&fit=crop',
    rating: 4.3,
    reviewCount: 67,
    isVerified: true,
    latitude: 28.6300,
    longitude: 77.2250,
  },
  {
    id: '8',
    shopName: 'City Medical Store',
    ownerName: 'Dr. Neha Gupta',
    category: 'Medical',
    address: '555 Medical Plaza',
    city: 'Delhi',
    phone: '+91 98765 43217',
    timings: '9:00 AM - 9:00 PM',
    description: '24/7 medical supplies. Prescription medicines and health products.',
    logo: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 142,
    isVerified: true,
    latitude: 28.6150,
    longitude: 77.2120,
  },
];

// Mock products data
export const mockProducts: Product[] = [
  // Grocery Store Products
  {
    id: 'p1',
    name: 'Fresh Tomatoes',
    description: 'Fresh red tomatoes, 1kg pack',
    price: 40,
    image: 'https://images.unsplash.com/photo-1546097491-8cbf462350ac?w=400&auto=format&fit=crop',
    category: 'Vegetables',
    shopId: '1',
    inStock: true,
    stock: 50,
  },
  {
    id: 'p2',
    name: 'Basmati Rice',
    description: 'Premium basmati rice, 5kg pack',
    price: 350,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop',
    category: 'Grains',
    shopId: '1',
    inStock: true,
    stock: 30,
  },
  {
    id: 'p3',
    name: 'Fresh Milk',
    description: 'Pure cow milk, 1 liter',
    price: 60,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop',
    category: 'Dairy',
    shopId: '1',
    inStock: true,
    stock: 100,
  },
  // Electronics Products
  {
    id: 'p4',
    name: 'Wireless Earbuds',
    description: 'Bluetooth 5.0, 20hr battery life',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&auto=format&fit=crop',
    category: 'Audio',
    shopId: '2',
    inStock: true,
    stock: 25,
  },
  {
    id: 'p5',
    name: 'Phone Case',
    description: 'Shockproof phone case for all models',
    price: 299,
    image: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=400&auto=format&fit=crop',
    category: 'Accessories',
    shopId: '2',
    inStock: true,
    stock: 50,
  },
  {
    id: 'p6',
    name: 'Power Bank 10000mAh',
    description: 'Fast charging power bank',
    price: 899,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f5be0f4?w=400&auto=format&fit=crop',
    category: 'Accessories',
    shopId: '2',
    inStock: true,
    stock: 40,
  },
  // Bakery Products
  {
    id: 'p7',
    name: 'Chocolate Cake',
    description: 'Fresh chocolate cake, 1kg',
    price: 450,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop',
    category: 'Cakes',
    shopId: '3',
    inStock: true,
    stock: 10,
  },
  {
    id: 'p8',
    name: 'Fresh Bread',
    description: 'White bread, 500g',
    price: 35,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop',
    category: 'Bread',
    shopId: '3',
    inStock: true,
    stock: 60,
  },
  {
    id: 'p9',
    name: 'Donuts (Pack of 6)',
    description: 'Assorted donuts, fresh daily',
    price: 180,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&auto=format&fit=crop',
    category: 'Pastries',
    shopId: '3',
    inStock: true,
    stock: 20,
  },
  // Pharmacy Products
  {
    id: 'p10',
    name: 'Paracetamol 500mg',
    description: 'Pain relief tablets, strip of 10',
    price: 25,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop',
    category: 'Medicines',
    shopId: '4',
    inStock: true,
    stock: 200,
  },
  {
    id: 'p11',
    name: 'Band-Aid',
    description: 'Adhesive bandages, pack of 20',
    price: 45,
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&auto=format&fit=crop',
    category: 'First Aid',
    shopId: '4',
    inStock: true,
    stock: 150,
  },
  // Clothing Products
  {
    id: 'p12',
    name: 'Cotton T-Shirt',
    description: '100% cotton, comfortable fit',
    price: 499,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&auto=format&fit=crop',
    category: 'Men',
    shopId: '5',
    inStock: true,
    stock: 75,
  },
  {
    id: 'p13',
    name: 'Denim Jeans',
    description: 'Classic fit jeans, all sizes',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&auto=format&fit=crop',
    category: 'Men',
    shopId: '5',
    inStock: true,
    stock: 50,
  },
];

// Helper functions
export const getShopById = (id: string): Shop | undefined => {
  return mockShops.find((shop) => shop.id === id);
};

export const getProductsByShopId = (shopId: string): Product[] => {
  return mockProducts.filter((product) => product.shopId === shopId);
};

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find((product) => product.id === id);
};

export const searchShops = (query: string): Shop[] => {
  const lowerQuery = query.toLowerCase();
  return mockShops.filter(
    (shop) =>
      shop.shopName.toLowerCase().includes(lowerQuery) ||
      shop.category.toLowerCase().includes(lowerQuery) ||
      shop.city.toLowerCase().includes(lowerQuery) ||
      shop.description.toLowerCase().includes(lowerQuery)
  );
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
  );
};

// Order interface and mock data
export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerPincode: string;
  shopId: string;
  shopName: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'online';
  createdAt: string;
  updatedAt: string;
}

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: 'o1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+91 98765 43210',
    customerAddress: '123 Customer Street',
    customerCity: 'Delhi',
    customerPincode: '110001',
    shopId: '1',
    shopName: 'Vijay Grocery Store',
    items: [
      { productId: 'p1', productName: 'Fresh Tomatoes', quantity: 2, price: 40 },
      { productId: 'p2', productName: 'Basmati Rice', quantity: 1, price: 350 },
    ],
    total: 430,
    status: 'pending',
    paymentMethod: 'cod',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'o2',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '+91 98765 43211',
    customerAddress: '456 Buyer Avenue',
    customerCity: 'Mumbai',
    customerPincode: '400001',
    shopId: '2',
    shopName: 'Raj Electronics',
    items: [
      { productId: 'p4', productName: 'Wireless Earbuds', quantity: 1, price: 1299 },
    ],
    total: 1299,
    status: 'confirmed',
    paymentMethod: 'cod',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const getOrdersByShopId = (shopId: string): Order[] => {
  return mockOrders.filter((order) => order.shopId === shopId);
};

export const getOrderById = (id: string): Order | undefined => {
  return mockOrders.find((order) => order.id === id);
};

