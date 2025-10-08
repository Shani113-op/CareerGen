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
        /* Universal Mobile Optimizations */
        body.mobile-mode {
          font-size: 14px !important;
          line-height: 1.4 !important;
          overflow-x: hidden !important;
          min-height: 100vh !important;
          position: relative !important;
        }
        
        /* ULTIMATE HERO SECTION FULL WIDTH & HEIGHT FIX */
        
        /* Root elements - ensure no constraints */
        html,
        body.mobile-mode html,
        body.mobile-mode body {
          width: 100% !important;
          max-width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          overflow-x: hidden !important;
          min-height: 100vh !important;
          height: 100% !important;
        }

        /* Ensure all elements respect box-sizing */
        body.mobile-mode * {
            box-sizing: border-box !important;
        }
        
        /* App containers */
        body.mobile-mode #root,
        body.mobile-mode .App,
        body.mobile-mode main {
          width: 100% !important;
          max-width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          min-height: 100% !important;
        }
        
        /* HERO SECTION - SIMPLIFIED */
        body.mobile-mode section {
          width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        /* Hero section specific - ensure it fills the screen */
        body.mobile-mode .relative.min-h-screen,
        body.mobile-mode section.relative.min-h-screen {
            width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            min-height: 100vh !important;
        }
        
        /* Container overrides - neutralize */
        body.mobile-mode .container,
        body.mobile-mode .mx-auto {
          width: 100% !important;
          max-width: 100% !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
        
        /* Hero content - preserve readability with minimal padding */
        body.mobile-mode .relative.z-10.text-center,
        body.mobile-mode .text-center.text-white {
          width: 100% !important;
          max-width: 100% !important;
          padding-left: 16px !important;
          padding-right: 16px !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
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
        
        /* All buttons - general styling */
        body.mobile-mode button {
          padding: 14px 16px !important;
          font-size: 16px !important;
          min-height: 48px !important;
          margin-bottom: 8px !important;
        }
        
        /* Hero section buttons - special styling */
        body.mobile-mode .flex.flex-col.gap-4.justify-center.items-center.max-w-md.mx-auto button {
          width: 100% !important;
          padding: 16px 24px !important;
          border-radius: 50px !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          min-height: 56px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 12px !important;
          transition: all 0.3s ease !important;
          margin-bottom: 16px !important;
        }
        
        /* Explore Our Services button - gradient blue to purple */
        body.mobile-mode .flex.flex-col.gap-4 button:first-child {
          background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%) !important;
          color: white !important;
          border: none !important;
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3) !important;
        }
        
        /* Chat with AI button - semi-transparent with border */
        body.mobile-mode .flex.flex-col.gap-4 button:last-child {
          background: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          backdrop-filter: blur(10px) !important;
        }
        
        /* Grid systems - force single column */
        body.mobile-mode .grid,
        body.mobile-mode .grid-cols-2,
        body.mobile-mode .sm\\\\:grid-cols-2 {
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
        }
        
        /* Chatbot toggle - PRESERVE CIRCULAR DESIGN */
        body.mobile-mode .chatbot-toggle {
          bottom: 15px !important;
          right: 15px !important;
        }
        
        body.mobile-mode .chatbot-toggle-btn {
          width: 56px !important;
          height: 56px !important;
          max-width: 56px !important;
          max-height: 56px !important;
          border-radius: 50% !important;
          background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%) !important;
          border: none !important;
          color: white !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3) !important;
          transition: all 0.3s ease !important;
          padding: 0 !important;
          margin: 0 !important;
          flex-shrink: 0 !important;
          font-size: 24px !important;
        }
        
        /* Toggle button icon size */
        body.mobile-mode .chatbot-toggle-btn svg,
        body.mobile-mode .chatbot-toggle-btn i,
        body.mobile-mode .chatbot-toggle-btn span,
        body.mobile-mode .chatbot-toggle-btn *,
        .chatbot-toggle-btn svg,
        .chatbot-toggle-btn i,
        .chatbot-toggle-btn span,
        .chatbot-toggle-btn * {
          width: 24px !important;
          height: 24px !important;
          font-size: 24px !important;
          stroke-width: 2 !important;
        }
        
        /* Mobile chatbot - SAME AS DESKTOP but touch-optimized */
        body.mobile-mode .chatbot-container {
          width: calc(100vw - 32px) !important;
          max-width: 360px !important;
          height: 520px !important;
          bottom: 90px !important;
          right: 16px !important;
          border-radius: 20px !important;
          position: fixed !important;
          z-index: 10000 !important;
          top: auto !important;
          left: auto !important;
          background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%) !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2) !important;
        }
        
        /* Preserve desktop header design */
        body.mobile-mode .chatbot-header {
          padding: 16px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(10px) !important;
        }
        
        /* Preserve desktop header layout */
        body.mobile-mode .chatbot-avatar-header {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
        }
        
        body.mobile-mode .chatbot-bot-avatar {
          width: 40px !important;
          height: 40px !important;
          background: rgba(255, 255, 255, 0.2) !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 20px !important;
        }
        
        body.mobile-mode .chatbot-header-text h3 {
          color: white !important;
          margin: 0 !important;
          font-size: 16px !important;
          font-weight: 600 !important;
        }
        
        body.mobile-mode .chatbot-header-text p {
          color: rgba(255, 255, 255, 0.8) !important;
          margin: 0 !important;
          font-size: 12px !important;
        }
        
        /* Close button - PERFECT CIRCLE LIKE DESKTOP */
        body.mobile-mode .chatbot-close-btn {
          background: rgba(255, 255, 255, 0.2) !important;
          border: none !important;
          color: white !important;
          width: 32px !important;
          height: 32px !important;
          max-width: 32px !important;
          max-height: 32px !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          flex-shrink: 0 !important;
          min-width: 32px !important;
          min-height: 32px !important;
          font-size: 24px !important;
          line-height: 1 !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        /* AGGRESSIVE ICON TARGETING - FINAL FIX */
        body.mobile-mode .chatbot-close-btn svg,
        body.mobile-mode .chatbot-close-btn i,
        body.mobile-mode .chatbot-close-btn span,
        body.mobile-mode .chatbot-close-btn *,
        .chatbot-close-btn svg,
        .chatbot-close-btn i,
        .chatbot-close-btn span,
        .chatbot-close-btn * {
          width: 24px !important;
          height: 24px !important;
          font-size: 24px !important;
          stroke-width: 2.5 !important;
          min-width: 24px !important;
          min-height: 24px !important;
        }
        
        /* Header actions container */
        body.mobile-mode .chatbot-header-actions {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
        
        /* Help button if present */
        body.mobile-mode .chatbot-help-btn {
          background: rgba(255, 255, 255, 0.2) !important;
          border: none !important;
          color: white !important;
          width: 32px !important;
          height: 32px !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          flex-shrink: 0 !important;
          font-size: 20px !important;
        }
        
        /* Help button icon size - larger for visibility */
        body.mobile-mode .chatbot-help-btn svg,
        body.mobile-mode .chatbot-help-btn i {
          width: 20px !important;
          height: 20px !important;
          font-size: 20px !important;
        }
        
        /* Preserve desktop messages area */
        body.mobile-mode .chatbot-messages-area {
          background: #f8fafc !important;
          padding: 16px !important;
        }
        
        /* Keep desktop quick replies grid - 2x2 layout */
        body.mobile-mode .chatbot-quick-replies {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 8px !important;
          margin-top: 12px !important;
        }
        
        /* Touch-friendly quick reply buttons */
        body.mobile-mode .chatbot-quick-reply-btn {
          padding: 12px 14px !important;
          font-size: 13px !important;
          min-height: 44px !important;
          border-radius: 20px !important;
          background: rgba(139, 92, 246, 0.1) !important;
          border: 1px solid rgba(139, 92, 246, 0.3) !important;
          color: #8B5CF6 !important;
        }
        
        /* Keep desktop quick actions grid - 2x2 layout */
        body.mobile-mode .chatbot-quick-actions-grid {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 6px !important;
        }
        
        /* Touch-friendly quick action buttons */
        body.mobile-mode .chatbot-quick-action-button {
          padding: 10px 12px !important;
          font-size: 12px !important;
          min-height: 40px !important;
          border-radius: 16px !important;
          background: rgba(59, 130, 246, 0.1) !important;
          border: 1px solid rgba(59, 130, 246, 0.3) !important;
          color: #3B82F6 !important;
        }
        
        /* Preserve desktop input area design */
        body.mobile-mode .chatbot-input-area {
          padding: 12px 16px 16px !important;
          background: white !important;
          border-top: 1px solid #E5E7EB !important;
        }
        
        /* Preserve desktop input wrapper layout */
        body.mobile-mode .chatbot-input-wrapper {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          background: #F9FAFB !important;
          border-radius: 24px !important;
          padding: 4px !important;
          border: 1px solid #E5E7EB !important;
        }
        
        /* Input field - flex to take available space */
        body.mobile-mode .chatbot-input-field {
          flex: 1 !important;
          border: none !important;
          background: transparent !important;
          padding: 12px 16px !important;
          font-size: 16px !important;
          outline: none !important;
          color: #374151 !important;
          width: auto !important;
        }
        
        /* Send button - PERFECT CIRCLE LIKE DESKTOP */
        body.mobile-mode .chatbot-send-btn {
          width: 36px !important;
          height: 36px !important;
          max-width: 36px !important;
          max-height: 36px !important;
          background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%) !important;
          border: none !important;
          border-radius: 50% !important;
          color: white !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-shrink: 0 !important;
          min-width: 36px !important;
          min-height: 36px !important;
          font-size: 20px !important;
          line-height: 1 !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        /* AGGRESSIVE SEND ICON TARGETING - FINAL FIX */
        body.mobile-mode .chatbot-send-btn svg,
        body.mobile-mode .chatbot-send-btn i,
        body.mobile-mode .chatbot-send-btn span,
        body.mobile-mode .chatbot-send-btn *,
        .chatbot-send-btn svg,
        .chatbot-send-btn i,
        .chatbot-send-btn span,
        .chatbot-send-btn * {
          width: 20px !important;
          height: 20px !important;
          font-size: 20px !important;
          stroke-width: 2.5 !important;
          min-width: 20px !important;
          min-height: 20px !important;
        }
        
        /* Force chatbot popup on ALL mobile screens */
        @media (max-width: 768px) {
          .chatbot-container {
            width: calc(100vw - 32px) !important;
            max-width: 360px !important;
            height: 520px !important;
            bottom: 90px !important;
            right: 16px !important;
            border-radius: 20px !important;
            position: fixed !important;
            z-index: 10000 !important;
            top: auto !important;
            left: auto !important;
          }
          .chatbot-toggle {
            bottom: 15px !important;
            right: 15px !important;
          }
          
          /* FORCE 2x2 grid layout - override Chatbot.css */
          .chatbot-quick-replies,
          .chatbot-quick-actions-grid,
          .chatbot-main-menu-grid,
          body .chatbot-container .chatbot-quick-replies,
          body .chatbot-container .chatbot-quick-actions-grid,
          body .chatbot-container .chatbot-main-menu-grid,
          .chatbot-container .chatbot-messages-area .chatbot-quick-replies,
          .chatbot-container .chatbot-messages-area .chatbot-quick-actions-grid,
          .chatbot-container .chatbot-messages-area .chatbot-main-menu-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }
          
          /* FINAL CLOSE BUTTON ICON FIX */
          .chatbot-close-btn {
            font-size: 24px !important;
          }
          .chatbot-close-btn svg,
          .chatbot-close-btn i,
          .chatbot-close-btn span,
          .chatbot-close-btn * {
            width: 24px !important;
            height: 24px !important;
            font-size: 24px !important;
            stroke-width: 2.5 !important;
          }
          
          /* FINAL SEND BUTTON ICON FIX */
          .chatbot-send-btn {
            font-size: 20px !important;
          }
          .chatbot-send-btn svg,
          .chatbot-send-btn i,
          .chatbot-send-btn span,
          .chatbot-send-btn * {
            width: 20px !important;
            height: 20px !important;
            font-size: 20px !important;
            stroke-width: 2.5 !important;
          }
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
          /* padding-left/right are handled by specific rules now to avoid conflict with full-width sections */
          max-width: 100% !important;
        }
        
        /* Force all grids to single column EXCEPT interest-grid and services-grid */
        body.mobile-mode [class*="grid"]:not(.interest-grid):not(.services-grid),
        body.mobile-mode [style*="grid"]:not(.interest-grid):not(.services-grid),
        body.mobile-mode [style*="display: grid"]:not(.interest-grid):not(.services-grid) {
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
        }
        
        /* Special handling for interest-grid - 2 columns on mobile */
        body.mobile-mode .interest-grid {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 0.8rem !important;
        }
        
        body.mobile-mode .interest-item {
          padding: 1rem 0.8rem !important;
          min-height: 100px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
        }
        
        body.mobile-mode .interest-item .icon {
          font-size: 1.5rem !important;
          margin-bottom: 0.4rem !important;
        }
        
        body.mobile-mode .interest-item span:last-child {
          font-size: 0.85rem !important;
          text-align: center !important;
          line-height: 1.2 !important;
        }
        
        /* ULTRA HIGH SPECIFICITY - Force interest grid to be 2 columns */
        body.mobile-mode .interest-page-container .interest-grid,
        .mobile-mode .interest-page-container .interest-grid,
        body .mobile-mode .interest-page-container .interest-grid {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 0.8rem !important;
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