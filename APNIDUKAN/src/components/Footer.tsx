import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
          <div>
            <div className="text-xl font-bold">Apni Dukhan</div>
            <div className="text-sm text-gray-600 mt-2">Helping local shops reach nearby customers.</div>
          </div>

          <div className="flex gap-8">
            <div>
              <h5 className="font-semibold">Product</h5>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>Features</li>
                <li>Pricing</li>
                <li>Demo</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold">Company</h5>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>About</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">© {new Date().getFullYear()} Apni Dukhan — All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
