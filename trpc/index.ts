import { publicProcedure, router } from './trpc';
 import { getJson } from "serpapi";
import { z } from 'zod'


const API_KEY = process.env.SERPAPI_API_KEY;
// Define a function to handle citation logic
const getCitation = async (selectedText: string): Promise<any> => {
    try {
        const json = await getJson({
            engine: "google_scholar",
            q: selectedText, // Use the selected text as the query
            api_key: API_KEY
        });

        // You can handle the response here, e.g., display the results or process them further
        console.log(json["organic_results"]);
        return json["organic_results"];
    } catch (error) {
        // Handle errors if necessary
        console.error("Error fetching citation:", error);
        throw error;
    }
};


export const appRouter = router({
    test: publicProcedure.query(()=>{
        return 'HELLO FROM API'
    }),
    citation: publicProcedure.input(z.object({query:z.string()})).mutation(async({ctx,input}) => {
        // Call the getCitation function with the selected text
        const citationResults = getCitation(input.query);
        return citationResults; // Return some response indicating the request is sent
    })
});
 

export type AppRouter = typeof appRouter;