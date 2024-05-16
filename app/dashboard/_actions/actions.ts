"use server";
import prisma from "@/db";
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

const createUser = async () => {
  try {
    const user = await prisma.user.create({
      data: {
        name: "Akshat Doe",
        email: "akshatdoe@example.com",
      },
    });
    console.log("User created!!!");
    console.log(user);
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    console.log("Users:", users);
    return users;
  } catch (error) {
    console.error("Error getting users:", error);
  }
};

export { searchMedia, createUser, getAllUsers };
