import React, { useState } from 'react';
import { Bell, CheckCheck, Clock, ShieldCheck, Car } from 'lucide-react';

export default function NotificationsView() {
  const [filter, setFilter] = useState('all');

  const notifications = [
    {
      id: '1',
      title: 'Welcome to ShareWay! 🌱',
      message: 'Your account is ready. Discover affordable carpools or offer empty seats today.',
      time: '10 minutes ago',
      type: 'system',
      read: false,
    },
    {
      id: '2',
      title: 'Email Verified',
      message: 'Your email address has been successfully confirmed.',
      time: '1 hour ago',
      type: 'security',
      read: true,
    },
    {
      id: '3',
      title: 'Community Guidelines',
      message: 'Please review our community safety standards before your first journey.',
      time: 'Yesterday',
      type: 'info',
      read: true,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0b2b3d]">Notifications</h2>
          <p className="text-sm text-[#475f6e] mt-1">
            Platform updates, booking confirmations, and community alerts.
          </p>
        </div>

        <button
          type="button"
          className="text-xs font-bold text-[#008f87] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark all as read</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
              !n.read ? 'bg-white border-[#b2e5df] shadow-xs' : 'bg-[#fafbfb] border-gray-100'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#e6f6f5] text-[#008f87] flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#0b2b3d]">{n.title}</h4>
                <span className="text-[10px] text-gray-400">{n.time}</span>
              </div>
              <p className="text-xs text-[#475f6e] leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
