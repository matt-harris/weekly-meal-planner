import { NextResponse } from "next/server";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function extractJsonLd(html: string): Record<string, unknown>[] {
  const results: Record<string, unknown>[] = [];
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      results.push(JSON.parse(m[1]));
    } catch {
      // skip malformed blocks
    }
  }
  return results;
}

function findRecipeBlock(blocks: Record<string, unknown>[]): Record<string, unknown> | null {
  for (const block of blocks) {
    if (block["@type"] === "Recipe") return block;
    const graph = block["@graph"];
    if (Array.isArray(graph)) {
      const found = graph.find((n) => (n as Record<string, unknown>)["@type"] === "Recipe");
      if (found) return found as Record<string, unknown>;
    }
  }
  return null;
}

function extractImage(image: unknown): string | undefined {
  if (!image) return undefined;
  if (typeof image === "string") return image;
  if (Array.isArray(image)) return extractImage(image[0]);
  if (typeof image === "object") return (image as Record<string, unknown>)["url"] as string | undefined;
}

function extractSteps(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((s) =>
      typeof s === "string" ? s : ((s as Record<string, unknown>)["text"] as string) ?? ""
    )
    .filter(Boolean);
}

function extractNutrition(raw: unknown): Record<string, string> | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const n = raw as Record<string, string>;
  const result: Record<string, string> = {};
  if (n["calories"]) result.calories = n["calories"];
  if (n["proteinContent"]) result.protein = n["proteinContent"];
  if (n["carbohydrateContent"]) result.carbs = n["carbohydrateContent"];
  if (n["fatContent"]) result.fat = n["fatContent"];
  return Object.keys(result).length > 0 ? result : undefined;
}

function extractMeta(html: string, property: string): string | undefined {
  const re = new RegExp(`<meta[^>]*property="${property}"[^>]*content="([^"]+)"`, "i");
  return html.match(re)?.[1];
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const url: string = body.url ?? "";

  if (!url.startsWith("http")) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  let html: string;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (err) {
    return NextResponse.json({ error: `Could not fetch URL: ${(err as Error).message}` }, { status: 502 });
  }

  const blocks = extractJsonLd(html);
  const recipe = findRecipeBlock(blocks);

  if (recipe) {
    return NextResponse.json({
      name: (recipe["name"] as string) ?? undefined,
      imageUrl: extractImage(recipe["image"]),
      ingredients: Array.isArray(recipe["recipeIngredient"]) ? recipe["recipeIngredient"] : [],
      steps: extractSteps(recipe["recipeInstructions"]),
      nutrition: extractNutrition(recipe["nutrition"]),
    });
  }

  // Fallback to og: meta tags
  return NextResponse.json({
    name: extractMeta(html, "og:title"),
    imageUrl: extractMeta(html, "og:image"),
    ingredients: [],
  });
}
