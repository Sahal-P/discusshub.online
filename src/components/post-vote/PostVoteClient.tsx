"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { PostVoteRequest } from "@/lib/validators/vote";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

interface PostVoteClientProps {
  postId: string;
  initialVotesAmt: number;
  initialVote?: VoteType | null;
}

const PostVoteClient: FC<PostVoteClientProps> = ({
  postId,
  initialVotesAmt,
  initialVote,
}) => {
  const { loginToast } = useCustomToast();
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  const {mutate: vote} = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType,
      };
      await axios.patch('/api/subreddit/post/vote', payload)
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
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        setCurrentVote(undefined)
        if (type === 'UP') setVotesAmt((prev) => prev-1)
        else if (type === 'Down') setVotesAmt((prev) => prev +1)
      } else {
        setCurrentVote(type)
        if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
        else if (type === 'Down') setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
      }
    }
  });
  return (
    <div className="flex flex-col gap-4 sm:gap-0 pr-6 sm-w-20 pb-4 sm:pb-0 ">
      <Button onClick={() => vote('UP')} size={"sm"} variant={"ghost"} aria-label="upvote">
        <ArrowBigUp
          className={cn("h-5 w-5 text-emerald-800", {
            "text-emerald-500 fill-emerald-500": currentVote === "UP",
          })}
        />
      </Button>

      <p className="text-center py-2 font-medium text-sm text-zinc-900 ">
        {votesAmt}
      </p>

      <Button onClick={() => vote('Down')} size={"sm"} variant={"ghost"} aria-label="downvote">
        <ArrowBigDown
          className={cn("h-5 w-5 text-red-800", {
            "text-red-500 fill-red-500": currentVote === "Down",
          })}
        />
      </Button>
    </div>
  );
};

export default PostVoteClient;
