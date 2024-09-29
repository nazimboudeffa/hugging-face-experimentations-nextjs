import { NextRequest, NextResponse } from "next/server"
import {HfInference} from "@huggingface/inference"

type ChatPrompt = {
    apiKey: string
    model: string
    userInput: string
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { apiKey, model, userInput } = body as ChatPrompt;

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

    let aimodel;
    if (model === "mistralai/Mistral-7B-Instruct-v0.1") {
        aimodel = "mistralai/Mistral-7B-Instruct-v0.1"
        try {
            const response = await inference.chatCompletion({
                model: aimodel,
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
    } else if (model === "nazimboudeffa/gpt-2-sigmund-freud-psychoanalysis") {
        aimodel = "nazimboudeffa/gpt-2-sigmund-freud-psychoanalysis"
        try {
            const response = await inference.textGeneration({
                model: aimodel,
                inputs: userInput,
                max_tokens: 100
              });
        
            const data = response.generated_text;
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
}