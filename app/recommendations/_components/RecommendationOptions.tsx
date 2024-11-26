"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Ellipsis } from "lucide-react";
import { MouseEvent, use, useContext } from "react";
import {
  addRecommendationToWatchlist,
  deleteRecommendation,
} from "../actions/actions";
import { AuthContext } from "@/providers/auth-provider";

export default function RecommendationOptions({
  recommendationId,
  userId,
}: {
  recommendationId: string;
  userId: string;
}) {
  const { toast } = useToast();
  const { refreshUserDetails } = useContext(AuthContext);

  async function handleAddToWatchlist() {
    const response = await addRecommendationToWatchlist(
      recommendationId,
      userId,
    );
    if (response.success) {
      toast({
        title: "Success",
        description: "Recommendation added to watchlist",
      });
      refreshUserDetails();
    } else {
      toast({
        title: "Error",
        description: response.message,
      });
    }
  }

  async function handleDeleteRecommendation() {
    const response = await deleteRecommendation(recommendationId);
    if (response.success) {
      toast({
        title: "Success",
        description: "Recommendation deleted",
      });
      refreshUserDetails();
    } else {
      toast({
        title: "Error",
        description: response.message,
      });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleAddToWatchlist();
          }}
        >
          Add to Watchlist
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteRecommendation();
          }}
        >
          Delete Recommendation
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
