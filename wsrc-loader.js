"use client";

/** @type {import('next/image').ImageLoader} */
export default function wsrvImageLoader({ src, width, quality }) {
  const params = [`w=${width}`];

  if (quality) {
    params.push(`q=${quality}`);
  }

  return `https://wsrv.nl/?url=${encodeURIComponent(src)}&${params.join("&")}`;
}
