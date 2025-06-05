'use client';

import { SignIn } from '@clerk/nextjs';
 
export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg rounded-lg"
          }
        }}
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
}