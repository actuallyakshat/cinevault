import Image from "next/image";
import React from "react";
import AddCollaboratorDialog from "./AddCollaboratorDialog";
import Link from "next/link";
import RemoveCollaboratorDialog from "./RemoveCollaboratorDialog";

interface CollaborataorsProp {
  id: string;
  name: string;
  profileImageUrl: string | null;
}

export default function EditCollaborators({
  collaborators,
  boardId,
  isAdmin,
}: {
  collaborators: CollaborataorsProp[];
  boardId: string;
  isAdmin: boolean;
}) {
  return (
    <div className="mt-4 flex w-full flex-col items-start rounded-xl border p-4">
      <div className="flex w-full items-center justify-between">
        <h4 className="text-sm font-medium">Collaborators</h4>
        {isAdmin && <AddCollaboratorDialog boardId={boardId} />}
      </div>
      {collaborators.length > 0 && (
        <div className="mt-6 flex w-full flex-col gap-2">
          {collaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className="flex flex-1 items-center justify-between gap-2"
            >
              <div className="flex w-full items-center gap-2">
                {collaborator.profileImageUrl && (
                  <Image
                    width={1080}
                    height={1080}
                    src={collaborator.profileImageUrl}
                    alt={collaborator.name}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <Link
                  href={`/profile/${collaborator.id}`}
                  className="text-sm font-medium hover:underline"
                >
                  {collaborator.name}
                </Link>
              </div>
              {isAdmin && (
                <RemoveCollaboratorDialog
                  boardId={boardId}
                  userId={collaborator.id}
                />
              )}
            </div>
          ))}
        </div>
      )}
      {collaborators.length === 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium text-muted-foreground">
            No collaborators added yet.
          </p>
        </div>
      )}
    </div>
  );
}
