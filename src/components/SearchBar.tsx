"use client"

import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/Command";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Prisma, Subreddit } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Users } from "lucide-react";
import debounce from "lodash.debounce";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {

    const [input, setInput] = useState<string>('')
    const [name, setName] = useState<string>('')

    const {data: queryResults, refetch, isFetched, isFetching} = useQuery({
        queryFn: async () => {
            if (!input) return []

            const {data} = await axios.get(`/api/search?q=${input}`)
            if (data.length != 0) {
                setName(data[0].name)
            }
            return data as (Subreddit & {
                _count: Prisma.SubredditCountOutputType
            })[]
        },
        queryKey: ["search-query"],
        enabled: false
    })
    
    const request = debounce(() => {
        refetch()
    }, 300)
    const debounceRequest = useCallback(() => {
        request()
    },[])
    const router = useRouter()
    const commandRef = useRef<HTMLDivElement>(null)
    const pathName = usePathname()
    useOnClickOutside(commandRef, () => {
        setInput('')
    })

    useEffect(()=> {
        setInput('')
    },[pathName])
  return (
    <Command ref={commandRef} className="relative rounded-lg border max-w-lg z-50 overflow-visible ">
        <CommandInput value={input} onValueChange={(text) => {
            setInput(text)
            debounceRequest()
        }} className="outline-none border-none focus:border-none focus:outline-none ring-0" placeholder="search communities..." />

        {input.length > 0 && (
            <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md ">
                {isFetching ? (
                        <div className="py-6 text-center text-sm flex justify-center">
                        <Loader2 className='w-6 h-6 text-zinc-500 animate-spin' />
                        </div>
                ): null}
                {isFetched && (
                    <CommandEmpty>No results found.</CommandEmpty>
                )}
                {(queryResults?.length ?? 0) > 0 ? (
                    <CommandGroup heading="communities">
                        {queryResults?.map((subreddit) => (
                            <CommandItem key={subreddit.id} value={subreddit.name} onSelect={(e) => {
                                if (name) {
                                    router.push(`/r/${name}`)
                                    router.refresh()
                                }
                            }}><Users className="mr-2 h-4 w-4" />
                            <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                ): null}
            </CommandList>
  )}
    </Command>
  );
};

export default SearchBar;
