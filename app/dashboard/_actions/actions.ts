"use server";
import prisma from "@/db";
import axios from "axios";

const TOKEN = process.env.TMDB_API_TOKEN as string;
const DEFAULT_PFP =
  "https://res.cloudinary.com/djpbvhxfh/image/upload/v1735321020/cinevault/profile/hkljs8qrndn7wpyqsbnt.jpg";

async function searchMedia(query: string, mediaType: string) {
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
      console.error("No data found for search");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const getUserDetails = async ({
  name,
  clerkId,
  email,
}: {
  name: string;
  clerkId: string;
  email: string;
}) => {
  try {
    console.log("FETCHING USER");
    let user = await prisma.user.findUnique({
      where: {
        // id: clerkId,
        email,
      },
      include: {
        watchlist: true,
        favorites: true,
        watched: {
          include: {
            media: true,
          },
        },
      },
    });

    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          id: clerkId,
          email,
          name,
          profileImageUrl: DEFAULT_PFP,
        },
      });
      return { ...newUser, watchlist: [], favorites: [], watched: [] };
    }

    if (user.id != clerkId) {
      user = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          id: clerkId,
        },
        include: {
          watchlist: true,
          favorites: true,
          watched: {
            include: {
              media: true,
            },
          },
        },
      });
    }

    return user;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export { getUserDetails, searchMedia };
