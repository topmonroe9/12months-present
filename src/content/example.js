// src/content/gifts/gift1.js

export const gift1Content = {
  music: "/gifts/gift1/music.mp3",
  // Общая длительность музыки в секундах
  totalDuration: 180, // 3 минуты как пример

  slides: [
    {
      type: "text",
      content: "Привет, любимая! ❤️",
      className: "text-4xl font-bold text-pink-500 text-center",
      startTime: 0, // начало в 0:00
      endTime: 5, // конец в 0:05
      backgroundColor: "rgba(0, 0, 0, 0.95)",
    },

    {
      type: "image",
      src: "/gifts/gift1/photo1.jpg",
      alt: "Наша первая встреча",
      caption: "Помнишь этот день? Наша первая встреча в кафе...",
      className: "w-full h-96 object-cover rounded-lg shadow-xl",
      captionClassName: "text-lg text-gray-300 mt-4 text-center italic",
      startTime: 5, // 0:05
      endTime: 15, // 0:15
      backgroundColor: "rgba(0, 0, 0, 0.85)",
    },

    {
      type: "text",
      content: "Я до сих пор помню, как ты улыбалась в тот день...",
      className: "text-2xl text-gray-200 text-center leading-relaxed",
      startTime: 15, // 0:15
      endTime: 25, // 0:25
      backgroundColor: "rgba(0, 0, 0, 0.9)",
    },

    {
      type: "imageGrid",
      images: [
        {
          src: "/gifts/gift1/photo2.jpg",
          alt: "Наша прогулка",
          caption: "Первая прогулка в парке",
        },
        {
          src: "/gifts/gift1/photo3.jpg",
          alt: "Закат",
          caption: "Тот самый закат",
        },
      ],
      className: "grid grid-cols-2 gap-4",
      imageClassName: "w-full h-48 object-cover rounded-lg shadow-lg",
      captionClassName: "text-sm text-gray-300 mt-2 text-center",
      startTime: 25, // 0:25
      endTime: 40, // 0:40
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    {
      type: "videoGrid",
      videos: [
        {
          src: "/gifts/gift1/video1.mp4",
          caption: "Наше первое видео",
        },
        {
          src: "/gifts/gift1/video2.mp4",
          caption: "Веселые моменты",
        },
      ],
      content: "Наши лучшие моменты вместе ❤️", // Опциональный текст
      contentClassName: "text-2xl text-pink-400", // Стили для текста
      className: "grid grid-cols-2 gap-4",
      videoClassName: "w-full h-48 object-cover rounded-lg shadow-lg",
      captionClassName: "text-sm text-gray-300 mt-2 text-center",
      startTime: 75,
      endTime: 80,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    // ... другие слайды
  ],
};
