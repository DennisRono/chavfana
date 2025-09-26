import React, { useState } from 'react'
import { Search, Bell, User, Settings, Menu, X, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sprout } from 'lucide-react'
import { useAppDispatch } from '@/store/hooks'
import Link from 'next/link'
interface HeaderProps {
  onSearch?: (query: string) => void
}

const Header = ({ onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const dispatch = useAppDispatch()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  return (
    <header className="bg-white border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-6 py-2 container mx-auto">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Link className="flex items-center space-x-3" href="/">
            <div className="p-2 bg-primary rounded-lg">
              <Sprout className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Farm Information Management
              </h1>
              <p className="text-sm text-muted-foreground">System</p>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects, animals, crops..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" className="md:hidden">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs"></span>
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">{'farm name'}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {}}>
            <LogOut className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
