import React, { useState, useEffect } from "react";
import { Gift, Calendar, Clock } from "lucide-react";

const GiftCalendar = () => {
  const [openedGifts, setOpenedGifts] = useState([]);
  const [nextGiftDate, setNextGiftDate] = useState(null);
  const [timeUntilNext, setTimeUntilNext] = useState("");
  const [selectedGift, setSelectedGift] = useState(null);

  useEffect(() => {
    // Load saved state from localStorage
    const saved = localStorage.getItem("giftCalendarState");
    if (saved) {
      const { openedGifts: saved_gifts, nextGiftDate: saved_date } =
        JSON.parse(saved);
      setOpenedGifts(saved_gifts);
      setNextGiftDate(saved_date);
    }

    // Update timer
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateTimer = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const nextDate = new Date(now.getFullYear(), currentMonth, 16);

    if (now.getDate() >= 16) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }

    const diff = nextDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeUntilNext(`${days}д ${hours}ч ${minutes}м ${seconds}с`);
  };

  const isGiftAvailable = (monthIndex) => {
    const now = new Date();
    const giftDate = new Date(now.getFullYear(), monthIndex, 16);
    return now >= giftDate;
  };

  const openGift = (monthIndex) => {
    if (!isGiftAvailable(monthIndex) || openedGifts.includes(monthIndex))
      return;

    setSelectedGift(monthIndex);
    setOpenedGifts([...openedGifts, monthIndex]);

    // Save to localStorage
    localStorage.setItem(
      "giftCalendarState",
      JSON.stringify({
        openedGifts: [...openedGifts, monthIndex],
        nextGiftDate: nextGiftDate,
      })
    );
  };

  const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-4">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">
        Твои 12 тайн
      </h1>

      {selectedGift !== null ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-fade-in">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">
              {months[selectedGift]}
            </h2>
            <p className="text-gray-600 mb-4">Твой особенный подарок...</p>
            <button
              onClick={() => setSelectedGift(null)}
              className="w-full bg-pink-500 text-white rounded-lg py-2 hover:bg-pink-600 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4 mb-8">
        {months.map((month, index) => (
          <div
            key={month}
            className={`relative bg-white rounded-xl p-4 shadow-lg transform transition-all duration-300 ${
              openedGifts.includes(index) ? "bg-pink-50" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{month}</span>
              {openedGifts.includes(index) ? (
                <Gift className="w-5 h-5 text-pink-500" />
              ) : (
                <Calendar className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {isGiftAvailable(index) && !openedGifts.includes(index) ? (
              <button
                onClick={() => openGift(index)}
                className="w-full bg-pink-500 text-white text-sm rounded-lg py-1 hover:bg-pink-600 transition-colors"
              >
                Открыть
              </button>
            ) : !openedGifts.includes(index) ? (
              <div className="text-xs text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Скоро
              </div>
            ) : (
              <div className="text-xs text-pink-500">Открыто ✨</div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-4 shadow-lg">
        <h2 className="text-lg font-medium text-gray-800 mb-2">
          До следующего подарка:
        </h2>
        <div className="text-2xl font-bold text-pink-600">{timeUntilNext}</div>
      </div>
    </div>
  );
};

export default GiftCalendar;
