import { useState } from "react";

const LivingStatusModal = ({ onConfirm }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [customInput, setCustomInput] = useState("");

  const handleSelection = (option) => {
    setSelectedOption(option);
    if (option !== "Other") {
      setCustomInput("");
    }
  };

  const handleSubmit = () => {
    const finalSelection = selectedOption === "Other" ? customInput : selectedOption;
    if (finalSelection.trim()) {
      onConfirm(finalSelection);
    } else {
      alert("Please select or enter a valid option.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Modal Header */}
        <h2 className="text-2xl font-semibold text-white mb-6 text-center bg-[#5A3A8C] p-4 rounded-t-xl">
          Select Your Living Status
        </h2>

        {/* Radio Options */}
        <div className="space-y-4 p-4">
          {["60yrs+ age", "Orphan", "Alone in family", "Below Poverty Line", "Other"].map((option) => (
            <div key={option} className="flex items-center space-x-3">
              <input
                type="radio"
                id={option}
                name="livingStatus"
                value={option}
                checked={selectedOption === option}
                onChange={() => handleSelection(option)}
                className="w-5 h-5 border-gray-300 custom-radio"
              />
              <label
                htmlFor={option}
                className="text-gray-700 text-lg cursor-pointer hover:text-[#5A3A8C] transition-colors"
              >
                {option}
              </label>
            </div>
          ))}

          {/* Custom Input for "Other" */}
          {selectedOption === "Other" && (
            <input
              type="text"
              placeholder="Enter your status"
              className="w-full p-3 mt-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A3A8C] focus:border-transparent transition-all"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
            />
          )}
        </div>

        {/* Confirm Button */}
        <div className="mt-6 p-4 flex justify-end bg-gray-100 rounded-b-xl">
          <button
            onClick={handleSubmit}
            className="bg-[#5A3A8C] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#4A2C6D] focus:outline-none focus:ring-2 focus:ring-[#5A3A8C] focus:ring-opacity-50 transition-all"
          >
            Confirm
          </button>
        </div>

        {/* Inline CSS to override radio button checked color */}
        <style jsx>{`
          .custom-radio:checked {
            accent-color: #5A3A8C;
          }
          .custom-radio:focus {
            box-shadow: 0 0 0 3px rgba(90, 58, 140, 0.2);
          }
        `}</style>
      </div>
    </div>
  );
};

export default LivingStatusModal;