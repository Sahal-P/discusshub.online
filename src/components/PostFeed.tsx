"use client";

import { ExtendedPost } from "@/types/db";
import { FC, useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import axios from "axios";
import { useSession } from "next-auth/react";
import Post from "./Post";
import { Loader2 } from "lucide-react";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  subredditName?: string;
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, subredditName }) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { data: session } = useSession();
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-post-query"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : "");

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  );

  useEffect(()=> {
    if (entry?.isIntersecting) {
      fetchNextPage()
    }
  },[entry, fetchNextPage])

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;
  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const votesCount = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "Down") return acc + 1;
          return acc;
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id
        );  
        if (index === posts.length - 1) {
          return (
            <li key={index} ref={ref}>
              <Post currentVote={currentVote} votesCount={votesCount} commentCount={post.comments.length} subredditName={post.subreddit.name} post={post} />
            </li>
          );
        }else {
          return <Post key={index} currentVote={currentVote} votesCount={votesCount} commentCount={post.comments.length} subredditName={post.subreddit.name} post={post} />
        }

      })}
      {isFetchingNextPage && (
        <li className='flex justify-center' key={'loading'}>
          <Loader2 className='w-6 h-6 text-zinc-500 animate-spin' />
        </li>
      )}
    </ul>
  );
};

export default PostFeed;
