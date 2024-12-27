import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/db";
import { imagePrefix } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { Media, Recommendation } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import RecommendationOptions from "./_components/RecommendationOptions";

interface RecommendationWithUserAndMedia extends Recommendation {
  sender: {
    name: string;
  };
  media: Media;
}

function RecommendationSkeleton() {
  return (
    <Card className="col-span-1">
      <CardHeader className="space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-[2/3] w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-full" />
      </CardFooter>
    </Card>
  );
}

function RecommendationCard({
  recommendation,
  userId,
}: {
  recommendation: RecommendationWithUserAndMedia;
  userId: string;
}) {
  return (
    <Card className="col-span-1 transition-shadow duration-200 hover:shadow-lg">
      <Link
        href={`/${recommendation.media.mediaType}/${recommendation.media.tmdbId}`}
      >
        <CardHeader>
          <CardTitle className="line-clamp-1 flex items-center justify-between text-xl">
            {recommendation.media.title}
            <RecommendationOptions
              userId={userId}
              recommendationId={recommendation.id}
            />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Recommended by {recommendation.sender.name}
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-[2/3] w-full">
            <Image
              src={imagePrefix + recommendation.media.posterUrl}
              alt={`Poster of ${recommendation.media.title}`}
              fill
              className="rounded-md object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {recommendation.message}
          </p>
          <p className="block text-sm font-medium">
            {recommendation.createdAt.toLocaleDateString()}
          </p>
        </CardFooter>
      </Link>
    </Card>
  );
}

export default async function Recommendations() {
  const { userId } = auth();

  if (!userId) {
    return <div>Please sign in to view recommendations.</div>;
  }

  const recommendationsForUser = await prisma.recommendation.findMany({
    where: {
      receiverId: userId,
    },
    include: {
      media: true,
      sender: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-extrabold">Your Recommendations</h1>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <RecommendationSkeleton key={i} />
            ))}
          </div>
        }
      >
        {recommendationsForUser.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recommendationsForUser.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                userId={userId}
              />
            ))}
          </div>
        ) : (
          <div>
            <h2 className="mb-2 text-xl font-semibold">
              No recommendations yet
            </h2>
            <p className="text-muted-foreground">
              When your friends recommend something, it will appear here.
            </p>
          </div>
        )}
      </Suspense>
    </div>
  );
}
