import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return new NextResponse("Method Not Allowed", {
      status: 405,
      headers: { Allow: "POST" },
    });
  }

  const { category, inputText } = await req.json();

  if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
    return new NextResponse(JSON.stringify({ error: "API key is not set" }), {
      status: 500,
    });
  }

  // Validate inputText
  if (!inputText) {
    return new NextResponse(
      JSON.stringify({ error: "Headline is required" }),
      { status: 400 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GOOGLE_API_KEY
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a senior copywriter. You are here to review and give good feedback for the headline copy '${inputText}' for placement ${category}, give your score from 1-100 and what needs to improve. Please return result as json object for your analyze (pay attention on your json format - don't not add comma on last index of json) with key score, sentiment, pros, cons, suggestions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    try {
      const analysisResult = JSON.parse(
        text.replace(/`/g, "").replace("json", "")
      );
      return new NextResponse(JSON.stringify(analysisResult), { status: 200 });
    } catch (jsonError) {
      console.error("Error parsing analysis result:", jsonError);
      return new NextResponse(
        JSON.stringify({
          error: "Error parsing analysis result. Please try again.",
        }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error analyzing text:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error analyzing text. Please try again." }),
      { status: 500 }
    );
  }
}
