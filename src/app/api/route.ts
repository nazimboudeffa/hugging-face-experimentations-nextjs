import { NextRequest, NextResponse } from "next/server"
import {HfInference} from "@huggingface/inference"

type ChatPrompt = {
    apiKey: string
    model: string
    userInput: string
}

async function handleInference(apiKey: string, model: string, userInput: string, type = "chat") {
    
    let inference;
    if (inference === undefined) {
        inference = new HfInference(apiKey);
    }

    try {
        let response, data;
        
        // Choix de l'API selon le type de requête (chat ou génération de texte)
        if (type === "chat") {
            console.log("Chat");
            response = await inference.chatCompletion({
                model: model,
                messages: [{ role: "user", content: userInput }],
                max_tokens: 100
            });
            console.log(response);
            data = response.choices[0].message.content;
        } else if (type === "text") {
            response = await inference.textGeneration({
                model: model,
                inputs: userInput,
                max_tokens: 100
            });
            data = response.generated_text;
        }

        console.log(data);

        return NextResponse.json({
            success: true, message: data,
            status: 200
        });
    } catch (error) {
        console.error(`Error during inference for model ${model}:`, error);

        return NextResponse.json(
            { success: false, message: "Internal application error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { apiKey, model, userInput } = body as ChatPrompt;
    
    if (!apiKey || !userInput) {
        return NextResponse.json(
            { success: false, message: "Missing apiKey or userInput" },
            { status: 400 }
        );
    }

    let type = "text"; // Par défaut, on part sur la génération de texte

    switch (model) {
        case "mistralai/Mistral-7B-Instruct-v0.1":
            type = "chat";  // Ce modèle utilise chatCompletion
            console.log("Mistral");
            break;
        case "meta-llama/Llama-3.2-1B-Instruct":
            type = "chat";  // Ce modèle utilise textGeneration
            console.log("Llama");
            break;
        case "nazimboudeffa/gpt-2-sigmund-freud-psychoanalysis":
            type = "text";  // Ce modèle utilise textGeneration
            console.log("Freud");
            break;
        default:
            return NextResponse.json(
                { success: false, message: "Invalid model selection" },
                { status: 400 }
            );
    }

    // Appel à la fonction générique
    return handleInference(apiKey, model, userInput, type);
}