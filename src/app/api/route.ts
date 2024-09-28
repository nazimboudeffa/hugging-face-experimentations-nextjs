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

    let inference;
    if (inference === undefined) {
        inference = new HfInference(apiKey);
    }
    console.log(inference);
    
    try {
    const response = await inference.chatCompletion({
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
            {
            role: "user",
            content: userInput,
            },
        ],
        max_tokens: 1000,
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