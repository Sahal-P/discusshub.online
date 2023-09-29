"use client"

import TextareaAutosize from "react-textarea-autosize";
import { FC } from "react";
import {useForm} from "react-hook-form"
import { PostCreationRequest, Postvalidator } from "@/lib/validators/post";
import {zodResolver} from "@hookform/resolvers/zod"

interface EditorProps {
    subredditId: string
}

const Editor: FC<EditorProps> = ({subredditId}) => {
    const {} = useForm<PostCreationRequest>({
        resolver: zodResolver(Postvalidator),
        defaultValues: {
            subredditId
        }
    })
  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200 ">
      <form id="subreddit-post-form" className="w-fit" onSubmit={(e) => {e.preventDefault()}}>
        <div className="prose prose-stone dark:prose-invert">
            <TextareaAutosize placeholder="Title" className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"/>
        </div>
      </form>
    </div>
  );
};

export default Editor;
