// jina ai to get the content as markdown
// example: https://r.jina.ai/https://cafe-uetelier.de/
export async function getJinaContent(websiteUrl?: string | null) {
  if (!websiteUrl) {
    return null;
  }

  console.log(`🌐 getting content for ${websiteUrl}`);
  const content = await fetch(`https://r.jina.ai/${websiteUrl}`)
    .then((res) => {
      if (res.status !== 200) {
        console.log(`❌ error fetching content for ${websiteUrl}`, res.status);
        return null;
      }

      return res.text();
    })
    .catch((err) => {
      console.error(`❌ error fetching content for ${websiteUrl}`, err);
      return null;
    });

  return content;
}
