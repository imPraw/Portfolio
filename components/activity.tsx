import { GitFork, GitPullRequest, GitBranch } from "lucide-react";
import { person } from "@/lib/content";
import { dateLabel, getGitHubData, type Day } from "@/lib/github";

function Calendar({ days }: { days: Day[] }) {
  const offset = days.length ? new Date(`${days[0][0]}T00:00:00Z`).getUTCDay() : 0;
  const pitch = 14;
  const totalSlots = days.length + offset;
  const width = Math.ceil(totalSlots / 7) * pitch;
  const fullWeeksEnd = Math.floor(totalSlots / 7) * pitch;
  const fullWeeksStart = offset ? pitch : 0;
  const months: { x: number; name: string }[] = [];
  const activeDays: { date: string; count: number; level: number; x: number; y: number }[] = [];
  const contributions = days.reduce((total, [, , count]) => total + count, 0);

  days.forEach(([date, level, count], i) => {
    const x = Math.floor((i + offset) / 7) * pitch;
    const y = (i + offset) % 7 * pitch + 18;
    const day = new Date(`${date}T00:00:00Z`);
    if (day.getUTCDate() === 1 && x > pitch && x < width - 24) {
      months.push({ x, name: day.toLocaleDateString("en", { month: "short", timeZone: "UTC" }) });
    }
    if (count > 0) activeDays.push({ date, count, level, x, y });
  });
  return (
    <div className="calendar">
      <div className="panel-heading">
        <h3>Contribution calendar</h3>
        <span className="label"><strong data-counter={contributions}>{contributions}</strong> contributions</span>
      </div>
      <div className="calendar-scroll" tabIndex={0} role="region" aria-label="Scrollable contribution calendar" data-lenis-prevent>
        <svg className="calendar-grid" viewBox={`0 0 ${width} 116`} role="img" aria-label={`GitHub heatmap showing ${contributions} contributions in the past year`}>
          <defs>
            <pattern id="contribution-cells" patternUnits="userSpaceOnUse" y={18} width={pitch} height={pitch}>
              <rect className="calendar-cell" width={11} height={11} rx={2} />
            </pattern>
          </defs>
          {months.map(({ x, name }) => <text className="calendar-month" key={x} x={x} y={10}>{name}</text>)}
          <g fill="url(#contribution-cells)">
            {offset > 0 && <rect y={18 + offset * pitch} width={pitch} height={(7 - offset) * pitch} />}
            <rect x={fullWeeksStart} y={18} width={fullWeeksEnd - fullWeeksStart} height={7 * pitch} />
            {totalSlots % 7 > 0 && <rect x={fullWeeksEnd} y={18} width={pitch} height={totalSlots % 7 * pitch} />}
          </g>
          {activeDays.map(({ date, count, level, x, y }) => (
            <rect className="calendar-cell" key={date} data-level={level} x={x} y={y} width={11} height={11} rx={2}>
              <title>{`${dateLabel(date)} · ${count} ${count === 1 ? "contribution" : "contributions"}`}</title>
            </rect>
          ))}
        </svg>
      </div>
      <div className="calendar-footer"><span>Past year · GitHub</span><span className="legend">Less {[0, 1, 2, 3, 4].map((level) => <i key={level} data-level={level} />)} More</span></div>
      {activeDays.length > 0 && (
        <details className="calendar-text">
          <summary>Contribution dates</summary>
          <ul>{activeDays.toReversed().map(({ date, count }) => <li key={date}><time dateTime={date}>{dateLabel(date)}</time><span>{count} {count === 1 ? "contribution" : "contributions"}</span></li>)}</ul>
        </details>
      )}
    </div>
  );
}

const eventNames: Record<string, string> = {
  PushEvent: "Pushed to",
  CreateEvent: "Created a branch or repository in",
  PullRequestEvent: "Worked on a pull request in",
  IssuesEvent: "Worked on an issue in",
  IssueCommentEvent: "Commented on an issue in",
  MemberEvent: "Repository membership activity in",
  ForkEvent: "Forked",
  WatchEvent: "Starred",
  PublicEvent: "Made public",
};

export function Activity({ data }: { data: Awaited<ReturnType<typeof getGitHubData>> }) {
  const languageTotal = data.languages.reduce((total, [, bytes]) => total + bytes, 0);
  return (
    <section className="section shell" id="activity" aria-labelledby="activity-title">
      <div className="section-head" data-reveal>
        <p className="label"><GitBranch size={15} /> GitHub activity</p>
        <h2 id="activity-title">In the open.</h2>
      </div>
      <div className="activity-grid">
        <Calendar days={data.days} />
        <div className="activity-panel">
          <div className="panel-heading"><h3>Top languages</h3><span className="label">Repo bytes</span></div>
          {data.languages.slice(0, 5).map(([language, bytes]) => {
            const percent = Math.round(bytes * 100 / languageTotal);
            return <div className="language-row" key={language}><span>{language}</span><meter min={0} max={100} value={percent} aria-label={language} /><span>{percent}%</span></div>;
          })}
        </div>
        <div className="activity-panel">
          <div className="panel-heading"><h3>Recent public activity</h3><GitPullRequest size={17} /></div>
          {data.events.length ? <ul className="events">{data.events.slice(0, 3).map((event) => (
            <li key={`${event.repo}-${event.type}-${event.date}`}>
              <GitFork size={16} /><div><span>{eventNames[event.type] ?? "Public activity in"}</span> <a href={event.url}>{event.repo}</a><time dateTime={event.date}>{dateLabel(event.date)}</time></div>
            </li>
          ))}</ul> : <p className="muted">No recent public events.</p>}
          <a className="text-link" href={person.github}>View GitHub profile</a>
        </div>
      </div>
      {data.fallback && <p className="data-note">Some GitHub data uses the saved snapshot from {dateLabel(data.snapshotDate)}.</p>}
    </section>
  );
}
