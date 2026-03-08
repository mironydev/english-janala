const loadLessons = () => {
  const url = 'https://openapi.programming-hero.com/api/levels/all';

  fetch(url)
    .then(res => res.json())
    .then(data => displayLesson(data.data));
};

const displayLesson = (lessons) => {
  const levelContainer = document.getElementById('level-container');
  levelContainer.innerHTML = '';

    for (const lesson of lessons) {
    const level = document.createElement('div');
    level.innerHTML = `
    <button class="btn btn-primary btn-outline"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
    `;
    levelContainer.appendChild(level);
  };
};

loadLessons();