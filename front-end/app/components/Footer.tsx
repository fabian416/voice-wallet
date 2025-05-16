import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 backdrop-blur-sm border-t border-gray-800 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Wally. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
  