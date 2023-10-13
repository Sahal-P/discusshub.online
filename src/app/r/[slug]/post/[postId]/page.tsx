import { redis } from "@/config";
import { db } from "@/lib/db";
import { createRedisInstance } from "@/lib/redis";
import { CachedPostType } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import { notFound } from "next/navigation";
import { FC } from "react";

interface PageProps {
  params: {
    postId: string;
  };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page = async ({ params }: PageProps) => {
  const redis = createRedisInstance();
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`
  )) as unknown as CachedPostType;

  let post: (Post & { vote: Vote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }
  if (!post && !cachedPost) return notFound();
  return (
    <div>
      <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between ">
        page
      </div>
    </div>
  );
};

export default page;
