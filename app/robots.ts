/**
 * @file app/robots.ts
 * @description robots.txt 생성 파일
 *
 * 검색 엔진 크롤러를 위한 robots.txt 설정
 */

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/checkout/",
          "/payment/",
          "/my/",
          "/auth-test/",
          "/storage-test/",
          "/tasks/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/checkout/",
          "/payment/",
          "/my/",
          "/auth-test/",
          "/storage-test/",
          "/tasks/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

