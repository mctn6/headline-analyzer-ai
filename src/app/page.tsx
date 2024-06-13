"use client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState("Ads");
  const [inputText, setInputText] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");

  const handleAnalyzeClick = async () => {
    if (process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
      const genAI = new GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_GOOGLE_API_KEY
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are a senior copywriter. You are here to review and give good feedback for the headline copy '${inputText}' for placement ${category}, give your score and what needs to improve. Please return result as json object for your analyze.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setAnalysisResult(text);
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
        rows={5}
        placeholder="Enter your text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button
        className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleAnalyzeClick}
      >
        Analyze
      </button>

      {analysisResult && (
        <div className="m-8 text-center text-white">
          <h2 className="text-xl font-bold mb-4">Analysis Result</h2>
          <p>{analysisResult}</p>
        </div>
      )}
    </div>
  );
}
