'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <main className="flex flex-col gap-8 items-center max-w-2xl">
        <h1 className="text-5xl font-bold">To-DO List</h1>
        <p className="text-xl">A simple todo app with tRPC and Clerk authentication</p>
        
        <div className="flex justify-center mt-4">
          <SignedIn>
            {/* Redirect to dashboard if signed in */}
            <Button asChild variant="default" size="lg" className="px-8 py-6 text-lg">
              <Link href="/dashboard">My Todo List</Link>
            </Button>
          </SignedIn>
          
          <SignedOut>
            {/* Redirect to sign-in if not signed in */}
            <Button asChild variant="default" size="lg" className="px-8 py-6 text-lg">
              <Link href="/sign-in">Click to open To-Do List</Link>
            </Button>
          </SignedOut>
        </div>
      </main>
    </div>
  );
}
