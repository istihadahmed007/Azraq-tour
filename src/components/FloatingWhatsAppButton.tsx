import React, { useState } from 'react';
import { X, MessageSquare } from 'lucide-react';

interface FloatingWhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  phoneNumber = '8801851172032',
  defaultMessage = 'Hello Azraq! I would like to inquire about tour packages or visa assistance.',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-4 right-4 z-30 p-2.5 rounded-full bg-emerald-600/80 hover:bg-emerald-600 text-white shadow-lg backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer opacity-70 hover:opacity-100"
        title="Open Concierge Chat"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="hidden sm:inline text-[11px]">Chat</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center gap-2">
      {/* Tooltip on hover / expanded */}
      <div
        className={`hidden sm:flex items-center gap-2 bg-slate-900/95 text-white text-xs font-semibold py-2 px-3.5 rounded-2xl border border-emerald-400/40 shadow-2xl backdrop-blur-md transition-all duration-300 pointer-events-none ${
          showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>Chat with Dhaka Concierge (Online)</span>
      </div>

      {/* Floating Action Container */}
      <div className="relative flex items-center">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label="Contact Azraq on WhatsApp"
          className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-2xl hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/20"
        >
          {/* Pulse rings */}
          <span className="absolute -inset-1 rounded-full bg-emerald-400/30 animate-ping pointer-events-none"></span>

          {/* WhatsApp Vector Icon */}
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 fill-current drop-shadow-md group-hover:rotate-12 transition-transform duration-300"
            viewBox="0 0 24 24"
          >
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.99.54 1.777.818 2.796.818 3.182 0 5.768-2.587 5.768-5.767.001-3.182-2.586-5.765-5.768-5.765zm0-2c4.28 0 7.768 3.488 7.768 7.766 0 4.279-3.488 7.768-7.768 7.768-1.282 0-2.483-.314-3.541-.869l-4.49 1.178 1.2-4.382c-.663-1.127-1.045-2.434-1.045-3.695 0-4.278 3.488-7.766 7.768-7.766zm4.17 10.976c-.227.639-1.129 1.173-1.57 1.218-.44.045-.968.106-3.125-.769-2.158-.876-3.524-3.08-3.633-3.224-.108-.143-.865-1.15-.865-2.193 0-1.044.544-1.558.74-1.772.196-.214.428-.268.571-.268.143 0 .286.002.411.008.132.006.31.05.474.444.173.414.59 1.44.641 1.546.052.106.086.23.018.367-.068.136-.102.222-.204.341-.102.12-.214.268-.306.36-.102.102-.209.213-.09.418.118.204.526.867 1.129 1.405.776.691 1.429.905 1.633 1.008.204.102.34.153.39.238.051.085.051.493-.176 1.132z" />
          </svg>

          {/* Online Status Dot */}
          <span className="absolute top-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-300 border-2 border-slate-950"></span>
        </a>

        {/* Small Close Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDismissed(true);
          }}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-[10px] border border-slate-600 shadow-md cursor-pointer transition-colors"
          title="Minimize WhatsApp button"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
