"use client";

import { useState } from "react";
import { MovieBoard } from "@prisma/client";
import SearchBar from "./SearchBar";
import AddMovieBoardDialog from "../../_components/AddMovieBoardDialog";
import { BoardList } from "./BoardList";

export default function MovieBoardsClient({
  initialBoards,
}: {
  initialBoards: MovieBoard[];
}) {
  const [boards, setBoards] = useState(initialBoards);

  const handleSearch = (query: string) => {
    const filteredBoards = initialBoards.filter((board) =>
      board.title.toLowerCase().includes(query.toLowerCase()),
    );
    setBoards(filteredBoards);
  };

  return (
    <>
      <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-extrabold">Movie Boards</h1>
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
          <SearchBar onSearch={handleSearch} />
          <AddMovieBoardDialog />
        </div>
      </div>
      <BoardList boards={boards} />
    </>
  );
}
