"use client";

import { SignedOut, SignInButton, SignedIn, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { CartIcon } from "@/components/cart-icon";
import { ThemeToggle } from "@/components/theme-toggle";

const Navbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto" role="banner">
      <Link href="/" className="text-2xl font-bold" aria-label="홈으로 이동">
        쇼핑몰
      </Link>
      <nav className="flex gap-4 items-center" role="navigation" aria-label="주요 네비게이션">
        <Link
          href="/products"
          className="text-sm hover:underline font-medium"
          aria-label="상품 목록"
        >
          상품
        </Link>
        <SignedIn>
          <CartIcon />
          <Link
            href="/my"
            className="text-sm hover:underline font-medium"
            aria-label="마이페이지"
          >
            마이페이지
          </Link>
          <Link
            href="/tasks"
            className="text-sm hover:underline"
            aria-label="작업 목록"
          >
            작업 목록
          </Link>
          <Link
            href="/auth-test"
            className="text-sm hover:underline"
            aria-label="인증 테스트"
          >
            인증 테스트
          </Link>
        </SignedIn>
        {!isSignedIn && (
          <SignedOut>
            <SignInButton mode="modal">
              <Button aria-label="로그인">로그인</Button>
            </SignInButton>
          </SignedOut>
        )}
        <SignedIn>
          <UserButton />
        </SignedIn>
        <ThemeToggle />
      </nav>
    </header>
  );
};

export default Navbar;
