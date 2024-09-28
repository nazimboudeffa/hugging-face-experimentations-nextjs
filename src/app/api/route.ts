import { NextRequest, NextResponse } from "next/server"
import {HfInference} from "@huggingface/inference"

type ChatPrompt = {
    apiKey: string
    userInput: string
}

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();
    const { apiKey, userInput } = body as ChatPrompt;
    
    if (!apiKey || !userInput) {
        return NextResponse.json(
            { success: false, message: "Missing apiKey or userInput" },
            { status: 400 }
        );
    }

    try {
        const response = await fetch('https://api-inference.huggingface.co/models/mradermacher/TinyLlama-Friendly-Psychotherapist-v1.5-GGUF', {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
            method: 'POST',
            body: JSON.stringify({
              inputs: userInput,
            }),
          });
    
        const data = response;
        console.log(data);

        return NextResponse.json({
            success: true,
            result: data,
    })

    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { success: false, message: "Internal application error" },
            { status: 500 }
        )
    }
}