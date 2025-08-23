import React from 'react';
import useMobileDetection from '../hooks/useMobileDetection';

/**
 * Test component to verify mobile detection is working
 * Remove this after testing
 */
const MobileTest = () => {
  const isMobile = useMobileDetection();

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: isMobile ? '#ff4444' : '#44ff44',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      {isMobile ? '📱 Mobile CSS' : '💻 Desktop CSS'}
      <br />
      {window.innerWidth}px
    </div>
  );
};

export default MobileTest;