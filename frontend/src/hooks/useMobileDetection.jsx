import { useState, useEffect } from 'react';

/**
 * Custom hook for detecting mobile devices
 * Returns true for mobile, false for desktop/laptop
 */
export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Check screen width (primary method) - more inclusive breakpoint
      const isMobileScreen = width <= 768;
      
      // Check user agent (secondary method)
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileUA = mobileRegex.test(userAgent);
      
      // Device is mobile if either condition is true
      setIsMobile(isMobileScreen || isMobileUA);
    };

    // Initial check
    checkDevice();

    // Listen for window resize
    const handleResize = () => {
      checkDevice();
    };

    // Listen for orientation change
    const handleOrientationChange = () => {
      setTimeout(checkDevice, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return isMobile;
};

export default useMobileDetection;