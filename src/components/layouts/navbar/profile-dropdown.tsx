'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/features/auth/lib/auth-client';
import { User, Wallet, Settings, LogOut, Moon, LayoutDashboard } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { paths } from '@/config/paths';

export function ProfileDropdown() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [onlineForMessages, setOnlineForMessages] = useState(true);

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
        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(paths.app.dashboard.getHref())}>
          <LayoutDashboard className="w-4 h-4 mr-3" />
          Dashboard
        </DropdownMenuItem>

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
            <span className="text-sm">Theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
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
  );
}
