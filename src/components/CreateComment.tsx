"use client";

import { FC, useState } from "react";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CommentCreationRequest } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface CreateCommentProps {
  postId: string,
  replayToId?: string
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replayToId }) => {
  const [input, setInput] = useState<string>("");
  const { loginToast } = useCustomToast()
  const router = useRouter()

  const {mutate: comment, isLoading} = useMutation({
    mutationFn: async ({postId, text, replayToId}: CommentCreationRequest) => {
        const payload: CommentCreationRequest = {
            postId,
            text,
            replayToId,
        }

        const {data} = await axios.patch(`/api/subreddit/post/comment`, payload)
        return data
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast()
        }
        // 422 unprocessable entity
      }
      return toast({
        title: "there was a problem",
        description: "somthing went wrong. please try again",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      router.refresh()
      setInput('')
    }   
  })
  return (
    <div className="grid w-full gap-1.5 ">
      <Label htmlFor="comment">Your comment</Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder="What are your thoughts?"
        />
        <div className="mt-2 flex justify-end ">
            <Button isLoading={isLoading} disabled={input.length === 0} onClick={() => comment({postId, text: input, replayToId})}>Post</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
