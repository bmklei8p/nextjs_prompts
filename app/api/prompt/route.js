import { connectToDB } from "@utils/database"
import Prompt from "@models/prompt";

connectToDB();

export const GET = async (req) => {
    try {
        const prompts = await Prompt.find({}).populate("creator");
        console.log(prompts)
        return new Response(JSON.stringify(prompts), {status: 200})
    } catch(error) {
        console.log(error)
        return new Response("Failed to get prompts", {status: 500})
    }
}
