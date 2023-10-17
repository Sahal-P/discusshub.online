import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession();
  // fetching the top level comments
  const comments = await db.comment.findMany({
    where: {
      postId,
      replayToId: null,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });
  return (
    <div className="flex flex-col gap-y-4 mt-4 ">
      <hr className="w-full h-px my-6 " />
      <CreateComment postId={postId} />

      <div className="flex flex-col gap-y-6 mt-4 ">
        {comments
          .filter((comment) => !comment.replayToId)
          .map((topLvlComment) => {
            const topLevelCommentVotesAmt = topLvlComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === "UP") return acc + 1;
                if (vote.type === "Down") return acc - 1;
                return acc;
              },
              0
            );

            const topLevelCommentVote = topLvlComment.votes.find(
              (vote) => vote.userId === session?.user.id
            );
            return (
              <div key={topLvlComment.id} className="flex flex-col">
                <div className="mb-2">
                    <PostComment postId={postId} currentVote={topLevelCommentVote} votesAmt={topLevelCommentVotesAmt} comment={topLvlComment} />
                </div>

                {topLvlComment.replies.sort((a, b) => b.votes.length - a.votes.length).map((reply) => {
                  const replayVotesAmt = reply.votes.reduce(
                    (acc, vote) => {
                      if (vote.type === "UP") return acc + 1;
                      if (vote.type === "Down") return acc - 1;
                      return acc;
                    },
                    0
                  );
      
                  const replayVotes = reply.votes.find(
                    (vote) => vote.userId === session?.user.id
                  );
                  return (
                    <div key={reply.id} className="ml-2 py-2 pl-4 border-l-2 border-zinc-200">
                      <PostComment comment={reply} currentVote={replayVotes} votesAmt={replayVotesAmt} postId={postId} />
                    </div>
                  )
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentsSection;
