# 🇹🇼 Taiwan Mandarin Flashcards 🎴

A modern, web-based flashcard application tailored for learning Traditional Chinese (Taiwanese Mandarin). Fully dedicated to helping learners reach the **TOCFL Band A2** level, covering **2000+ most frequently used vocabulary words** in daily life.

## ✨ Key Features
* **2000+ Vocabulary Words**: Complete with Traditional Hanzi, Pinyin, and English translations!
* **Mastery Filters**: Track your learning progress by categorizing cards into: "All", "Mastered", "Unsure", and "Forgot".
* **Smart Progress Tracking**: Your memorization data is securely stored offline in your browser's Local Storage.
* **Premium Design**: Built with a dynamic, futuristic Glassmorphism aesthetic to keep you motivated and engaged.

## 📖 How to Use (For Learners)
**Access with this link** : https://taiwan-flash-card-sh.vercel.app/
1. **View the Card**: The app displays a Traditional Chinese character on the screen.
2. **Flip for Meaning**: Click or tap the card to flip it and reveal the Pinyin and English translation.
3. **Rate Your Memory**: Once you see the answer, evaluate yourself using one of the three buttons below:
   - **Hafal Banget (Mastered)**: If you knew it perfectly.
   - **Ragu-ragu (Unsure)**: If it took you some time to remember.
   - **Lupa (Forgot)**: If you completely forgot it.
4. **Filter & Focus**: Use the top navigation tabs to filter the words. For example, click "Lupa" to exclusively study the words you failed to remember!

## 🛠️ Tech Stack
* **Vite** - Lightning fast frontend tooling
* **React 19** - Modern Frontend library
* **Lucide React** - Premium icon set
* **Vanilla CSS** - For unrestricted glassmorphism styling and UI responsiveness.
* **Hanzi API** - For backend fetching and translating official database modules seamlessly.

## 🚀 Running Locally

Make sure you have [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/) installed on your machine.

\`\`\`bash
# 1. Clone this repository
git clone https://github.com/YourUsername/taiwan-flashcards.git

# 2. Enter the project directory
cd taiwan-flashcards

# 3. Install dependencies
bun install

# 4. Start the development server
bun run dev
\`\`\`

Open `http://localhost:5173` in your browser to see the app running live.

## 🌍 Building for Production (Static Web)

\`\`\`bash
bun run build
\`\`\`
This command bundles the application into a highly optimized, lightweight `dist` folder. You can easily upload this `dist` folder to free hosting services like **Vercel**, **Netlify**, or **GitHub Pages** to get your website online instantly and share it with others!

---
*Crafted specifically to support your Mandarin learning journey! 加油 (Jiāyóu)!*
