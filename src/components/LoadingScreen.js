import React from "react";

export const LoadingScreen = ({ loadedImages, totalImages }) => {
  const progress = Math.round((loadedImages / totalImages) * 100) || 0;

  console.log("Loading progress:", { loadedImages, totalImages, progress });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-white text-center">
        <div className="mb-4">Подготавливаем ваш подарок... {progress}%</div>
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-pink-500 transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-400">
          {loadedImages} из {totalImages}
        </div>
      </div>
    </div>
  );
};
