'use client';

import { SignUp } from '@clerk/nextjs';
 
export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg rounded-lg"
          }
        }}
        forceRedirectUrl="/onboarding"
      />
    </div>
  );
}