import { CardTemplate, CardTemplateId, TextLayer, FontFamilyType } from '../types/card';
import { USER_CARD_TEMPLATES, UserTemplateConfig } from '../config/cardTemplates';

// A high-resolution dark metallic brushed template SVG to serve as a clean baseline
export const BLANK_CARD_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='856' height='540' viewBox='0 0 856 540'><defs><linearGradient id='metal' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%231e1f26'/><stop offset='45%' stop-color='%23121317'/><stop offset='70%' stop-color='%23181920'/><stop offset='100%' stop-color='%230a0a0d'/></linearGradient><pattern id='mesh' width='24' height='24' patternUnits='userSpaceOnUse'><path d='M 24 0 L 0 0 0 24' fill='none' stroke='rgba(255,255,255,0.028)' stroke-width='1'/></pattern></defs><rect width='100%' height='100%' fill='url(%23metal)'/><rect width='100%' height='100%' fill='url(%23mesh)'/><rect x='4' y='4' width='848' height='532' rx='32' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='2'/></svg>";

export const DEFAULT_BLANK_TEMPLATE: CardTemplate = {
  id: 'blank-template',
  name: 'Clean Card Template',
  subtitle: 'Ready for Your Photos',
  badge: 'Base',
  description: 'Clean minimalist base card. Put your photos in src/config/cardTemplates.ts to create custom templates.',
  material: 'Anodized Matte Slate',
  imageUrl: BLANK_CARD_IMAGE,
  accentColor: '#38bdf8',
  foilColor: 'silver',
  glowColor: 'rgba(56, 189, 248, 0.25)',
  defaultTextColor: '#FFFFFF',
  defaultEffect: 'embossed',
};

export function buildTemplateFromConfig(config: UserTemplateConfig): CardTemplate {
  return {
    id: config.id,
    name: config.name,
    subtitle: config.subtitle || 'Custom Edition',
    badge: config.badge || 'Custom',
    description: config.description || 'Custom photo card template',
    material: config.material || 'Custom Metal & Glass',
    imageUrl: config.imageUrl,
    accentColor: config.accentColor || '#38bdf8',
    foilColor: config.foilColor || 'silver',
    glowColor: config.glowColor || 'rgba(56, 189, 248, 0.25)',
    defaultTextColor: config.textColor || '#FFFFFF',
    defaultEffect: config.defaultEffect || 'embossed',
  };
}

export function getCardTemplates(): Record<string, CardTemplate> {
  const result: Record<string, CardTemplate> = {};

  if (USER_CARD_TEMPLATES && USER_CARD_TEMPLATES.length > 0) {
    USER_CARD_TEMPLATES.forEach((item) => {
      if (item && item.id) {
        result[item.id] = buildTemplateFromConfig(item);
      }
    });
  } else {
    // When no custom templates are added yet, use the clean slate base
    result[DEFAULT_BLANK_TEMPLATE.id] = DEFAULT_BLANK_TEMPLATE;
  }

  return result;
}

export const CARD_TEMPLATES: Record<string, CardTemplate> = getCardTemplates();
export const TEMPLATE_LIST: CardTemplate[] = Object.values(CARD_TEMPLATES);
export const INITIAL_TEMPLATE_ID: string = TEMPLATE_LIST[0]?.id || DEFAULT_BLANK_TEMPLATE.id;

export const FONT_OPTIONS: { id: FontFamilyType; name: string; category: string }[] = [
  { id: 'cinzel', name: 'Cinzel (Roman Imperial & Classical)', category: 'Luxury Serif' },
  { id: 'cormorant', name: 'Cormorant (Prestige Fine Serif)', category: 'Luxury Serif' },
  { id: 'playfair', name: 'Playfair Display (Haute Couture)', category: 'Luxury Serif' },
  { id: 'space-grotesk', name: 'Space Grotesk (Modern Geometric)', category: 'Display Sans' },
  { id: 'system', name: 'SF Pro (System Modern)', category: 'Clean Sans' },
  { id: 'inter', name: 'Inter (Clean Technical)', category: 'Clean Sans' },
  { id: 'share-tech-mono', name: 'Share Tech (Embossed Stamped)', category: 'Card Monospace' },
  { id: 'jetbrains-mono', name: 'JetBrains Mono (Laser Engraved)', category: 'Monospace' },
];

export const COLOR_PRESETS = [
  { id: 'pure-white', name: 'Pure White', color: '#FFFFFF' },
  { id: 'silver-foil', name: 'Sterling Silver', color: '#E2E8F0' },
  { id: 'gold-24k', name: '24K Gold', color: '#F59E0B' },
  { id: 'rose-gold', name: 'Rose Gold', color: '#F472B6' },
  { id: 'bronze', name: 'Warm Bronze', color: '#D97706' },
  { id: 'charcoal', name: 'Matte Charcoal', color: '#334155' },
  { id: 'pitch-black', name: 'Pitch Black', color: '#090A0F' },
  { id: 'electric-blue', name: 'Sapphire Blue', color: '#3B82F6' },
  { id: 'emerald', name: 'Emerald Green', color: '#10B981' },
];

export function createDefaultTextLayers(
  name: string = 'JOHAN JOESTAR',
  templateId?: string
): TextLayer[] {
  const current = templateId && CARD_TEMPLATES[templateId] ? CARD_TEMPLATES[templateId] : (TEMPLATE_LIST[0] || DEFAULT_BLANK_TEMPLATE);
  const textColor = current.defaultTextColor || '#FFFFFF';
  const isDarkCard = textColor.toLowerCase() === '#ffffff' || textColor.toLowerCase() === '#fff' || textColor.toLowerCase().includes('255');
  const subColor = isDarkCard ? '#94A3B8' : '#475569';
  const effect = current.defaultEffect || 'embossed';

  return [
    {
      id: 'cardholder-name',
      name: 'Cardholder Name',
      text: name,
      visible: true,
      locked: false,
      fontFamily: 'cinzel',
      fontSize: 16,
      fontWeight: 'bold',
      letterSpacing: 1.5,
      color: textColor,
      effect: effect,
      x: 8,
      y: 84,
      align: 'left',
      isUppercase: true,
    },
    {
      id: 'card-number',
      name: 'Card Number',
      text: '•••• •••• •••• 3420',
      visible: true,
      locked: false,
      fontFamily: 'share-tech-mono',
      fontSize: 14,
      fontWeight: 'semibold',
      letterSpacing: 2,
      color: textColor,
      effect: effect,
      x: 8,
      y: 68,
      align: 'left',
      isUppercase: true,
    },
    {
      id: 'valid-thru',
      name: 'Valid Thru',
      text: 'VALID THRU 12/30',
      visible: true,
      locked: false,
      fontFamily: 'share-tech-mono',
      fontSize: 10,
      fontWeight: 'medium',
      letterSpacing: 1.2,
      color: subColor,
      effect: 'flat',
      x: 52,
      y: 84,
      align: 'left',
      isUppercase: true,
    },
    {
      id: 'member-since',
      name: 'Member Since',
      text: 'MEMBER SINCE 21',
      visible: true,
      locked: false,
      fontFamily: 'space-grotesk',
      fontSize: 9,
      fontWeight: 'semibold',
      letterSpacing: 1.5,
      color: subColor,
      effect: 'flat',
      x: 8,
      y: 76,
      align: 'left',
      isUppercase: true,
    },
    {
      id: 'fictional-notice',
      name: 'Prop Notice',
      text: 'PROP · ENTERTAINMENT',
      visible: true,
      locked: false,
      fontFamily: 'system',
      fontSize: 8,
      fontWeight: 'normal',
      letterSpacing: 0.8,
      color: subColor,
      effect: 'flat',
      x: 92,
      y: 91,
      align: 'right',
      isUppercase: true,
    },
  ];
}

export const DISCLAIMER_TEXT = 'FICTIONAL PROP · FOR ENTERTAINMENT ONLY';
export const FULL_LEGAL_DISCLAIMER = 'Fictional prop for creative mockups & entertainment only. Not a real payment card and holds no stored value.';
