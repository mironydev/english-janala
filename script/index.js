const loadLessons = () => {
  fetch('https://openapi.programming-hero.com/api/levels/all')
    .then(res => res.json())
    .then(data => displayLesson(data.data));
};

const loadWords = (id) => {
  fetch(`https://openapi.programming-hero.com/api/level/${id}`)
    .then(res => res.json())
    .then(data => displayWord(data.data));
};

const displayWord = (words) => {
  const wordContainer = document.getElementById('word-container');
  wordContainer.innerHTML = '';

  if (words.length === 0) {
    wordContainer.innerHTML = `
    <div class="text-cente w-11/12 bg-gray-100 mx-auto rounded-xl p-8 col-span-full">
      <span class="text-5xl"><i class="fa-solid fa-triangle-exclamation"></i></span>
      <p class="bangla-font text-sm opacity-80 mt-4 mb-2">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
      <h2 class="bangla-font text-3xl font-semibold">নেক্সট Lesson এ যান</h2>
    </div>
    `;
    return;
  }

  for (const word of words) {
    const wordCard = document.createElement('div');
    wordCard.innerHTML = `
    <div class="card bg-base-100 p-10">
      <p class="font-bold text-3xl">${word.word ? word.word : "(শব্দ পাওয়া যায়নি)"}</p>
      <p class="font-medium text-x my-5">Meaning / Pronunciation</p>
      <p class="font-semibold text-2xl opacity-80 bangla-font">"${word.meaning ? word.meaning : "(অর্থ পাওয়া যায়নি)"} / ${word.pronunciation ? word.pronunciation : "(উচ্চারণ পাওয়া যায়নি)"}"</p>
      <div class="flex justify-between items-center mt-4">
        <button class="bg-sky-100 px-3 py-2 rounded-md opacity-80"><i class="fa-solid fa-circle-info"></i></button>
        <button class="bg-sky-100 px-3 py-2 rounded-md opacity-80"><i class="fa-solid fa-volume-high"></i></button>
      </div>
    </div>
    `;
    wordContainer.appendChild(wordCard);
  }

};


const displayLesson = (lessons) => {
  const levelContainer = document.getElementById('level-container');
  levelContainer.innerHTML = '';

  for (const lesson of lessons) {
    const level = document.createElement('div');
    level.innerHTML = `
    <button onclick="loadWords(${lesson.level_no})" class="btn btn-primary btn-outline"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
    `;
    levelContainer.appendChild(level);
  };
};

loadLessons();