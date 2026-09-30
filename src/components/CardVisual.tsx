import React, { useState, useRef, useEffect } from 'react';
import { CardData, TextLayer } from '../types/card';
import { CARD_TEMPLATES, TEMPLATE_LIST, DEFAULT_BLANK_TEMPLATE, DISCLAIMER_TEXT } from '../utils/cardTemplates';
import { sound } from '../utils/audio';
import { UploadCloud, Lock, X } from 'lucide-react';

interface CardVisualProps {
  cardData: CardData;
  scale?: number;
  className?: string;
  interactive?: boolean;
  allowLayerDrag?: boolean;
  showWalletZone?: boolean;
  onSelectLayer?: (layerId: string | null) => void;
  onUpdateLayerPosition?: (layerId: string, x: number, y: number) => void;
  onUploadImage?: (file: File) => void;
}

export const CardVisual: React.FC<CardVisualProps> = ({
  cardData,
  scale = 1,
  className = '',
  interactive = true,
  allowLayerDrag = true,
  showWalletZone = false,
  onSelectLayer,
  onUpdateLayerPosition,
  onUploadImage,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // 3D Tilt handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current || draggingLayerId) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 10;
    const rotY = ((x - centerX) / centerX) * 10;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.45,
    });
  };

  const handleMouseLeave = () => {
    if (draggingLayerId) return;
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  // Card surface click to deselect text
  const handleCardClick = (e: React.MouseEvent) => {
    // Only deselect if clicked directly on card or background, not when dragging or clicking a text layer
    if (!draggingLayerId && onSelectLayer) {
      onSelectLayer(null);
    }
  };

  // Text layer drag positioning
  const handleLayerPointerDown = (e: React.PointerEvent, layer: TextLayer) => {
    e.stopPropagation();
    sound.playClick();
    if (onSelectLayer) onSelectLayer(layer.id);
    if (!allowLayerDrag || layer.locked || cardData.walletArtMode) return;
    setDraggingLayerId(layer.id);
  };

  useEffect(() => {
    if (!draggingLayerId) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!cardRef.current || !onUpdateLayerPosition) return;
      const rect = cardRef.current.getBoundingClientRect();
      const rawX = ((e.clientX - rect.left) / rect.width) * 100;
      const rawY = ((e.clientY - rect.top) / rect.height) * 100;

      const clampedX = Math.max(2, Math.min(98, Math.round(rawX)));
      const clampedY = Math.max(4, Math.min(96, Math.round(rawY)));

      onUpdateLayerPosition(draggingLayerId, clampedX, clampedY);
    };

    const handlePointerUp = () => {
      setDraggingLayerId(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingLayerId, onUpdateLayerPosition]);

  // File Drag & Drop for user photos
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0] && onUploadImage) {
      onUploadImage(e.dataTransfer.files[0]);
    }
  };

  const getFontFamilyStyle = (font: string) => {
    switch (font) {
      case 'cinzel':
        return '"Cinzel", Georgia, serif';
      case 'cormorant':
        return '"Cormorant Garamond", Georgia, serif';
      case 'playfair':
        return '"Playfair Display", Georgia, serif';
      case 'space-grotesk':
        return '"Space Grotesk", sans-serif';
      case 'inter':
        return '"Inter", sans-serif';
      case 'system':
        return '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      case 'share-tech-mono':
        return '"Share Tech Mono", monospace';
      case 'jetbrains-mono':
        return '"JetBrains Mono", monospace';
      default:
        return '"Cinzel", serif';
    }
  };

  const getTextEffectStyle = (effect: string) => {
    switch (effect) {
      case 'embossed':
        return {
          textShadow: '-1px -1px 0.8px rgba(255, 255, 255, 0.7), 1.5px 1.5px 2.5px rgba(0, 0, 0, 0.95)',
        };
      case 'engraved':
        return {
          textShadow: '1px 1px 0.8px rgba(255, 255, 255, 0.35), -1px -1px 1.5px rgba(0, 0, 0, 0.9)',
        };
      case 'shadow':
        return {
          textShadow: '0 3px 8px rgba(0, 0, 0, 0.85)',
        };
      default:
        return {};
    }
  };

  const currentTemplate = CARD_TEMPLATES[cardData.templateId] || TEMPLATE_LIST[0] || DEFAULT_BLANK_TEMPLATE;
  const backgroundImageSrc = cardData.customBackgroundImage || currentTemplate.imageUrl;

  return (
    <div
      className={`perspective-1000 select-none ${className}`}
      style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
    >
      <div
        ref={cardRef}
        data-card-preview
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="w-[360px] sm:w-[450px] md:w-[490px] aspect-[85.6/54] relative cursor-pointer transform-style-3d transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {/* Specular Sheen Reflection */}
        <div
          className="absolute inset-0 rounded-[1.35rem] pointer-events-none z-30 transition-opacity duration-300 overflow-hidden mix-blend-overlay"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.65) 0%, transparent 60%)`,
          }}
        />

        {/* ==================== CARD FRONT SURFACE ==================== */}
        <div
          className={`absolute inset-0 w-full h-full rounded-[1.35rem] overflow-hidden shadow-2xl transition-all duration-300 border border-white/20 bg-neutral-900 ${
            isDragOver ? 'ring-4 ring-[#0071E3]' : ''
          }`}
          style={{
            boxShadow: isHovered
              ? `0 25px 60px -10px rgba(0,0,0,0.6), 0 0 24px ${currentTemplate.glowColor}`
              : '0 16px 36px -8px rgba(0,0,0,0.45)',
          }}
        >
          {/* CARD BACKGROUND IMAGE (Template Artwork or Custom Uploaded Photo) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              src={backgroundImageSrc}
              alt={currentTemplate.name}
              className="w-full h-full"
              style={{
                objectFit: cardData.backgroundFit || 'cover',
                filter: `brightness(${cardData.backgroundBrightness}%) contrast(${cardData.backgroundContrast}%)`,
              }}
              onError={(e) => {
                // Fallback gradient if image still loading
                const target = e.currentTarget;
                target.style.display = 'none';
              }}
            />
          </div>

          {/* Subtle Outer Metal Bevel Ring */}
          <div className="absolute inset-0 rounded-[1.35rem] border border-white/15 pointer-events-none z-10" />


          {/* APPLE WALLET NUMBER ZONE (editor guide only, never exported) */}
          {showWalletZone && (
            <div
              className="absolute z-40 pointer-events-none border-2 border-dashed border-red-500 bg-red-500/15 rounded-sm flex flex-col items-center justify-center text-center"
              style={{ left: '5.66%', top: '81.3%', width: '24.2%', height: '11.5%' }}
            >
              <span className="text-[8px] sm:text-[9px] font-bold uppercase leading-tight text-red-600 bg-white/85 px-1 rounded">
                ⚠ Apple Wallet numbers
              </span>
              <span className="text-[7px] sm:text-[8px] leading-tight text-red-600 bg-white/85 px-1 rounded mt-0.5">
                Keep this area clear
              </span>
            </div>
          )}

          {/* DYNAMIC TEXT LAYERS (Cardholder name, card number, expiry, etc.) */}
          {cardData.textLayers && cardData.textLayers.map((layer) => {
            if (!layer.visible) return null;
            const isSelected = cardData.selectedLayerId === layer.id;

            return (
              <div
                key={layer.id}
                onPointerDown={(e) => handleLayerPointerDown(e, layer)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectLayer) onSelectLayer(layer.id);
                }}
                className={`absolute select-none z-20 group transition-shadow ${
                  layer.locked 
                    ? 'cursor-pointer' 
                    : 'cursor-grab active:cursor-grabbing'
                } ${
                  isSelected 
                    ? 'ring-2 ring-[#0071E3] ring-offset-2 ring-offset-black/50 rounded-sm' 
                    : 'hover:ring-1 hover:ring-white/40 rounded-sm'
                }`}
                style={{
                  left: `${layer.x}%`,
                  top: `${layer.y}%`,
                  transform: layer.align === 'center' ? 'translateX(-50%)' : layer.align === 'right' ? 'translateX(-100%)' : 'none',
                  opacity: layer.opacity !== undefined ? layer.opacity : 1,
                }}
              >
                <span
                  style={{
                    fontFamily: getFontFamilyStyle(layer.fontFamily),
                    fontSize: `${layer.fontSize * (scale || 1)}px`,
                    fontWeight: layer.fontWeight === 'black' ? 900 : layer.fontWeight === 'bold' ? 700 : layer.fontWeight === 'semibold' ? 600 : layer.fontWeight === 'medium' ? 500 : 400,
                    letterSpacing: `${layer.letterSpacing}px`,
                    color: layer.color,
                    ...getTextEffectStyle(layer.effect),
                  }}
                  className={`inline-block leading-none tracking-wider ${layer.isUppercase ? 'uppercase' : ''}`}
                >
                  {layer.text}
                </span>

                {/* Selected Layer Indicator Pill with Quick Deselect */}
                {isSelected && (
                  <div className="absolute -top-6 left-0 flex items-center gap-1.5 bg-[#0071E3] text-white text-[9px] font-mono px-2 py-0.5 rounded-full shadow-lg pointer-events-auto whitespace-nowrap z-30">
                    {layer.locked && <Lock className="w-2.5 h-2.5" />}
                    <span>{layer.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectLayer) onSelectLayer(null);
                      }}
                      title="Deselect layer (or press Esc)"
                      className="hover:bg-blue-600 rounded-full p-0.5 ml-0.5 transition-colors cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
