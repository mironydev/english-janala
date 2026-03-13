const loadLessons = () => {
  fetch('https://openapi.programming-hero.com/api/levels/all')
    .then(res => res.json())
    .then(data => displayLesson(data.data));
};

const loadingAnimation = (isLoading) => {
  const animation = document.getElementById('loading-animation');
  const levelContainer = document.getElementById('word-container');
  if (isLoading) {
    animation.classList.remove('hidden');
    levelContainer.classList.add('hidden');
  } else {
    animation.classList.add('hidden');
    levelContainer.classList.remove('hidden');
  }
}

const removeActiveClass = () => {
  const lessonBtns = document.querySelectorAll('.lesson-btn');
  lessonBtns.forEach(btn => btn.classList.remove('active'));
}

const loadWords = (levelNUmber) => {
  loadingAnimation(true);
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

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const wordContainer = document.getElementById('word-container');
const displayWord = (words) => {
  wordContainer.innerHTML = '';

  if (words.length === 0) {
    wordContainer.innerHTML = `
    <div class="text-cente w-11/12 bg-gray-100 mx-auto rounded-xl py-2 md:p-8 col-span-full">
      <span class="text-5xl"><i class="fa-solid fa-triangle-exclamation"></i></span>
      <p class="bangla-font text-sm opacity-80 mt-4 mb-2">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
      <h2 class="bangla-font text-3xl font-semibold">নেক্সট Lesson এ যান</h2>
    </div>
    `;
    loadingAnimation(false);
    return;
  }

  for (const word of words) {
    const wordCard = document.createElement('div');
    wordCard.innerHTML = `
    <div class="relative card bg-base-100 p-10">   
      <span onclick="toggleSaveWord(this, ${word.id})" class="absolute right-5 top-5 heart-icon text-xl cursor-pointer">
        <i class="${savedWords.includes(word.id) ? 'fa-solid text-pink-500' : 'fa-regular'} fa-heart"></i>
      </span>

      <p class="font-bold text-3xl">${word.word ? word.word : "(শব্দ পাওয়া যায়নি)"}</p>
      <p class="font-medium text-x my-5">Meaning / Pronunciation</p>
      <p class="font-semibold text-2xl opacity-80 bangla-font">"${word.meaning ? word.meaning : "(অর্থ পাওয়া যায়নি)"} / ${word.pronunciation ? word.pronunciation : "(উচ্চারণ পাওয়া যায়নি)"}"</p>
      <div class="flex justify-between items-center mt-4">
        <button onclick="loadWordDetails(${word.id})" class="bg-sky-100 px-3 py-2 rounded-md opacity-80 outline-none cursor-pointer hover:bg-sky-300 duration-200"><i class="fa-solid fa-circle-info"></i></button>
        <button onclick="pronounceWord('${word.word}')" class="bg-sky-100 px-3 py-2 rounded-md opacity-80 cursor-pointer hover:bg-sky-300 duration-200"><i class="fa-solid fa-volume-high"></i></button>
      </div>
    </div>
    `;
    wordContainer.appendChild(wordCard);
  }
  loadingAnimation(false);
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

document.getElementById('search-button').addEventListener('click', () => {
  loadingAnimation(true);
  removeActiveClass();
  const searchInput = document.getElementById('search-input');
  const searchValue = searchInput.value.trim().toLowerCase();

  fetch('https://openapi.programming-hero.com/api/words/all')
    .then(res => res.json())
    .then(data => {
      const allWords = data.data;
      const filterWords = allWords.filter((word) => word.word.toLowerCase().includes(searchValue));
      if (!searchValue || filterWords.length === 0) {
        wordContainer.innerHTML = `
        <div class="text-cente w-11/12 bg-gray-100 mx-auto rounded-xl py-2 md:p-8 col-span-full">
          <span class="text-5xl"><i class="fa-solid fa-triangle-exclamation"></i></span>
          <h2 class="bangla-font text-3xl font-semibold pt-4">কোন শব্দ পাওয়া যায়নি</h2>
          <p class="bangla-font text-sm opacity-80 mt-2">সঠিক শব্দ লিখে Search করুন।</p>
        </div>
        `;
        loadingAnimation(false);
        return;
      }
      displayWord(filterWords);
    });
});

document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const faqDescription = btn.closest('.faq-item').querySelector('.faq-description');
    if (btn.innerText === '+') {
      faqDescription.classList.remove('hidden');
      btn.innerText = '-';
    } else {
      faqDescription.classList.add('hidden');
      btn.innerText = '+';
    }
  });
});

const savedWords = [];

const toggleSaveWord = (element, wordId) => {
  const heartIcon = element.querySelector('i');
  heartIcon.classList.toggle('fa-regular');
  heartIcon.classList.toggle('fa-solid');
  heartIcon.classList.toggle('text-pink-500');

  if (savedWords.includes(wordId)) {
    savedWords.splice(savedWords.indexOf(wordId), 1);
  } else {
    savedWords.push(wordId);
  }

  document.getElementById('saved-words-btn').innerText = `Saved Words: ${savedWords.length}`;
};

document.getElementById('saved-words-btn').addEventListener('click', () => {
  removeActiveClass();
  if (savedWords.length === 0) {
    wordContainer.innerHTML = `
      <div class="text-cente w-11/12 bg-gray-100 mx-auto rounded-xl py-2 md:p-8 col-span-full">
        <span class="text-5xl"><i class="fa-solid fa-triangle-exclamation"></i></span>
        <h2 class="bangla-font text-3xl font-semibold pt-4">কোন শব্দ Save করা হয়নি</h2>
        <p class="bangla-font text-sm opacity-80 mt-2">শব্দ Save করতে Heart Icon এ ক্লিক করুন।</p>
      </div>
      `;
    return;
  }
  loadingAnimation(true);
  const requests = savedWords.map(id =>
    fetch(`https://openapi.programming-hero.com/api/word/${id}`)
      .then(res => res.json())
      .then(data => data.data)
  );
  Promise.all(requests).then(words => {
    displayWord(words);
  });
});