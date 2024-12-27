import { MovieBoard } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

export function BoardList({ boards }: { boards: MovieBoard[] }) {
  return (
    <>
      {boards.length > 0 ? (
        <div className="mt-4 grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {boards.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      ) : (
        <p className="pt-2 text-muted-foreground">
          No boards found. Create one to get started.
        </p>
      )}
    </>
  );
}

function BoardCard({ board }: { board: MovieBoard }) {
  return (
    <Link href={"/movieboard/" + board.id}>
      <div className="flex flex-col gap-2">
        <div className="">
          {board.coverImage ? (
            <Image
              loading="lazy"
              src={board.coverImage}
              alt={board.title}
              width={500}
              height={500}
              className="aspect-square w-full rounded-lg object-cover"
            />
          ) : (
            <div className="flex aspect-square h-full items-center justify-center rounded-lg bg-muted">
              <p className="text-wrap text-xs text-muted-foreground">
                {board.title}
              </p>
            </div>
          )}
        </div>
        <h2 className="font-medium">{board.title}</h2>
      </div>
    </Link>
  );
}
