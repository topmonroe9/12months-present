const important = "text-5xl font-serif font-semibold text-pink-400 text-center";
const main = "text-2xl font-serif text-gray-200 text-center";
const mainDark = "text-2xl font-serif text-gray-600 text-center";
const romantic =
    "text-3xl font-serif font-medium text-pink-300 text-center italic";
const photoSubs = "text-lg font-serif text-gray-300 text-center italic";
const gradients = {
    pinkLavender: "linear-gradient(to bottom, #FFE4E8, #E6E6FA)", // Нежно-розовый с лавандовым
    blueMint: "linear-gradient(to bottom, #E0F0FF, #E0FFE6)", // Светло-голубой с мятным
    peachPink: "linear-gradient(to bottom, #FFE5D6, #FFD6D6)", // Персиковый с розовым
    purpleBlue: "linear-gradient(to bottom, #E8D6E8, #D6D6FF)", // Лавандовый с синим
    diagonalPink: "linear-gradient(135deg, #FFE4E8, #E6E6FA)", // Диагональный градиент розово-лавандовый
    softGold: "linear-gradient(to bottom, #F5DEB3, #FFD700)", // Золотисто-бежевый
    deepSunset: "linear-gradient(to bottom, #FFB6C1, #FF6347)", // Глубокий закат (розовый с оранжевым)
    twilightSky: "linear-gradient(to bottom, #6A5ACD, #8A2BE2)", // Сумеречное небо (фиолетово-синий)
    mistyRose: "linear-gradient(to bottom, #FFE4E1, #FFDAB9)", // Нежная роза (розово-персиковый)
    softGray: "linear-gradient(to bottom, #D3D3D3, #A9A9A9)", // Мягкий серый для тёмных текстов
    classyBlack: "linear-gradient(to bottom, #2C2C2C, #1A1A1A)", // Элегантный чёрный
    blushPeach: "linear-gradient(to bottom, #FFD1DC, #FFE5B4)", // Soft pink to warm peach
    lavenderMist: "linear-gradient(to bottom, #E6E6FA, #D8BFD8)", // Light lavender to soft thistle
    roseQuartz: "linear-gradient(to bottom, #F7CAC9, #DEC2CB)", // Muted pink to soft dusty rose
    cloudBlue: "linear-gradient(to bottom, #DFF6FF, #BEE1E6)", // Gentle sky blue to pale mint
    vintageRose: "linear-gradient(to bottom, #FADADD, #FFD1DC)", // Faded pink to baby blush
    softLilac: "linear-gradient(to bottom, #D8BFD8, #E6E6FA)", // Pastel lilac to soft lavender
    peachDream: "linear-gradient(to bottom, #FFE5B4, #FFDAB9)", // Light peach to warm apricot
    cottonCandy: "linear-gradient(to bottom, #FFDEE9, #B5C6E0)", // Baby pink to powder blue
    sunsetGlow: "linear-gradient(to bottom, #FFB6C1, #FFC3A0)", // Soft pink to pastel coral
};

export const siteConfig = {
    startDate: new Date(2025, 1, 10).toISOString(),
    backgroundMusic: "/background-music.mp3",
};

export const gift1Content = {
    music: "/gifts/gift1/harley.mp3",
    totalDuration: 420, // 7 minutes for all slides
    slides: [
        {
            type: "text",
            content: "Привет\nмалышка\n❤️",
            className: important,
            startTime: 0,
            endTime: 3,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "Это для тебя.\n Все как ты любишь \n Память, воспоминания...",
            className: main,
            startTime: 3,
            endTime: 6,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "Теперь это твой дневник... \n Который я буду делать для тебя",
            className: main,
            startTime: 6,
            endTime: 9,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                {
                    src: "/gifts/gift1/tapochki.jpg",
                },
            ],
            content: "Хочу показать как ты важна мне ❤️",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            contentClassName:
                "text-3xl  font-serif font-semibold text-pink-500 text-center",
            startTime: 9,
            endTime: 12,
            backgroundColor: gradients.blushPeach,
        },
        {
            type: "text",
            content:
                "Первая встреча...\nМы явно были не в восторге друг от друга, но что то нас толкнуло на еще одно свидание.\nДушнила и тиктокерша ))",
            className: mainDark,
            startTime: 12,
            endTime: 19,
            backgroundColor: gradients.pinkLavender,
        },
        {
            type: "imageGrid",
            images: [
                {
                    src: "/gifts/gift1/skating.png",
                    alt: "Каток",
                    caption: "Каток в ПГ",
                },
                {
                    src: "/gifts/gift1/map.jpg",
                    alt: "Карта прогулки",
                    caption: "Прогулка через всю москву под дождем",
                },
            ],
            content: "Мне уже после катка все было понятно",
            contentClassName: photoSubs,
            className: "grid grid-cols-2 gap-4",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            captionClassName: "text-sm text-gray-300 mt-2 text-center",
            startTime: 19,
            endTime: 24,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "videoGrid",
            videos: [
                {
                    src: "/gifts/gift1/singing.mp4",
                },
            ],
            className: "grid grid-cols gap-4",
            content:
                "Твое пение в душе меня заворожило моментально и я понял уже тогда что я влюбляюсь в тебя ❤️",
            contentClassName: photoSubs,
            startTime: 24,
            endTime: 29,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "image",
            src: "/gifts/gift1/tg-vids.png",
            alt: "Кружки",
            className: "w-full object-cover rounded-lg shadow-xl",
            captionClassName: photoSubs,
            startTime: 29,
            endTime: 35,
            backgroundColor: "rgba(231, 174, 128, 0.97)",
        },
        {
            type: "text",
            content: "Итак... немного того что делает нас и нашу магию ✨",
            className: romantic,
            startTime: 35,
            endTime: 39,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                {
                    src: "/gifts/gift1/zavtrak1.jpg",
                },
                {
                    src: "/gifts/gift1/zavtrak2.jpg",
                },
                {
                    src: "/gifts/gift1/zavtrak3.jpg",
                },
                {
                    src: "/gifts/gift1/zavtrak4.jpg",
                },
            ],
            contentClassName: "text-2xl font-serif text-black-300 text-center italic",
            className: "grid grid-cols-2 gap-4",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            captionClassName: "text-sm text-gray-300 mt-2 text-center",
            content: "Я пересел на чай\nТы начала пить кофе ☕️",
            startTime: 39,
            endTime: 45,
            backgroundColor: "rgba(107, 160, 184, 1)",
        },
        {
            type: "imageGrid",
            images: [
                {
                    src: "/gifts/gift1/fargo.webp",
                    alt: "Fargo",
                },
                {
                    src: "/gifts/gift1/izvne.jpg",
                    alt: "Извне",
                },
            ],
            className: "grid grid-cols-2 gap-4",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            captionClassName: "text-sm text-gray-300 mt-2 text-center",
            content: "Мы смотрим сериалы вместе\nдаже на расстоянии 🎬",
            contentClassName: "text-2xl font-serif text-black-300 text-center italic",
            startTime: 45,
            endTime: 50,
            backgroundColor: "rgba(76, 88, 164, 1)",
        },
        {
            type: "image",
            src: "/gifts/gift1/nsk1.jpg",
            caption: "А вот и первая фоточка...",
            className: "w-full object-cover rounded-lg shadow-xl",
            captionClassName: photoSubs,
            startTime: 50,
            endTime: 54,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                {
                    src: "/gifts/gift1/duo.jpg",
                },
            ],
            content: "И учим языки вместе",
            contentClassName: main,
            className: "grid grid-rows-1 gap-2", // reduced gap
            startTime: 54,
            endTime: 59,
            backgroundColor: "#ff6c2c",
        },
        {
            type: "image",
            src: "/gifts/gift1/nsk2.jpg",
            className: "w-full object-cover rounded-lg shadow-xl",
            captionClassName: photoSubs,
            startTime: 59, // 0:05
            endTime: 63, // 0:15
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                {
                    src: "/gifts/gift1/music1.png",
                    caption: "Я люблю наш музыкальный вкус",
                },
            ],
            className: "grid grid-cols-1 gap-4",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            captionClassName: photoSubs,
            startTime: 63,
            endTime: 66,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "image",
            src: "/gifts/gift1/nsk3.jpg",
            className: "w-full object-cover rounded-lg shadow-xl",
            startTime: 66,
            endTime: 69,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content:
                "Я люблю эти совместные дела\nЯ люблю как мы друг друга пинаем к успеху\nЯ люблю наши кружки по утрам ☕️",
            className: main,
            startTime: 69,
            endTime: 73,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "image",
            src: "/gifts/gift1/nsk4.jpg",
            className: "w-full object-cover rounded-lg shadow-xl",
            captionClassName: photoSubs,
            startTime: 73,
            endTime: 75,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "videoWithSound",
            src: "/gifts/gift1/best_day.mp4",
            content: "Я люблю говорить тебе что сегодня самый лучший день ✨",
            contentClassName: photoSubs,
            className: "w-full max-w-2xl mx-auto",
            videoClassName:
                "w-full aspect-square object-cover rounded-full shadow-lg", // Added rounded-full for circular shape
            //   captionClassName: "text-sm text-gray-300 mt-2 text-center",
            loop: false, // Optional: set to false if you don't want the video to loop
            startTime: 75,
            endTime: 85,
            backgroundColor: gradients.classyBlack,
        },
        // {
        //   type: "text",
        //   content: "Я люблю говорить тебе что сегодня самый лучший день ✨",
        //   className: "text-2xl text-pink-400 text-center leading-relaxed",
        //   startTime: 96,
        //   endTime: 101,
        //   backgroundColor: gradients.classyBlack,
        // },
        {
            type: "image",
            src: "/gifts/gift1/look.jpg",
            caption:
                "Твой взгляд особенный\nтак никто не смотрел\nя сохраню его в сердце ❤️",
            className: "w-full object-cover rounded-lg shadow-xl",
            captionClassName: photoSubs,
            startTime: 85,
            endTime: 90,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "Я люблю щекотать тебя\nи слышать твой звонкий смех 😊",
            className: romantic,
            startTime: 90,
            endTime: 94,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "image",
            src: "/gifts/gift1/nsk5.jpg",
            className: "w-full object-cover rounded-lg shadow-xl",
            startTime: 94,
            endTime: 96,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content:
                "Я люблю как мы можем\n обсудить абсолютно любую тему\nДля нас нет стоп тем",
            className: romantic,
            startTime: 96,
            endTime: 102,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "image",
            src: "/gifts/gift1/nsk6.jpg",
            className: "w-full object-cover rounded-lg shadow-xl",
            startTime: 102,
            endTime: 107,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "Я люблю как ты меня поддерживаешь",
            className: romantic,
            startTime: 107,
            endTime: 111,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "image",
            src: "/gifts/gift1/keys.jpg",
            className: "w-full object-cover rounded-lg shadow-xl",
            startTime: 111,
            endTime: 115,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "Ты первая, кому я хочу рассказать хорошие новости",
            className: romantic,
            startTime: 115,
            endTime: 120,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "image",
            src: "/gifts/gift1/nsk7.jpg",
            className: "w-full object-cover rounded-lg shadow-xl",
            startTime: 120,
            endTime: 124,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "И первая, к кому я иду, когда грустно",
            className: romantic,
            startTime: 124,
            endTime: 128,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "Мы растем вместе и становимся лучше друг для друга ✨",
            className: romantic,
            startTime: 128,
            endTime: 132,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "videoGrid",
            videos: Array.from({ length: 24 }, (_, i) => ({
                src: `/gifts/gift1/vids/compressed/${i + 1}_compressed.mp4`,
            })),
            className: "grid grid-cols-4 gap-1",
            videoClassName: "w-full h-full object-cover select-none rounded-full",
            startTime: 132,
            endTime: 148,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "Мне надо тебе кое в чем признаться...",
            className: main,
            startTime: 148,
            endTime: 150,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "Я люблю",
            className: important,
            startTime: 150,
            endTime: 152,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "hearts",
            content: "Тебя ❤️",
            className: important,
            intensity: "high", // can be 'low', 'medium', or 'high'
            startTime: 152,
            endTime: 155,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "За то что ты отдаешь себя в наши отношения",
            className: romantic,
            startTime: 155,
            endTime: 158,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "За то что ты делаешь меня счастливым",
            className: romantic,
            startTime: 158,
            endTime: 163,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "За твою эмоциональность и чувственность",
            className: romantic,
            startTime: 163,
            endTime: 168,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "За то, как ты обнимаешь меня",
            className: romantic,
            startTime: 168,
            endTime: 173,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "За твой взгляд,\n в котором я\n вижу любовь ❤️",
            className: romantic,
            startTime: 173,
            endTime: 178,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "За то, что делаешь меня лучше каждый день",
            className: romantic,
            startTime: 178,
            endTime: 183,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "За то, что вдохновляешь меня расти",
            className: romantic,
            startTime: 183,
            endTime: 188,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "За то, как ты делаешь обычные дни особенными ✨",
            className: romantic,
            startTime: 188,
            endTime: 193,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "С днем\n рождения,\n любимая ❤️",
            className: important,
            startTime: 188,
            endTime: 193,
            backgroundColor: gradients.classyBlack,
        },
    ],
};

// =============================================
// Gift 2 — Год отношений (слайдшоу)
// Песня: 141 сек (~2:21)
// Редактируй тексты, порядок, тайминги как хочешь
// =============================================
export const gift2Content = {
    music: "/gifts/gift2/song.mp3",
    totalDuration: 141,
    slides: [
        // ======== INTRO (0–8) ========
        {
            type: "text",
            content: "1 год\nвместе\n❤️",
            className: important,
            startTime: 0,
            endTime: 4,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "365 дней...\nКаждый из них — с тобой",
            className: romantic,
            startTime: 4,
            endTime: 8,
            backgroundColor: gradients.classyBlack,
        },

        // ======== ФЕВРАЛЬ 2025 — Начало (8–20) ========
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_539@16-02-2025_14-55-41.jpg" },
                { src: "/gifts/gift2/photo_547@16-02-2025_14-55-41.jpg" },
            ],
            content: "16 февраля 2025",
            contentClassName: photoSubs,
            className: "grid grid-cols-2 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 8,
            endTime: 12,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_565@18-02-2025_07-49-40_thumb.jpg" },
                { src: "/gifts/gift2/photo_592@23-02-2025_13-46-35.jpg" },
                { src: "/gifts/gift2/photo_593@23-02-2025_13-46-35.jpg" },
                { src: "/gifts/gift2/photo_594@23-02-2025_13-46-35.jpg" },
            ],
            className: "grid grid-cols-2 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 12,
            endTime: 16,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_599@23-02-2025_13-46-35.jpg" },
                { src: "/gifts/gift2/photo_595@23-02-2025_13-46-35_thumb.jpg" },
                { src: "/gifts/gift2/photo_596@23-02-2025_13-46-35_thumb.jpg" },
                { src: "/gifts/gift2/photo_598@23-02-2025_13-46-35_thumb.jpg" },
            ],
            className: "grid grid-cols-2 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 16,
            endTime: 20,
            backgroundColor: gradients.classyBlack,
        },

        // ======== МАРТ 2025 (20–38) ========
        {
            type: "text",
            content: "Первая весна вместе ✨",
            className: romantic,
            startTime: 20,
            endTime: 23,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_699@02-03-2025_15-01-37.jpg" },
                { src: "/gifts/gift2/photo_705@02-03-2025_15-01-37.jpg" },
            ],
            className: "grid grid-cols-2 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 23,
            endTime: 27,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_894@16-03-2025_15-04-50.jpg" },
                { src: "/gifts/gift2/photo_895@16-03-2025_15-04-50.jpg" },
            ],
            className: "grid grid-cols-2 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 27,
            endTime: 31,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_982@22-03-2025_19-17-13.jpg" },
                { src: "/gifts/gift2/photo_979@22-03-2025_19-16-49_thumb.jpg" },
            ],
            className: "grid grid-cols-2 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 31,
            endTime: 34,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_1027@27-03-2025_19-32-25.jpg" },
                { src: "/gifts/gift2/photo_1028@27-03-2025_19-32-43.jpg" },
                { src: "/gifts/gift2/photo_1045@29-03-2025_18-45-14.jpg" },
            ],
            className: "grid grid-cols-3 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 34,
            endTime: 38,
            backgroundColor: gradients.classyBlack,
        },

        // ======== АПРЕЛЬ 2025 (38–52) ========
        {
            type: "text",
            content: "Апрель",
            className: main,
            startTime: 38,
            endTime: 41,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_1118@04-04-2025_13-55-03.jpg" },
                { src: "/gifts/gift2/photo_1144@06-04-2025_14-30-54.jpg" },
            ],
            className: "grid grid-cols-2 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 41,
            endTime: 45,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_1201@13-04-2025_13-52-02.jpg" },
                { src: "/gifts/gift2/photo_1205@13-04-2025_13-52-02.jpg" },
                { src: "/gifts/gift2/photo_1209@13-04-2025_13-53-05.jpg" },
                { src: "/gifts/gift2/photo_1210@13-04-2025_13-53-05.jpg" },
            ],
            className: "grid grid-cols-2 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 45,
            endTime: 49,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "image",
            src: "/gifts/gift2/photo_1212@13-04-2025_13-53-05.jpg",
            className: "w-full object-cover rounded-lg shadow-xl",
            startTime: 49,
            endTime: 52,
            backgroundColor: gradients.classyBlack,
        },

        // ======== МАЙ 2025 (52–60) ========
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_1371@17-05-2025_21-11-59.jpg" },
                { src: "/gifts/gift2/photo_1423@24-05-2025_11-53-45.jpg" },
                { src: "/gifts/gift2/photo_1448@25-05-2025_21-08-41.jpg" },
            ],
            className: "grid grid-cols-3 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 52,
            endTime: 56,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_1453@28-05-2025_07-57-42_thumb.jpg" },
                { src: "/gifts/gift2/photo_1466@28-05-2025_22-48-30.jpg" },
            ],
            className: "grid grid-cols-2 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 56,
            endTime: 60,
            backgroundColor: gradients.classyBlack,
        },

        // ======== ИЮНЬ 2025 (60–63) ========
        {
            type: "image",
            src: "/gifts/gift2/photo_1557@20-06-2025_18-45-04.jpg",
            className: "w-full object-cover rounded-lg shadow-xl",
            startTime: 60,
            endTime: 63,
            backgroundColor: gradients.classyBlack,
        },

        // ======== ИЮЛЬ 2025 — Лето (63–74) ========
        {
            type: "text",
            content: "Наше первое лето ☀️",
            className: romantic,
            startTime: 63,
            endTime: 66,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_1636@11-07-2025_19-03-04.jpg" },
                { src: "/gifts/gift2/photo_1637@11-07-2025_19-03-08.jpg" },
                { src: "/gifts/gift2/photo_1642@11-07-2025_19-03-08.jpg" },
                { src: "/gifts/gift2/photo_1652@11-07-2025_20-29-37.jpg" },
            ],
            className: "grid grid-cols-2 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 66,
            endTime: 70,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_1703@12-07-2025_10-35-56.jpg" },
                { src: "/gifts/gift2/photo_1708@12-07-2025_10-36-11.jpg" },
                { src: "/gifts/gift2/photo_1730@13-07-2025_17-55-23.jpg" },
            ],
            className: "grid grid-cols-3 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 70,
            endTime: 74,
            backgroundColor: gradients.classyBlack,
        },

        // ======== АВГУСТ 2025 (74–78) ========
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_1895@14-08-2025_18-44-12.jpg" },
                { src: "/gifts/gift2/photo_1904@16-08-2025_15-20-56.jpg" },
            ],
            className: "grid grid-cols-2 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 74,
            endTime: 78,
            backgroundColor: gradients.classyBlack,
        },

        // ======== ОСЕНЬ 2025 (78–96) ========
        {
            type: "text",
            content: "Осень 🍂",
            className: romantic,
            startTime: 78,
            endTime: 81,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_2044@04-10-2025_12-18-16.jpg" },
                { src: "/gifts/gift2/photo_2133@31-10-2025_07-31-33_thumb.jpg" },
            ],
            className: "grid grid-cols-2 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 81,
            endTime: 85,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_2193@08-11-2025_16-14-07.jpg" },
                { src: "/gifts/gift2/photo_2198@08-11-2025_16-16-43.jpg" },
                { src: "/gifts/gift2/photo_2216@08-11-2025_16-17-00.jpg" },
                { src: "/gifts/gift2/photo_2221@08-11-2025_16-17-00.jpg" },
            ],
            className: "grid grid-cols-2 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 85,
            endTime: 89,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_2226@08-11-2025_16-17-06.jpg" },
                { src: "/gifts/gift2/photo_2237@09-11-2025_11-30-16.jpg" },
                { src: "/gifts/gift2/photo_2241@09-11-2025_11-30-27.jpg" },
            ],
            className: "grid grid-cols-3 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 89,
            endTime: 92,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_2267@14-11-2025_16-21-13_thumb.jpg" },
                { src: "/gifts/gift2/photo_2271@14-11-2025_18-32-35_thumb.jpg" },
                { src: "/gifts/gift2/photo_2323@28-11-2025_20-50-17_thumb.jpg" },
            ],
            className: "grid grid-cols-3 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 92,
            endTime: 96,
            backgroundColor: gradients.classyBlack,
        },

        // ======== ЗИМА — ДЕКАБРЬ 2025 (96–108) ========
        {
            type: "text",
            content: "Первая зима вдвоём ❄️",
            className: romantic,
            startTime: 96,
            endTime: 99,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_2410@15-12-2025_18-41-05.jpg" },
                { src: "/gifts/gift2/photo_2423@19-12-2025_20-02-57.jpg" },
            ],
            className: "grid grid-cols-2 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 99,
            endTime: 103,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_2447@19-12-2025_21-06-34.jpg" },
                { src: "/gifts/gift2/photo_2450@19-12-2025_21-06-34.jpg" },
                { src: "/gifts/gift2/photo_2483@20-12-2025_09-35-11.jpg" },
                { src: "/gifts/gift2/photo_2513@27-12-2025_18-27-13.jpg" },
            ],
            className: "grid grid-cols-2 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 103,
            endTime: 107,
            backgroundColor: gradients.classyBlack,
        },

        // ======== ЯНВАРЬ 2026 (107–119) ========
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_2550@02-01-2026_17-42-40.jpg" },
                { src: "/gifts/gift2/photo_2552@02-01-2026_17-42-40.jpg" },
            ],
            className: "grid grid-cols-2 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 107,
            endTime: 111,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_2575@05-01-2026_15-39-15_thumb.jpg" },
                { src: "/gifts/gift2/photo_2602@06-01-2026_20-47-55_thumb.jpg" },
                { src: "/gifts/gift2/photo_2603@06-01-2026_22-32-44.jpg" },
            ],
            className: "grid grid-cols-3 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 111,
            endTime: 115,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "imageGrid",
            images: [
                { src: "/gifts/gift2/photo_2608@07-01-2026_19-46-31.jpg" },
                { src: "/gifts/gift2/photo_2619@08-01-2026_14-32-47_thumb.jpg" },
                { src: "/gifts/gift2/photo_2634@08-01-2026_14-48-11.jpg" },
            ],
            className: "grid grid-cols-3 gap-2",
            imageClassName: "w-full object-cover rounded-lg shadow-lg",
            startTime: 115,
            endTime: 119,
            backgroundColor: gradients.classyBlack,
        },

        // ======== ФЕВРАЛЬ 2026 + ФИНАЛ (119–141) ========
        {
            type: "text",
            content: "Февраль 2026\nСнова вместе ❤️",
            className: romantic,
            startTime: 119,
            endTime: 123,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "image",
            src: "/gifts/gift2/photo_2777@02-02-2026_13-33-46.jpg",
            className: "w-full object-cover rounded-lg shadow-xl",
            startTime: 123,
            endTime: 127,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "1 год...\nи это только начало",
            className: romantic,
            startTime: 127,
            endTime: 131,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "text",
            content: "Я люблю тебя ❤️",
            className: important,
            startTime: 131,
            endTime: 136,
            backgroundColor: gradients.classyBlack,
        },
        {
            type: "hearts",
            content: "❤️",
            className: important,
            intensity: "high",
            startTime: 136,
            endTime: 141,
            backgroundColor: gradients.classyBlack,
        },
    ],
};
