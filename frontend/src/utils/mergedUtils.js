// Merged utility functions for Resume Builder
// This file combines downloadPDF.js, formValidation.js, and puppeteerPDF.js

// ============================================================================
// PDF GENERATION UTILITIES
// ============================================================================

// HTML2PDF-based PDF generation
export const generatePDF = async () => {
  try {
    // Dynamic import to avoid SSR issues
    const html2pdf = await import('html2pdf.js');
    
    const element = document.getElementById('resume-preview');
    if (!element) {
      throw new Error('Resume preview element not found');
    }

    const options = {
      margin: 0.5,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait' 
      }
    };

    await html2pdf.default().set(options).from(element).save();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Print-based PDF generation
export const printResume = async () => {
  try {
    const printWindow = window.open('', '_blank');
    const element = document.getElementById('resume-preview');
    
    if (!element || !printWindow) {
      throw new Error('Unable to open print window');
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Resume</title>
          <style>
            body { margin: 0; padding: 20px; }
            @media print {
              body { margin: 0; padding: 0; }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  } catch (error) {
    console.error('Error printing resume:', error);
    throw error;
  }
};

// Puppeteer-based PDF generation with modern CSS support
export const generatePDFWithPuppeteer = async (element, filename = 'resume.pdf') => {
  try {
    // For client-side, we'll use a different approach since Puppeteer runs in Node.js
    // This is a fallback that uses modern browser APIs with better CSS support
    
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      throw new Error('Unable to open print window. Please allow popups for this site.');
    }
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Resume</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Inter', Arial, sans-serif;
              background: white;
              padding: 0;
              margin: 0;
            }
            ${getTemplateStyles()}
            @media print {
              body {
                background: white !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              .section-header {
                background: #1e3a8a !important;
                color: white !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load
    await new Promise(resolve => {
      printWindow.onload = resolve;
      setTimeout(resolve, 1000); // Fallback timeout
    });
    
    // Trigger print dialog
    printWindow.print();
    
    // Close the window after a delay
    setTimeout(() => {
      printWindow.close();
    }, 1000);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Template styles for PDF generation
const getTemplateStyles = () => `
  .preview-container {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    background: white;
    font-family: 'Inter', Arial, sans-serif;
    padding: 2rem;
    box-sizing: border-box;
    text-align: center;
  }
  .section {
    margin-bottom: 2rem;
    break-inside: avoid;
  }
  .section-header {
    background: #1e3a8a;
    color: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 0.75rem;
  }
  .section-header svg {
    vertical-align: baseline;
    transform: translateY(3px);
  }
  .content-item {
    background: #f8fafc;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    margin-bottom: 0.75rem;
    text-align: center;
  }
  .two-column {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }
  .contact-info {
    text-align: center;
    font-size: 0.875rem;
    color: #64748b;
  }
  .contact-table {
    width: 100%;
    border-collapse: collapse;
    margin: 0 auto;
  }
  .contact-table td {
    text-align: center;
    padding: 0 1rem;
    vertical-align: top;
  }
  .contact-item svg {
    display: inline;
    margin-right: 0.5rem;
    vertical-align: text-bottom;
  }
`;

// ============================================================================
// FORM VALIDATION UTILITIES
// ============================================================================

// Basic validation functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

// Comprehensive form validation
export const validateResumeData = (data) => {
  const errors = {};

  // Personal information validation
  if (!validateRequired(data.personal?.firstName)) {
    errors.firstName = 'First name is required';
  }

  if (!validateRequired(data.personal?.lastName)) {
    errors.lastName = 'Last name is required';
  }

  if (!validateRequired(data.personal?.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.personal.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (data.personal?.phone && !validatePhone(data.personal.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  // Experience validation
  if (data.experience && data.experience.length > 0) {
    data.experience.forEach((exp, index) => {
      if (exp.position && !validateRequired(exp.company)) {
        errors[`experience_${index}_company`] = 'Company name is required when position is provided';
      }
    });
  }

  // Education validation
  if (data.education && data.education.length > 0) {
    data.education.forEach((edu, index) => {
      if (edu.degree && !validateRequired(edu.school)) {
        errors[`education_${index}_school`] = 'School name is required when degree is provided';
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Yup schema example (uncomment if using Yup)
/*
import * as Yup from 'yup';

export const resumeValidationSchema = Yup.object({
  personal: Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string(),
    location: Yup.string(),
    summary: Yup.string()
  }),
  experience: Yup.array().of(
    Yup.object({
      position: Yup.string(),
      company: Yup.string(),
      duration: Yup.string(),
      description: Yup.string()
    })
  ),
  education: Yup.array().of(
    Yup.object({
      degree: Yup.string(),
      school: Yup.string(),
      year: Yup.string()
    })
  ),
  skills: Yup.array().of(
    Yup.object({
      name: Yup.string(),
      level: Yup.number().min(0).max(100)
    })
  ),
  projects: Yup.array().of(
    Yup.object({
      name: Yup.string(),
      description: Yup.string(),
      technologies: Yup.array().of(Yup.string())
    })
  )
});
*/
