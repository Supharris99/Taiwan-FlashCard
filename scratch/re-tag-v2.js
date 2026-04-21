import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the old data
const vocabPath = path.join(__dirname, '../src/data/vocabulary.js');
let vocabContent = fs.readFileSync(vocabPath, 'utf-8');

// Quick and dirty way to parse the export
let vocabularyData;
try {
  const jsonStr = vocabContent
    .replace('export const vocabularyData = ', '')
    .replace(/;?\s*$/, '');
  vocabularyData = eval(jsonStr); // Eval used locally for script
} catch (e) {
  console.error("Parse error:", e);
  process.exit(1);
}

// Ensure 16 Categories Match Exact Strings
// 1. Kehidupan Sehari-hari
// 2. Orang & Relasi
// 3. Waktu & Jadwal
// 4. Tempat & Arah
// 5. Angka & Kuantitas
// 6. Makanan & Minuman
// 7. Transportasi
// 8. Belanja & Uang
// 9. Sekolah & Belajar
// 10. Pekerjaan Dasar
// 11. Kesehatan
// 12. Teknologi & Komunikasi
// 13. Perasaan & Sifat
// 14. Kata Kerja Inti
// 15. Kata Sifat Inti
// 16. Partikel & Struktur Dasar

const mappingRules = [
    // 5. Angka & Kuantitas (Must go first to catch numbers/measure words before anything else)
    {
        cat: "Angka & Kuantitas",
        sub: "Bilangan/Urutan",
        keywords: [/(^|\b)(one|two|three|four|five|six|seven|eight|nine|ten|zero|first|second|hundred|thousand|half)(\b|$)/i, /number/i, /amount/i]
    },
    {
        cat: "Angka & Kuantitas",
        sub: "Satuan (Measure Words)",
        keywords: [/measure word/i, /classifier/i, /CL:/, /unit /i]
    },
    
    // 16. Partikel & Struktur Dasar (Grammar logic)
    {
        cat: "Partikel & Struktur Dasar",
        sub: "Konjungsi/Partikel",
        keywords: [/(^|\b)(and|but|or|because|so|therefore|although|if|then|however|particle)(\b|$)/i, /negative prefix/i, /indicating/i, /question/i]
    },
    {
        cat: "Partikel & Struktur Dasar",
        sub: "Pronoun",
        keywords: [/(^|\b)(I|me|you|he|she|it|we|they|this|that|these|those|which|what|who)(\b|$)/i]
    },
    
    // 3. Waktu & Jadwal
    {
        cat: "Waktu & Jadwal",
        sub: "Kalender/Jam",
        keywords: [/time/i, /hour/i, /minute/i, /second/i, /day/i, /week/i, /month/i, /year/i, /today/i, /tomorrow/i, /yesterday/i, /morning/i, /afternoon/i, /night/i, /evening/i, /spring/i, /summer/i, /autumn/i, /winter/i]
    },

    // 2. Orang & Relasi
    {
        cat: "Orang & Relasi",
        sub: "Keluarga/Teman",
        keywords: [/father/i, /mother/i, /brother/i, /sister/i, /son/i, /daughter/i, /uncle/i, /aunt/i, /friend/i, /guest/i, /people/i, /person/i, /man/i, /woman/i, /child/i, /wife/i, /husband/i]
    },
    
    // 6. Makanan & Minuman
    {
        cat: "Makanan & Minuman",
        sub: "Bahan/Hidangan",
        keywords: [/eat/i, /drink/i, /food/i, /water/i, /tea/i, /coffee/i, /rice/i, /noodle/i, /meat/i, /chicken/i, /fish/i, /vegetable/i, /fruit/i, /apple/i, /bread/i, /cake/i, /meal/i, /restaurant/i, /hungry/i, /thirsty/i, /taste/i, /spicy/i, /sweet/i, /sour/i, /bitter/i]
    },

    // 7. Transportasi
    {
        cat: "Transportasi",
        sub: "Kendaraan/Lalu Lintas",
        keywords: [/car/i, /bus/i, /train/i, /vehicle/i, /drive/i, /ride/i, /fly/i, /plane/i, /airport/i, /station/i, /road/i, /street/i, /traffic/i, /ticket/i, /go by/i, /travel/i]
    },

    // 8. Belanja & Uang
    {
        cat: "Belanja & Uang",
        sub: "Transaksi/Barang",
        keywords: [/buy/i, /sell/i, /money/i, /price/i, /cheap/i, /expensive/i, /shop/i, /store/i, /clothes/i, /shirt/i, /shoes/i, /pants/i, /wear/i, /pay/i]
    },

    // 9. Sekolah & Belajar
    {
        cat: "Sekolah & Belajar",
        sub: "Akademik",
        keywords: [/school/i, /student/i, /teacher/i, /study/i, /learn/i, /book/i, /read/i, /write/i, /pen/i, /paper/i, /exam/i, /test/i, /class/i, /lesson/i, /homework/i, /university/i, /college/i, /dictionary/i]
    },

    // 10. Pekerjaan Dasar
    {
        cat: "Pekerjaan Dasar",
        sub: "Profesi/Kantor",
        keywords: [/work/i, /job/i, /business/i, /company/i, /office/i, /boss/i, /employee/i, /doctor/i, /nurse/i, /manager/i, /meeting/i, /salary/i]
    },

    // 11. Kesehatan
    {
        cat: "Kesehatan",
        sub: "Fisik/Medis",
        keywords: [/health/i, /sick/i, /ill/i, /hospital/i, /medicine/i, /body/i, /head/i, /hand/i, /foot/i, /leg/i, /eye/i, /ear/i, /mouth/i, /tooth/i, /pain/i, /tired/i]
    },

    // 12. Teknologi & Komunikasi
    {
        cat: "Teknologi & Komunikasi",
        sub: "Digial/Alat",
        keywords: [/phone/i, /computer/i, /internet/i, /call/i, /message/i, /email/i, /television/i, /movie/i, /camera/i, /photo/i, /music/i]
    },

    // 4. Tempat & Arah
    {
        cat: "Tempat & Arah",
        sub: "Lokasi/Posisi",
        keywords: [/place/i, /room/i, /door/i, /window/i, /house/i, /home/i, /city/i, /country/i, /park/i, /left/i, /right/i, /front/i, /back/i, /inside/i, /outside/i, /up/i, /down/i, /north/i, /south/i, /east/i, /west/i, /here/i, /there/i, /where/i]
    },

    // 1. Kehidupan Sehari-hari
    {
        cat: "Kehidupan Sehari-hari",
        sub: "Rutinitas/Rumah",
        keywords: [/sleep/i, /wake up/i, /wash/i, /clean/i, /bath/i, /dog/i, /cat/i, /animal/i, /chair/i, /table/i, /bed/i, /live/i, /stay/i]
    },

    // 13. Perasaan & Sifat
    {
        cat: "Perasaan & Sifat",
        sub: "Emosi/Opini",
        keywords: [/happy/i, /sad/i, /angry/i, /afraid/i, /like/i, /love/i, /hate/i, /feel/i, /think/i, /believe/i, /hope/i, /want/i, /good/i, /bad/i, /beautiful/i, /ugly/i]
    },

    // 14. Kata Kerja Inti (Catch-all verbs)
    {
        cat: "Kata Kerja Inti",
        sub: "Tindakan Umum",
        keywords: [/(^|\b)(do|make|be|have|go|come|see|look|listen|hear|say|speak|talk|tell|give|take|get|know|understand|remember|forget|use|help|try|start|finish|open|close|stop|wait)(\b|$)/i, /to /i, /verb/i]
    },

    // 15. Kata Sifat Inti (Catch-all adjectives)
    {
        cat: "Kata Sifat Inti",
        sub: "Deskripsi",
        keywords: [/(^|\b)(big|small|long|short|hot|cold|new|old|fast|slow|hard|easy|high|low|far|near)(\b|$)/i, /color/i, /red/i, /blue/i, /green/i, /black/i, /white/i, /yellow/i]
    }
];

function assignCategory(meaning) {
    const defaultData = { cat: "Kehidupan Sehari-hari", sub: "Umum", tags: ['A2', 'General', 'Common'] };
    // Tags basic estimation
    let tags = [];
    if (/CL:/.test(meaning)) tags.push('Measure Word');
    else if (/(^|\b)to \w/.test(meaning)) tags.push('Verb');
    else if (/(^|\b)(very|too|not)\b/.test(meaning)) tags.push('Adverb');
    else tags.push('Noun/Adj');

    tags.push(Math.random() > 0.5 ? 'A1' : 'A2'); // Mock level
    tags.push('Common');

    for (const rule of mappingRules) {
        if (rule.keywords.some(regex => regex.test(meaning))) {
            return { cat: rule.cat, sub: rule.sub, tags };
        }
    }
    return { ...defaultData, tags };
}

const updatedData = vocabularyData.map(word => {
    const { cat, sub, tags } = assignCategory(word.meaning);
    return {
        id: word.id,
        traditional: word.traditional,
        pinyin: word.pinyin,
        meaning: word.meaning,
        category: cat,
        subcategory: sub,
        tags: tags
    };
});

const fileContent = `export const vocabularyData = ${JSON.stringify(updatedData, null, 2)};\n`;
fs.writeFileSync(vocabPath, fileContent, 'utf-8');
console.log(`Successfully mapped ${updatedData.length} words to TOCFL A2 format.`);
