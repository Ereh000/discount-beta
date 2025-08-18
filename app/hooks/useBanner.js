// hooks/useBanner.js
import { useState, useCallback } from "react";

export function useBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [bannerTone, setBannerTone] = useState("info");

  const showError = useCallback((message) => {
    setShowBanner(true);
    setBannerMessage(message);
    setBannerTone("critical");
  }, []);

  const showSuccess = useCallback((message) => {
    setShowBanner(true);
    setBannerMessage(message);
    setBannerTone("success");
  }, []);

  const hideBanner = useCallback(() => {
    setShowBanner(false);
    setBannerMessage("");
  }, []);

  return {
    showBanner,
    bannerMessage,
    bannerTone,
    showError,
    showSuccess,
    hideBanner,
  };
}
