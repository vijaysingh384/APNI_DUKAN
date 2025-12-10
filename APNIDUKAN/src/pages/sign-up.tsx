import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';
import { useAuthStore } from '@/store/authStore';
import { Mail, Lock, User } from 'lucide-react';

export default function SignUpPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { register } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as 'customer' | 'shopkeeper',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!formData.name.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }
    if (!formData.email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }
    if (!formData.password) {
      setErrors({ password: 'Password is required' });
      return;
    }
    if (formData.password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters' });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      
      toast.success('Account created successfully!');
      
      setTimeout(() => {
        if (formData.role === 'shopkeeper') {
          navigate('/create-shop');
        } else {
          navigate('/shops');
        }
      }, 500);
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
      if (error.message?.includes('email')) {
        setErrors({ email: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10 p-6">
      <Card className="w-full max-w-md rounded-2xl shadow-md border bg-background">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="flex items-center gap-2 border rounded-lg px-3 h-12 focus-within:ring-2 focus-within:ring-ring mt-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="border-0 shadow-none focus-visible:ring-0"
                />
              </div>
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2 border rounded-lg px-3 h-12 focus-within:ring-2 focus-within:ring-ring mt-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="border-0 shadow-none focus-visible:ring-0"
                />
              </div>
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="flex items-center gap-2 border rounded-lg px-3 h-12 focus-within:ring-2 focus-within:ring-ring mt-2">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="border-0 shadow-none focus-visible:ring-0"
                />
              </div>
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="flex items-center gap-2 border rounded-lg px-3 h-12 focus-within:ring-2 focus-within:ring-ring mt-2">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  className="border-0 shadow-none focus-visible:ring-0"
                />
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <Label htmlFor="role">Account Type</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'customer' | 'shopkeeper' })}
                className="w-full rounded-lg border px-3 h-12 mt-2"
              >
                <option value="customer">Customer</option>
                <option value="shopkeeper">Shopkeeper</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="default"
              className="w-full h-12 text-base font-medium rounded-lg mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  Creating account...
                </span>
              ) : (
                'Sign Up'
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-2">
              Already have an account?{' '}
              <span
                className="text-primary cursor-pointer hover:underline"
                onClick={() => navigate('/sign-in')}
              >
                Sign In
              </span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

