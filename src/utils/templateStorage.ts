import { UploadedTemplate } from '../types/card';

const TEMPLATES_KEY = 'aura_custom_templates_v1';

export function getSavedTemplates(): UploadedTemplate[] {
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Fallback
  }
  return [];
}

export function saveTemplate(template: UploadedTemplate): UploadedTemplate[] {
  const existing = getSavedTemplates();
  const updated = [template, ...existing.filter((t) => t.id !== template.id)];
  try {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated.slice(0, 20)));
  } catch (err) {
    console.warn('Storage quota exceeded, keeping fewer templates', err);
  }
  return updated;
}

export function deleteTemplate(id: string): UploadedTemplate[] {
  const existing = getSavedTemplates();
  const updated = existing.filter((t) => t.id !== id);
  try {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  return updated;
}
