'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/features/auth/lib/auth-client';
import {
  Menu,
  User,
  Wallet,
  Settings,
  LogOut,
  Moon,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { paths } from '@/config/paths';

export function MobileMenu() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [onlineForMessages, setOnlineForMessages] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = isAuthenticated && !!user;

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
    await logout();
  };

  return (
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
                {user?.role === 'client' && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-11 px-4"
                    onClick={() => {
                      router.push(paths.public.examples.getHref());
                      setMobileMenuOpen(false);
                    }}
                  >
                    Automation Examples
                  </Button>
                )}
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
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
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
  );
}
