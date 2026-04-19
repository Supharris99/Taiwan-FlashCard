const fs = require('fs');

async function fetchVocab() {
  console.log('Fetching TOCFL words...');
  const res = await fetch('https://raw.githubusercontent.com/PSeitz/tocfl/master/tocfl_words.json');
  const text = await res.text();
  console.log(text.substring(0, 500));
}

fetchVocab().catch(console.error);
