"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./components/header";

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("SVM");
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData();

    const model = selectedAlgorithm === ""
    formData.append("file", selectedFile);
    formData.append("model", selectedAlgorithm);

    try {
      const response = await fetch("http://localhost:3001/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      console.log(result);

      router.push(
        `/ia?result=${encodeURIComponent(
          JSON.stringify(result)
        )}&image=${encodeURIComponent(selectedFile.name)}`
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRadioChange = (event: any) => {
    setSelectedAlgorithm(event.target.value);
  };

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    setSelectedFile(event.dataTransfer.files[0]);
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <Header />
      <div
        className="min-h-screen bg-black text-white flex flex-col items-center justify-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <main className="flex flex-col items-center justify-center flex-1">
          <h2 className="text-2xl font-semibold mb-4">Upload Your Image</h2>
          <form
            className="bg-gray-800 p-6 rounded-lg shadow-md w-96"
            onSubmit={handleSubmit}
          >
            <div className="flex items-center justify-center w-full">
              <label
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                htmlFor="dropzone-file"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {selectedFile && (
              <div className="mt-4 p-4 bg-gray-700 rounded-md">
                <p className="text-sm text-gray-300">
                  Selected file: {selectedFile.name}
                </p>
                <p className="text-sm text-gray-300">
                  Size: {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            <fieldset className="flex justify-between mt-5">
              <div className="flex items-center mb-4">
                <input
                  id="country-option-1"
                  type="radio"
                  name="algorithms"
                  value="svm"
                  className="w-5 h-5 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  checked={selectedAlgorithm === "svm"}
                  onChange={handleRadioChange}
                />
                <label
                  htmlFor="country-option-1"
                  className="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  SVM
                </label>
              </div>

              <div className="flex items-center mb-4">
                <input
                  id="country-option-2"
                  type="radio"
                  name="algorithms"
                  value="lr"
                  className="w-5 h-5 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  checked={selectedAlgorithm === "lr"}
                  onChange={handleRadioChange}
                />
                <label
                  htmlFor="country-option-2"
                  className="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Regression
                </label>
              </div>

              <div className="flex items-center mb-4">
                <input
                  id="country-option-3"
                  type="radio"
                  name="algorithms"
                  value="sgd"
                  className="w-5 h-5 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  checked={selectedAlgorithm === "sgd"}
                  onChange={handleRadioChange}
                />
                <label
                  htmlFor="country-option-3"
                  className="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  SGD
                </label>
              </div>
            </fieldset>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Upload
            </button>
          </form>
        </main>
        <footer className="w-full p-4 text-center">
          &copy; 2024 AI-Powered Pneumonia Detection. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
