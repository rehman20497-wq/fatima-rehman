/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";

const NORMAL_TITLES = [
  "❤️ I Love You",
  "❤️ Meri Malkan",
  "❤️ Meri Begam",
  "❤️ Meri Jaan",
  "❤️ Madam G",
  "❤️ Meri Fatima Zara",
  "❤️ Mera Sakoon",
  "❤️ Mera Bacha",
  "❤️ Lakht-e-Jigar",
  "❤️ Antal Hayat",
  "❤️ My Forever",
  "❤️ My Favorite Human",
  "❤️ My Queen",
  "❤️ Fatima ❤️ Rehman",
  "❤️ Aik Khuwaab Tumhare Sath"
];

const LOST_FOCUS_TITLES = [
  "🥺 Oye Wapas Aao...",
  "🥺 Madam G Kahan Chali Gayi?",
  "❤️ Main Yahan Hoon...",
  "💖 Meri Jaan Wapas Aao...",
  "🌹 Miss You...",
  "🥹 Sirf Ek Nazar Aur...",
  "❤️ Fatima, Don't Leave Yet..."
];

const NORMAL_FAVICONS = ["❤️", "💋", "💕", "💖", "😘", "🌹", "💍", "✨"];
const LOST_FOCUS_FAVICONS = ["💋", "😘", "❤️"];

export default function RomanticTabManager() {
  const [isTabFocused, setIsTabFocused] = useState(true);

  // Helper to dynamically set SVG favicon using emoji representation
  const updateFavicon = (emoji: string) => {
    try {
      if (typeof window === "undefined" || typeof document === "undefined") return;
      
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      
      // Create elegant, crisp SVG data URL for the emoji
      const svgString = `<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emoji}</text></svg>`;
      link.href = `data:image/svg+xml,${svgString}`;
    } catch (e) {
      console.warn("Favicon update failed/ignored due to security sandbox constraints", e);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    let normalTitleIndex = 0;
    let lostFocusTitleIndex = 0;
    let normalFaviconIndex = 0;
    let lostFocusFaviconIndex = 0;
    let titleIntervalId: number | null = null;
    let faviconIntervalId: number | null = null;
    let welcomeTimeoutId: number | null = null;

    const startNormalCycles = () => {
      try {
        // Clear any previous interval to prevent leaks
        if (titleIntervalId) clearInterval(titleIntervalId);
        if (faviconIntervalId) clearInterval(faviconIntervalId);

        // Start beautiful Document Title rotation
        document.title = NORMAL_TITLES[normalTitleIndex];
        titleIntervalId = window.setInterval(() => {
          try {
            normalTitleIndex = (normalTitleIndex + 1) % NORMAL_TITLES.length;
            document.title = NORMAL_TITLES[normalTitleIndex];
          } catch (err) {
            console.warn("Failed to update title during normal cycle", err);
          }
        }, 3000); // Rotate every 3 seconds for smooth premium timing

        // Start gorgeous dynamic Favicon animation
        updateFavicon(NORMAL_FAVICONS[normalFaviconIndex]);
        faviconIntervalId = window.setInterval(() => {
          try {
            normalFaviconIndex = (normalFaviconIndex + 1) % NORMAL_FAVICONS.length;
            updateFavicon(NORMAL_FAVICONS[normalFaviconIndex]);
          } catch (err) {
            console.warn("Failed to update favicon during normal cycle", err);
          }
        }, 2500); // Animate smoothly
      } catch (e) {
        console.warn("Error starting normal cycles", e);
      }
    };

    const startLostFocusCycles = () => {
      try {
        // Clear previous intervals
        if (titleIntervalId) clearInterval(titleIntervalId);
        if (faviconIntervalId) clearInterval(faviconIntervalId);

        // Rotate attention-grabbing romantic titles immediately
        document.title = LOST_FOCUS_TITLES[lostFocusTitleIndex];
        titleIntervalId = window.setInterval(() => {
          try {
            lostFocusTitleIndex = (lostFocusTitleIndex + 1) % LOST_FOCUS_TITLES.length;
            document.title = LOST_FOCUS_TITLES[lostFocusTitleIndex];
          } catch (err) {
            console.warn("Failed to update lost-focus title", err);
          }
        }, 2500);

        // Cycle between kiss/heart pulse icons
        updateFavicon(LOST_FOCUS_FAVICONS[lostFocusFaviconIndex]);
        faviconIntervalId = window.setInterval(() => {
          try {
            lostFocusFaviconIndex = (lostFocusFaviconIndex + 1) % LOST_FOCUS_FAVICONS.length;
            updateFavicon(LOST_FOCUS_FAVICONS[lostFocusFaviconIndex]);
          } catch (err) {
            console.warn("Failed to update lost-focus favicon", err);
          }
        }, 1500);
      } catch (e) {
        console.warn("Error starting lost focus cycles", e);
      }
    };

    // Handle initial state setup
    startNormalCycles();

    const handleVisibilityChange = () => {
      try {
        if (document.hidden) {
          setIsTabFocused(false);
          startLostFocusCycles();
        } else {
          setIsTabFocused(true);
          if (titleIntervalId) clearInterval(titleIntervalId);
          if (faviconIntervalId) clearInterval(faviconIntervalId);

          // Show welcome back title alert
          document.title = "❤️ Welcome Back Meri Jaan";
          updateFavicon("💖");

          // Clear any previous welcome timeout
          if (welcomeTimeoutId) clearTimeout(welcomeTimeoutId);

          // Return to normal romantic schedule after 3 seconds
          welcomeTimeoutId = window.setTimeout(() => {
            startNormalCycles();
          }, 3000);
        }
      } catch (e) {
        console.warn("Error handling visibility change", e);
      }
    };

    const handleFocus = () => {
      try {
        if (!isTabFocused) {
          handleVisibilityChange();
        }
      } catch (e) {
        console.warn("Error in handleFocus", e);
      }
    };

    const handleBlur = () => {
      try {
        setIsTabFocused(false);
        startLostFocusCycles();
      } catch (e) {
        console.warn("Error in handleBlur", e);
      }
    };

    try {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("focus", handleFocus);
      window.addEventListener("blur", handleBlur);
    } catch (e) {
      console.warn("Failed to bind tab listeners", e);
    }

    return () => {
      try {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("focus", handleFocus);
        window.removeEventListener("blur", handleBlur);
      } catch (e) {
        console.warn("Failed to unbind tab listeners", e);
      }
      if (titleIntervalId) clearInterval(titleIntervalId);
      if (faviconIntervalId) clearInterval(faviconIntervalId);
      if (welcomeTimeoutId) clearTimeout(welcomeTimeoutId);
    };
  }, [isTabFocused]);

  return null; // Side-effect only component, guarantee no visual layout shifts
}
