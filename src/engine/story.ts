const storyIntros: Record<number, string[]> = {
  1: [
    'سنجابک وارد شهر عددها شد! 🏰',
    'اول باید یکی‌ها را بشناسی! 🟡',
    'بیا گنج یکی‌ها را پیدا کنیم! 🐿️',
  ],
  2: [
    'سنجابک گنج جدید پیدا کرد! 🌰',
    'حالا وقت ده‌تایی‌هاست! 🔵',
    '۱۰ تا یکی = یک ده‌تایی! 📏',
  ],
  3: [
    'دروازه بزرگ باز شد! 🚪',
    'حالا صدتایی‌ها را یاد بگیر! 🟣',
    '۱۰ تا ده‌تایی = یک صدتایی! 🏗️',
  ],
  4: [
    'سنجابک به کارخانه عددها رسید! 🏭',
    'حالا با بلوک‌ها عدد بساز! 🧩',
    'صدتایی + ده‌تایی + یکی = عدد! 🔢',
  ],
  5: [
    'سنجابک وارد قلعه جایگاه شد! 🏰',
    'هر رقم یک جایگاه دارد! 🎯',
    'صدگان، دهگان، یکان! 📌',
  ],
  6: [
    'سنجابک کلید گنج‌خانه را پیدا کرد! 🔑',
    'حالا عددها را باز کن! 🔓',
    'هر عدد یک رمز دارد! 🔢',
  ],
  7: [
    'سنجابک به کتابخانه عددها رسید! 📚',
    'عددها اسم هم دارند! 📝',
    'عدد و حروف با هم دوست‌اند! 🐿️',
  ],
};

// Positive, encouraging messages for correct answers
const correctMessages = [
  'آفرین! عالی بودی! 🎉',
  'آفرین! خیلی خوب بود! 👏',
  'عالی بودی! ادامه بده! 🌟',
  'واااوه! درسته! 🎉',
  'آفرین! تو خیلی باهوشی! 🐿️',
  'عالی! داری فوق‌العاده پیش می‌ری! ✨',
  'درسته! آفرین قهرمان! 🏆',
  'هورا! درست گفتی! 🎊',
];

// Gentle, encouraging messages for wrong answers
const wrongMessages = [
  'دوباره تلاش کن، تو می‌تونی! 💪',
  'اشکالی نداره! با هم پیدا می‌کنیم! 😊',
  'نزدیک بود! دوباره نگاه کن! 👁️',
  'دوباره امتحان کن، حتماً می‌تونی! 🐿️',
  'عجله نکن! خوب نگاه کن و دوباره بزن! 😊',
];

const comboMessages: Record<number, string> = {
  3: '🔥 عالی پیش می‌ری!',
  5: '🌟 فوق‌العاده‌ای!',
  10: '🏆 قهرمان عددها!',
};

export function getStoryIntro(stageId: number): string {
  const msgs = storyIntros[stageId] || storyIntros[1];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

export function getCorrectMessage(): string {
  return correctMessages[Math.floor(Math.random() * correctMessages.length)];
}

export function getWrongMessage(): string {
  return wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
}

export function getComboMessage(combo: number): string | null {
  if (combo >= 10) return comboMessages[10];
  if (combo >= 5) return comboMessages[5];
  if (combo >= 3) return comboMessages[3];
  return null;
}
