'use client'
import React from 'react'
import { trpc } from '../_trpc/client'
import { useEditor, EditorContent } from '@tiptap/react'
import { useForm } from "react-hook-form"
import * as z from "zod";
import TipTap from '../components/TipTap'


const page = () => {
    const formSchema = z.object({
      title: z.string().min(5,{message:"not long"}),
      description: z.string().min(5,{message:'not long'})
    })
    const form = useForm<z.infer<typeof formSchema>>({
      mode: 'onChange',
      defaultValues: {
        title: "",
        description: ""
      }
    })
    const handleTipTapChange = (richText: string) => {
      form.setValue('description', richText);
    };
     // Define the citation mutation
     const { mutate: generateCitation } =
    trpc.citation.useMutation({
      onSuccess: () => {
        console.log('generated')
        // utils.getUserFiles.invalidate()
      },
      // onMutate({ query }) {
      //   setCurrentlyDeletingFile(id)
      // },
      // onSettled() {
      //   setCurrentlyDeletingFile(null)
      // },
    })
     const handleCiteButtonClick = async () => {
      const selectedText = window.getSelection()?.toString().trim(); // Get the selected text from the description field
      if (selectedText) {
          try {
              // Perform the citation request using the citation mutation
              await generateCitation({ query: selectedText });
          } catch (error) {
              console.error("Citation request failed:", error);
          }
      }
  };
  return (
    <div>
      <form >
        <div>
          <label htmlFor="description">Description:</label>
          <TipTap
            description={form.watch('description')}
            onChange={handleTipTapChange}
          />
          {form.formState.errors.description && <span>{form.formState.errors.description.message}</span>}
        </div>
        <button type="button" onClick={handleCiteButtonClick}>Cite</button>
        {/* {isCiting && <span>Loading citation...</span>} */}
      </form>
    </div>
  )
}
export default page