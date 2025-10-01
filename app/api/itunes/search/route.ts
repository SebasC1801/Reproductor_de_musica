import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    // Buscar en iTunes API
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=25`,
    )

    if (!response.ok) {
      throw new Error("iTunes API request failed")
    }

    const data = await response.json()

    // Transformar resultados de iTunes al formato de Track
    const tracks = data.results.map((item: any) => ({
      id: item.trackId.toString(),
      name: item.trackName,
      artist: item.artistName,
      album: item.collectionName,
      duration: Math.floor(item.trackTimeMillis / 1000),
      image_url: item.artworkUrl100.replace("100x100", "600x600"),
      thumbnail: item.artworkUrl100,
      preview_url: item.previewUrl,
      source: "itunes",
      genre: item.primaryGenreName,
      releaseDate: item.releaseDate,
    }))

    return NextResponse.json({ tracks })
  } catch (error) {
    console.error("Error searching iTunes:", error)
    return NextResponse.json({ error: "Failed to search iTunes" }, { status: 500 })
  }
}
