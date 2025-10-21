'use client';

import { useState } from 'react';
import { useRouter, usePathname, Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';
import {
  Search,
  Globe,
  Bell,
  MessageSquare,
  HelpCircle,
  User,
  Wallet,
  Settings,
  LogOut,
  Moon,
  Menu,
  Rocket,
  Briefcase,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { paths } from '@/config/paths';

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineForMessages, setOnlineForMessages] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = status === 'authenticated' && !!session?.user;
  const user = session?.user;

  // Helper function to get user initials
  const getUserInitials = () => {
    if (!user?.fullName) return 'U';
    const names = user.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0]?.[0] || ''}${names[1]?.[0] || ''}`.toUpperCase();
    }
    return user.fullName.substring(0, 2).toUpperCase();
  };

  // Helper function to get user type label
  const getUserTypeLabel = () => {
    if (user?.role === 'freelancer') return 'AI Expert';
    if (user?.role === 'client') return 'Client';
    if (user?.role === 'admin') return 'Admin';
    return 'User';
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: paths.auth.login.getHref() });
  };

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      icon: <Rocket className="w-5 h-5" />,
      title: 'New project matching your skills: Build a custom GPT-4 chatbot for customer support.',
      time: '2 hours ago',
    },
    {
      id: 2,
      icon: <Briefcase className="w-5 h-5" />,
      title: 'Sarah Chen hired you for the position "ML Model Training".',
      time: '5 hours ago',
    },
    {
      id: 3,
      icon: <DollarSign className="w-5 h-5" />,
      title: 'Congrats! You received an offer from TechCorp for AI Automation Project. Respond by Oct 13, 2025.',
      time: '1 day ago',
    },
  ];

  const unreadNotifications = 3;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(paths.public.browse.getHref({ q: searchQuery }));
    }
  };

  const changeLocale = (newLocale: 'en' | 'fr') => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href={paths.home.getHref()} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="text-lg font-semibold">LinkerAI</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 ml-8">
              <Link
                href={paths.public.findWork.getHref()}
                className="text-foreground hover:text-primary transition-colors"
              >
                Find Work
              </Link>
              <Link
                href={paths.public.findExperts.getHref()}
                className="text-foreground hover:text-primary transition-colors"
              >
                Find AI Experts
              </Link>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search for AI experts, automation services..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Desktop Icons */}
                <div className="hidden md:flex items-center space-x-3">
                  <Button variant="ghost" size="icon" onClick={() => router.push(paths.public.help.getHref())}>
                    <HelpCircle className="w-5 h-5" />
                  </Button>

                  {/* Notifications Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="relative inline-flex items-center justify-center rounded-md h-10 w-10 hover:bg-accent hover:text-accent-foreground transition-colors">
                        <Bell className="w-5 h-5" />
                        {unreadNotifications > 0 && (
                          <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-96">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Notifications</span>
                          {unreadNotifications > 0 && (
                            <Badge variant="secondary" className="ml-2">
                              {unreadNotifications} new
                            </Badge>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.map((notification) => (
                          <DropdownMenuItem key={notification.id} className="p-4 cursor-pointer focus:bg-accent">
                            <div className="flex gap-3 w-full">
                              <div className="flex-shrink-0 text-primary mt-0.5">{notification.icon}</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm mb-1 leading-relaxed">{notification.title}</p>
                                <p className="text-xs text-muted-foreground">{notification.time}</p>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="justify-center text-primary cursor-pointer">
                        View all notifications
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button variant="ghost" size="icon" onClick={() => router.push(paths.app.messages.getHref())}>
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                </div>

                {/* Language Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="inline-flex items-center justify-center rounded-md h-10 w-10 hover:bg-accent hover:text-accent-foreground transition-colors">
                      <Globe className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => changeLocale('en')}
                      className={locale === 'en' ? 'bg-primary/10 text-primary' : ''}
                    >
                      <span className="mr-2">🇺🇸</span>
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => changeLocale('fr')}
                      className={locale === 'fr' ? 'bg-primary/10 text-primary' : ''}
                    >
                      <span className="mr-2">🇫🇷</span>
                      Français
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 rounded-full hover:opacity-80 transition-opacity">
                      <Avatar className="w-9 h-9 border-2 border-primary/20">
                        <AvatarImage src={user?.avatarUrl || ''} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72">
                    {/* User Info Header */}
                    <div className="flex items-center gap-3 p-3">
                      <Avatar className="w-12 h-12 border-2 border-primary/20">
                        <AvatarImage src={user?.avatarUrl || ''} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                          {user?.fullName || 'User'}
                        </p>
                        <p className="text-sm text-muted-foreground">{getUserTypeLabel()}</p>
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Online Status Toggle */}
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm">Online for messages</span>
                      <Switch checked={onlineForMessages} onCheckedChange={setOnlineForMessages} />
                    </div>

                    <DropdownMenuSeparator />

                    {/* Menu Items */}
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        if (user?.id) {
                          router.push(
                            user.role === 'freelancer'
                              ? paths.app.freelancerProfile.getHref(user.id)
                              : paths.app.clientProfile.getHref(user.id)
                          );
                        }
                      }}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Your profile
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(paths.app.payments.getHref())}>
                      <Wallet className="w-4 h-4 mr-3" />
                      Payments
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between px-3 py-2 hover:bg-accent rounded-sm">
                      <div className="flex items-center">
                        <Moon className="w-4 h-4 mr-3" />
                        <span className="text-sm">Theme: {darkMode ? 'Dark' : 'Light'}</span>
                      </div>
                      <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                    </div>

                    <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(paths.app.settings.getHref())}>
                      <Settings className="w-4 h-4 mr-3" />
                      Account settings
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Language Dropdown for non-logged in users */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="inline-flex items-center justify-center rounded-md h-10 w-10 hover:bg-accent hover:text-accent-foreground transition-colors">
                      <Globe className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => changeLocale('en')}
                      className={locale === 'en' ? 'bg-primary/10 text-primary' : ''}
                    >
                      <span className="mr-2">🇺🇸</span>
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => changeLocale('fr')}
                      className={locale === 'fr' ? 'bg-primary/10 text-primary' : ''}
                    >
                      <span className="mr-2">🇫🇷</span>
                      Français
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Login/Signup Buttons */}
                <Button
                  variant="ghost"
                  className="hidden md:inline-flex"
                  onClick={() => router.push(paths.auth.login.getHref())}
                >
                  Log In
                </Button>
                <Button className="hidden md:inline-flex" onClick={() => router.push(paths.auth.signup.getHref())}>
                  Sign Up
                </Button>
              </>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 px-6">
                <SheetHeader className="px-0">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription className="sr-only">Navigation menu with links and account settings</SheetDescription>
                </SheetHeader>

                <div className="flex flex-col space-y-6 mt-8">
                  {isLoggedIn ? (
                    <>
                      {/* User Profile Section */}
                      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                        <Avatar className="w-12 h-12 border-2 border-primary/20">
                          <AvatarImage src={user?.avatarUrl || ''} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">
                            {user?.fullName || 'User'}
                          </p>
                          <p className="text-sm text-muted-foreground">{getUserTypeLabel()}</p>
                        </div>
                      </div>

                      {/* Navigation Links */}
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-11 px-4"
                          onClick={() => {
                            router.push(paths.public.findWork.getHref());
                            setMobileMenuOpen(false);
                          }}
                        >
                          Find Work
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-11 px-4"
                          onClick={() => {
                            router.push(paths.public.findExperts.getHref());
                            setMobileMenuOpen(false);
                          }}
                        >
                          Find AI Experts
                        </Button>
                      </div>

                      <div className="border-t pt-5 space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-11 px-4"
                          onClick={() => {
                            if (user?.id) {
                              router.push(
                                user.role === 'freelancer'
                                  ? paths.app.freelancerProfile.getHref(user.id)
                                  : paths.app.clientProfile.getHref(user.id)
                              );
                            }
                            setMobileMenuOpen(false);
                          }}
                        >
                          <User className="w-5 h-5 mr-3" />
                          Your Profile
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full justify-start h-11 px-4"
                          onClick={() => {
                            router.push(paths.app.messages.getHref());
                            setMobileMenuOpen(false);
                          }}
                        >
                          <MessageSquare className="w-5 h-5 mr-3" />
                          Messages
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full justify-start h-11 px-4"
                          onClick={() => {
                            router.push(paths.app.payments.getHref());
                            setMobileMenuOpen(false);
                          }}
                        >
                          <Wallet className="w-5 h-5 mr-3" />
                          Payments
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full justify-start h-11 px-4"
                          onClick={() => {
                            router.push(paths.app.settings.getHref());
                            setMobileMenuOpen(false);
                          }}
                        >
                          <Settings className="w-5 h-5 mr-3" />
                          Settings
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full justify-start h-11 px-4"
                          onClick={() => {
                            router.push(paths.public.help.getHref());
                            setMobileMenuOpen(false);
                          }}
                        >
                          <HelpCircle className="w-5 h-5 mr-3" />
                          Help Center
                        </Button>
                      </div>

                      {/* Settings */}
                      <div className="border-t pt-5 space-y-4">
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm">Online for messages</span>
                          <Switch checked={onlineForMessages} onCheckedChange={setOnlineForMessages} />
                        </div>

                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            <Moon className="w-4 h-4 mr-2" />
                            <span className="text-sm">Dark Mode</span>
                          </div>
                          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                        </div>
                      </div>

                      {/* Logout */}
                      <div className="border-t pt-5">
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-11 px-4 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-5 h-5 mr-3" />
                          Log Out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Navigation Links for logged out users */}
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-11 px-4"
                          onClick={() => {
                            router.push(paths.public.findWork.getHref());
                            setMobileMenuOpen(false);
                          }}
                        >
                          Find Work
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-11 px-4"
                          onClick={() => {
                            router.push(paths.public.findExperts.getHref());
                            setMobileMenuOpen(false);
                          }}
                        >
                          Find AI Experts
                        </Button>
                      </div>

                      {/* Auth Buttons */}
                      <div className="border-t pt-5 space-y-3">
                        <Button
                          className="w-full h-11"
                          onClick={() => {
                            router.push(paths.auth.login.getHref());
                            setMobileMenuOpen(false);
                          }}
                        >
                          Log In
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full h-11"
                          onClick={() => {
                            router.push(paths.auth.signup.getHref());
                            setMobileMenuOpen(false);
                          }}
                        >
                          Sign Up
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search AI experts or projects..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </div>
    </nav>
  );
}
