import { faTranslations } from './fa';
import { enTranslations } from './en';

export type TranslationKey = keyof typeof faTranslations;

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: number | string): string {
  const str = String(input);
  return str.replace(/[0-9]/g, (w) => PERSIAN_DIGITS[parseInt(w, 10)]);
}

export function formatNumberByLang(val: number | string, lang: 'fa' | 'en'): string {
  if (lang === 'fa') {
    // Also format with Persian thousands separator if applicable
    if (typeof val === 'number') {
      const parts = val.toLocaleString('en-US').split(',');
      const joined = parts.join('٬');
      return toPersianDigits(joined);
    }
    return toPersianDigits(val);
  }
  return typeof val === 'number' ? val.toLocaleString('en-US') : String(val);
}

export function formatJalaliDate(dateInput: string | Date, lang: 'fa' | 'en' = 'fa'): string {
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);

    if (lang === 'fa') {
      return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(d);
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(d);
    }
  } catch {
    return String(dateInput);
  }
}

export function getTranslation(key: TranslationKey, lang: 'fa' | 'en', params?: Record<string, string | number>): string {
  const dict = lang === 'fa' ? faTranslations : enTranslations;
  let text = dict[key] || faTranslations[key] || key;

  if (params) {
    Object.entries(params).forEach(([paramKey, paramVal]) => {
      const displayVal = lang === 'fa' && typeof paramVal === 'number'
        ? toPersianDigits(paramVal)
        : String(paramVal);
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), displayVal);
    });
  }

  return text;
}
