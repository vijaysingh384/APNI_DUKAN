import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useToast } from '@/components/ui/toast'
import { useAuthStore } from '@/store/authStore'
import { shopsAPI, uploadAPI } from '@/lib/api'
import { validateShopForm, sanitizeInput } from '@/lib/validation'
import { motion } from 'framer-motion'

export default function CreateShopPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { updateUser } = useAuthStore()
  const [shopName, setShopName] = useState('')
  const [category, setCategory] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [timings, setTimings] = useState('')
  const [description, setDescription] = useState('')
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    if (f) {
      setLogoFile(f)
      setLogoPreview(URL.createObjectURL(f))
    } else {
      setLogoFile(null)
      setLogoPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const validationErrors = validateShopForm({
      shopName,
      ownerName: 'Owner', // Not needed for API, user name comes from auth
      category,
      address,
      city,
      phone,
    })

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {}
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message
      })
      setErrors(errorMap)
      toast.error('Please fix the errors in the form')
      return
    }

    setSubmitting(true)

    try {
      let logoUrl: string | undefined = undefined;

      // Upload logo if a file was selected
      if (logoFile) {
        setUploadingLogo(true);
        try {
          const uploadResult = await uploadAPI.uploadFile(logoFile);
          logoUrl = uploadResult.url;
        } catch (uploadError: any) {
          toast.error(uploadError.message || 'Failed to upload logo');
          setSubmitting(false);
          setUploadingLogo(false);
          return;
        } finally {
          setUploadingLogo(false);
        }
      }

      const response = await shopsAPI.create({
        shopName: sanitizeInput(shopName),
        category: sanitizeInput(category),
        address: sanitizeInput(address),
        city: sanitizeInput(city),
        phone: sanitizeInput(phone),
        timings: sanitizeInput(timings),
        description: sanitizeInput(description),
        logo: logoUrl,
      })

      // Update user with shopId
      if (response.shop?.id) {
        updateUser({ shopId: response.shop.id })
      }

      // Save to localStorage for backward compatibility
      localStorage.setItem('shop_profile', JSON.stringify(response.shop))
      
      toast.success('Shop created successfully!')
      
      setTimeout(() => {
        navigate('/shopkeeper/dashboard')
      }, 500)
    } catch (error: any) {
      toast.error(error.message || 'Failed to create shop. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/5 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold mb-4">Create Your Shop</h1>
            <p className="text-sm text-muted-foreground mb-6">Fill in your shop details. Approval is instant for demo purposes.</p>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="shopName">Shop name *</Label>
                <Input id="shopName" value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="e.g. Vijay Grocery" />
                {errors.shopName && <p className="text-sm text-red-600 mt-1">{errors.shopName}</p>}
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Grocery, Electronics" />
                {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, number" />
                  {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
                  {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone / WhatsApp *</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98xxxx" />
                  {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="timings">Shop timings</Label>
                  <Input id="timings" value={timings} onChange={(e) => setTimings(e.target.value)} placeholder="e.g. 9:00 AM - 9:00 PM" />
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
                  disabled={uploadingLogo || submitting}
                />
                {uploadingLogo && (
                  <p className="text-sm text-gray-600 mt-2">Uploading logo...</p>
                )}
                {logoPreview && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 w-32 h-32 rounded overflow-hidden border">
                    <img src={logoPreview} alt="logo preview" className="w-full h-full object-cover" />
                  </motion.div>
                )}
              </div>

              <div>
                <Label htmlFor="description">Short description</Label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your shop in a line" className="w-full rounded border p-2 mt-2" />
              </div>

              <div className="flex items-center justify-end">
                <Button type="submit" variant="default" className="h-12" disabled={submitting || uploadingLogo}>
                  {submitting || uploadingLogo ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      {uploadingLogo ? 'Uploading...' : 'Submitting…'}
                    </span>
                  ) : (
                    'Create shop'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
