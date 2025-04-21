import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © {new Date().getFullYear()} Website Cloner. All rights reserved.
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">
              For educational purposes only. Do not use for copyright infringement.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;