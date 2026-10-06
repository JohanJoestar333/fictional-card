import React, { useRef, useState } from 'react';
import { CardData, CardTemplateId, FontFamilyType, TextEffectType, TextLayer, UploadedTemplate } from '../types/card';
import { CARD_TEMPLATES, TEMPLATE_LIST, DEFAULT_BLANK_TEMPLATE, FONT_OPTIONS, COLOR_PRESETS, createDefaultTextLayers } from '../utils/cardTemplates';
import { USER_CARD_TEMPLATES } from '../config/cardTemplates';
import { sound } from '../utils/audio';
import { 
  Upload, 
  Trash2, 
  Plus, 
  Layers, 
  Type, 
  Image as ImageIcon, 
  Move, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Check, 
  Download, 
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown,
  CopyPlus,
  X,
  Sparkles,
  Sliders,
  RotateCcw,
  ExternalLink
} from 'lucide-react';

interface AppleInspectorProps {
  cardData: CardData;
  onChange: (updated: CardData) => void;
  uploadedTemplates: UploadedTemplate[];
  onUploadImage: (file: File) => void;
  onDeleteUploadedTemplate: (id: string) => void;
  onDownload: () => void;
  onCopyClipboard: () => void;
  isCopied: boolean;
}

export const AppleInspector: React.FC<AppleInspectorProps> = ({
  cardData,
  onChange,
  uploadedTemplates,
  onUploadImage,
  onDeleteUploadedTemplate,
  onDownload,
  onCopyClipboard,
  isCopied,
}) => {
  const [activeTab, setActiveTab] = useState<'template' | 'layers' | 'export'>('template');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedLayer = cardData.textLayers.find((l) => l.id === cardData.selectedLayerId) || null;

  // Unselect text handler
  const handleDeselectLayer = () => {
    sound.playClick();
    onChange({ ...cardData, selectedLayerId: null });
  };

  const handleSelectLayer = (id: string | null) => {
    sound.playClick();
    onChange({ ...cardData, selectedLayerId: id });
  };

  const handleUpdateSelectedLayer = (updates: Partial<TextLayer>) => {
    if (!selectedLayer) return;
    const updatedLayers = cardData.textLayers.map((layer) =>
      layer.id === selectedLayer.id ? { ...layer, ...updates } : layer
    );
    onChange({ ...cardData, textLayers: updatedLayers });
  };

  const handleUpdateSpecificLayer = (id: string, updates: Partial<TextLayer>) => {
    const updatedLayers = cardData.textLayers.map((layer) =>
      layer.id === id ? { ...layer, ...updates } : layer
    );
    onChange({ ...cardData, textLayers: updatedLayers });
  };

  // Reordering layers (move up/down in stack)
  const handleMoveLayer = (index: number, direction: 'up' | 'down') => {
    sound.playClick();
    const newLayers = [...cardData.textLayers];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newLayers.length) return;
    const temp = newLayers[index];
    newLayers[index] = newLayers[targetIndex];
    newLayers[targetIndex] = temp;
    onChange({ ...cardData, textLayers: newLayers });
  };

  // Toggle layer visibility
  const handleToggleVisibility = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    const updatedLayers = cardData.textLayers.map((layer) =>
      layer.id === id ? { ...layer, visible: !layer.visible } : layer
    );
    onChange({ ...cardData, textLayers: updatedLayers });
  };

  // Toggle layer lock
  const handleToggleLock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    const updatedLayers = cardData.textLayers.map((layer) =>
      layer.id === id ? { ...layer, locked: !layer.locked } : layer
    );
    onChange({ ...cardData, textLayers: updatedLayers });
  };

  // Duplicate layer
  const handleDuplicateLayer = (layer: TextLayer, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playChime();
    const newId = `layer-${Date.now()}`;
    const duplicated: TextLayer = {
      ...layer,
      id: newId,
      name: `${layer.name} (Copy)`,
      x: Math.min(90, layer.x + 3),
      y: Math.min(90, layer.y + 4),
    };
    onChange({
      ...cardData,
      textLayers: [...cardData.textLayers, duplicated],
      selectedLayerId: newId,
    });
  };

  // Delete layer
  const handleDeleteLayer = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playClick();
    const filtered = cardData.textLayers.filter((l) => l.id !== id);
    onChange({
      ...cardData,
      textLayers: filtered,
      selectedLayerId: cardData.selectedLayerId === id ? null : cardData.selectedLayerId,
    });
  };

  // Add custom layer
  const handleAddNewLayer = (presetType?: string) => {
    sound.playClick();
    const newId = `layer-${Date.now()}`;
    let newLayer: TextLayer;

    const currentTemplate = CARD_TEMPLATES[cardData.templateId];
    const defaultColor = currentTemplate?.defaultTextColor || '#FFFFFF';

    switch (presetType) {
      case 'name':
        newLayer = {
          id: newId,
          name: 'Cardholder Name',
          text: 'VICTORIA MONROE',
          visible: true,
          locked: false,
          fontFamily: 'cinzel',
          fontSize: 16,
          fontWeight: 'bold',
          letterSpacing: 2,
          color: defaultColor,
          effect: 'embossed',
          x: 8,
          y: 67,
          align: 'left',
          isUppercase: true,
        };
        break;
      case 'number':
        newLayer = {
          id: newId,
          name: 'Card Number',
          text: '3759 876543 21001',
          visible: true,
          locked: false,
          fontFamily: 'share-tech-mono',
          fontSize: 14,
          fontWeight: 'semibold',
          letterSpacing: 2,
          color: defaultColor,
          effect: 'embossed',
          x: 8,
          y: 60,
          align: 'left',
          isUppercase: true,
        };
        break;
      case 'expiry':
        newLayer = {
          id: newId,
          name: 'Valid Thru',
          text: 'GOOD THRU 09/31',
          visible: true,
          locked: false,
          fontFamily: 'share-tech-mono',
          fontSize: 10,
          fontWeight: 'medium',
          letterSpacing: 1.5,
          color: defaultColor,
          effect: 'flat',
          x: 48,
          y: 84,
          align: 'left',
          isUppercase: true,
        };
        break;
      case 'member':
        newLayer = {
          id: newId,
          name: 'Member Since',
          text: 'MEMBER SINCE 2022',
          visible: true,
          locked: false,
          fontFamily: 'space-grotesk',
          fontSize: 9,
          fontWeight: 'semibold',
          letterSpacing: 1.5,
          color: defaultColor,
          effect: 'flat',
          x: 8,
          y: 75,
          align: 'left',
          isUppercase: true,
        };
        break;
      default:
        newLayer = {
          id: newId,
          name: `Custom Layer ${cardData.textLayers.length + 1}`,
          text: 'ROYAL RESERVE',
          visible: true,
          locked: false,
          fontFamily: 'cinzel',
          fontSize: 14,
          fontWeight: 'bold',
          letterSpacing: 2,
          color: defaultColor,
          effect: 'embossed',
          x: 50,
          y: 50,
          align: 'center',
          isUppercase: true,
        };
    }

    onChange({
      ...cardData,
      textLayers: [...cardData.textLayers, newLayer],
      selectedLayerId: newId,
    });
    setActiveTab('layers');
  };

  // Switch template
  const handleSelectTemplate = (templateId: CardTemplateId) => {
    sound.playChime();
    const template = CARD_TEMPLATES[templateId];
    onChange({
      ...cardData,
      templateId,
      customBackgroundImage: undefined, // Clear custom photo to show new card template artwork
    });
  };

  // Reset to default layers for template
  const handleApplyDefaultLayers = () => {
    sound.playClick();
    const freshLayers = createDefaultTextLayers(cardData.cardholderName || 'JOHAN JOESTAR', cardData.templateId);
    onChange({
      ...cardData,
      textLayers: freshLayers,
      selectedLayerId: freshLayers[0].id,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white dark:bg-[#161617] rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-xl overflow-hidden flex flex-col font-sans transition-colors">
      {/* ================= TAB NAVIGATION ================= */}
      <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 bg-[#f9f9fb] dark:bg-[#1e1e20]">
        <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-200/70 dark:bg-neutral-800/90 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('template');
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'template'
                ? 'bg-white dark:bg-[#2c2c2e] text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>Card Design</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('layers');
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
              activeTab === 'layers'
                ? 'bg-white dark:bg-[#2c2c2e] text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>Layers ({cardData.textLayers.length})</span>
            {selectedLayer && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3] absolute top-1.5 right-2" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('export');
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'export'
                ? 'bg-white dark:bg-[#2c2c2e] text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: CARD TEMPLATES & PHOTO ================= */}
      {activeTab === 'template' && (
        <div className="p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar">
          {/* Card Template Grid & Code Notice */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Card Templates
                </h3>
                <p className="text-xs text-neutral-500">
                  {USER_CARD_TEMPLATES.length > 0 
                    ? `${USER_CARD_TEMPLATES.length} custom template${USER_CARD_TEMPLATES.length === 1 ? '' : 's'}` 
                    : 'Select a card template'}
                </p>
              </div>
              <button
                onClick={handleApplyDefaultLayers}
                className="text-[11px] text-[#0071E3] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                title="Reset text positions to template defaults"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Text</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TEMPLATE_LIST.map((template) => {
                const isSelected = cardData.templateId === template.id && !cardData.customBackgroundImage;
                return (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template.id)}
                    className={`group text-left rounded-2xl p-2 transition-all border flex flex-col cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'border-[#0071E3] ring-2 ring-[#0071E3]/20 bg-blue-50/40 dark:bg-blue-950/20'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-[#1f1f21]'
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="w-full aspect-[85.6/54] rounded-xl overflow-hidden bg-neutral-900 relative shadow-sm border border-black/10">
                      <img
                        src={template.imageUrl}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#0071E3] text-white flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                      <div className="absolute bottom-1 left-1.5">
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-black/70 text-white backdrop-blur-xs">
                          {template.badge}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <div className="font-semibold text-xs text-neutral-900 dark:text-white truncate">
                        {template.name}
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                        {template.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Card Upload & Resource Link */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-neutral-500">
                Upload your card
              </h4>
              {cardData.customBackgroundImage && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onChange({ ...cardData, customBackgroundImage: undefined });
                  }}
                  className="text-xs text-red-500 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Revert to Card Template</span>
                </button>
              )}
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-[#0071E3] dark:hover:border-[#0071E3] rounded-2xl p-4 text-center cursor-pointer transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-1.5">
                <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0071E3] flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  {cardData.customBackgroundImage ? 'Upload Different Card' : 'Upload Your Card'}
                </div>
                <div className="text-[11px] text-neutral-400">
                  Drag &amp; drop PNG, JPG or WebP (Standard card aspect ratio: 85.6 × 54)
                </div>
              </div>
            </div>

            {/* Link to Community Card Designs */}
            <div className="mt-3 p-3 rounded-2xl bg-neutral-100 dark:bg-[#1e1f24] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0">
                <div className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                  Looking for card designs?
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                  Explore custom card graphics &amp; community templates
                </p>
              </div>
              <a
                href="https://fearthez.com/2022/01/23/card-designs/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-[#0071E3] hover:text-[#005bb5] font-semibold text-xs border border-neutral-200 dark:border-neutral-700 shrink-0 flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <span>Card Designs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Custom Photo Adjustments */}
            {cardData.customBackgroundImage && (
              <div className="mt-4 p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Image Fit</span>
                  <div className="flex rounded-lg bg-neutral-200 dark:bg-neutral-700 p-0.5 text-xs font-semibold">
                    {(['cover', 'contain', 'fill'] as const).map((fit) => (
                      <button
                        key={fit}
                        onClick={() => onChange({ ...cardData, backgroundFit: fit })}
                        className={`px-2.5 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                          cardData.backgroundFit === fit
                            ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        {fit}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
                    <span>Brightness</span>
                    <span>{cardData.backgroundBrightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={cardData.backgroundBrightness}
                    onChange={(e) => onChange({ ...cardData, backgroundBrightness: Number(e.target.value) })}
                    className="w-full accent-[#0071E3]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
                    <span>Contrast</span>
                    <span>{cardData.backgroundContrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={cardData.backgroundContrast}
                    onChange={(e) => onChange({ ...cardData, backgroundContrast: Number(e.target.value) })}
                    className="w-full accent-[#0071E3]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: LAYERS & TYPOGRAPHY ================= */}
      {activeTab === 'layers' && (
        <div className="p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar">
          {/* Top Banner: Selection Status & Deselect Button */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-100 dark:bg-[#222225] border border-neutral-200 dark:border-neutral-800">
            {selectedLayer ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0071E3]" />
                  <div>
                    <div className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <span>Editing: {selectedLayer.name}</span>
                      {selectedLayer.locked && <Lock className="w-3 h-3 text-amber-500" />}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      Press <kbd className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 font-mono text-[9px]">Esc</kbd> or click Deselect
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDeselectLayer}
                  className="px-3 py-1.5 rounded-xl bg-[#0071E3] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Deselect</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-neutral-400" />
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    No text selected · Select a layer below or click card
                  </span>
                </div>
                <button
                  onClick={() => handleAddNewLayer()}
                  className="px-2.5 py-1 rounded-xl bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <div className="text-xs font-semibold text-neutral-500 mb-2">
              Quick Add Presets
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => handleAddNewLayer('name')}
                className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-[#0071E3] bg-neutral-50 dark:bg-neutral-800/40 text-left font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-[#0071E3]" />
                <span>Cardholder Name</span>
              </button>
              <button
                onClick={() => handleAddNewLayer('number')}
                className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-[#0071E3] bg-neutral-50 dark:bg-neutral-800/40 text-left font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-[#0071E3]" />
                <span>Card Number (16-Digit)</span>
                <span className="ml-auto text-[10px] text-red-500" title="Apple Wallet already shows the card numbers">⚠ Wallet adds it</span>
              </button>
              <button
                onClick={() => handleAddNewLayer('expiry')}
                className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-[#0071E3] bg-neutral-50 dark:bg-neutral-800/40 text-left font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-[#0071E3]" />
                <span>Valid Thru (MM/YY)</span>
              </button>
              <button
                onClick={() => handleAddNewLayer('member')}
                className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-[#0071E3] bg-neutral-50 dark:bg-neutral-800/40 text-left font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-[#0071E3]" />
                <span>Member Since</span>
              </button>
            </div>
          </div>

          {/* ================= LAYER STACK LIST ================= */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-500">
                Layer Hierarchy (Top to Bottom)
              </span>
              <span className="text-[11px] text-neutral-400">
                Click layer to edit properties
              </span>
            </div>

            <div className="space-y-1.5">
              {cardData.textLayers.map((layer, index) => {
                const isSelected = cardData.selectedLayerId === layer.id;
                return (
                  <div
                    key={layer.id}
                    onClick={() => handleSelectLayer(layer.id)}
                    className={`group flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0071E3] bg-blue-50/50 dark:bg-blue-950/30 shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-[#1a1a1c]'
                    }`}
                  >
                    {/* Left: Visibility + Lock + Name */}
                    <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
                      {/* Visibility Toggle */}
                      <button
                        onClick={(e) => handleToggleVisibility(layer.id, e)}
                        title={layer.visible ? 'Hide layer' : 'Show layer'}
                        className={`p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer ${
                          layer.visible ? 'text-neutral-600 dark:text-neutral-300' : 'text-neutral-300 dark:text-neutral-600'
                        }`}
                      >
                        {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Lock Toggle */}
                      <button
                        onClick={(e) => handleToggleLock(layer.id, e)}
                        title={layer.locked ? 'Unlock layer' : 'Lock layer'}
                        className={`p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer ${
                          layer.locked ? 'text-amber-500' : 'text-neutral-300 dark:text-neutral-600'
                        }`}
                      >
                        {layer.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>

                      {/* Name & Text snippet */}
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate flex items-center gap-1.5">
                          <span>{layer.name}</span>
                          {isSelected && (
                            <span className="text-[9px] font-semibold text-[#0071E3] bg-blue-100 dark:bg-blue-900/50 px-1 rounded">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono truncate">
                          "{layer.text}"
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions (Move up/down, duplicate, delete) */}
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveLayer(index, 'up');
                        }}
                        title="Move layer up"
                        className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-20 cursor-pointer"
                      >
                        <ChevronUp className="w-3.5 h-3.5 text-neutral-500" />
                      </button>

                      <button
                        disabled={index === cardData.textLayers.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveLayer(index, 'down');
                        }}
                        title="Move layer down"
                        className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-20 cursor-pointer"
                      >
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                      </button>

                      <button
                        onClick={(e) => handleDuplicateLayer(layer, e)}
                        title="Duplicate layer"
                        className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer ml-1"
                      >
                        <CopyPlus className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => handleDeleteLayer(layer.id, e)}
                        title="Delete layer"
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-950/40 text-neutral-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= ACTIVE LAYER DETAILED PROPERTIES ================= */}
          {selectedLayer && (
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-[#0071E3] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Layer Properties</span>
                </h4>

                <button
                  onClick={handleDeselectLayer}
                  className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-medium flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Unselect</span>
                </button>
              </div>

              {/* Text Value & Uppercase Toggle */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs text-neutral-600 dark:text-neutral-400">
                  <label className="font-semibold">Text Content</label>
                  <button
                    onClick={() => handleUpdateSelectedLayer({ isUppercase: !selectedLayer.isUppercase })}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors cursor-pointer ${
                      selectedLayer.isUppercase
                        ? 'bg-[#0071E3] text-white border-[#0071E3]'
                        : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    AA ALL CAPS
                  </button>
                </div>
                <input
                  type="text"
                  value={selectedLayer.text}
                  onChange={(e) => handleUpdateSelectedLayer({ text: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1f1f21] text-neutral-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#0071E3] focus:border-transparent outline-none"
                  placeholder="Enter card text..."
                />
                {(selectedLayer.id === 'card-number' || /number/i.test(selectedLayer.name)) && (
                  <div className="flex items-start gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-2.5 py-2 text-[11px] leading-snug text-red-600 dark:text-red-400">
                    <span>⚠</span>
                    <span>
                      Adding this card to Apple Wallet? Wallet already shows the card numbers on its own
                      (the red dashed area on the card), so you may not need this number layer.
                    </span>
                  </div>
                )}
              </div>

              {/* Layer Title / Label */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Layer Label (for organization)
                </label>
                <input
                  type="text"
                  value={selectedLayer.name}
                  onChange={(e) => handleUpdateSelectedLayer({ name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1f1f21] text-neutral-800 dark:text-neutral-200 text-xs focus:ring-1 focus:ring-[#0071E3] outline-none"
                />
              </div>

              {/* Positioning (X% and Y%) */}
              <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  <div className="flex items-center gap-1.5">
                    <Move className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Position on Card</span>
                  </div>
                  {/* Quick Center button */}
                  <button
                    onClick={() => handleUpdateSelectedLayer({ x: 50, align: 'center' })}
                    className="text-[11px] text-[#0071E3] hover:underline cursor-pointer font-medium"
                  >
                    Center Horizontally
                  </button>
                </div>

                {/* X Position Slider + Stepper */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>Horizontal (X): {selectedLayer.x}%</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleUpdateSelectedLayer({ x: Math.max(2, selectedLayer.x - 1) })}
                        className="w-5 h-5 rounded bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer font-semibold text-xs"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleUpdateSelectedLayer({ x: Math.min(98, selectedLayer.x + 1) })}
                        className="w-5 h-5 rounded bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer font-semibold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="98"
                    value={selectedLayer.x}
                    onChange={(e) => handleUpdateSelectedLayer({ x: Number(e.target.value) })}
                    className="w-full accent-[#0071E3]"
                  />
                </div>

                {/* Y Position Slider + Stepper */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>Vertical (Y): {selectedLayer.y}%</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleUpdateSelectedLayer({ y: Math.max(4, selectedLayer.y - 1) })}
                        className="w-5 h-5 rounded bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer font-semibold text-xs"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleUpdateSelectedLayer({ y: Math.min(96, selectedLayer.y + 1) })}
                        className="w-5 h-5 rounded bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer font-semibold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="96"
                    value={selectedLayer.y}
                    onChange={(e) => handleUpdateSelectedLayer({ y: Number(e.target.value) })}
                    className="w-full accent-[#0071E3]"
                  />
                </div>

                {/* Alignment */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-neutral-500">Alignment</span>
                  <div className="flex rounded-xl bg-neutral-200 dark:bg-neutral-700 p-0.5">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => handleUpdateSelectedLayer({ align })}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          selectedLayer.align === align
                            ? 'bg-white dark:bg-neutral-900 text-[#0071E3] shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                        {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                        {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Font Family */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Font Family
                </label>
                <select
                  value={selectedLayer.fontFamily}
                  onChange={(e) => handleUpdateSelectedLayer({ fontFamily: e.target.value as FontFamilyType })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1f1f21] text-neutral-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0071E3] outline-none cursor-pointer"
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font.id} value={font.id}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size & Weight */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>Size</span>
                    <span className="font-semibold">{selectedLayer.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="36"
                    value={selectedLayer.fontSize}
                    onChange={(e) => handleUpdateSelectedLayer({ fontSize: Number(e.target.value) })}
                    className="w-full accent-[#0071E3]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>Spacing</span>
                    <span className="font-semibold">{selectedLayer.letterSpacing}px</span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="6"
                    step="0.5"
                    value={selectedLayer.letterSpacing}
                    onChange={(e) => handleUpdateSelectedLayer({ letterSpacing: Number(e.target.value) })}
                    className="w-full accent-[#0071E3]"
                  />
                </div>
              </div>

              {/* Font Weight Buttons */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Weight
                </label>
                <div className="grid grid-cols-4 gap-1 text-xs">
                  {(['normal', 'medium', 'bold', 'black'] as const).map((w) => (
                    <button
                      key={w}
                      onClick={() => handleUpdateSelectedLayer({ fontWeight: w })}
                      className={`py-1.5 rounded-lg capitalize border font-medium transition-colors cursor-pointer ${
                        selectedLayer.fontWeight === w
                          ? 'border-[#0071E3] bg-[#0071E3] text-white shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Color Swatches & Custom Color */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Metallic &amp; Foil Colors
                </label>
                <div className="flex flex-wrap gap-2 items-center">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleUpdateSelectedLayer({ color: p.color })}
                      title={p.name}
                      style={{ backgroundColor: p.color }}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer relative shadow-xs ${
                        selectedLayer.color.toLowerCase() === p.color.toLowerCase()
                          ? 'border-[#0071E3] scale-110 ring-2 ring-[#0071E3]/40'
                          : 'border-neutral-300 dark:border-neutral-600 hover:scale-105'
                      }`}
                    >
                      {selectedLayer.color.toLowerCase() === p.color.toLowerCase() && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className={`w-3.5 h-3.5 stroke-[3] ${p.color === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                        </div>
                      )}
                    </button>
                  ))}

                  {/* Native Hex Picker */}
                  <div className="relative">
                    <input
                      type="color"
                      value={selectedLayer.color}
                      onChange={(e) => handleUpdateSelectedLayer({ color: e.target.value })}
                      className="w-7 h-7 rounded-full opacity-0 absolute inset-0 cursor-pointer"
                    />
                    <div 
                      className="w-7 h-7 rounded-full border-2 border-dashed border-neutral-400 flex items-center justify-center text-neutral-500 pointer-events-none"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Visual Effects */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Engraving &amp; Foil Effect
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {(['flat', 'embossed', 'engraved', 'shadow'] as const).map((eff) => (
                    <button
                      key={eff}
                      onClick={() => handleUpdateSelectedLayer({ effect: eff })}
                      className={`py-1.5 px-2 rounded-xl capitalize font-medium border transition-colors cursor-pointer ${
                        selectedLayer.effect === eff
                          ? 'border-[#0071E3] bg-blue-50 dark:bg-blue-950/40 text-[#0071E3] font-semibold shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                      }`}
                    >
                      {eff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => handleDeleteLayer(selectedLayer.id)}
                  className="px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Layer</span>
                </button>

                <button
                  onClick={handleDeselectLayer}
                  className="px-4 py-2 rounded-xl bg-[#0071E3] hover:bg-blue-600 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-98"
                >
                  <Check className="w-4 h-4" />
                  <span>Done / Deselect</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: EXPORT ================= */}
      {activeTab === 'export' && (
        <div className="p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
              Export Card Artwork
            </h3>
            <p className="text-xs text-neutral-500">
              Download studio-grade high-resolution PNG (2400 × 1512) ready for digital mockups or video props.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                onDownload();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0071E3] hover:bg-blue-600 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Download Ultra-Res PNG</span>
            </button>

            <button
              onClick={onCopyClipboard}
              className="w-full py-3 px-4 rounded-2xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Image to Clipboard</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Specs */}
          <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-xs space-y-2">
            <div className="font-semibold text-neutral-700 dark:text-neutral-300">
              Export Specifications:
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Resolution</span>
              <span className="font-mono">2400 × 1512 px (16:10 / ISO ID-1)</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Color Profile</span>
              <span className="font-mono">sRGB 32-bit Alpha</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Template</span>
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                {CARD_TEMPLATES[cardData.templateId]?.name}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
