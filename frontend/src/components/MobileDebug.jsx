import React from 'react';
import useMobileDetection from '../hooks/useMobileDetection';

/**
 * Debug component to show mobile detection status
 * Shows current screen size and device type
 */
const MobileDebug = () => {
  const isMobile = useMobileDetection();
  const [screenSize, setScreenSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  React.useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: isMobile ? '#dc2626' : '#059669',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      zIndex: 10000,
      fontFamily: 'monospace',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        {isMobile ? '📱 MOBILE MODE' : '💻 DESKTOP MODE'}
      </div>
      <div>Screen: {screenSize.width} × {screenSize.height}</div>
      <div>Breakpoint: {screenSize.width <= 768 ? 'Mobile' : 'Desktop'}</div>
      <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.8 }}>
        Resume Form: {isMobile ? 'Optimized' : 'Standard'}
      </div>
    </div>
  );
};

export default MobileDebug;