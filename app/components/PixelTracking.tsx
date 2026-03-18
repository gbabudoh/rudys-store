'use client';

import { useEffect, useState } from 'react';

interface Pixels {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  x?: string;
  linkedin?: string;
  snapchat?: string;
}

export default function PixelTracking() {
  const [pixels, setPixels] = useState<Pixels>({});

  useEffect(() => {
    fetch('/api/pixel-tracking')
      .then((res) => res.json())
      .then((data) => {
        if (data.pixels) setPixels(data.pixels);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const injectScript = (id: string, code: string) => {
      if (!code || document.getElementById(`pixel-${id}`)) return;
      const container = document.createElement('div');
      container.id = `pixel-${id}`;
      container.style.display = 'none';
      // Parse and inject any <script> and <noscript> tags from the pixel code
      const temp = document.createElement('div');
      temp.innerHTML = code;
      const scripts = temp.querySelectorAll('script');
      scripts.forEach((scriptEl) => {
        const newScript = document.createElement('script');
        if (scriptEl.src) {
          newScript.src = scriptEl.src;
          newScript.async = true;
        } else {
          newScript.textContent = scriptEl.textContent;
        }
        // Copy attributes
        Array.from(scriptEl.attributes).forEach((attr) => {
          if (attr.name !== 'src') newScript.setAttribute(attr.name, attr.value);
        });
        document.head.appendChild(newScript);
      });
      // Append noscript tags to body
      const noscripts = temp.querySelectorAll('noscript');
      noscripts.forEach((ns) => {
        const newNs = document.createElement('noscript');
        newNs.innerHTML = ns.innerHTML;
        document.body.appendChild(newNs);
      });
    };

    if (pixels.facebook) injectScript('facebook', pixels.facebook);
    if (pixels.instagram) injectScript('instagram', pixels.instagram);
    if (pixels.tiktok) injectScript('tiktok', pixels.tiktok);
    if (pixels.x) injectScript('x', pixels.x);
    if (pixels.linkedin) injectScript('linkedin', pixels.linkedin);
    if (pixels.snapchat) injectScript('snapchat', pixels.snapchat);
  }, [pixels]);

  return null;
}
