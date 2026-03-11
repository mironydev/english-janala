const loadLessons = () => {
  fetch('https://openapi.programming-hero.com/api/levels/all')
    .then(res => res.json())
    .then(data => displayLesson(data.data));
};

const removeActiveClass = () => {
  const lessonBtns = document.querySelectorAll('.lesson-btn');
  lessonBtns.forEach(btn => btn.classList.remove('active'));
}

const loadWords = (levelNUmber) => {
  fetch(`https://openapi.programming-hero.com/api/level/${levelNUmber}`)
    .then(res => res.json())
    .then(data => {
      removeActiveClass();
      const clickedBtn = document.getElementById(`lesson-btn-${levelNUmber}`);
      clickedBtn.classList.add('active');
      displayWord(data.data)
    });
};

const loadWordDetails = async (word_id) => {
  const res = await fetch(`https://openapi.programming-hero.com/api/word/${word_id}`);
  const data = await res.json();
  displayWordDetails(data.data);
}

const createElementForSynonyms = (arr) => {
  const htmlElements = arr.map((element) => `<p class="bg-sky-100 px-4 p-2 rounded-xl">${element}</p>`);
  return htmlElements.join(" ");
}

const displayWordDetails = (word) => {

  //   "data": {
  // "word": "Eager",
  // "meaning": "আগ্রহী",
  // "pronunciation": "ইগার",
  // "level": 1,
  // "sentence": "The kids were eager to open their gifts.",
  // "points": 1,
  // "partsOfSpeech": "adjective",
  // "synonyms": [
  // "enthusiastic",
  // "excited",
  // "keen"
  // ],
  // "id": 5
  // }

  const wordDetailscontainer = document.getElementById('word-details-container');
  wordDetailscontainer.innerHTML = `
  <div class="px-4 pt-4">
    <h2 class="text-3xl font-semibold bangla-font">${word.word ? word.word : ('শব্দ পাওয়া যায়নি')} (<i class="fa-solid fa-microphone-lines"></i>: ${word.pronunciation ? word.pronunciation : '(উচ্চারণ পাওয়া যায়নি)'})</h2>
    <p class="text-xl font-semibold pt-6 pb-2">Meaning</p>
    <p class="text-xl font-medium bangla-font">${word.meaning ? word.meaning : '(অর্থ পাওয়া যায়নি)'}</p>
    <p class="text-xl font-semibold pt-6 pb-2">Example</p>
    <p class="text-xl">${word.sentence ? word.sentence : 'উদাহরণ পাওয়া যায়নি'}</p>
    <p class="text-xl font-semibold pt-6 pb-2">Synonyms</p>
    <div class="flex gap-2">
      ${word.synonyms.length > 0 ? createElementForSynonyms(word.synonyms) : '<p class="text-xl font-medium bangla-font">(সমার্থক শব্দ পাওয়া যায়নি)</p>'}
    </div>
  </div>
  `;

  document.getElementById('my_modal_5').showModal();
}

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
        <button onclick="loadWordDetails(${word.id})" class="bg-sky-100 px-3 py-2 rounded-md opacity-80 outline-none cursor-pointer hover:bg-sky-300 duration-200"><i class="fa-solid fa-circle-info"></i></button>
        <button class="bg-sky-100 px-3 py-2 rounded-md opacity-80 cursor-pointer hover:bg-sky-300 duration-200"><i class="fa-solid fa-volume-high"></i></button>
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
    <button id="lesson-btn-${lesson.level_no}" onclick="loadWords(${lesson.level_no})" class="btn btn-primary btn-outline lesson-btn"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
    `;
    levelContainer.appendChild(level);
  };
};

loadLessons();