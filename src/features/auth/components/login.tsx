'use client';

import { useState } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, Briefcase, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LanguageSwitcherCompact } from '@/components/language-switcher-compact';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useLogin } from '../api/login';
import { type UserType } from '../types';
import { loginSchema, type LoginFormData } from '../lib/validations';
import { toast } from 'sonner';
import { paths } from '@/config/paths';

interface LoginProps {
  onNavigate?: (screen: string) => void;
  onLogin?: (userType: UserType) => void;
}

export function Login({ onNavigate, onLogin }: LoginProps) {
  const router = useRouter();
  const t = useTranslations('auth');
  const [activeTab, setActiveTab] = useState<UserType>('freelancer');
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const loginMutation = useLogin({
    onSuccess: () => {
      toast.success('Welcome back!');
      onLogin?.(activeTab);
      router.push(paths.app.dashboard.getHref());
    },
    onError: (error) => {
      toast.error('Invalid email or password. Please try again.');
      console.error('Login failed:', error);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  const handleSignupClick = () => {
    if (onNavigate) {
      onNavigate('signup');
    } else {
      router.push(paths.auth.signup.getHref());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-cyan-500/5 flex items-center justify-center px-4 py-8">
      {/* Language Switcher - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcherCompact />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <span className="text-white text-2xl font-bold">L</span>
          </div>
          <h1 className="text-3xl mb-2">{t('login.title')}</h1>
          <p className="text-muted-foreground">{t('login.subtitle')}</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as UserType)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="freelancer" className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <span>{t('login.freelancerTab')}</span>
                </TabsTrigger>
                <TabsTrigger value="client" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{t('login.clientTab')}</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.email')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>{t('common.password')}</FormLabel>
                        <a href="#" className="text-sm text-primary hover:underline">
                          {t('common.forgotPassword')}
                        </a>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={showPassword ? t('common.hidePassword') : t('common.showPassword')}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer">
                        {t('login.rememberMe')}
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? t('login.signingIn') : t('login.signInButton')}
                </Button>
              </form>
            </Form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">{t('login.noAccount')} </span>
              <button
                type="button"
                onClick={handleSignupClick}
                className="text-primary hover:underline font-medium"
              >
                {t('login.signUpLink')}
              </button>
            </div>

            {activeTab === 'freelancer' && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  🚀 Join 10,000+ AI automation experts earning an average of $125/hour
                </p>
              </div>
            )}

            {activeTab === 'client' && (
              <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  💼 Access vetted AI experts and automate your business processes today
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{' '}
            <Link href={paths.public.terms.getHref()} className="text-primary hover:underline">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href={paths.public.privacy.getHref()} className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
