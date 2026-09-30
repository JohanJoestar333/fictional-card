/**
 * ==============================================================================
 * CUSTOM CARD TEMPLATES CONFIGURATION
 * ==============================================================================
 * Put the photos you desire here!
 *
 * HOW TO USE LOCAL PHOTOS:
 * ------------------------------------------------------------------------------
 * 1. Place your image files into the `public/photos/` folder:
 *    e.g. `public/photos/my-card.png` or `public/photos/black-titanium.jpg`
 * 2. Reference it with the local path: `imageUrl: '/photos/my-card.png'`
 *
 * HOW TO USE WEB PHOTOS:
 * ------------------------------------------------------------------------------
 * Simply paste any image link: `imageUrl: 'https://example.com/card.png'`
 *
 * Every entry in `USER_CARD_TEMPLATES` will immediately appear as a selectable
 * card template in the studio.
 * ==============================================================================
 */

export interface UserTemplateConfig {
  /** Unique identifier for the template (e.g. 'my-card-1') */
  id: string;

  /** Display title for the card (e.g. 'Titanium Reserve') */
  name: string;

  /** 
   * Image URL or local file path for your card photo.
   * Examples:
   * - Local photo in public/photos/: '/photos/my-card.png'
   * - Web image link: 'https://images.unsplash.com/...'
   */
  imageUrl: string;

  /** Short subtitle (e.g. "Matte Black Edition") */
  subtitle?: string;

  /** Badge tag displayed on thumbnail (e.g. "Custom", "VIP", "Noir") */
  badge?: string;

  /** Description of the card */
  description?: string;

  /** Material texture description (e.g. "Brushed Metal") */
  material?: string;

  /** Theme accent color in hex format (e.g. "#38bdf8") */
  accentColor?: string;

  /** Card foil reflection tone: 'silver' | 'gold' | 'rose' | 'monochrome' */
  foilColor?: 'silver' | 'gold' | 'rose' | 'monochrome';

  /** Ambient glow shadow color */
  glowColor?: string;

  /** Default text color for layers on this card (e.g. "#FFFFFF" or "#0F172A") */
  textColor?: string;

  /** Default typography effect: 'flat' | 'embossed' | 'engraved' | 'shadow' */
  defaultEffect?: 'flat' | 'embossed' | 'engraved' | 'shadow';
}

/**
 * ==============================================================================
 * YOUR TEMPLATES LIST
 * Add your photo cards in this array:
 * ==============================================================================
 */
export const USER_CARD_TEMPLATES: UserTemplateConfig[] = [
  /*
   * Examples:
   * 
   * // 1. Using a local photo saved in public/photos/
   * {
   *   id: 'local-photo-card',
   *   name: 'My Local Photo Card',
   *   imageUrl: '/photos/sample_card.svg', // saved in public/photos/sample_card.svg
   *   subtitle: 'Local Photo Edition',
   *   badge: 'Local',
   *   textColor: '#FFFFFF',
   * },
   * 
   * // 2. Using a web image link
   * {
   *   id: 'custom-web-card',
   *   name: 'Obsidian Reserve',
   *   imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
   *   subtitle: 'Custom Photo Edition',
   *   badge: 'Custom',
   *   textColor: '#FFFFFF',
   * },
   */
  {
    id: 'amex-gold-2',
    name: 'Amex Gold 2',
    imageUrl: '/photos/amexgold-2.png',
  },
  {
    id: 'amex-platinum-art',
    name: 'Amex Platinum Art',
    imageUrl: '/photos/amexplatinumart.png',
  },
  {
    id: 'amex-centurion-x-kehinde-wiley',
    name: 'Amex Centurion x Kehinde Wiley',
    imageUrl: '/photos/amexcenturionxkehindewiley.jpeg',
  },
  {
    id: 'american-express-platinum-x-kehinde-wiley',
    name: 'American Express Platinum x Kehinde Wiley',
    imageUrl: '/photos/americanexpressplatinumxkehindewiley.png',
  },
  {
    id: 'american-express-platinum',
    name: 'American Express Platinum',
    imageUrl: '/photos/americanexpressplatinum.png',
  },
  {
    id: 'chase-jpm-reserve',
    name: 'Chase JPM Reserve',
    imageUrl: '/photos/chasejpmreserve.png',
  },
  {
    id: 'amex-centurion',
    name: 'Amex Centurion',
    imageUrl: '/photos/amexcentrion.png',
  },
];
