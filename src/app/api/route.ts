import { NextRequest, NextResponse } from "next/server"
import {HfInference} from "@huggingface/inference"
import { use } from "react"

type ChatPrompt = {
    apiKey: string
    userInput: string
}

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();
    const { apiKey, userInput } = body as ChatPrompt;

    let inference;
    if (inference === undefined) {
        inference = new HfInference(apiKey);
    }
    
    if (!apiKey || !userInput) {
        return NextResponse.json(
            { success: false, message: "Missing apiKey or userInput" },
            { status: 400 }
        );
    }

    try {
        const response = await inference.chatCompletion({
            model: "mistralai/Mistral-7B-Instruct-v0.1",
            messages: [{ role: "user", content: userInput }],
            max_tokens: 100
          });
    
        const data = response.choices[0].message;
        console.log(data);

        return NextResponse.json({
            success: true,
            result: data.content,
    })

    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { success: false, message: "Internal application error" },
            { status: 500 }
        )
    }
}