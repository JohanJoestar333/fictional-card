import React, { useState } from 'react';
import { CardData } from '../types/card';
import { CardVisual } from './CardVisual';
import { sound } from '../utils/audio';
import { Signal, Wifi, Battery, Download, Check, Sparkles, Sliders } from 'lucide-react';

interface AppleWalletViewProps {
  cardData: CardData;
  onDownloadCard: () => void;
}

export const AppleWalletView: React.FC<AppleWalletViewProps> = ({ cardData, onDownloadCard }) => {
  const [viewStyle, setViewStyle] = useState<'apple-pay-done' | 'wallet-stack'>('apple-pay-done');
  const [deviceTheme, setDeviceTheme] = useState<'white' | 'dark'>('white');
  const [checkAnimated, setCheckAnimated] = useState(true);

  const triggerDoneAnimation = () => {
    sound.playChime();
    setCheckAnimated(false);
    setTimeout(() => setCheckAnimated(true), 100);
  };

  const isWhite = deviceTheme === 'white';

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* Presentation Controls Bar */}
      <div className="flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono-card text-neutral-400">iOS Preview:</span>
          <div className="inline-flex p-0.5 rounded-lg bg-neutral-900 border border-neutral-800">
            <button
              onClick={() => {
                sound.playClick();
                setDeviceTheme('white');
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                isWhite ? 'bg-white text-neutral-900 font-semibold shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Apple Pay Sheet (Light)
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setDeviceTheme('dark');
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                !isWhite ? 'bg-neutral-800 text-white font-semibold shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Dark Mode
            </button>
          </div>
        </div>

        <button
          onClick={triggerDoneAnimation}
          className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono-card text-[11px] cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Replay "Done" Haptic</span>
        </button>
      </div>

      {/* ================= EXACT 1:1 IPHONE SCREEN FROM USER SCREENSHOT ================= */}
      <div
        className={`w-full rounded-[3.2rem] p-4 sm:p-6 shadow-[0_30px_90px_rgba(0,0,0,0.8)] border-[6px] border-[#22242c] relative overflow-hidden select-none transition-colors duration-300 ${
          isWhite ? 'bg-white text-black' : 'bg-black text-white'
        }`}
        style={{ minHeight: '640px' }}
      >
        {/* Dynamic Island (Pill with camera & sensor) */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-7 bg-black rounded-full z-40 flex items-center justify-between px-3 border border-neutral-800/80 shadow-md">
          <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-neutral-800"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#0a1428] border border-blue-900/40"></div>
        </div>

        {/* Status Bar: 9:41, Signal, Wi-Fi, Battery */}
        <div className={`flex items-center justify-between px-6 pt-2 pb-8 text-sm font-semibold tracking-tight transition-colors ${
          isWhite ? 'text-black' : 'text-white'
        }`}>
          <span className="font-sans font-semibold text-base">9:41</span>
          <div className="flex items-center gap-2">
            <Signal className="w-4 h-4 fill-current stroke-none" />
            <Wifi className="w-4 h-4 stroke-[2.2]" />
            <div className="relative w-5 h-2.5 border border-current rounded-sm p-[1px] flex items-center">
              <div className="w-full h-full bg-current rounded-[1px]"></div>
              <div className="absolute -right-1 top-0.5 bottom-0.5 w-[1.5px] bg-current rounded-r-xs"></div>
            </div>
          </div>
        </div>

        {/* Floating Card Representation (Pure Apple Wallet Pass Art) */}
        <div className="pt-2 pb-4 flex flex-col items-center justify-center">
          <div className="relative transform hover:scale-[1.01] transition-transform duration-300 cursor-pointer">
            <CardVisual
              cardData={{
                ...cardData,
                walletArtMode: true, // Clean pass artwork matching user's screenshot
              }}
              interactive={true}
              scale={0.88}
              className="drop-shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
            />
          </div>
        </div>

        {/* ================= APPLE PAY BLUE CHECKMARK & "DONE" ================= */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center space-y-3">
          {/* Blue Circle with White Checkmark */}
          <div
            onClick={triggerDoneAnimation}
            className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#007AFF] shadow-md flex items-center justify-center cursor-pointer transition-transform active:scale-95 ${
              checkAnimated ? 'scale-100' : 'scale-75'
            }`}
          >
            <svg
              className="w-9 h-9 sm:w-10 sm:h-10 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          {/* "Done" Text underneath */}
          <div className="text-center">
            <span
              className="text-base sm:text-lg font-normal tracking-tight select-none"
              style={{ color: isWhite ? '#8E8E93' : '#98989D' }}
            >
              Done
            </span>
          </div>
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-36 h-1 bg-neutral-400 rounded-full opacity-60"></div>
      </div>

      {/* Export / Quick Download Button */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-neutral-400 font-mono-card">
          Matches iOS Apple Pay Confirmation
        </span>
        <button
          onClick={() => {
            sound.playChime();
            onDownloadCard();
          }}
          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-98"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Pass PNG</span>
        </button>
      </div>
    </div>
  );
};
