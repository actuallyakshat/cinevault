"use server";
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

export { searchMedia };
