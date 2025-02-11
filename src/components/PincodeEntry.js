import React, { useState } from "react";
import { fetchContent, savePincode } from "../services/contentService";

const PincodeEntry = ({ onSuccess }) => {
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetchContent(pincode);

      if (response.success && response.data) {
        savePincode(pincode);
        onSuccess(response.data);
      } else {
        setError(response.message || "Invalid pincode");
      }
    } catch (error) {
      setError("Failed to validate pincode");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-4 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-pink-600">
          Enter Pincode
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
            placeholder="Enter pincode"
            disabled={isLoading}
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-500 text-white rounded-lg py-2 hover:bg-pink-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PincodeEntry;
