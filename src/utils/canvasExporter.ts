import { CardData, TextLayer } from '../types/card';
import { CARD_TEMPLATES, TEMPLATE_LIST, DEFAULT_BLANK_TEMPLATE, DISCLAIMER_TEXT } from './cardTemplates';

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function drawTextLayersOnCanvas(
  ctx: CanvasRenderingContext2D,
  layers: TextLayer[],
  width: number,
  height: number,
  offsetX: number,
  offsetY: number,
  previewWidth: number
) {
  // Scale relative to the width the card is actually shown at on screen
  const scale = width / previewWidth;
  layers.forEach((layer) => {
    if (!layer.visible) return;
    const x = offsetX + (layer.x / 100) * width;
    // Preview anchors the top of the text box (line-height 1) at y%,
    // so the vertical middle sits half a font size lower.
    const y = offsetY + (layer.y / 100) * height + (layer.fontSize * scale) / 2;
    const fontSize = layer.fontSize * scale;
    const weight = layer.fontWeight === 'black' ? '900' : layer.fontWeight === 'bold' ? '700' : layer.fontWeight === 'semibold' ? '600' : layer.fontWeight === 'medium' ? '500' : '400';
    
    let fontName = '"Cinzel", Georgia, serif';
    if (layer.fontFamily === 'cormorant') fontName = '"Cormorant Garamond", Georgia, serif';
    else if (layer.fontFamily === 'playfair') fontName = '"Playfair Display", Georgia, serif';
    else if (layer.fontFamily === 'space-grotesk') fontName = '"Space Grotesk", sans-serif';
    else if (layer.fontFamily === 'inter') fontName = '"Inter", sans-serif';
    else if (layer.fontFamily === 'system') fontName = '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    else if (layer.fontFamily === 'share-tech-mono') fontName = '"Share Tech Mono", monospace';
    else if (layer.fontFamily === 'jetbrains-mono') fontName = '"JetBrains Mono", monospace';

    ctx.save();
    ctx.font = `${weight} ${fontSize}px ${fontName}`;
    ctx.textAlign = layer.align;
    ctx.textBaseline = 'middle';
    (ctx as any).letterSpacing = `${layer.letterSpacing * scale}px`;
    if (layer.opacity !== undefined) ctx.globalAlpha = layer.opacity;

    const textToDraw = layer.isUppercase ? layer.text.toUpperCase() : layer.text;

    if (layer.effect === 'embossed') {
      // 3D Stamped raised foil effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fillText(textToDraw, x + 1.5 * scale, y + 1.5 * scale);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(textToDraw, x - 1 * scale, y - 1 * scale);
    } else if (layer.effect === 'engraved') {
      // Recessed laser etching
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillText(textToDraw, x + 1 * scale, y + 1 * scale);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillText(textToDraw, x - 1 * scale, y - 1 * scale);
    } else if (layer.effect === 'shadow') {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 8 * scale;
      ctx.shadowOffsetY = 3 * scale;
    }

    ctx.fillStyle = layer.color;
    ctx.fillText(textToDraw, x, y);
    ctx.restore();
  });
}

export async function exportCardToCanvas(
  cardData: CardData,
  width: number = 2400,
  height: number = 1512,
  previewWidth: number = 450
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context');

  const cornerRadius = 72;
  const inset = 30;
  const cardWidth = width - inset * 2;
  const cardHeight = height - inset * 2;

  ctx.save();
  drawRoundedRect(ctx, inset, inset, cardWidth, cardHeight, cornerRadius);
  ctx.clip();

  // 1. DRAW CARD TEMPLATE BACKGROUND OR CUSTOM PHOTO
  const currentTemplate = CARD_TEMPLATES[cardData.templateId] || TEMPLATE_LIST[0] || DEFAULT_BLANK_TEMPLATE;
  const imageSource = cardData.customBackgroundImage || currentTemplate.imageUrl;

  try {
    const img = await loadImage(imageSource);
    
    // Apply filters if supported
    if (cardData.backgroundBrightness !== 100 || cardData.backgroundContrast !== 100) {
      ctx.filter = `brightness(${cardData.backgroundBrightness}%) contrast(${cardData.backgroundContrast}%)`;
    }
    
    const fit = cardData.backgroundFit || 'cover';
    if (fit === 'fill') {
      ctx.drawImage(img, inset, inset, cardWidth, cardHeight);
    } else {
      const ratio = fit === 'contain'
        ? Math.min(cardWidth / img.width, cardHeight / img.height)
        : Math.max(cardWidth / img.width, cardHeight / img.height);
      const w = img.width * ratio;
      const h = img.height * ratio;
      ctx.drawImage(img, inset + (cardWidth - w) / 2, inset + (cardHeight - h) / 2, w, h);
    }
    ctx.filter = 'none';
  } catch (err) {
    // Fallback luxury dark background if image loading fails
    const grad = ctx.createLinearGradient(inset, inset, inset + cardWidth, inset + cardHeight);
    grad.addColorStop(0, '#161617');
    grad.addColorStop(0.5, '#222226');
    grad.addColorStop(1, '#0e0e10');
    ctx.fillStyle = grad;
    ctx.fillRect(inset, inset, cardWidth, cardHeight);
  }

  // 2. DRAW DYNAMIC TEXT LAYERS
  if (cardData.textLayers) {
    drawTextLayersOnCanvas(ctx, cardData.textLayers, cardWidth, cardHeight, inset, inset, previewWidth);
  }

  ctx.restore();

  // Outer Edge Bevel
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, inset, inset, cardWidth, cardHeight, cornerRadius);
  ctx.stroke();

  return canvas.toDataURL('image/png');
}
