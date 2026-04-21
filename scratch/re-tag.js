import fs from 'fs';
import path from 'path';

const filePath = 'c:/Users/FX506LHB/.gemini/antigravity/scratch/taiwan-flashcards/src/data/vocabulary.js';
const content = fs.readFileSync(filePath, 'utf-8');

const match = content.match(/export const vocabularyData = (\[[\s\S]*\]);/);
if (!match) {
  console.error("Could not find vocabularyData array.");
  process.exit(1);
}

const vocabularyData = JSON.parse(match[1]);

const tagMapping = [
  { 
    category: 'numbers', 
    keywords: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'hundred', 'thousand', 'million', 'billion', 'dozen', 'score', 'half', 'percent'], 
    hanzi: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '萬', '億', '零', '兩', '第'] 
  },
  { 
    category: 'calendar', 
    keywords: ['month', 'year', 'day', 'week', 'time', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'today', 'tomorrow', 'yesterday', 'hour', 'minute', 'second', 'o\'clock', 'spring', 'summer', 'autumn', 'fall', 'winter', 'morning', 'afternoon', 'evening', 'night', 'noon', 'weekend', 'calendar'], 
    hanzi: ['月', '年', '日', '天', '周', '週', '期', '時', '分', '秒', '午', '晚', '早', '昨', '明', '今', '前', '後', '末', '刻', '鐘'] 
  },
  { 
    category: 'family', 
    keywords: ['father', 'mother', 'parent', 'son', 'daughter', 'brother', 'sister', 'aunt', 'uncle', 'grandpa', 'grandma', 'wife', 'husband', 'cousin', 'sibling', 'family', 'relatives', 'child', 'marry', 'baby'], 
    hanzi: ['爸', '媽', '哥', '弟', '姐', '姊', '妹', '兒', '子', '女', '家', '族', '親', '婚', '妻', '夫', '叔', '舅', '姨', '奶'] 
  },
  { 
    category: 'work', 
    keywords: ['work', 'job', 'company', 'office', 'boss', 'employee', 'business', 'career', 'salary', 'meeting', 'interview', 'report', 'staff', 'manager', 'colleague', 'industry', 'hire', 'fire', 'promotion', 'contract', 'trade', 'economy'], 
    hanzi: ['工', '作', '職', '務', '司', '辦', '公', '會', '面', '談', '薪', '畢', '事', '業', '雇', '員', '經'] 
  },
  { 
    category: 'school', 
    keywords: ['school', 'student', 'teacher', 'study', 'learn', 'class', 'homework', 'exam', 'test', 'university', 'college', 'textbook', 'grade', 'scholarship', 'teach', 'subject', 'academy', 'campus'], 
    hanzi: ['學', '生', '師', '課', '習', '校', '試', '讀', '教', '考', '究', '科'] 
  }
];

const processedData = vocabularyData.map(item => {
  const meaning = item.meaning.toLowerCase();
  const traditional = item.traditional;
  
  let newCategory = 'daily'; // Default
  
  // Find matching category (Priority order: Work, School, Family, Calendar, Numbers)
  // Higher complexity matches should go first
  const checkOrder = ['work', 'school', 'family', 'calendar', 'numbers'];
  
  for (const catName of checkOrder) {
    const group = tagMapping.find(g => g.category === catName);
    const keywordMatch = group.keywords.some(k => 
      meaning === k || 
      meaning.includes(` ${k}`) || 
      meaning.includes(`${k}/`) ||
      (k.length > 3 && meaning.includes(k))
    );
    const hanziMatch = group.hanzi.some(h => traditional.includes(h));
    
    if (keywordMatch || hanziMatch) {
      newCategory = group.category;
      break;
    }
  }
  
  return { ...item, category: newCategory };
});

const newContent = `export const vocabularyData = ${JSON.stringify(processedData, null, 2)};\n`;
fs.writeFileSync(filePath, newContent);
console.log(`Successfully re-categorized ${processedData.length} words.`);
