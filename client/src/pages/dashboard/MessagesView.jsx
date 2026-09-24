import React, { useState } from 'react';
import { MessageSquare, Send, User, Search } from 'lucide-react';

export default function MessagesView() {
  const [activeChat, setActiveChat] = useState(null);

  const sampleChats = [
    {
      id: '1',
      name: 'Rajesh Sharma (Driver)',
      lastMsg: 'See you at Connaught Place Metro Exit 2 at 7:30 AM.',
      time: '10:45 AM',
      unread: 1,
    },
    {
      id: '2',
      name: 'Pooja Verma (Driver)',
      lastMsg: 'The ride is confirmed. Have a safe journey!',
      time: 'Yesterday',
      unread: 0,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-extrabold text-[#0b2b3d]">Messages</h2>
        <p className="text-sm text-[#475f6e] mt-1">
          Coordinate pickup points and trip details with your co-travelers.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
        {/* Left: Chat List */}
        <div className="md:col-span-4 border-r border-gray-100 p-4 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <div className="space-y-1">
            {sampleChats.map((c) => (
              <div
                key={c.id}
                onClick={() => setActiveChat(c)}
                className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${
                  activeChat?.id === c.id ? 'bg-[#f4faf9] border border-[#b2e5df]' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#008f87] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0b2b3d] truncate">{c.name}</span>
                    <span className="text-[10px] text-gray-400">{c.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">{c.lastMsg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Chat Conversation */}
        <div className="md:col-span-8 flex flex-col justify-between p-6 bg-[#fafbfb]">
          {activeChat ? (
            <>
              <div className="pb-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0b2b3d]">{activeChat.name}</h4>
                  <span className="text-[11px] text-emerald-600 font-semibold">● Online</span>
                </div>
              </div>

              <div className="flex-1 py-6 space-y-3 overflow-y-auto">
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-xs border border-gray-100 shadow-2xs max-w-sm text-xs text-[#0b2b3d]">
                    Hi! Just wanted to confirm if you'll be waiting at Exit 2?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-[#008f87] text-white p-3 rounded-2xl rounded-tr-xs shadow-2xs max-w-sm text-xs">
                    Yes, exactly! I'll be in the white Honda City with hazard lights on.
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#008f87]"
                />
                <button
                  type="button"
                  className="p-2.5 rounded-xl bg-[#008f87] text-white hover:bg-[#00736c] transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="m-auto text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-xs text-gray-400">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
