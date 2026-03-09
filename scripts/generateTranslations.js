import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = 'AIzaSyDgyWwwmHOROsPZclCm-LGzZs_uoYNhVDk';
const LANGUAGES = [
    'en', 'es', 'fr', 'pt', 'de', 'ar', 'hi', 'bn', 'zh', 'ja',
    'id', 'tr', 'vi', 'ko', 'ru', 'it', 'pl', 'th', 'tl'
];

const sourceStrings = {
    "welcome_title": "Welcome to Brain Dump",
    "welcome_subtitle": "Clear Your Mind. Find Your Focus.",
    "welcome_desc": "Write down everything. No judgment. No sorting. Just release.",
    "start_dump": "Start Your Dump",
    "how_it_works": "How it works",
    "step_1": "1. Download your brain onto the digital page.",
    "step_2": "2. Sort into what needs action and what can wait.",
    "step_3": "3. Focus on just one small next step.",
    "dump_placeholder": "Just start writing...",
    "dump_hint": "Anything that's on your mind right now.",
    "finished": "I'm finished",
    "keep_going": "Keep going... what else?",
    "breathe": "Breathe in. Breathe out.",
    "sort_title": "Sort Your Thoughts",
    "sort_desc": "Drag and drop or click to move items.",
    "action_needed": "Action Needed",
    "action_desc": "Something I need to do soon.",
    "do_later": "Do Later",
    "later_desc": "Not urgent, but keep in mind.",
    "let_it_go": "Let It Go",
    "letgo_desc": "Not important or out of my control.",
    "continue": "Continue",
    "go_back": "Go Back",
    "small_step_title": "One Small Next Step",
    "small_step_desc": "Focus on just the first tiny thing for each action.",
    "first_step_placeholder": "What is the very first step?",
    "done": "Done",
    "reflection_title": "Reflection",
    "reflection_desc": "How do you feel now that you've sorted your brain?",
    "reflection_placeholder": "Write a brief reflection...",
    "finish_session": "Finish Session",
    "history": "History",
    "no_sessions": "No saved sessions yet.",
    "back_to_app": "Back to App",
    "delete_session": "Delete Session",
    "thoughts": "Thoughts",
    "reflection": "Reflection",
    "language": "Language"
};

async function translate(text, targetLang) {
    if (targetLang === 'en') return text;

    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                target: targetLang,
                format: 'text'
            })
        });
        const data = await response.json();
        if (data.data && data.data.translations && data.data.translations.length > 0) {
            return data.data.translations[0].translatedText;
        }
        console.error(`Translation failed for ${targetLang}:`, data);
        return text;
    } catch (error) {
        console.error(`Error translating to ${targetLang}:`, error);
        return text;
    }
}

async function generate() {
    for (const lang of LANGUAGES) {
        console.log(`Generating translations for ${lang}...`);
        const translations = {};
        for (const [key, text] of Object.entries(sourceStrings)) {
            translations[key] = await translate(text, lang);
        }
        fs.writeFileSync(
            path.join(__dirname, `../src/i18n/locales/${lang}.json`),
            JSON.stringify(translations, null, 2)
        );
    }
    console.log('All translations generated!');
}

generate();
