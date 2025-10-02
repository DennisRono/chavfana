'use client'
import type React from 'react'
import { useState, useEffect } from 'react'
import {
  Search,
  Bell,
  User,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Sprout,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/actions/auth'
import { useSelector } from 'react-redux'
import { selectAuth } from '@/store/selectors/auth'

interface HeaderProps {
  onSearch?: (query: string) => void
}

const Header = ({ onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [notificationCount] = useState(3)

  const { user, isAuthenticated, isLoading, error } = useSelector(selectAuth)

  const dispatch = useAppDispatch()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const handleLogout = async () => {
    dispatch(logout({}))
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-accent"
                onClick={toggleMobileMenu}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <Link
                className="flex items-center space-x-3 group"
                href="/dashboard"
              >
                <div className="p-2.5 bg-primary rounded-xl group-hover:scale-105 transition-transform duration-200">
                  <Sprout className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
                    ChavFana
                  </h1>
                  <p className="text-sm text-muted-foreground font-medium">
                    Farm Management System
                  </p>
                </div>
              </Link>
            </div>

            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div
                className={`relative w-full transition-all duration-200 ${
                  isSearchFocused ? 'scale-105' : ''
                }`}
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search projects, livestock, crops, records..."
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-12 pr-4 h-12 bg-secondary/10 border-border/50 focus:bg-secondary/15 focus:border-ring/50 transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-accent"
              >
                <Search className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-accent"
                  >
                    <Bell className="h-4 w-4" />
                    {notificationCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive text-primary-foreground border-0">
                        {notificationCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold">Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      You have {notificationCount} new notifications
                    </p>
                  </div>
                  <DropdownMenuItem className="p-4">
                    <div>
                      <p className="font-medium">Harvest reminder</p>
                      <p className="text-sm text-muted-foreground">
                        Wheat Field A is ready for harvest
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-4">
                    <div>
                      <p className="font-medium">Health check due</p>
                      <p className="text-sm text-muted-foreground">
                        Livestock group B needs health inspection
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-4">
                    <div>
                      <p className="font-medium">Weather alert</p>
                      <p className="text-sm text-muted-foreground">
                        Heavy rain expected tomorrow
                      </p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 hover:bg-accent p-3 h-13"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium">{user?.full_name||user?.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Premium Account
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <Link href="/profile" className="flex gap-2">
                    <DropdownMenuItem className="cursor-pointer hover:bg-primary/20 w-full">
                      <User className="mr-2 h-4 w-4" />
                      Profile Settings
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/farm" className="flex gap-2">
                    <DropdownMenuItem className="cursor-pointer hover:bg-primary/20 w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Farm Settings
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer hover:bg-primary/20 w-full"
                    onClick={() => {
                      handleLogout()
                    }}
                  >
                    {isLoading && (
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    )}
                    {!isLoading && <LogOut className="mr-2 h-4 w-4" />}
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          />
          <div className="fixed top-0 left-0 right-0 bg-background border-b border-border p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Sprout className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">
                    AgriFlow
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Farm Management
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search projects, livestock, crops..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 bg-secondary/50 border-border/50"
              />
            </div>

            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className="block p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                href="/projects"
                className="block p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <span className="font-medium">Projects</span>
              </Link>
              <Link
                href="/livestock"
                className="block p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <span className="font-medium">Livestock</span>
              </Link>
              <Link
                href="/crops"
                className="block p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <span className="font-medium">Crops</span>
              </Link>
              <Link
                href="/reports"
                className="block p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <span className="font-medium">Reports</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
