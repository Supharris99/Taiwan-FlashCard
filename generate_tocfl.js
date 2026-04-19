const fs = require('fs');
const hanzi = require('hanzi');

async function main() {
  console.log('Initializing Hanzi...');
  hanzi.start();
  
  console.log('Fetching TOCFL words...');
  const res = await fetch('https://raw.githubusercontent.com/PSeitz/tocfl/master/tocfl_words.json');
  const text = await res.text();
  
  const items = text.split('\n').filter(l => l.trim().length > 0).map(l => JSON.parse(l));
  console.log(`Fetched ${items.length} TOCFL words.`);
  
  // Take first 2000 words
  const targetWords = items.slice(0, 2000);
  
  const vocabularyData = [];
  let id = 1;
  const categories = ['school', 'work', 'daily', 'environment'];
  
  for (const item of targetWords) {
    const char = item.text;
    const pinyin = item.pinyin;
    
    // Fallbacks
    let meaning = 'Tidak ada arti';
    
    // Look up dictionary
    const def = hanzi.definitionLookup(char);
    if (def && def.length > 0) {
      // Get meaning
      meaning = def[0].definition;
    }
    
    vocabularyData.push({
      id: id++,
      traditional: char,
      pinyin: pinyin,
      meaning: meaning.substring(0, 150), // Cap length
      category: categories[id % categories.length]
    });
  }
  
  const fileContent = `export const vocabularyData = ${JSON.stringify(vocabularyData, null, 2)};`;
  fs.writeFileSync('src/data/vocabulary.js', fileContent);
  console.log('Successfully generated src/data/vocabulary.js with 2000 words.');
}

main().catch(console.error);
