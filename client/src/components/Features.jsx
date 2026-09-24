import React from 'react';
import { ShieldCheck, Wallet, Leaf, Users } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Safe & Verified',
    description: 'Verified users, secure communication',
    color: '#008f87',
    bgColor: '#e6f6f5',
  },
  {
    icon: Wallet,
    title: 'Save Money',
    description: 'Affordable travel options for everyone',
    color: '#008f87',
    bgColor: '#e6f6f5',
  },
  {
    icon: Leaf,
    title: 'Greener Planet',
    description: 'Reduce emissions by sharing rides',
    color: '#40ab50',
    bgColor: '#eef8ef',
  },
  {
    icon: Users,
    title: 'Real Connections',
    description: 'Meet like-minded travellers in your community',
    color: '#008f87',
    bgColor: '#e6f6f5',
  },
];

export default function Features() {
  return (
    <section className="bg-white border-y border-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                  style={{ backgroundColor: feature.bgColor, color: feature.color }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0b2b3d]">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-[#475f6e] mt-0.5 leading-snug">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
