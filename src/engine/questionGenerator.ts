import { Question, QuestionType } from '../types';
import { numberToWord, toPersianDigits } from '../utils/numberToWord';

let questionCounter = 0;

function genId(): string {
  return `q_${++questionCounter}_${Date.now()}`;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate unique distractors - no duplicates
function generateUniqueDistractors(correct: number, min: number, max: number, count: number): number[] {
  const set = new Set<number>();
  let attempts = 0;
  while (set.size < count && attempts < 100) {
    // Nearby distractors
    const nearby = correct + randInt(-3, 3);
    if (nearby >= min && nearby <= max && nearby !== correct && !set.has(nearby)) {
      set.add(nearby);
    }
    // Random distractors
    const r = randInt(min, max);
    if (r !== correct && !set.has(r)) {
      set.add(r);
    }
    attempts++;
  }
  return shuffle([...set]).slice(0, count);
}

// Always use 400-499 range for this lesson
function genNumber400(): number {
  return randInt(400, 499);
}

// For early stages, use simpler numbers
function genSimpleNumber400(): number {
  // Numbers like 400, 410, 420, 430... or 401, 402, etc.
  const variant = randInt(0, 2);
  if (variant === 0) {
    // Round tens: 400, 410, 420, etc.
    return 400 + randInt(0, 9) * 10;
  } else if (variant === 1) {
    // Single digit ones: 401, 402, 403
    return 400 + randInt(1, 9);
  } else {
    // Any 400-499
    return randInt(400, 499);
  }
}

// Emoji items for ones counting
const countEmojis = ['🍎', '🌟', '🪙', '🟠', '🎁', '💎', '🔮'];
function randomEmoji(): string {
  return countEmojis[randInt(0, countEmojis.length - 1)];
}

export function generateQuestion(type: QuestionType, stageId: number, difficulty: number): Question {
  // Always use 400-499 range
  const num = stageId <= 3 ? genSimpleNumber400() : genNumber400();
  const h = Math.floor(num / 100); // Always 4
  const t = Math.floor((num % 100) / 10);
  const o = num % 10;

  const base: Partial<Question> = {
    id: genId(),
    type,
    difficulty,
    score: 1,
    hundreds: h,
    tens: t,
    ones: o,
    number: num,
    wordForm: numberToWord(num),
    stageId,
    visualOnly: stageId <= 3,
  };

  switch (type) {
    case 'count_ones': {
      const count = randInt(1, 9);
      const emoji = randomEmoji();
      const distractors = generateUniqueDistractors(count, 1, 9, 2);
      return {
        ...base,
        text: `${Array(count).fill(emoji).join(' ')}\n\nچند تا یکی می‌بینی؟ 👁️`,
        options: shuffle([toPersianDigits(count), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(count),
        hint: `یکی‌یکی ${emoji} ها رو بشمار! 👁️`,
        hundreds: 0,
        tens: 0,
        ones: count,
        number: count,
        wordForm: numberToWord(count),
      } as Question;
    }

    case 'count_tens': {
      const count = randInt(1, 9);
      const distractors = generateUniqueDistractors(count, 1, 9, 2);
      return {
        ...base,
        text: 'چند تا ده‌تایی (میله آبی) می‌بینی؟ 👁️',
        options: shuffle([toPersianDigits(count), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(count),
        hint: 'هر میله آبی بلند یک ده‌تایی است! 🔵',
        hundreds: 0,
        tens: count,
        ones: 0,
        number: count * 10,
        wordForm: numberToWord(count * 10),
      } as Question;
    }

    case 'count_hundreds': {
      const count = 4; // Always 4 for 400s lesson
      const distractors = generateUniqueDistractors(count, 1, 6, 2);
      return {
        ...base,
        text: 'چند تا صدتایی (بلوک بنفش بزرگ) می‌بینی؟ 👁️',
        options: shuffle([toPersianDigits(count), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(count),
        hint: 'هر بلوک بنفش بزرگ یک صدتایی است! 🟣',
        hundreds: count,
        tens: 0,
        ones: 0,
        number: count * 100,
        wordForm: numberToWord(count * 100),
      } as Question;
    }

    case 'identify_one': {
      return {
        ...base,
        text: 'کدام یکی است؟ 👁️\n\n(به شکل‌ها نگاه کن)',
        options: shuffle(['🟡 مکعب کوچک زرد', '🔵 میله آبی بلند', '🟣 بلوک بنفش بزرگ']),
        correctAnswer: '🟡 مکعب کوچک زرد',
        hint: 'یکی کوچک‌ترین بلوک است! مکعب زرد کوچک 🟡',
        hundreds: 0, tens: 0, ones: 1, number: 1, wordForm: 'یک',
      } as Question;
    }

    case 'identify_ten': {
      return {
        ...base,
        text: 'کدام ده‌تایی است؟ 👁️\n\n(به شکل‌ها نگاه کن)',
        options: shuffle(['🔵 میله آبی بلند', '🟡 مکعب کوچک زرد', '🟣 بلوک بنفش بزرگ']),
        correctAnswer: '🔵 میله آبی بلند',
        hint: 'ده‌تایی یک میله بلند آبی رنگ است! 🔵',
        hundreds: 0, tens: 1, ones: 0, number: 10, wordForm: 'ده',
      } as Question;
    }

    case 'identify_hundred': {
      return {
        ...base,
        text: 'کدام صدتایی است؟ 👁️\n\n(به شکل‌ها نگاه کن)',
        options: shuffle(['🟣 بلوک بنفش بزرگ', '🔵 میله آبی بلند', '🟡 مکعب کوچک زرد']),
        correctAnswer: '🟣 بلوک بنفش بزرگ',
        hint: 'صدتایی بزرگ‌ترین بلوک است! بنفش و بزرگ 🟣',
        hundreds: 1, tens: 0, ones: 0, number: 100, wordForm: 'صد',
      } as Question;
    }

    case 'build_number': {
      const distractors = generateUniqueDistractors(num, 400, 499, 2);
      return {
        ...base,
        text: `${toPersianDigits(h)} صدتایی 🟣\n${toPersianDigits(t)} ده‌تایی 🔵\n${toPersianDigits(o)} یکی 🟡\n\nچه عددی ساختیم؟`,
        options: shuffle([toPersianDigits(num), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(num),
        hint: `صدتایی = ${toPersianDigits(h)}، پس عدد با ${toPersianDigits(h)} شروع می‌شود 🟣`,
      } as Question;
    }

    case 'image_to_number': {
      const distractors = generateUniqueDistractors(num, 400, 499, 2);
      return {
        ...base,
        text: 'این بلوک‌ها چه عددی را نشان می‌دهند؟ 👁️',
        options: shuffle([toPersianDigits(num), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(num),
        hint: `صدتایی‌ها رو بشمار: ${toPersianDigits(h)} تا 🟣`,
      } as Question;
    }

    case 'number_to_image': {
      const wrongH = h;
      const wrongT1 = (t + 2) % 10;
      const wrongO1 = (o + 3) % 10;
      const wrongT2 = (t + 4) % 10;
      const wrongO2 = (o + 5) % 10;
      // Make sure options are different
      const opt1 = `${h}|${t}|${o}`;
      const opt2 = `${wrongH}|${wrongT1}|${wrongO1}`;
      const opt3 = `${wrongH}|${wrongT2}|${wrongO2}`;
      return {
        ...base,
        text: `عدد ${toPersianDigits(num)} کدام تصویر است؟ 👁️`,
        options: shuffle([opt1, opt2, opt3]),
        correctAnswer: opt1,
        hint: `${toPersianDigits(num)} = ${toPersianDigits(h)} صدتایی + ${toPersianDigits(t)} ده‌تایی + ${toPersianDigits(o)} یکی`,
      } as Question;
    }

    case 'identify_sadgan': {
      const distractors = generateUniqueDistractors(h, 1, 9, 2);
      return {
        ...base,
        text: `در عدد ${toPersianDigits(num)}\nرقم صدگان کدام است؟ 🟣`,
        options: shuffle([toPersianDigits(h), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(h),
        hint: 'رقم صدگان اولین رقم از سمت چپ است! ⬅️',
      } as Question;
    }

    case 'identify_dahgan': {
      const distractors = generateUniqueDistractors(t, 0, 9, 2);
      return {
        ...base,
        text: `در عدد ${toPersianDigits(num)}\nرقم دهگان کدام است؟ 🔵`,
        options: shuffle([toPersianDigits(t), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(t),
        hint: 'رقم دهگان رقم وسطی است! 🔵',
      } as Question;
    }

    case 'identify_yekan': {
      const distractors = generateUniqueDistractors(o, 0, 9, 2);
      return {
        ...base,
        text: `در عدد ${toPersianDigits(num)}\nرقم یکان کدام است؟ 🟡`,
        options: shuffle([toPersianDigits(o), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(o),
        hint: 'رقم یکان آخرین رقم از سمت راست است! ➡️',
      } as Question;
    }

    case 'place_digit': {
      return {
        ...base,
        text: `ارقام عدد ${toPersianDigits(num)} را\nدر جای درست بگذار! 📌`,
        options: [toPersianDigits(h), toPersianDigits(t), toPersianDigits(o)],
        correctAnswer: `${h}|${t}|${o}`,
        hint: 'اولین رقم از سمت چپ → صدگان 🟣',
      } as Question;
    }

    case 'missing_digit': {
      const pos = randInt(0, 2);
      const display = [toPersianDigits(h), toPersianDigits(t), toPersianDigits(o)];
      const missing = display[pos];
      display[pos] = '❓';
      const missingNum = pos === 0 ? h : pos === 1 ? t : o;
      const distractors = generateUniqueDistractors(missingNum, 0, 9, 2);
      const posName = pos === 0 ? 'صدگان' : pos === 1 ? 'دهگان' : 'یکان';
      return {
        ...base,
        text: `رقم گمشده را پیدا کن! 🔎\n\n${display.join(' ')}`,
        options: shuffle([missing, ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: missing,
        hint: `رقم ${posName} گم شده! 👁️`,
      } as Question;
    }

    case 'missing_place_value': {
      const pos = randInt(0, 2);
      const values = [h, t, o];
      const missing = values[pos];
      const labels = ['صدتایی 🟣', 'ده‌تایی 🔵', 'یکی 🟡'];
      const distractors = generateUniqueDistractors(missing, 0, 9, 2);
      const parts = [
        `${pos === 0 ? '❓' : toPersianDigits(h)} صدتایی`,
        `${pos === 1 ? '❓' : toPersianDigits(t)} ده‌تایی`,
        `${pos === 2 ? '❓' : toPersianDigits(o)} یکی`
      ];
      return {
        ...base,
        text: `جای خالی را پر کن!\n\n${parts.join('\n')}\n\nعدد: ${toPersianDigits(num)}`,
        options: shuffle([toPersianDigits(missing), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(missing),
        hint: `چند تا ${labels[pos]} داریم؟`,
      } as Question;
    }

    case 'expand_number': {
      const expanded = `${toPersianDigits(h * 100)} + ${toPersianDigits(t * 10)} + ${toPersianDigits(o)}`;
      // Make sure wrong options are unique and different from correct
      const wrong1 = `${toPersianDigits(h * 10)} + ${toPersianDigits(t * 100)} + ${toPersianDigits(o)}`;
      const wrong2 = `${toPersianDigits(h)} + ${toPersianDigits(t)} + ${toPersianDigits(o)}`;
      const wrong3 = `${toPersianDigits(h * 100)} + ${toPersianDigits(t)} + ${toPersianDigits(o * 10)}`;
      // Filter unique options that differ from correct
      const wrongOptions = [wrong1, wrong2, wrong3].filter(w => w !== expanded);
      const uniqueWrongs = [...new Set(wrongOptions)].slice(0, 2);
      // If not enough unique wrongs, create more
      while (uniqueWrongs.length < 2) {
        uniqueWrongs.push(`${toPersianDigits((h+1) * 100)} + ${toPersianDigits(t * 10)} + ${toPersianDigits(o)}`);
      }
      return {
        ...base,
        text: `عدد ${toPersianDigits(num)} را باز کن! 🔓`,
        options: shuffle([expanded, ...uniqueWrongs]),
        correctAnswer: expanded,
        hint: `${toPersianDigits(h)} صدتایی = ${toPersianDigits(h * 100)} 🟣`,
      } as Question;
    }

    case 'expand_to_number': {
      const distractors = generateUniqueDistractors(num, 400, 499, 2);
      return {
        ...base,
        text: `${toPersianDigits(h * 100)} + ${toPersianDigits(t * 10)} + ${toPersianDigits(o)}\n\nچه عددی می‌شود؟`,
        options: shuffle([toPersianDigits(num), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(num),
        hint: 'صدها + ده‌ها + یکی‌ها = عدد کامل',
      } as Question;
    }

    case 'number_to_word': {
      const word = numberToWord(num);
      // Generate different wrong options
      const alt1 = Math.min(499, Math.max(400, num + 10));
      const alt2 = Math.min(499, Math.max(400, num - 10));
      const wrong1 = numberToWord(alt1 === num ? num + 11 : alt1);
      const wrong2 = numberToWord(alt2 === num ? num - 11 : alt2);
      return {
        ...base,
        text: `عدد ${toPersianDigits(num)} به حروف چیست؟ 📝`,
        options: shuffle([word, wrong1, wrong2]),
        correctAnswer: word,
        hint: `چهارصد و ... 👁️`,
      } as Question;
    }

    case 'word_to_number': {
      const word = numberToWord(num);
      const distractors = generateUniqueDistractors(num, 400, 499, 2);
      return {
        ...base,
        text: `«${word}»\n\nکدام عدد است؟`,
        options: shuffle([toPersianDigits(num), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(num),
        hint: 'اول به نام صدها گوش بده: چهارصد...',
      } as Question;
    }

    case 'match_image_number': {
      const distractors = generateUniqueDistractors(num, 400, 499, 2);
      return {
        ...base,
        text: 'تصویر بلوک‌ها چه عددی را نشان می‌دهد؟ 👁️',
        options: shuffle([toPersianDigits(num), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(num),
        hint: `صدتایی‌ها: ${toPersianDigits(h)} 🟣`,
      } as Question;
    }

    case 'match_number_word': {
      const word = numberToWord(num);
      const alt1 = Math.min(499, Math.max(400, num + randInt(5, 20)));
      const alt2 = Math.min(499, Math.max(400, num - randInt(5, 20)));
      return {
        ...base,
        text: `عدد ${toPersianDigits(num)} به حروف کدام است؟`,
        options: shuffle([word, numberToWord(alt1 === num ? alt1 + 1 : alt1), numberToWord(alt2 === num ? alt2 - 1 : alt2)]),
        correctAnswer: word,
        hint: 'عدد را بلند بخوان! 📖',
      } as Question;
    }

    case 'next_number': {
      const nextNum = num + 1 > 499 ? 498 : num;
      const distractors = generateUniqueDistractors(nextNum + 1, 400, 499, 2);
      return {
        ...base,
        text: `عدد بعد از ${toPersianDigits(nextNum)} کدام است؟ ➡️`,
        options: shuffle([toPersianDigits(nextNum + 1), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(nextNum + 1),
        hint: 'یکی بهش اضافه کن! +۱',
        number: nextNum + 1,
      } as Question;
    }

    case 'prev_number': {
      const prevNum = num - 1 < 400 ? 401 : num;
      const distractors = generateUniqueDistractors(prevNum - 1, 400, 499, 2);
      return {
        ...base,
        text: `عدد قبل از ${toPersianDigits(prevNum)} کدام است؟ ⬅️`,
        options: shuffle([toPersianDigits(prevNum - 1), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(prevNum - 1),
        hint: 'یکی ازش کم کن! -۱',
        number: prevNum - 1,
      } as Question;
    }

    case 'sequence': {
      const start = Math.max(400, num - randInt(1, 3));
      const seq = [start, start + 1, start + 2, start + 3, start + 4].filter(n => n <= 499);
      const missingIdx = randInt(1, Math.min(3, seq.length - 2));
      const missing = seq[missingIdx];
      const distractors = generateUniqueDistractors(missing, 400, 499, 2);
      const display = seq.map((s, i) => i === missingIdx ? '❓' : toPersianDigits(s)).join(' ، ');
      return {
        ...base,
        text: `عدد گمشده را پیدا کن! 🔍\n\n${display}`,
        options: shuffle([toPersianDigits(missing), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(missing),
        hint: 'اعداد یکی‌یکی زیاد می‌شوند! 📈',
        number: missing,
      } as Question;
    }

    case 'missing_in_sequence': {
      const start = Math.max(400, num - 2);
      const seq = [start, start + 1, start + 2, start + 3, start + 4].filter(n => n <= 499);
      const missingIdx = 2;
      const missing = seq[missingIdx] || seq[1];
      const distractors = generateUniqueDistractors(missing, 400, 499, 2);
      const display = seq.map((s, i) => i === missingIdx ? '❓' : toPersianDigits(s)).join(' → ');
      return {
        ...base,
        text: `${display}\n\nعدد گمشده کدام است؟`,
        options: shuffle([toPersianDigits(missing), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(missing),
        hint: 'مسیر رو دنبال کن! ➡️',
        number: missing,
      } as Question;
    }

    case 'number_train': {
      const start = Math.max(400, num - 2);
      const trainSeq = [start, start + 1, start + 2, start + 3, start + 4].filter(n => n <= 499);
      const missingIdx = randInt(1, Math.min(3, trainSeq.length - 2));
      const missing = trainSeq[missingIdx];
      const distractors = generateUniqueDistractors(missing, 400, 499, 2);
      const display = trainSeq.map((s, i) =>
        i === missingIdx ? '❓' : toPersianDigits(s)
      );
      return {
        ...base,
        text: `🚂 قطار عددها!\n\n${display.join(' | ')}\n\nواگن گمشده چه عددی دارد؟`,
        options: shuffle([toPersianDigits(missing), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(missing),
        hint: 'واگن‌ها یکی‌یکی زیاد می‌شوند! 🚃',
        number: missing,
      } as Question;
    }

    case 'number_shop': {
      const distractors = generateUniqueDistractors(num, 400, 499, 2);
      return {
        ...base,
        text: `📦 سنجابک می‌خواهد جعبه ${toPersianDigits(num)} را پیدا کند!\n\nکدام جعبه درست است؟`,
        options: shuffle([toPersianDigits(num), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(num),
        hint: 'به عدد روی جعبه دقت کن! 👁️',
      } as Question;
    }

    case 'warehouse': {
      const distractors = generateUniqueDistractors(num, 400, 499, 2);
      return {
        ...base,
        text: '🏭 در انبار چه عددی داریم؟',
        options: shuffle([toPersianDigits(num), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(num),
        hint: 'صدتایی 🟣 ده‌تایی 🔵 یکی 🟡 رو بشمار!',
      } as Question;
    }

    case 'memory_game': {
      const distractors = generateUniqueDistractors(num, 400, 499, 2);
      return {
        ...base,
        text: '🧠 عدد را به خاطر بسپار!',
        options: shuffle([toPersianDigits(num), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(num),
        hint: 'به رقم‌ها دقت کن! 👁️',
      } as Question;
    }

    case 'final_challenge': {
      const distractors = generateUniqueDistractors(num, 400, 499, 2);
      const expanded = `${toPersianDigits(h * 100)} + ${toPersianDigits(t * 10)} + ${toPersianDigits(o)}`;
      return {
        ...base,
        text: `🏆 چالش!\n\n${expanded}\n\nکدام عدد است؟`,
        options: shuffle([toPersianDigits(num), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(num),
        hint: 'صدها + ده‌ها + یکی‌ها = عدد 💡',
      } as Question;
    }

    case 'drag_build': {
      return {
        ...base,
        text: `عدد ${toPersianDigits(num)} را با بلوک‌ها بساز! 🏗️`,
        options: [],
        correctAnswer: `${h}|${t}|${o}`,
        hint: `${toPersianDigits(h)} صدتایی 🟣 + ${toPersianDigits(t)} ده‌تایی 🔵 + ${toPersianDigits(o)} یکی 🟡`,
      } as Question;
    }

    default: {
      const distractors = generateUniqueDistractors(h, 1, 9, 2);
      return {
        ...base,
        text: `عدد ${toPersianDigits(num)} چند صدتایی دارد؟ 🟣`,
        options: shuffle([toPersianDigits(h), ...distractors.map(d => toPersianDigits(d))]),
        correctAnswer: toPersianDigits(h),
        hint: 'اولین رقم سمت چپ! ⬅️',
      } as Question;
    }
  }
}

export function generateQuestionsForStage(stageId: number, difficulty: number, count: number = 6): Question[] {
  const stageTypes: Record<number, QuestionType[]> = {
    1: ['count_ones', 'identify_one', 'count_ones', 'identify_one', 'count_ones', 'count_ones'],
    2: ['count_tens', 'identify_ten', 'count_tens', 'identify_ten', 'count_tens', 'count_tens'],
    3: ['count_hundreds', 'identify_hundred', 'count_hundreds', 'identify_hundred', 'count_hundreds', 'count_hundreds'],
    4: ['build_number', 'image_to_number', 'warehouse', 'build_number', 'image_to_number', 'number_to_image'],
    5: ['identify_sadgan', 'identify_dahgan', 'identify_yekan', 'place_digit', 'missing_digit', 'missing_place_value'],
    6: ['expand_number', 'expand_to_number', 'expand_number', 'drag_build', 'expand_to_number', 'final_challenge'],
    7: ['number_to_word', 'word_to_number', 'match_number_word', 'sequence', 'number_train', 'next_number'],
  };

  const types = stageTypes[stageId] || stageTypes[4];
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    questions.push(generateQuestion(type, stageId, difficulty));
  }

  return questions;
}
