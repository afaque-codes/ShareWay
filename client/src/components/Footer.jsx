import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#061822] text-gray-400 text-sm py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-4">
            <img
              src="/shareway-logo.svg"
              alt="ShareWay"
              className="h-10 w-auto brightness-0 invert opacity-90"
            />
            <p className="text-xs text-gray-400 leading-relaxed">
              ShareWay is a community-driven ridesharing platform helping commuters travel
              affordably while reducing our shared environmental footprint.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#find-rides" className="hover:text-white transition-colors">Find a Ride</a></li>
              <li><a href="#offer-ride" className="hover:text-white transition-colors">Offer a Ride</a></li>
              <li><a href="#routes" className="hover:text-white transition-colors">Popular Routes</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing & Safety</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Community</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#guidelines" className="hover:text-white transition-colors">Community Guidelines</a></li>
              <li><a href="#safety" className="hover:text-white transition-colors">Safety Standards</a></li>
              <li><a href="#eco" className="hover:text-white transition-colors">Eco Impact Calculator</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">Rider Stories</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#cookies" className="hover:text-white transition-colors">Cookie Settings</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} ShareWay Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for greener journeys with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
