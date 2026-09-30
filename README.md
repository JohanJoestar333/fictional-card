# AirCard Studio

A high-fidelity visual designer and card pass artwork studio created to accompany and generate custom card visuals for the **[AirCard](https://github.com/Mak5er/AirCard)** project by Mak5er.

---

## Overview

[AirCard](https://github.com/Mak5er/AirCard) is an open-source smart card and digital wallet pass companion project. This studio provides a dedicated visual workspace for crafting pixel-perfect, hyper-realistic card faces and digital wallet passes that pair directly with AirCard devices, firmware, and pass pipelines.

Whether building custom prop cards, digital wallet mockups, or custom graphics for AirCard's e-paper/OLED displays and pass bundles, this studio generates production-ready assets with precision typography, metallic textures, and authentic 3D lighting.

---

## Integration with [Mak5er/AirCard](https://github.com/Mak5er/AirCard)

1. **Pixel-Perfect Standard Aspect Ratio**:
   * All card visuals adhere to the standard ISO/IEC 7810 ID-1 format (85.60 mm × 53.98 mm, aspect ratio `85.6 / 54`).
   * Ultra-high-resolution exports (2400 × 1512 px) ensure razor-sharp rendering when converted for AirCard firmware, display buffers, or companion mobile apps.

2. **Apple Pay & Digital Wallet Simulation**:
   * Switch directly into the **Apple Pay View** to preview how your card artwork appears inside the native iOS Apple Pay sheet and pass stack.
   * Matches the visual presentation and framing expected by AirCard pass workflows.

3. **Export Pipeline**:
   * Click **Export PNG** to export a clean, high-resolution PNG with rounded card corners, specular highlights, and text layers rendered to canvas.
   * Copy directly to the clipboard or download for immediate use in your AirCard asset folder or pass compiler.

---

## Adding Custom Card Photo Templates in Code

You can define your own card photo templates in the dedicated configuration file:

**`src/config/cardTemplates.ts`**

Simply add your desired photos to the `USER_CARD_TEMPLATES` array:

```typescript
import { UserTemplateConfig } from './cardTemplates';

export const USER_CARD_TEMPLATES: UserTemplateConfig[] = [
  {
    id: 'my-custom-card',
    name: 'Obsidian Reserve',
    imageUrl: 'https://example.com/your-card-art.png', // or local path '/card-templates/my_card.png'
    subtitle: 'Forged Titanium Edition',
    badge: 'Custom',
    textColor: '#FFFFFF', // Default text color ('#FFFFFF' or '#0F172A')
    accentColor: '#38bdf8',
    material: 'Brushed Black Titanium',
  },
];
```

Every template added to this array immediately becomes an active, selectable card template in the studio UI.

You can also drop images directly into the `public/photos/` folder and reference them locally as `/photos/filename.png`, or upload photos directly through the browser interface.

---

## Features

* **3D Dynamic Tilt Canvas**: Realistic mouse/pointer reactive sheen reflections and metallic foil depth.
* **Organized Text Layers**:
  * Individual controls for Cardholder Name, Card Number, Expiration Date, Member Since, and custom prop text.
  * Direct drag-and-drop on the card canvas or fine-tuned X% / Y% position steppers.
  * Click to select and click outside or press <kbd>Esc</kbd> to unselect.
  * Typography controls: Font family (Cinzel, Cormorant Garamond, Playfair Display, Space Grotesk, Share Tech Mono, JetBrains Mono, SF Pro), size, weight, letter-spacing tracking, and color swatches.
  * Text shaders: 3D Embossed, Laser Engraved, Soft Shadow, and Flat.
* **Apple Wallet Number Guide**: When a card is added to Apple Wallet, Wallet places the card numbers on the card by itself (bottom-left). The editor shows this area as a red dashed box so you can keep your text clear of it.
  * Shown on every template and on uploaded photos, with a **Hide guide / Show guide** toggle under the card.
  * Editor-only: the guide is never drawn on exported PNGs or in the Apple Pay view.
  * Selecting a Card Number layer shows a notice that Wallet already displays the numbers, so you may not need that layer.
* **Zero Emojis**: Clean, professional design language using typography and SVG vector icons.
* **Apple Pay Mode**: Native iOS wallet sheet representation with status bar, haptic simulation, and pass export.
* **High-Res Canvas Export**: 2400 × 1512 PNG rendering using HTML5 Canvas with custom brightness, contrast, and fit adjustments.

---

## Getting Started

### Prerequisites

* Node.js 18+
* npm or bun

### Installation

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```

---

## Project Structure

```
├── README.md                      # Project documentation and AirCard integration guide
├── index.html                     # HTML entry point
├── package.json                   # Project scripts and dependencies
├── public/
│   └── photos/                    # Local folder for your card photos (e.g. /photos/card.png)
└── src/
    ├── App.tsx                    # Main studio application shell
    ├── config/
    │   └── cardTemplates.ts       # Area to configure custom photo card templates
    ├── components/
    │   ├── AppleInspector.tsx     # Inspector panel (templates, layers, typography, export)
    │   ├── AppleWalletView.tsx    # iOS Apple Pay presentation preview
    │   └── CardVisual.tsx         # 3D interactive card canvas
    ├── types/
    │   └── card.ts                # TypeScript interfaces and models
    └── utils/
        ├── audio.ts               # Subdued haptic audio feedback
        ├── canvasExporter.ts      # 2400x1512 canvas render & export
        ├── cardTemplates.ts       # Template builder & typography utilities
        └── templateStorage.ts     # In-browser uploaded templates storage
```

---

## Credits & Related Projects

* **[AirCard](https://github.com/Mak5er/AirCard)** by [Mak5er](https://github.com/Mak5er): The open-source smart card project this studio was built to accompany.
