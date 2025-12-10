import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';
import { validateShopForm, sanitizeInput } from '@/lib/validation';
import { uploadAPI, shopsAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { ArrowLeft } from 'lucide-react';

export default function EditShopProfilePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    category: '',
    address: '',
    city: '',
    phone: '',
    timings: '',
    description: '',
  });

  useEffect(() => {
    // Load existing shop data from localStorage
    const shopData = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('shop_profile') || 'null')
      : null;
    
    if (shopData) {
      setFormData({
        shopName: shopData.shopName || '',
        ownerName: shopData.ownerName || '',
        category: shopData.category || '',
        address: shopData.address || '',
        city: shopData.city || '',
        phone: shopData.phone || '',
        timings: shopData.timings || '',
        description: shopData.description || '',
      });
      if (shopData.logo) {
        setLogoPreview(shopData.logo);
      }
    }
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f) {
      setLogoFile(f);
      setLogoPreview(URL.createObjectURL(f));
    } else {
      setLogoFile(null);
      setLogoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateShopForm({
      shopName: formData.shopName,
      ownerName: formData.ownerName,
      category: formData.category,
      address: formData.address,
      city: formData.city,
      phone: formData.phone,
    });

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    setIsSubmitting(true);

    try {
      let logoUrl: string | undefined = logoPreview || undefined;

      // Upload logo if a new file was selected
      if (logoFile) {
        setUploadingLogo(true);
        try {
          const uploadResult = await uploadAPI.uploadFile(logoFile);
          logoUrl = uploadResult.url;
        } catch (uploadError: any) {
          toast.error(uploadError.message || 'Failed to upload logo');
          setIsSubmitting(false);
          setUploadingLogo(false);
          return;
        } finally {
          setUploadingLogo(false);
        }
      }

      // Get shop ID from user or localStorage
      const shopData = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('shop_profile') || 'null')
        : null;
      const shopId = shopData?.id || user?.shopId;

      if (shopId) {
        // Update via API
        await shopsAPI.update(shopId, {
          shopName: sanitizeInput(formData.shopName),
          category: sanitizeInput(formData.category),
          address: sanitizeInput(formData.address),
          city: sanitizeInput(formData.city),
          phone: sanitizeInput(formData.phone),
          timings: sanitizeInput(formData.timings),
          description: sanitizeInput(formData.description),
          logo: logoUrl,
        });
      }

      // Update localStorage for backward compatibility
      const payload = {
        ...shopData,
        shopName: sanitizeInput(formData.shopName),
        ownerName: sanitizeInput(formData.ownerName),
        category: sanitizeInput(formData.category),
        address: sanitizeInput(formData.address),
        city: sanitizeInput(formData.city),
        phone: sanitizeInput(formData.phone),
        timings: sanitizeInput(formData.timings),
        description: sanitizeInput(formData.description),
        logo: logoUrl,
      };
      localStorage.setItem('shop_profile', JSON.stringify(payload));
      
      toast.success('Shop profile updated successfully!');
      
      setTimeout(() => {
        navigate('/shopkeeper/dashboard');
      }, 500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/5 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/shopkeeper/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Shop Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="shopName">Shop name *</Label>
                <Input
                  id="shopName"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  placeholder="e.g. Vijay Grocery"
                />
                {errors.shopName && <p className="text-sm text-red-600 mt-1">{errors.shopName}</p>}
              </div>

              <div>
                <Label htmlFor="ownerName">Owner name *</Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="Full name"
                />
                {errors.ownerName && <p className="text-sm text-red-600 mt-1">{errors.ownerName}</p>}
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Grocery, Electronics"
                />
                {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street, number"
                  />
                  {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                  />
                  {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone / WhatsApp *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98xxxx"
                  />
                  {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="timings">Shop timings</Label>
                  <Input
                    id="timings"
                    value={formData.timings}
                    onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
                    placeholder="e.g. 9:00 AM - 9:00 PM"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="logo">Logo / shop photo</Label>
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="mt-2"
                  disabled={uploadingLogo || isSubmitting}
                />
                {uploadingLogo && (
                  <p className="text-sm text-gray-600 mt-2">Uploading logo...</p>
                )}
                {logoPreview && (
                  <div className="mt-3 w-32 h-32 rounded overflow-hidden border">
                    <img src={logoPreview} alt="logo preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="description">Short description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your shop in a line"
                  className="w-full rounded border p-2 mt-2 min-h-[100px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/shopkeeper/dashboard')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || uploadingLogo}>
                  {isSubmitting || uploadingLogo ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      {uploadingLogo ? 'Uploading...' : 'Updating...'}
                    </span>
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

