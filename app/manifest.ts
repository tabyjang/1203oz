/**
 * @file app/manifest.ts
 * @description Web App Manifest 생성 파일
 *
 * PWA 및 모바일 앱 설치를 위한 manifest.json 생성
 */

import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

  return {
    name: "쇼핑몰",
    short_name: "쇼핑몰",
    description: "Next.js + Clerk + Supabase 기반 쇼핑몰",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["shopping", "ecommerce"],
    lang: "ko",
    dir: "ltr",
  };
}

