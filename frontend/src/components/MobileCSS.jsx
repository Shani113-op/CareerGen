import { useEffect } from 'react';
import useMobileDetection from '../hooks/useMobileDetection';

/**
 * Component that conditionally loads mobile CSS
 * Your existing CSS remains for desktop/laptop
 */
const MobileCSS = () => {
  const isMobile = useMobileDetection();

  useEffect(() => {
    // Always clean up first
    const cleanup = () => {
      const existingCSS = document.getElementById('global-mobile-css');
      const existingAggressive = document.getElementById('aggressive-mobile-css');
      
      if (existingCSS) {
        existingCSS.remove();
      }
      if (existingAggressive) {
        existingAggressive.remove();
      }
      
      // Remove mobile classes
      document.body.classList.remove('mobile-mode');
      document.documentElement.classList.remove('mobile-mode');
      
      // Reset any inline styles
      const inputs = document.querySelectorAll('input, textarea, select, button');
      inputs.forEach(input => {
        input.style.width = '';
        input.style.boxSizing = '';
        input.style.fontSize = '';
        input.style.padding = '';
        input.style.minHeight = '';
        input.style.borderRadius = '';
        input.style.marginBottom = '';
      });
    };
    
    // Clean up existing styles first
    cleanup();

    // Add or remove mobile class from body
    if (isMobile) {
      // Add inline mobile CSS for better compatibility
      const style = document.createElement('style');
      style.id = 'global-mobile-css';
      style.textContent = `
        /* Universal Mobile Form Optimizations */
        body.mobile-mode {
          font-size: 14px !important;
          line-height: 1.4 !important;
          overflow-x: hidden !important;
        }
        
        /* All form containers */
        body.mobile-mode .resume-form-container,
        body.mobile-mode .resume-builder-container,
        body.mobile-mode [class*="resume"],
        body.mobile-mode [class*="form-container"] {
          max-width: 100% !important;
          padding: 8px !important;
          margin: 0 !important;
        }
        
        /* All form inputs */
        body.mobile-mode input[type="text"],
        body.mobile-mode input[type="email"],
        body.mobile-mode input[type="tel"],
        body.mobile-mode textarea,
        body.mobile-mode select {
          width: 100% !important;
          padding: 12px !important;
          font-size: 16px !important;
          border-radius: 6px !important;
          box-sizing: border-box !important;
          margin-bottom: 8px !important;
          min-height: 44px !important;
        }
        
        /* All labels */
        body.mobile-mode label {
          font-size: 14px !important;
          font-weight: 600 !important;
          margin-bottom: 4px !important;
          display: block !important;
        }
        
        /* All buttons */
        body.mobile-mode button {
          width: 100% !important;
          padding: 14px 16px !important;
          font-size: 16px !important;
          min-height: 48px !important;
          margin-bottom: 8px !important;
        }
        
        /* Grid systems - force single column */
        body.mobile-mode .grid,
        body.mobile-mode .grid-cols-2,
        body.mobile-mode .sm\\\\:grid-cols-2 {
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
        }
        
        /* Chatbot optimizations - SCOPED TO MOBILE MODE ONLY */
        body.mobile-mode .chatbot-toggle {
          bottom: 15px !important;
          right: 15px !important;
          width: 56px !important;
          height: 56px !important;
        }
        body.mobile-mode .chatbot-container {
          width: 100vw !important;
          height: 100vh !important;
          bottom: 0 !important;
          right: 0 !important;
          left: 0 !important;
          top: 0 !important;
          border-radius: 0 !important;
          position: fixed !important;
          z-index: 9999 !important;
        }
      `;
      document.head.appendChild(style);

      // Add additional aggressive mobile styles
      const aggressiveStyle = document.createElement('style');
      aggressiveStyle.id = 'aggressive-mobile-css';
      aggressiveStyle.textContent = `
        /* Aggressive mobile targeting for all possible form structures */
        body.mobile-mode * {
          box-sizing: border-box !important;
        }
        
        /* Target any input field */
        body.mobile-mode input,
        body.mobile-mode textarea,
        body.mobile-mode select {
          width: 100% !important;
          max-width: 100% !important;
          padding: 12px !important;
          font-size: 16px !important;
          border-radius: 6px !important;
          margin-bottom: 8px !important;
          min-height: 44px !important;
        }
        
        /* Target any container that might hold forms */
        body.mobile-mode div[class*="container"],
        body.mobile-mode div[class*="wrapper"],
        body.mobile-mode div[class*="form"],
        body.mobile-mode main,
        body.mobile-mode section {
          padding-left: 8px !important;
          padding-right: 8px !important;
          max-width: 100% !important;
        }
        
        /* Force all grids to single column */
        body.mobile-mode [class*="grid"],
        body.mobile-mode [style*="grid"],
        body.mobile-mode [style*="display: grid"] {
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
        }
        
        /* Force all flex rows to column */
        body.mobile-mode [class*="flex-row"],
        body.mobile-mode [style*="flex-direction: row"] {
          flex-direction: column !important;
        }
        
        /* Ensure buttons are full width */
        body.mobile-mode button,
        body.mobile-mode [role="button"],
        body.mobile-mode input[type="submit"],
        body.mobile-mode input[type="button"] {
          width: 100% !important;
          padding: 14px !important;
          font-size: 16px !important;
          min-height: 48px !important;
        }
      `;
      document.head.appendChild(aggressiveStyle);

      // Add mobile class to body and html
      document.body.classList.add('mobile-mode');
      document.documentElement.classList.add('mobile-mode');

      // Update viewport for mobile
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        document.head.appendChild(viewport);
      }
      viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';

      // Force a style recalculation and reapply styles
      setTimeout(() => {
        document.body.style.display = 'none';
        // Trigger reflow
        void document.body.offsetHeight;
        document.body.style.display = '';
        
        // Force re-render of all form elements
        const inputs = document.querySelectorAll('input, textarea, select, button');
        inputs.forEach(input => {
          input.style.width = '100%';
          input.style.boxSizing = 'border-box';
          if (input.tagName !== 'BUTTON') {
            input.style.fontSize = '16px';
            input.style.padding = '12px';
          }
        });
      }, 100);

      console.log('🔥 Mobile CSS loaded - Universal form optimizations active');
      console.log('📱 Applied mobile styles to all inputs, buttons, and containers');
    } else {
      // Remove mobile class from body and html (desktop uses existing CSS)
      document.body.classList.remove('mobile-mode');
      document.documentElement.classList.remove('mobile-mode');

      // Remove mobile CSS styles
      const globalCSS = document.getElementById('global-mobile-css');
      const aggressiveCSS = document.getElementById('aggressive-mobile-css');
      if (globalCSS) {
        globalCSS.remove();
      }
      if (aggressiveCSS) {
        aggressiveCSS.remove();
      }

      // Reset any inline styles that were applied
      const inputs = document.querySelectorAll('input, textarea, select, button');
      inputs.forEach(input => {
        input.style.width = '';
        input.style.boxSizing = '';
        input.style.fontSize = '';
        input.style.padding = '';
        input.style.minHeight = '';
        input.style.borderRadius = '';
        input.style.marginBottom = '';
      });

      // Reset viewport for desktop
      let viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.content = 'width=device-width, initial-scale=1';
      }

      // Force a reflow to ensure styles are reset
      setTimeout(() => {
        document.body.style.display = 'none';
        void document.body.offsetHeight;
        document.body.style.display = '';
      }, 50);

      console.log('💻 Desktop mode - mobile CSS removed, using existing CSS');
    }

    // Cleanup function
    return cleanup;
  }, [isMobile]);

  return null; // No debug component needed
};

export default MobileCSS;