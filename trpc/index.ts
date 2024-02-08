import { publicProcedure, router } from './trpc';
 import { getJson } from "serpapi";
import { z } from 'zod'
const API_KEY = process.env.SERPAPI_API_KEY;


// Define a function to handle search logic
const getSearchQueries = async (selectedText: string): Promise<any> => {
    try {
        const json = await getJson({
            engine: "google_scholar",
            q: selectedText, // Use the selected text as the query
            api_key: API_KEY
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
        const urlWithApiKey = `${citeURL}&api_key=${API_KEY}`;
        console.log(urlWithApiKey)
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