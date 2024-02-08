import { publicProcedure, router } from './trpc';
 import { getJson } from "serpapi";
import { z } from 'zod'
import OpenAI from "openai";

const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SERPAPI_API_KEY || !OPENAI_API_KEY) {
    throw new Error("API keys not provided");
}
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});
  

// Define a function to handle search logic
const getSearchQueries = async (selectedText: string): Promise<any> => {
    try {
        let summarizedText: string = selectedText;
        if (selectedText.length > 80) {
          // If selected text exceeds 50 characters, summarize it using the OpenAI API
          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                "Please summarize the provided content in a concise and informative manner suitable for Google search. Aim for a summary that is clear, relevant, and under 50 characters. Ensure the summary captures the key points and main ideas of the content effectively. Your goal is to create a summary that stands out in search results and provides users with a quick understanding of the topic."
              },
              {
                role: "user",
                content: selectedText,
              },
            ],
            temperature: 0.7,
            max_tokens: 64, // Adjust max_tokens as needed for summary length
            top_p: 1,
          });
          // Extract the summarized text from the OpenAI response
          summarizedText = response.choices[0].message.content as string; 
          console.log("summarizedText: "+summarizedText)
        }
        const json = await getJson({
            engine: "google_scholar",
            q: summarizedText, // Use the selected text as the query
            api_key: SERPAPI_API_KEY
        });
        return json["organic_results"];
    } catch (error) {
        // Handle errors if necessary
        console.error("Error fetching citation:", error);
        throw error;
    }
};
const getCitationFromURL = async (citeURL: string): Promise<any> => {
    try {
        const urlWithApiKey = `${citeURL}&api_key=${SERPAPI_API_KEY}`;
        const response = await fetch(urlWithApiKey);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching citation:", error);
        throw error;
    }
};

export const appRouter = router({
    test: publicProcedure.query(()=>{
        return 'HELLO FROM API'
    }),
    searchQuery: publicProcedure.input(z.object({query:z.string()})).mutation(async({ctx,input}) => {
        const searchQueries = await getSearchQueries(input.query);
        return {searchQueries:searchQueries}; // Return some response indicating the request is sent
    }),
    searchCitation: publicProcedure.input(z.object({citeURL:z.string()})).mutation(async({input})=>{
        const citationData = await getCitationFromURL(input.citeURL);
        return {citationData:citationData.citations}; // Return citation data
    })
});
 

export type AppRouter = typeof appRouter;