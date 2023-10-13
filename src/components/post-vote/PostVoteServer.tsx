import { Post, Vote, VoteType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

interface PostVoteServerProps {
  postId: string;
  initialVotesAmt?: number;
  initialVote?: VoteType | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

const PostVoteServer = async ({
  postId,
  initialVotesAmt,
  initialVote,
  getData,
}: PostVoteServerProps) => {
  const session = await getServerSession()

  let _votesAmt: number = 0
  let _currentVote: VoteType | null | undefined = undefined

  if (getData) {
    const post = await getData()
    if (!post) return notFound()

    _votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === 'UP') return acc + 1
      if (vote.type === 'Down') return acc -1
      return acc
    }, 0)

    _currentVote = post.votes.find((vote) => vote.userId === session?.user.id)?.type
  } else {
    _votesAmt = initialVote!
    _currentVote = initialVote
  }
  return <div>PostVoteServer</div>;
};

export default PostVoteServer;
