// Convert number to Persian words
const yekan = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
const dahgan1 = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
const dahgan2 = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
const sadgan = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];

export function numberToWord(n: number): string {
  if (n === 0) return 'صفر';
  if (n < 0 || n > 999) return String(n);

  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const y = n % 10;
  const parts: string[] = [];

  if (h > 0) parts.push(sadgan[h]);

  if (t === 1) {
    parts.push(dahgan1[y]);
  } else {
    if (t > 1) parts.push(dahgan2[t]);
    if (y > 0) parts.push(yekan[y]);
  }

  return parts.join(' و ');
}

export function toPersianDigits(n: number | string): string {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return String(n).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
}

export function toEnglishDigits(s: string): string {
  return s.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
}
