import { GitFork, GitPullRequest, GitBranch } from "lucide-react";
import { Fragment } from "react";
import { person } from "@/lib/content";
import { dateLabel, getGitHubData, type Day } from "@/lib/github";

function Calendar({ days }: { days: Day[] }) {
  const offset = days.length ? new Date(`${days[0][0]}T00:00:00Z`).getUTCDay() : 0;
  const contributions = days.reduce((total, [, , count]) => total + count, 0);
  return (
    <div className="calendar">
      <div className="panel-heading">
        <h3>Contribution calendar</h3>
        <span className="label"><strong data-counter={contributions}>{contributions}</strong> contributions</span>
      </div>
      <div className="calendar-scroll" tabIndex={0} role="region" aria-label="Scrollable contribution calendar" data-lenis-prevent>
        <div className="calendar-grid" style={{ gridTemplateColumns: `repeat(${Math.ceil((days.length + offset) / 7)}, minmax(7px, 1fr))` }}>
          {days.map(([date, level, count], i) => {
            const column = Math.floor((i + offset) / 7) + 1;
            const day = new Date(`${date}T00:00:00Z`);
            const showMonth = day.getUTCDate() === 1 && column > 2;
            return (
              <Fragment key={date}>
                {showMonth && <span className="calendar-month" style={{ gridColumn: column, gridRow: 1 }} aria-hidden="true">{day.toLocaleDateString("en", { month: "short", timeZone: "UTC" })}</span>}
                <div className="calendar-cell-wrap" style={{ gridColumn: column, gridRow: (i + offset) % 7 + 2 }}>
                  <span className="calendar-cell" data-level={level} title={`${dateLabel(date)}: ${count} ${count === 1 ? "contribution" : "contributions"}`} />
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
      <div className="calendar-footer"><span>Past year · GitHub</span><span className="legend">Less {[0, 1, 2, 3, 4].map((level) => <i key={level} data-level={level} />)} More</span></div>
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
