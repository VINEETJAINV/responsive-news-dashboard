// API Route: /api/news
// Fetches top US headlines from NewsAPI using a server-side API key

export default async function handler(req, res) {
  // Get API key from environment variables
  const apiKey = process.env.NEWS_API_KEY;
  const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

  try {
    // Fetch news from NewsAPI
    const response = await fetch(url);
    const data = await response.json();
    // Return the news data as JSON
    res.status(200).json(data);
  } catch (error) {
    // Handle errors gracefully
    res.status(500).json({ error: 'Failed to fetch news.' });
  }
}
