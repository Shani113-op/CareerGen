import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import '../styles/QrPopup.css';

const QrPopup = ({ selectedPlan, onClose }) => {
  const navigate = useNavigate(); // ✅ Define navigate

  const planPrices = {
    '1 Month': '1999',
    '2 Months': '2999',
    '3 Months': '3999',
  };

  const upiId = 'shailapadwal83@okhdfcbank';
  const planAmount = planPrices[selectedPlan];
  const upiLink = `upi://pay?pa=${upiId}&pn=Rahul Padwal&am=${planAmount}&cu=INR`;

  return (
    <div className="qr-popup-overlay">
      <div className="qr-popup-box">
        <span className="close-btn" onClick={onClose}>✖</span>

        <h3>Scan to Pay</h3>
        <p><strong>Plan:</strong> {selectedPlan}</p>
        <p><strong>Amount:</strong> ₹{planAmount}</p>

        {/* ✅ Dynamic QR Code */}
        <QRCodeSVG value={upiLink} size={200} />

        <p><strong>UPI ID:</strong> {upiId}</p>
        <button
          className="copy-upi-btn"
          onClick={() => navigator.clipboard.writeText(upiId)}
        >
          📋 Copy UPI ID
        </button>

        <p>After payment is done, click below to upload receipt:</p>

        {/* ✅ Correct usage of navigate */}
        <button className="done-btn" onClick={() => navigate('/upload-receipt')}>
          📤 Upload Receipt
        </button>
      </div>
    </div>
  );
};

export default QrPopup;
