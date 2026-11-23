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
  return [...html.matchAll(/<td\b[^>]*data-date="([^"]+)"[^>]*id="([^"]+)"[^>]*data-level="([0-4])"[^>]*>/g)]
    .filter((match) => counts.has(match[2]))
    .map<Day>((match) => [match[1], Number(match[3]), counts.get(match[2])!])
    .sort((a, b) => a[0].localeCompare(b[0]));
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
  return {
    repos, events, days: days.length >= 350 ? days : cachedDays, languages,
    fallback: !liveRepos || !Array.isArray(liveEvents) || days.length < 350 || languages === cachedLanguages,
    snapshotDate: snapshot.capturedAt.slice(0, 10),
  };
}

export function dateLabel(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
    .format(new Date(date));
}
