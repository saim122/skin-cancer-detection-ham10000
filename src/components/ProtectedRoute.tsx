'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth-backend';
import { motion } from 'framer-motion';
import { Lock, LogIn, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      
      if (!authenticated) {
        // Store intended destination
        sessionStorage.setItem('redirectAfterLogin', pathname);
      }
    };

    checkAuthentication();
  }, [pathname]);

  // Loading state
  if (isAuth === null) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Verifying access...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - show professional message
  if (!isAuth) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg"
          >
            <Card className="border-primary-200 dark:border-primary-800">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary-100 dark:bg-primary-950 rounded-full">
                    <Lock className="h-12 w-12 text-primary-500" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Authentication Required</CardTitle>
                <CardDescription className="text-base">
                  Please sign in to access your dashboard and view your scan history
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-primary-50 dark:bg-primary-950/20 rounded-lg border border-primary-200 dark:border-primary-800">
                  <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">
                    Why do I need to sign in?
                  </h4>
                  <ul className="text-sm text-primary-800 dark:text-primary-200 space-y-1">
                    <li>• Save and access your scan history</li>
                    <li>• View personalized health insights</li>
                    <li>• Export and download reports</li>
                    <li>• Track your skin health over time</li>
                  </ul>
                </div>

                <div className="flex flex-col space-y-3">
                  <Link href="/auth?mode=login">
                    <Button className="w-full" size="lg">
                      <LogIn className="h-5 w-5 mr-2" />
                      Sign In to Continue
                    </Button>
                  </Link>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                        Don't have an account?
                      </span>
                    </div>
                  </div>

                  <Link href="/auth?mode=signup">
                    <Button variant="outline" className="w-full" size="lg">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Create Free Account
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                  Creating an account is free and takes less than a minute
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Authenticated - render children
  return <>{children}</>;
}

