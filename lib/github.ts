import snapshot from "./github-snapshot.json";

export type Repo = {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  updatedAt: string;
};

type Event = { type: string; repo: string; date: string; url: string };
export type Day = [date: string, level: number, count: number];

type ApiRepo = {
  name: string; description: string | null; html_url: string; language: string | null;
  topics: string[]; stargazers_count: number; forks_count: number; updated_at: string;
  languages_url: string;
};
type ApiEvent = { type: string; repo: { name: string }; created_at: string };

const handle = "imPraw";
const api = `https://api.github.com/users/${handle}`;
const cachedDays = snapshot.days as Day[];
const cachedLanguages = snapshot.languages as [string, number][];

async function githubRequest(url: string) {
  const headers: Record<string, string> = { "User-Agent": "PrawPortfolio" };
  if (url.startsWith("https://api.github.com/") && process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  try {
    const response = await fetch(url, { headers, next: { revalidate: 86400 }, signal: AbortSignal.timeout(5500) });
    if (response.ok) return response;
  } catch {
    // A timeout or blocked request can fall back to the checked-in public snapshot.
  }
  return null;
}

async function json<T>(url: string): Promise<T | null> {
  try {
    const response = await githubRequest(url);
    return response ? await response.json() : null;
  } catch {
    return null;
  }
}

async function contributionDays() {
  try {
    const response = await githubRequest(`https://github.com/users/${handle}/contributions`);
    return response ? parseCalendar(await response.text()) : [];
  } catch {
    return [];
  }
}

async function repositories() {
  const repos: ApiRepo[] = [];
  for (let page = 1; ; page++) {
    const batch = await json<ApiRepo[]>(`${api}/repos?type=owner&per_page=100&page=${page}`);
    if (!Array.isArray(batch)) return null;
    repos.push(...batch);
    if (batch.length < 100) return repos;
  }
}

function parseCalendar(html: string): Day[] {
  const counts = new Map(
    [...html.matchAll(/for="(contribution-day-component-[^"]+)"[^>]*>(No|[\d,]+) contribution/g)]
      .map((match) => [match[1], Number(match[2].replaceAll(",", "")) || 0]),
  );
  const days: Day[] = [];
  for (const [cell] of html.matchAll(/<td\b[^>]*>/g)) {
    const date = /\bdata-date="(\d{4}-\d{2}-\d{2})"/.exec(cell)?.[1];
    const id = /\bid="([^"]+)"/.exec(cell)?.[1];
    const level = /\bdata-level="([0-4])"/.exec(cell)?.[1];
    const count = id ? counts.get(id) : undefined;
    if (date && level && count !== undefined) days.push([date, Number(level), count]);
  }
  days.sort((a, b) => a[0].localeCompare(b[0]));
  // The chart positions each cell by its index. A missing day would shift every later week.
  const dayMs = 86_400_000;
  const fullYear = days.length >= 365 && days.length <= 371;
  return fullYear && days.every(([date], i) => i === 0 || Date.parse(date) - Date.parse(days[i - 1][0]) === dayMs)
    ? days : [];
}

export async function getGitHubData() {
  const [liveRepos, liveEvents, days] = await Promise.all([
    repositories(),
    json<ApiEvent[]>(`${api}/events/public?per_page=20`),
    contributionDays(),
  ]);

  const repos = liveRepos?.map<Repo>((repo) => ({
    name: repo.name, description: repo.description, url: repo.html_url,
    language: repo.language, topics: repo.topics ?? [], stars: repo.stargazers_count,
    forks: repo.forks_count, updatedAt: repo.updated_at,
  })) ?? snapshot.repos;
  const events = Array.isArray(liveEvents) ? liveEvents.map<Event>((event) => ({
    type: event.type, repo: event.repo.name, date: event.created_at, url: `https://github.com/${event.repo.name}`,
  })) : snapshot.events;
  const languageRows = liveRepos && await Promise.all(liveRepos.map((repo) =>
    json<Record<string, number>>(repo.languages_url),
  ));
  let languages = cachedLanguages;
  if (languageRows?.every((row) => row !== null)) {
    const totals = new Map<string, number>();
    for (const row of languageRows) {
      for (const [language, bytes] of Object.entries(row ?? {})) {
        totals.set(language, (totals.get(language) ?? 0) + bytes);
      }
    }
    languages = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  }
  const savedSections: string[] = [];
  if (!liveRepos) savedSections.push("repositories");
  if (!Array.isArray(liveEvents)) savedSections.push("public activity");
  if (!days.length) savedSections.push("contribution calendar");
  if (languages === cachedLanguages) savedSections.push("languages");
  return {
    repos, events, days: days.length ? days : cachedDays, languages, savedSections,
    fallback: savedSections.length > 0,
    snapshotDate: snapshot.capturedAt.slice(0, 10),
  };
}

const dateFormat = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export function dateLabel(date: string) {
  return dateFormat.format(new Date(date));
}
