'use client'
import React from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon'
import { useScroll } from '@/components/ui/use-scroll'
import { ShoppingCart, LogOut, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export interface HeaderLink {
  label: string
  href: string
}

export interface HeaderProps {
  links?: HeaderLink[]
  onLinkClick?: (href: string) => void
  isAuthenticated?: boolean
  userName?: string
  userRole?: 'customer' | 'shopkeeper'
  cartCount?: number
  onLogout?: () => void
  onDashboardClick?: () => void
  onSignInClick?: () => void
  onSignUpClick?: () => void
  onCartClick?: () => void
}

export function Header({
  links = [
    { label: 'Features', href: '#features' },
    { label: 'Products', href: '#products' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
  onLinkClick,
  isAuthenticated = false,
  userName,
  userRole,
  cartCount = 0,
  onLogout,
  onDashboardClick,
  onSignInClick,
  onSignUpClick,
  onCartClick,
}: HeaderProps) {
  const [open, setOpen] = React.useState(false)
  const scrolled = useScroll(50)

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      const id = href.replace('#', '')
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = href
    }

    setOpen(false)
    onLinkClick?.(href)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-300 backdrop-blur-lg',
        scrolled && !open ? 'bg-white/90 shadow-md' : 'bg-white'
      )}
    >
      <nav className="flex h-16 items-center justify-between px-4 md:px-8">
        
        {/* Logo */}
        <a
          href="/"
          onClick={() => handleLinkClick('/')}
          className="flex items-center gap-2"
        >
          <img
            src="https://qazimaazarshad.github.io/Apni-Dukaan/Images/Logo/ApniDukan.png"
            alt="Apni Dukan"
            className="w-20 h-20 object-contain"
          />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          {links.map(link => (
            <button
              key={link.label}
              onClick={() => handleLinkClick(link.href)}
              className={buttonVariants({ variant: 'ghost' })}
            >
              {link.label}
            </button>
          ))}

          {/* Auth & Cart Buttons */}
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{userName}</span>
              </div>
              {userRole === 'shopkeeper' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDashboardClick}
                >
                  Dashboard
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onSignInClick || (() => handleLinkClick('/sign-in'))}
              >
                Sign In
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={onSignUpClick || (() => handleLinkClick('/sign-up'))}
              >
                Sign Up
              </Button>
            </>
          )}
          
          {/* Cart Icon */}
          <Button
            size="icon"
            variant="ghost"
            className="relative border"
            onClick={onCartClick || (() => handleLinkClick('/cart'))}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                {cartCount > 9 ? '9+' : cartCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Mobile Right Icons */}
        <div className="flex items-center gap-2 md:hidden ml-auto">
          {/* Cart Icon */}
          <Button
            size="icon"
            variant="ghost"
            className="relative border"
            onClick={onCartClick || (() => handleLinkClick('/cart'))}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                {cartCount > 9 ? '9+' : cartCount}
              </Badge>
            )}
          </Button>

          {/* Menu Toggle */}
          <Button
            size="icon"
            variant="ghost"
            className="border"
            onClick={() => setOpen(!open)}
          >
            <MenuToggleIcon open={open} className="size-5" duration={300} />
          </Button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 top-16 bg-white z-40 md:hidden border-t">
          <div className="flex flex-col h-full justify-between p-4">

            <div className="grid gap-3">
              {links.map(link => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.href)}
                  className={buttonVariants({
                    variant: 'ghost',
                    className: 'justify-start text-lg',
                  })}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{userName}</span>
                  </div>
                  {userRole === 'shopkeeper' && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={onDashboardClick}
                    >
                      Dashboard
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onSignInClick || (() => handleLinkClick('/sign-in'))}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={onSignUpClick || (() => handleLinkClick('/sign-up'))}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  )
}
