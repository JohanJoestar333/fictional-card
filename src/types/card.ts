export type CardTemplateId = string;

export type FontFamilyType = 
  | 'system'
  | 'inter'
  | 'space-grotesk'
  | 'cormorant'
  | 'cinzel'
  | 'share-tech-mono'
  | 'jetbrains-mono'
  | 'playfair';

export type TextEffectType = 'flat' | 'embossed' | 'engraved' | 'shadow';

export interface TextLayer {
  id: string;
  name: string;
  text: string;
  visible: boolean;
  locked?: boolean;
  fontFamily: FontFamilyType;
  fontSize: number; // in pixels at base preview scale
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
  letterSpacing: number; // in px
  color: string;
  opacity?: number;
  effect: TextEffectType;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  align: 'left' | 'center' | 'right';
  isUppercase?: boolean;
}

export interface UploadedTemplate {
  id: string;
  name: string;
  url: string;
  date: string;
}

export interface CardTemplate {
  id: CardTemplateId;
  name: string;
  subtitle: string;
  badge: string;
  description: string;
  material: string;
  imageUrl: string;
  accentColor: string;
  foilColor: 'silver' | 'gold' | 'rose' | 'monochrome';
  glowColor: string;
  defaultTextColor: string;
  defaultEffect: TextEffectType;
}

export interface CardData {
  templateId: CardTemplateId;
  cardholderName: string;
  cardNumber: string;
  isMasked: boolean;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  memberSinceYear: string;
  customText: string;
  showChip: boolean;
  showContactless: boolean;
  customBackgroundImage?: string; // Base64 or local image URL
  backgroundFit: 'cover' | 'contain' | 'fill';
  backgroundBrightness: number; // 50 to 150
  backgroundContrast: number; // 50 to 150
  textLayers: TextLayer[];
  selectedLayerId: string | null;
  walletArtMode: boolean;
}

export type EnvironmentTheme = 'apple-light' | 'apple-dark';
export type PresentationMode = 'studio' | 'wallet';
