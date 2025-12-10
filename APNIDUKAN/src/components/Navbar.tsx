import { Header, HeaderLink } from '@/components/ui/header';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/toast';

export const Navbar = () => {
  const { setActiveSection, getCartItemCount } = useStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const toast = useToast();
  const navigate = useNavigate();
  const cartCount = getCartItemCount();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const navLinks: HeaderLink[] = [
    { label: 'Shops', href: '/shops' },
    { label: 'Products', href: '/products' },
    { label: 'For Shopkeepers', href: '/shopkeepers' },
    { label: 'How it Works', href: '/HowItWorks' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
  ];

  const handleLinkClick = (href: string) => {
    if (href.startsWith('/')) {
      navigate(href);
      return;
    }
    setActiveSection(href.replace('#', ''));
  };

  return (
    <Header
      links={navLinks}
      onLinkClick={handleLinkClick}
      isAuthenticated={isAuthenticated}
      userName={user?.name}
      userRole={user?.role}
      cartCount={cartCount}
      onLogout={handleLogout}
      onDashboardClick={() => navigate('/shopkeeper/dashboard')}
      onSignInClick={() => navigate('/sign-in')}
      onSignUpClick={() => navigate('/sign-up')}
      onCartClick={() => navigate('/cart')}
    />
  );
};
