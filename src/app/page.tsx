import { Header } from "./components/header"
import { Chat } from "./components/Chat"

export default async function ChatGPTWithX() {

    return (
        <main className="min-h-screen flex flex-col items-center justify-center w-full h-full">
            <Header
                heading="Hugging Face Experimentations"
                subheading="Chat with AI"
            />
            <Chat />
        </main>
    )
}