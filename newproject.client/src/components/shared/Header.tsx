import * as React from 'react'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList} from '../ui/navigation-menu'
// import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Menu, LogOut, UserCircle, Settings, ShoppingCart } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

import BarbarLogo from '@/assets/BarbarLogo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'


const Header = () => {
  const isMobile = useIsMobile()
  const Navigate = useNavigate()
  const { logout } = useAuth()
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  const navItems = [  
    { label: 'Home', href: '/home' },
    { label: 'Services', href: '/services' },
    { label: 'My Appointments', href: '/appointments' },
    { label: 'Book Now', href: '/book-now' },
    { label: 'Offers', href: '/offers' },
    { label: 'Settings', href: '/settings' }
  ]

  const HandleLogout = () => {
    logout();
  }

  const NavContent = () => (
    <NavigationMenuList className="flex items-center gap-17">
      {navItems.map((item) => (
        <NavigationMenuItem key={item.href}>
          <Link
            key={item.href}
            to={item.href}
            className="text-sm  font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            {item.label}
          </Link>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  )

  return (
    <header className="border-b bg-gray-100 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 md:px-10 h-16">
        <div className="flex items-center h-full relative">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <img src={BarbarLogo} alt="Logo" className="h-15 w-15" />
          </div>

          {/* Desktop Navigation - Centered */}
          {!isMobile && (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <NavigationMenu>
                <NavContent />
              </NavigationMenu>
            </div>
          )}

          {/* Search and Profile */}
          <div className="flex items-center gap-4 ml-auto">
            {/* <div className="hidden md:block w-64 relative">
              <Input
                type="search"
                placeholder="Search..."
                className="rounded-full bg-gray-50 pl-10 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
              />
              <svg
                className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div> */}

            <Button onClick={() => Navigate("/cart") } variant="ghost" className="p-2 h-8 w-8 relative cursor-pointer">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">0</span>
            </Button>

            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="p-0 h-8 w-8">
                    <Avatar className='cursor-pointer'>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-35 p-2">
                  <div className="flex flex-col gap-1">
                    <Button onClick={() => {
                      Navigate("/profile")
                    }} variant="ghost" className="flex items-center gap-2 w-full justify-start cursor-pointer">
                      <UserCircle size={16} />
                      Profile
                    </Button>
                    <Button 
                      onClick={() => {
                        Navigate("/settings")
                      }} variant="ghost" className="flex items-center gap-2 w-full justify-start cursor-pointer"> 
                      <Settings size={16} />
                      Settings
                    </Button>
                    <Button 
                    onClick={()=>{
                      HandleLogout();
                    }}
                     variant="ghost" className="flex items-center gap-2 w-full justify-start cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
                      <LogOut size={16} />
                      Log out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Mobile Menu */}
            {isMobile && (
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col gap-4 mt-4">
                    {/* <Input
                      type="search"
                      placeholder="Search..."
                      className="rounded-full bg-gray-50"
                    />  */}
                    <nav className="flex flex-col gap-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors p-2 px-6"
                          onClick={() => setIsSheetOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
