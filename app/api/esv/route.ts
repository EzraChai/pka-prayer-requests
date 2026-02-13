export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const book = searchParams.get("book");
  const chapter = searchParams.get("chapter");

  if (!book || !chapter) {
    return new Response("Missing book or chapter", { status: 400 });
  }

  const res = await fetch(
    `https://api.esv.org/v3/passage/text/?q=${book}+${chapter}&include-passage-references=false&include-first-verse-numbers=false&include-footnotes=false&include-footnote-body=false&include-short-copyright=false`,
    {
      headers: {
        authorization: `Token ${process.env.ESV_API_KEY}`,
      },
    },
  );

  if (!res.ok) {
    return new Response("Failed to fetch ESV passage", { status: 500 });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), { status: 200 });
}
