import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { imagePrefix } from "@/lib/utils";
import prisma from "@/db";
import { Media, Recommendation, User } from "@prisma/client";

function RecommendationSkeleton() {
  return (
    <Card className="col-span-1">
      <CardHeader className="space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[200px] w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-full" />
      </CardFooter>
    </Card>
  );
}

interface RecommendationWithUserAndMedia extends Recommendation {
  sender: {
    name: string;
  };
  media: Media;
}

function RecommendationCard({
  recommendation,
}: {
  recommendation: RecommendationWithUserAndMedia;
}) {
  return (
    <Card className="col-span-1 transition-shadow duration-200 hover:shadow-lg">
      <Link
        href={`/${recommendation.media.mediaType}/${recommendation.media.tmdbId}`}
      >
        <CardHeader>
          <CardTitle className="line-clamp-1 text-xl">
            {recommendation.media.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Recommended by {recommendation.sender.name}
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative h-[400px] w-full">
            <Image
              src={imagePrefix + recommendation.media.posterUrl}
              alt={`Poster of ${recommendation.media.title}`}
              fill
              className="rounded-md object-cover"
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
              />
            ))}
          </div>
        ) : (
          <div className="py-12">
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
