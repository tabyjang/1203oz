"use client";

import { SignedOut, SignInButton, SignedIn, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
      <Link href="/" className="text-2xl font-bold">
        쇼핑몰
      </Link>
      <div className="flex gap-4 items-center">
        <Link href="/products" className="text-sm hover:underline font-medium">
          상품
        </Link>
        <SignedIn>
          <Link href="/tasks" className="text-sm hover:underline">
            작업 목록
          </Link>
          <Link href="/auth-test" className="text-sm hover:underline">
            인증 테스트
          </Link>
        </SignedIn>
        {!isSignedIn && (
          <SignedOut>
            <SignInButton mode="modal">
              <Button>로그인</Button>
            </SignInButton>
          </SignedOut>
        )}
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
