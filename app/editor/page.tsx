"use client";
import React, { useState } from "react";
import { trpc } from "../_trpc/client";
import { useEditor, EditorContent } from "@tiptap/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import TipTap from "../components/TipTap";
import SearchQueryBlock from "../components/SearchQueryBlock";

// Define the type for the API response
interface SearchResult {
  position: number;
  title: string;
  snippet: string;
  publication_info: { summary: string };
  file_format: string;
  resources_title: string;
  inline_links: { serpapi_cite_link: string };
}
interface CitationData {
  title: string;
  snippet: string;
}
const page = () => {
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const [citationData, setCitationData] = useState<CitationData[][]>([]);
  const [selectedCitationStyle, setSelectedCitationStyle] =
    useState<number>(0); // Default to MLA
  const citationStyles = {
    MLA: 0,
    APA: 1,
    Harvard: 2,
    Chicago: 3,
    Vancouver: 4,
  };

  const formSchema = z.object({
    title: z.string().min(5, { message: "not long" }),
    description: z.string().min(5, { message: "not long" }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const handleTipTapChange = (richText: string) => {
    form.setValue("description", richText);
  };
  const { mutate: generateCitation } = trpc.searchCitation.useMutation({
    onSuccess: ({ citationData }) => {
      // setSearchResult(searchQueries);
      console.log(citationData);
      setCitationData((prevData) => [...prevData, citationData]);
      setSearchResult([])
      // utils.getUserFiles.invalidate()
    },
    // onMutate({ query }) {
    //   setCurrentlyDeletingFile(id)
    // },
    // onSettled() {
    //   setCurrentlyDeletingFile(null)
    // },
  });
  const { mutate: generateSearchResults } = trpc.searchQuery.useMutation({
    onSuccess: ({ searchQueries }) => {
      setSearchResult(searchQueries);
      console.log(searchQueries);
      // utils.getUserFiles.invalidate()
    },
    // onMutate({ query }) {
    //   setCurrentlyDeletingFile(id)
    // },
    // onSettled() {
    //   setCurrentlyDeletingFile(null)
    // },
  });
  const handleSelectCitationClick = async (citeLink: string) => {
    try {
      const citationData = generateCitation({ citeURL: citeLink });
      console.log("Citation Data:", citationData);
      // setSearchResult(SearchResult[]:[])
      // setSelectedCitation(citationData.citations[0]);
    } catch (error) {
      console.error("Error fetching citation:", error);
    }
  };

  const handleSearchQueryClick = async () => {
    const selectedText = window.getSelection()?.toString().trim(); // Get the selected text from the description field
    if (selectedText) {
      try {
        // Perform the citation request using the citation mutation
        generateSearchResults({ query: selectedText });
      } catch (error) {
        console.error("Citation request failed:", error);
      }
    }
  };
  const handleCitationStyleChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCitationStyle(Number(event.target.value));
  };
  return (
    <div className="p-6">
      <form>
        <div>
          <div className="flex justify-between">
          <label htmlFor="description">Enter Text:</label>
            <div>
            <label htmlFor="citationStyle">Citation Style:</label>
            <select
              id="citationStyle"
              value={selectedCitationStyle}
              onChange={handleCitationStyleChange}
            >
              <option value="0">MLA</option>
              <option value="1">APA</option>
              <option value="2">Chicago</option>
              <option value="3">Harvard</option>
              <option value="4">Vancouver</option>
              {/* Add more citation styles as needed */}
            </select>
            </div>
          </div>
          
          <TipTap
            description={form.watch("description")}
            onChange={handleTipTapChange}
          />
          {searchResult?.length > 0 &&
            searchResult.map((result, index) => (
              <SearchQueryBlock
                onClick={() =>
                  handleSelectCitationClick(
                    result.inline_links.serpapi_cite_link
                  )
                }
                key={index}
                title={result.title}
                snippet={result.snippet}
                summary={result.publication_info.summary}
                fileFormat={result.file_format}
                resourcesTitle={result.resources_title}
                serpapiCiteLink={result.inline_links.serpapi_cite_link}
              />
            ))}
          {
              citationData?.length > 0 && 
              citationData.map((data, index) => (
                <div key={index}>
                  <h3>{data[selectedCitationStyle].title}</h3>
                  <p>{data[selectedCitationStyle].snippet}</p>
                </div>
              ))
            }
          {form.formState.errors.description && (
            <span>{form.formState.errors.description.message}</span>
          )}
        </div>
        <div className="w-full flex my-2 justify-center align-middle">
        <button className="border-1 bg-black text-white shadow-md px-4 py-2" type="button" onClick={handleSearchQueryClick}>
          Cite
        </button>
        </div>
        
        {/* {isCiting && <span>Loading citation...</span>} */}
      </form>
    </div>
  );
};
export default page;
