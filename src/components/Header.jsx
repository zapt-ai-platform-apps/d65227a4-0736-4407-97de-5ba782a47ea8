import React from 'react';

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=40&height=40" 
              alt="Website Cloner Logo" 
              className="w-10 h-10 mr-3"
            />
            <h1 className="text-xl font-bold text-gray-800">Website Cloner</h1>
          </div>
          <div>
            <span className="text-sm text-gray-600">Clone any website's appearance instantly</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;