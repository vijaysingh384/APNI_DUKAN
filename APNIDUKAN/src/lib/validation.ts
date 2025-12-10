export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): string | null {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone) return 'Phone number is required';
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
  if (phone.replace(/\D/g, '').length < 10) return 'Phone number must be at least 10 digits';
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateMinLength(value: string, minLength: number, fieldName: string): string | null {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
}

export function validateMaxLength(value: string, maxLength: number, fieldName: string): string | null {
  if (value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters`;
  }
  return null;
}

export function validatePrice(price: string | number): string | null {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice) || numPrice <= 0) {
    return 'Price must be a positive number';
  }
  return null;
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function validateShopForm(data: {
  shopName: string;
  ownerName: string;
  category: string;
  address: string;
  city: string;
  phone: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  const shopNameError = validateRequired(data.shopName, 'Shop name');
  if (shopNameError) errors.push({ field: 'shopName', message: shopNameError });

  const ownerNameError = validateRequired(data.ownerName, 'Owner name');
  if (ownerNameError) errors.push({ field: 'ownerName', message: ownerNameError });

  const categoryError = validateRequired(data.category, 'Category');
  if (categoryError) errors.push({ field: 'category', message: categoryError });

  const addressError = validateRequired(data.address, 'Address');
  if (addressError) errors.push({ field: 'address', message: addressError });

  const cityError = validateRequired(data.city, 'City');
  if (cityError) errors.push({ field: 'city', message: cityError });

  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.push({ field: 'phone', message: phoneError });

  return errors;
}

export function validateProductForm(data: {
  name: string;
  description: string;
  price: string | number;
  category: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  const nameError = validateRequired(data.name, 'Product name');
  if (nameError) errors.push({ field: 'name', message: nameError });

  const descriptionError = validateRequired(data.description, 'Description');
  if (descriptionError) errors.push({ field: 'description', message: descriptionError });

  const priceError = validatePrice(data.price);
  if (priceError) errors.push({ field: 'price', message: priceError });

  const categoryError = validateRequired(data.category, 'Category');
  if (categoryError) errors.push({ field: 'category', message: categoryError });

  return errors;
}

export function validateCheckoutForm(data: {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  const nameError = validateRequired(data.name, 'Name');
  if (nameError) errors.push({ field: 'name', message: nameError });

  const emailError = validateEmail(data.email);
  if (emailError) errors.push({ field: 'email', message: emailError });

  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.push({ field: 'phone', message: phoneError });

  const addressError = validateRequired(data.address, 'Address');
  if (addressError) errors.push({ field: 'address', message: addressError });

  const cityError = validateRequired(data.city, 'City');
  if (cityError) errors.push({ field: 'city', message: cityError });

  const pincodeError = validateRequired(data.pincode, 'Pincode');
  if (pincodeError) errors.push({ field: 'pincode', message: pincodeError });
  else if (!/^\d{6}$/.test(data.pincode)) {
    errors.push({ field: 'pincode', message: 'Pincode must be 6 digits' });
  }

  return errors;
}

