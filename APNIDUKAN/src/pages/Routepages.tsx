
import Copages from "../components/Cospages";
import Shopkeepers from "./shopkeepers";
import HowItWorks from "./HowItWorks";
import { Routes, Route } from 'react-router-dom';
import ContactPage from "./contact";
import Products from "./products";
import SignInPage from "./sign-in";
import SignUpPage from "./sign-up";
import GetStarted from "./get-started";
import CreateShopPage from "./create-shop";
import ShopkeeperDashboard from "./shopkeeper-dashboard";
import Pricing from "./Pricing";
import ShopsPage from "./shops";
import ShopDetailPage from "./shop-detail";
import ProductDetailPage from "./product-detail";
import CartPage from "./cart";
import CheckoutPage from "./checkout";
import NotFoundPage from "./NotFound";
import ProductManagementPage from "./product-management";
import OrderManagementPage from "./order-management";
import EditShopProfilePage from "./edit-shop-profile";
import ProtectedRoute from "../components/ProtectedRoute";


function Routepages() {
  return (
    <Routes>
      <Route path="/" element={<Copages />} />
      <Route path="/shopkeepers" element={<Shopkeepers />} />
      <Route path="/HowItWorks" element={<HowItWorks />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/products" element={<Products />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/shops" element={<ShopsPage />} />
      <Route path="/shop/:shopId" element={<ShopDetailPage />} />
      <Route path="/product/:productId" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={
        <ProtectedRoute requiredRole="customer">
          <CheckoutPage />
        </ProtectedRoute>
      } />
      <Route path="/create-shop" element={
        <ProtectedRoute requiredRole="shopkeeper">
          <CreateShopPage />
        </ProtectedRoute>
      } />
      <Route path="/shopkeeper/dashboard" element={
        <ProtectedRoute requiredRole="shopkeeper">
          <ShopkeeperDashboard />
        </ProtectedRoute>
      } />
      <Route path="/shopkeeper/products" element={
        <ProtectedRoute requiredRole="shopkeeper">
          <ProductManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/shopkeeper/orders" element={
        <ProtectedRoute requiredRole="shopkeeper">
          <OrderManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/shopkeeper/profile" element={
        <ProtectedRoute requiredRole="shopkeeper">
          <EditShopProfilePage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default Routepages;
