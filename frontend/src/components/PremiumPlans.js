// src/components/PremiumPopup.js
import React, { useState } from "react";
import { FaCrown } from "react-icons/fa";
import "../styles/CareerDetail.css";
import QrPopup from './QrPopup';

export default function PremiumPopup({ onClose, onUpgrade }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showQrPopup, setShowQrPopup] = useState(false);

  const handleActivatePremium = () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser || !currentUser.email) {
      alert("❌ Unable to identify user. Please login again.");
      return;
    }

    // ✅ Convert UI label to backend plan key
    let selectedPlanKey;
    if (selectedPlan === "1 Month") selectedPlanKey = "1month";
    else if (selectedPlan === "2 Months") selectedPlanKey = "2months";
    else if (selectedPlan === "3 Months") selectedPlanKey = "3months";
    else {
      alert("⚠️ Please select a valid plan.");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/api/premium/activate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: currentUser.email,
        plan: selectedPlanKey
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.user));
          alert("✅ Payment successful! You now have premium access.");
          onClose();
          onUpgrade?.();
          window.location.reload();
        } else {
          alert("⚠️ Payment success but failed to activate plan. Please contact support.");
        }
      })
      .catch(err => {
        console.error("Activation Error:", err);
        alert("❌ Something went wrong while activating your plan.");
      });
  };

  return (
    <div className="premium-overlay">
      <div className="premium-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>

        <div className="premium-header">
          <FaCrown size={40} color="#ffcc00" className="premium-icon" />
          <h2>Unlock Full Access</h2>
          <p className="premium-subtitle">
            Get detailed roadmaps, expert tips, and downloadable guides for every career.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="plan-cards">
          {["1 Month", "2 Months", "3 Months"].map((plan) => (
            <div
              key={plan}
              className={`plan-card ${selectedPlan === plan ? "selected" : ""} ${plan === "3 Months" ? "popular" : ""}`}
              onClick={() => setSelectedPlan(plan)}
            >
              <h3>{plan}</h3>
              <p>{plan === "1 Month" ? "₹1999" : plan === "3 Months" ? "₹2999" : "₹3999"}</p>
              <span>
                {plan === "1 Month"
                  ? "Ideal for quick exploration"
                  : plan === "3 Months"
                    ? "Most Popular – Save 33%"
                    : "Best value for serious planning"}
              </span>
            </div>
          ))}
        </div>

        <button
          className="subscribe-btn"
          disabled={!selectedPlan}
          onClick={() => setShowQrPopup(true)}
        >
          Upgrade Now
        </button>

        <p className="secure-text">🔒 100% secure payment • Cancel anytime</p>
      </div>

      {/* QR Payment Modal */}
      {showQrPopup && (
        <QrPopup
          selectedPlan={selectedPlan}
          onClose={() => setShowQrPopup(false)}
          onConfirm={handleActivatePremium}
        />
      )}
    </div>
  );
}
