import { LESSON_CONTENT, UNITS } from './src/data/curriculum.js';

console.log("Loading Curriculum Data...");
console.log("Unit Count:", UNITS.length);
console.log("Lesson Content Keys:", Object.keys(LESSON_CONTENT));

if (LESSON_CONTENT['l1']) {
    console.log("SUCCESS: Lesson 'l1' found!");
    console.log("Item count:", LESSON_CONTENT['l1'].length);
} else {
    console.error("ERROR: Lesson 'l1' NOT found!");
}
