/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CardData, CardTemplateId, EnvironmentTheme, PresentationMode, UploadedTemplate } from './types/card';
import { CARD_TEMPLATES, TEMPLATE_LIST, INITIAL_TEMPLATE_ID, DEFAULT_BLANK_TEMPLATE, createDefaultTextLayers, FULL_LEGAL_DISCLAIMER } from './utils/cardTemplates';
import { CardVisual } from './components/CardVisual';
import { AppleInspector } from './components/AppleInspector';
import { AppleWalletView } from './components/AppleWalletView';
import { exportCardToCanvas } from './utils/canvasExporter';
import { getSavedTemplates, saveTemplate, deleteTemplate } from './utils/templateStorage';
import { sound } from './utils/audio';
import { 
  CreditCard, 
  Wallet, 
  Download, 
  Sun, 
  Moon, 
  Check, 
  Sparkles,
  MousePointerClick
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'aura_card_studio_v6';

const INITIAL_CARD_DATA: CardData = {
  templateId: INITIAL_TEMPLATE_ID,
  cardholderName: 'JOHAN JOESTAR',
  cardNumber: '•••• •••• •••• 3420',
  isMasked: true,
  expiryMonth: '12',
  expiryYear: '30',
  cvv: '742',
  memberSinceYear: '21',
  customText: 'RESERVE',
  showChip: false,
  showContactless: true,
  backgroundFit: 'cover',
  backgroundBrightness: 100,
  backgroundContrast: 100,
  textLayers: createDefaultTextLayers('JOHAN JOESTAR', INITIAL_TEMPLATE_ID).map((layer) =>
    layer.id === 'cardholder-name' || layer.id === 'card-number'
      ? { ...layer, color: '#090A0F', effect: 'flat' as const }
      : layer
  ),
  selectedLayerId: null,
  walletArtMode: false,
};

export default function App() {
  const [cardData, setCardData] = useState<CardData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure templateId exists in current CARD_TEMPLATES
        const validTemplateId = CARD_TEMPLATES[parsed.templateId as CardTemplateId]
          ? (parsed.templateId as CardTemplateId)
          : INITIAL_TEMPLATE_ID;

        return { 
          ...INITIAL_CARD_DATA, 
          ...parsed,
          templateId: validTemplateId,
          textLayers: parsed.textLayers || INITIAL_CARD_DATA.textLayers,
        };
      }
    } catch {
      // Fallback
    }
    return INITIAL_CARD_DATA;
  });

  const [uploadedTemplates, setUploadedTemplates] = useState<UploadedTemplate[]>(() => getSavedTemplates());
  const [mode, setMode] = useState<PresentationMode>('studio');
  const [theme, setTheme] = useState<EnvironmentTheme>('apple-dark');
  const [isCopied, setIsCopied] = useState(false);
  const [showWalletZone, setShowWalletZone] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dark class on document element
  useEffect(() => {
    if (theme === 'apple-light') {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    }
  }, [theme]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cardData));
    } catch {
      // Ignore
    }
  }, [cardData]);

  // Press ESC to unselect active text layer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (cardData.selectedLayerId !== null) {
          sound.playClick();
          setCardData((prev) => ({ ...prev, selectedLayerId: null }));
          setToastMessage('Deselected text layer');
          setTimeout(() => setToastMessage(null), 2000);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cardData.selectedLayerId]);

  // Handle Photo Upload
  const handleUploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        sound.playChime();
        const newTemplate: UploadedTemplate = {
          id: `template-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          url: dataUrl,
          date: new Date().toLocaleDateString(),
        };
        const updated = saveTemplate(newTemplate);
        setUploadedTemplates(updated);

        // Apply custom photo
        setCardData((prev) => ({
          ...prev,
          customBackgroundImage: dataUrl,
        }));

        setToastMessage(`Custom card background applied!`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteUploadedTemplate = (id: string) => {
    const updated = deleteTemplate(id);
    setUploadedTemplates(updated);
    if (cardData.customBackgroundImage) {
      setCardData((prev) => ({
        ...prev,
        customBackgroundImage: undefined,
      }));
    }
  };

  // Direct layer drag update
  const handleUpdateLayerPosition = (layerId: string, x: number, y: number) => {
    setCardData((prev) => ({
      ...prev,
      textLayers: prev.textLayers.map((l) => (l.id === layerId ? { ...l, x, y } : l)),
    }));
  };

  const handleSelectLayer = (layerId: string | null) => {
    setCardData((prev) => ({ ...prev, selectedLayerId: layerId }));
  };

  const getPreviewWidth = () => {
    const el = document.querySelector('[data-card-preview]') as HTMLElement | null;
    return el?.offsetWidth || 450;
  };

  const handleDownload = async () => {
    try {
      sound.playChime();
      const dataUrl = await exportCardToCanvas(cardData, 2400, 1512, getPreviewWidth());
      const link = document.createElement('a');
      const cardName = (CARD_TEMPLATES[cardData.templateId]?.name || 'Card').replace(/[\\/:*?"<>|]/g, '').trim();
      link.download = `${cardName}.png`;
      link.href = dataUrl;
      link.click();

      setToastMessage(`Exported high-res PNG (2400×1512)`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleCopyClipboard = async () => {
    try {
      sound.playClick();
      const dataUrl = await exportCardToCanvas(cardData, 2400, 1512, getPreviewWidth());
      const blob = await (await fetch(dataUrl)).blob();
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setIsCopied(true);
        setToastMessage('Card copied to clipboard!');
        setTimeout(() => {
          setIsCopied(false);
          setToastMessage(null);
        }, 2500);
      } else {
        handleDownload();
      }
    } catch {
      handleDownload();
    }
  };

  const isLight = theme === 'apple-light';

  // Keep Tailwind's `dark:` styles (used by the editor panel) in sync with the theme toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', !isLight);
  }, [isLight]);
  const currentTemplate = CARD_TEMPLATES[cardData.templateId] || TEMPLATE_LIST[0] || DEFAULT_BLANK_TEMPLATE;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isLight ? 'bg-[#f5f5f7] text-[#1d1d1f]' : 'bg-[#0b0c10] text-[#f5f5f7]'
    }`}>
      {/* ================= HEADER BAR ================= */}
      <header className={`px-6 py-3.5 border-b sticky top-0 z-50 backdrop-blur-xl transition-colors flex items-center justify-between ${
        isLight ? 'bg-white/85 border-[#e5e5ea]' : 'bg-[#14151a]/85 border-[#23242b]'
      }`}>
        {/* Left: Brand Mark */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-sm font-black text-xs">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <span className={`font-bold text-sm tracking-tight block leading-tight ${
                isLight ? 'text-neutral-900' : 'text-white'
              }`}>
                Luxury Card Studio
              </span>
              <span className={`text-[10px] font-medium ${
                isLight ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                {currentTemplate.name}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Segmented View Switcher */}
        <div className="p-1 rounded-2xl bg-neutral-200/80 dark:bg-neutral-800/90 flex items-center gap-1 text-xs font-semibold">
          <button
            onClick={() => {
              sound.playClick();
              setMode('studio');
            }}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'studio'
                ? 'bg-white dark:bg-[#1f2024] text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>Design Studio</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setMode('wallet');
            }}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'wallet'
                ? 'bg-white dark:bg-[#1f2024] text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-amber-500" />
            <span>Apple Pay View</span>
          </button>
        </div>

        {/* Right: Theme Toggle & Export Action */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              sound.playClick();
              setTheme(isLight ? 'apple-dark' : 'apple-light');
            }}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            className="p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            {isLight ? <Moon className="w-4 h-4 text-neutral-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={() => {
              confetti({ particleCount: 35, spread: 55 });
              handleDownload();
            }}
            className="px-4 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PNG</span>
          </button>
        </div>
      </header>

      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1c1e] text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-neutral-700 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= WORKSPACE ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {mode === 'wallet' ? (
          /* Apple Pay Presentation Screen */
          <div className="py-2">
            <AppleWalletView
              cardData={cardData}
              onDownloadCard={handleDownload}
            />
          </div>
        ) : (
          /* Design Studio: Canvas + Inspector */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Center Card Stage (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-4">
              {/* Studio Canvas */}
              <div 
                onClick={(e) => {
                  // Clicking outside the card or on stage unselects text
                  if (e.target === e.currentTarget && cardData.selectedLayerId !== null) {
                    handleSelectLayer(null);
                  }
                }}
                className={`w-full rounded-3xl p-8 sm:p-12 relative flex flex-col items-center justify-center border transition-all ${
                  isLight
                    ? 'bg-white border-[#e5e5ea] shadow-sm'
                    : 'bg-[#14151a] border-[#23242b] shadow-xl'
                }`}
              >
                {/* Active Template Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="px-3 py-1 rounded-full bg-black/60 dark:bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{cardData.customBackgroundImage ? 'Custom Photo' : currentTemplate.name}</span>
                  </div>
                </div>

                {/* Deselect Pill if layer selected */}
                {cardData.selectedLayerId && (
                  <div className="absolute top-4 right-4 z-20">
                    <button
                      onClick={() => handleSelectLayer(null)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      title="Deselect active text layer (or press Esc)"
                    >
                      <MousePointerClick className="w-3.5 h-3.5 text-[#0071E3]" />
                      <span>Deselect Layer (Esc)</span>
                    </button>
                  </div>
                )}

                {/* Interactive Front Card */}
                <div className="py-6 z-10">
                  <CardVisual
                    cardData={cardData}
                    interactive={true}
                    allowLayerDrag={true}
                    showWalletZone={showWalletZone}
                    onSelectLayer={handleSelectLayer}
                    onUpdateLayerPosition={handleUpdateLayerPosition}
                    onUploadImage={handleUploadImage}
                  />
                </div>

                {/* Helpful Canvas Guidance */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs text-neutral-400 font-mono select-none pt-2 text-center">
                  <span>Click any text to select</span>
                  <span>·</span>
                  <span>Drag text to reposition</span>
                  <span>·</span>
                  <span className="text-amber-500 font-semibold">Click card or press Esc to unselect</span>
                </div>

                {/* Apple Wallet number zone notice */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-red-500 font-medium text-center">
                  <span>⚠ Apple Wallet places the card numbers in the red dashed area, so keep it clear.</span>
                  <button
                    onClick={() => setShowWalletZone((v) => !v)}
                    className="underline underline-offset-2 hover:opacity-80 cursor-pointer"
                  >
                    {showWalletZone ? 'Hide guide' : 'Show guide'}
                  </button>
                </div>
              </div>

              {/* Status / Quick Note */}
              <div className="w-full flex items-center justify-between text-xs text-neutral-400 px-2">
                <div>
                  <span>Card Template: </span>
                  <strong className={`font-semibold ${isLight ? 'text-neutral-800' : 'text-neutral-200'}`}>
                    {cardData.customBackgroundImage ? 'Uploaded Card Photo' : currentTemplate.name}
                  </strong>
                </div>

                <div>
                  <span>Selected Layer: </span>
                  {cardData.selectedLayerId ? (
                    <strong className="text-[#0071E3] font-bold">
                      {cardData.textLayers.find((l) => l.id === cardData.selectedLayerId)?.name}
                    </strong>
                  ) : (
                    <span className="italic text-neutral-500">None (Click text or layer to edit)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Inspector Panel (5 cols) */}
            <div className="lg:col-span-5">
              <AppleInspector
                cardData={cardData}
                onChange={(updated) => setCardData(updated)}
                uploadedTemplates={uploadedTemplates}
                onUploadImage={handleUploadImage}
                onDeleteUploadedTemplate={handleDeleteUploadedTemplate}
                onDownload={handleDownload}
                onCopyClipboard={handleCopyClipboard}
                isCopied={isCopied}
              />
            </div>
          </div>
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className={`border-t py-4 px-6 text-center text-xs transition-colors mt-auto ${
        isLight ? 'bg-white/60 border-[#e5e5ea] text-neutral-500' : 'bg-[#14151a]/60 border-[#23242b] text-neutral-400'
      }`}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className={isLight ? 'text-neutral-700 font-medium' : 'text-neutral-400'}>
            Luxury Card Studio · For Props, Creative Content &amp; Mockups
          </span>
          <span className={`text-[11px] ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
            {FULL_LEGAL_DISCLAIMER}
          </span>
        </div>
      </footer>
    </div>
  );
}
