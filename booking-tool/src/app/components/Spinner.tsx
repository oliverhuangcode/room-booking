"use client";

import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="spinner-container">
      <div className="spinner" />
      <style jsx>{`
        .spinner-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(82, 146, 223, 0.3);
          border-top-color: #5292df;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Spinner;
