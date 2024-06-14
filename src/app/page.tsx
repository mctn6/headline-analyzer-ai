"use client";
import { useLoadingDots } from "@/hooks/useLoadingDots";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState("Ads");
  const [inputText, setInputText] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loading indicator
  const [error, setError] = useState(""); // State to manage errors
  const loadingDots = useLoadingDots(); // Use the custom hook

  const handleAnalyzeClick = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category, inputText }),
      });

      const data = await response.json();

      if (response.ok) {
        setAnalysisResult(data);
      } else {
        setError(data.error || "Unknown error occurred.");
      }
    } catch (error) {
      console.error("Error analyzing text:", error);
      setError("Error analyzing text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="mx-4 md:max-w-2xl text-center">
        <h1 className="text-2xl md:text-5xl font-bold mb-8">
          Boost Your Headlines with Free AI Analysis
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Struggling to write headlines that grab attention and drive results?
          Our free AI-powered headline analyzer can help
        </p>
      </div>
      <div className="flex w-full mx-4 md:max-w-2xl justify-end">
        <div className="mb-6">
          <select
            className="select select-bordered w-full max-w-xs"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Ads">Ads</option>
            <option value="Blog">Blog</option>
            <option value="Landing Page">Landing Page</option>
            <option value="Sales Page">Sales Page</option>
          </select>
        </div>
      </div>

      <textarea
        className="w-3/4 md:w-1/2 p-4 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={2}
        placeholder="Enter your text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button
        className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleAnalyzeClick}
      >
        {loading ? `Analyzing${loadingDots}` : "Analyze"}
      </button>

      {error && (
        <div className="m-8 text-center p-4 rounded-lg bg-red-100 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {analysisResult && !loading && (
        <div className="m-8 text-center text-white">
          <h2 className="text-xl font-bold mb-4">Analysis Result</h2>
          <div className="m-8 p-6 bg-gray-800 mx-4 md:max-w-2xl rounded-lg shadow-lg text-white">
            <div className="text-left">
              <h3 className={`text-xl font-semibold `}>
                Score:{" "}
                <span
                  className={`${
                    analysisResult?.score >= 80
                      ? "text-green-500" // light green for score >= 80
                      : analysisResult?.score >= 50
                      ? "text-yellow-500" // light orange for score between 50 and 79
                      : "text-red-500" // light red for score below 50
                  }`}
                >
                  {" "}
                  {analysisResult?.score}
                </span>
              </h3>
              <p className={`text-lg font-semibold `}>
                Sentiment:{" "}
                <span className="text-base"> {analysisResult?.sentiment}</span>
              </p>
              {analysisResult?.pros && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold">Pros:</h4>
                  <ul className="list-disc ml-6">
                    {analysisResult?.pros?.map((pro, index) => (
                      <li key={index} className="mt-2">
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysisResult?.cons && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold">Cons:</h4>
                  <ul className="list-disc ml-6">
                    {analysisResult?.cons?.map((con, index) => (
                      <li key={index} className="mt-2">
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysisResult?.suggestions && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold">Suggestions:</h4>
                  <ul className="list-disc ml-6">
                    {analysisResult?.suggestions?.map((improvement, index) => (
                      <li key={index} className="mt-2">
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
