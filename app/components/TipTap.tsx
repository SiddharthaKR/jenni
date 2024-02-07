'use client'
import { EditorContent, useEditor } from '@tiptap/react'
import React from 'react'
import StarterKit from '@tiptap/starter-kit'

const TipTap = ({description,onChange}:{description:string, onChange:(richText:string)=>void}) => {
    const editor = useEditor({
        extensions: [StarterKit.configure()],
        content: description,
        editorProps: {
            attributes:{
                class: "rounded-md border min-h-[150px] border-input "
            },
        },
        onUpdate({editor}){
            onChange(editor.getHTML())
        }
    })
  return (
    <div className='flex flex-col justify-stretch min-h-[250px'>
        <EditorContent editor={editor}/>
    </div>
  )
}

export default TipTap