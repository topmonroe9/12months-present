import React from "react";

export const LoadingScreen = ({ loadedImages, totalImages }) => (
  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
    <div className="text-white text-center">
      <div className="mb-4">Подготавливаем ваш подарок...</div>
      <div className="w-32 h-1 bg-gray-700 rounded-full">
        <div
          className="h-full bg-pink-500 rounded-full transition-all duration-300"
          style={{
            width: `${(loadedImages / totalImages) * 100}%`,
          }}
        />
      </div>
    </div>
  </div>
);
