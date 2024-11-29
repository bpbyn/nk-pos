'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useAuth from '@/hooks/use-auth';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { toast } from 'sonner';

export default function SignIn() {
  const { signInGoogle } = useAuth();

  const handleSignInGoogle = async () => {
    try {
      await signInGoogle();
    } catch (e) {
      toast.error('Failed to sign in. Please try again after sometime');
      console.error('Error occurred while signing in', e);
    }
  };

  return (
    <div className="grid place-items-center px-4">
      <Card className="h-fit max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            <div className="flex justify-center py-4">
              <Image
                src={'/nk_white.png'}
                alt="nk logo"
                priority
                width={100}
                height={100}
                className="hidden transition-all group-hover:scale-110 dark:block"
              />
              <Image
                src={'/nk_black.png'}
                alt="nk logo"
                priority
                width={100}
                height={100}
                className="block transition-all group-hover:scale-110 dark:hidden"
              />
            </div>
            <div>Sign in</div>
          </CardTitle>
          <CardDescription>
            Choose an option below to continue to <b>Northern Kaffeine</b>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Button variant="outline" className="w-full space-x-2" onClick={handleSignInGoogle}>
              <Image src="/google_logo.png" alt="Google logo" width={20} height={20} />
              <span>Sign in with Google</span>
            </Button>
            {/* <Button variant="outline" className="w-full space-x-2" onClick={signInFacebook}>
              <Image src="/fb_logo.png" alt="Facebook logo" width={14} height={14} />
              <span>Sign in with Facebook</span>
            </Button> */}
          </div>
          <div className="mt-6 text-center text-xs text-muted-foreground">
            By signing in, you agree to our&nbsp;
            <Link href="#" className="text-blue-500 underline">
              Terms of Service
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
