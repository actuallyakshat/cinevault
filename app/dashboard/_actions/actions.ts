"use server";
import prisma from "@/db";
import { ClerkMiddlewareAuthObject } from "@clerk/nextjs/server";
import axios from "axios";

const TOKEN = process.env.TMDB_API_TOKEN as string;
async function searchMedia(query: string, mediaType: string): Promise<void> {
  try {
    // Make a GET request to search for movies
    const response = await axios.get(
      "https://api.themoviedb.org/3/search/" +
        mediaType +
        "?language=en-US&page=1&include_adult=false",
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
        params: {
          query,
        },
      },
    );
    if (response.data) {
      const movies = response.data.results;
      return movies;
    } else {
      console.log("No data found");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const getUserDetails = async ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        watchlist: true,
        favorites: true,
        watched: true,
      },
    });
    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
        },
      });
      return newUser;
    }
    return user;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export { searchMedia, getUserDetails };
