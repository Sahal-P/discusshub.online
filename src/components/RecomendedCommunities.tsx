"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Subreddit} from "@prisma/client";
import { Loader2 } from "lucide-react";


const RecomendedCommunities = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [communites, setCommunites] = useState<Pick<Subreddit, "id" | "name">[]>([]);

  const { mutate: getRecomend, isLoading: isRecomendLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.get("/api/recomend");
      return data;
    },
    onError: (error) => {
      toast({
        title: "There was an error.",
        description: "Could not add vote. please try again",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      setCommunites(data);
    },
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    const init = () => {
      getRecomend();
    };

    if (isMounted) {
      init();
    }
  }, [isMounted]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Featured</CardTitle>
        <CardDescription>Explore new communities</CardDescription>
      </CardHeader>
      {isRecomendLoading && (
        <>
          <CardContent>
            <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
          </CardContent>
        </>
      )}
      {communites.map((comm) => (
          <CardContent key={comm.id}>
            <a
              className="underline text-zinc-900 text-sm underline-offset-2 "
              href={`/r/${comm.name}`}
            >
              r/{comm.name}
            </a>
            <span className="px-1">•</span>
          </CardContent>
      ))}
    </Card>
  );
};

export default RecomendedCommunities;
