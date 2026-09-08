const MAX_TEXT_LENGTH = 2000;

export const normalizeText = (value: string, maxLength = MAX_TEXT_LENGTH): string =>
  value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, maxLength);

export const normalizeEmail = (value: string): string => normalizeText(value, 320).toLowerCase();

export const isSafeExternalUrl = (value?: string): boolean => {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && Boolean(url.hostname);
  } catch {
    return false;
  }
};

export const isDemoAuthEnabled = (): boolean => import.meta.env.DEV || import.meta.env.VITE_ALLOW_DEMO_AUTH === 'true';