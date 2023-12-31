"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { usePrevious } from "@mantine/hooks";
import { CommentVote, VoteType } from "@prisma/client";
import { FC, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { CommentVoteRequest } from "@/lib/validators/vote";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

type PartialVote = Pick<CommentVote, 'type'>

interface CommentVotesProps {
  commentId: string;
  initialVotesAmt: number;
  initialVote?: PartialVote;
}

const CommentVotes: FC<CommentVotesProps> = ({
  commentId,
  initialVotesAmt,
  initialVote,  
}) => {
  const { loginToast } = useCustomToast();
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  const {mutate: vote} = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType,
      };
      await axios.patch('/api/subreddit/post/comment/vote', payload)
    },
    onError: (err, VoteType) => {
      if (VoteType === "UP") setVotesAmt((prev) => prev -1)
      else setVotesAmt((prev) => prev + 1)
      setCurrentVote(prevVote)
      if (err instanceof AxiosError) {
        if (err.response?.status === 422) {
          return toast({
            title: "Invalid subreddit name.",
            description: "please choose a name between 3 and 21 characters.",
            variant: "destructive"
          })
        }
        if (err.response?.status === 401) {
          return loginToast()
        }
      }
      toast({
        title: "There was an error.",
        description: "Could not add vote. please try again",
        variant: "destructive"
      })
    },
    onMutate: (type) => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined)
        if (type === 'UP') setVotesAmt((prev) => prev-1)
        else if (type === 'Down') setVotesAmt((prev) => prev +1)
      } else {
        setCurrentVote({type})
        if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
        else if (type === 'Down') setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
      }
    }
  });
  return (
    <div className="flex gap-1">
      <Button onClick={() => vote('UP')} size={"sm"} variant={"ghost"} aria-label="upvote">
        <ArrowBigUp
          className={cn("h-5 w-5 text-emerald-800", {
            "text-emerald-500 fill-emerald-500": currentVote?.type === "UP",
          })}
        />
      </Button>

      <p className="text-center py-2 font-medium text-sm text-zinc-900 ">
        {votesAmt}
      </p>

      <Button onClick={() => vote('Down')} size={"sm"} variant={"ghost"} aria-label="downvote">
        <ArrowBigDown
          className={cn("h-5 w-5 text-red-800", {
            "text-red-500 fill-red-500": currentVote?.type === "Down",
          })}
        />
      </Button>
    </div>
  );
};

export default CommentVotes;
