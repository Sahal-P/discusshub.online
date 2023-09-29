"use client";

import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { FC, useReducer } from "react";

interface MiniCreatePostProps {
  session: Session | null;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <li className="overflow-hidden rounded-md bg-white shadow">
      <div className="h-full px-6 py-4 sm:flex sm:justify-between gap-6"></div>
    </li>
  );
};

export default MiniCreatePost;
