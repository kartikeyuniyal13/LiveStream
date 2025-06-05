"use client";

import React, { useState } from "react";
import qs from "query-string";
import { SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Search() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchText) return;

    const newURL = qs.stringifyUrl(
      {
        url: "/search",
        query: { term: searchText },
      },
      { skipEmptyString: true }
    );

    router.push(newURL);
  };

  const onClear = () => setSearchText("");

  return (
    <form
      onSubmit={onSubmit}
      className="relative w-full lg:w-[400px] flex items-center"
    >
      <Input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search"
        className="rounded-r-none focus-visible:ring-0 h-10 focus-visible:ring-transparent focus-visible:ring-offset-0"
      />
      {searchText && (
        <X
          onClick={onClear}
          className="absolute top-2.5 right-9.5 h-5 w-5 text-muted-foreground cursor-pointer hover:opacity-75 transition"
        />
      )}
      <Button
        className="rounded-l-none h-10 hover:bg-gray-200 hover:shadow transition duration-200"
        type="submit"
        size="sm"
        variant="secondary"
      >
        <SearchIcon className="h-5 w-5 text-muted-foreground hover:text-gray-600" />
      </Button>
    </form>
  );
}