"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import dynamic from "next/dynamic";
import { Check, Command, Copy, FolderGit2, GitBranch, Moon, Search, Sun, X } from "lucide-react";
import { archiveDescriptions, person, projects, sections, skillGroups } from "@/lib/content";
import type { Repo } from "@/lib/github";

const commands = [
  ...sections.map((section) => ({ name: section.label, href: `#${section.id}` })),
  ...projects.map((project) => ({ name: project.name, href: `#${project.id}` })),
  { name: "GitHub profile", href: person.github },
  { name: "Email Praw", href: `mailto:${person.email}` },
];
const SkillMotion = dynamic(() => import("./skill-motion"), { ssr: false });

export function Controls() {
  const [light, setLight] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const commandList = commands.filter(({ name }) => name.toLowerCase().includes(query.trim().toLowerCase()));

  function openPalette() {
    if (!dialog.current || dialog.current.open) return;
    opener.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActive(0);
    dialog.current.showModal();
    input.current?.focus();
  }

  useEffect(() => {
    setLight(document.documentElement.dataset.theme === "light");
    function shortcut(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openPalette();
      }
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  function toggleTheme() {
    const next = !light;
    document.documentElement.dataset.theme = next ? "light" : "dark";
    setLight(next);
    try { localStorage.setItem("praw-theme", next ? "light" : "dark"); } catch {}
  }

  function onKeyboard(event: KeyboardEvent<HTMLInputElement>) {
    if (!commandList.length) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      const next = (active + delta + commandList.length) % commandList.length;
      setActive(next);
      document.getElementById(`command-${next}`)?.scrollIntoView({ block: "nearest" });
    }
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById(`command-${active}`)?.click();
    }
  }

  return (
    <>
      <header className="site-header">
        <nav className="nav-shell" aria-label="Main navigation">
          <a className="wordmark" href="#top" aria-label="Praw, home">praw<span>.</span></a>
          <div className="nav-links">
            <a href="#about">About</a><a href="#work">Work</a><a href="#stack">Stack</a><a href="#contact">Contact</a>
          </div>
          <div className="nav-actions">
            <button className="icon-button palette-trigger" type="button" onClick={openPalette} aria-label="Open command palette" aria-keyshortcuts="Control+k Meta+k" title="Command palette">
              <Search size={17} /><kbd><Command size={12} /> K</kbd>
            </button>
            <button className="icon-button" type="button" aria-pressed={light} aria-label="Light theme" title="Toggle light theme" onClick={toggleTheme}>
              <Sun className="sun-icon" size={18} /><Moon className="moon-icon" size={18} />
            </button>
          </div>
        </nav>
      </header>
      <dialog ref={dialog} className="palette" aria-labelledby="palette-title" onClose={() => opener.current?.focus({ preventScroll: true })} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="palette-inner">
          <h2 id="palette-title" className="sr-only">Command palette</h2>
          <div className="palette-input">
            <Search size={19} aria-hidden="true" />
            <input ref={input} aria-label="Search destinations" placeholder="Go to a section or project…" value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} onKeyDown={onKeyboard} />
            <button className="icon-button" aria-label="Close command palette" onClick={() => dialog.current?.close()}><X size={18} /></button>
          </div>
          <ul className="palette-results" data-lenis-prevent>
            {commandList.map((command, index) => (
              <li key={command.href}>
                <a id={`command-${index}`} className={index === active ? "active" : ""} href={command.href} onClick={() => {
                  if (!command.href.startsWith("#")) {
                    dialog.current?.close();
                    return;
                  }
                  opener.current = null;
                  dialog.current?.close();
                  const target = document.getElementById(command.href.slice(1));
                  if (target) {
                    target.tabIndex = -1;
                    target.focus({ preventScroll: true });
                  }
                }}>{command.name}</a>
              </li>
            ))}
          </ul>
          {commandList.length === 0 && <p className="palette-empty" role="status">No matching destinations.</p>}
          <div className="palette-hint"><span>↑ ↓ Navigate</span><span>Enter to open</span><span>Esc to close</span></div>
        </div>
      </dialog>
    </>
  );
}

export function SkillExplorer() {
  const [selection, setSelected] = useState<number | null>(null);
  const selected = selection ?? 0;
  const panel = useRef<HTMLDivElement>(null);
  const group = skillGroups[selected];
  return (
    <div className="skill-explorer">
      <div className="skill-tabs" role="tablist" aria-label="Skill categories" aria-orientation="vertical">
        {skillGroups.map(({ name }, index) => (
          <button key={name} id={`skill-${index}`} role="tab" type="button" aria-selected={selected === index} aria-controls="skill-panel" tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={(event) => {
            const next = { ArrowDown: (index + 1) % skillGroups.length, ArrowUp: (index + skillGroups.length - 1) % skillGroups.length, Home: 0, End: skillGroups.length - 1 }[event.key];
            if (next === undefined) return;
            event.preventDefault();
            setSelected(next);
            document.getElementById(`skill-${next}`)?.focus();
          }}>{name}</button>
        ))}
      </div>
      <div id="skill-panel" className="skill-panel" role="tabpanel" aria-labelledby={`skill-${selected}`} tabIndex={0}>
        <div ref={panel}>
          <h3>{group.name}</h3><p className="muted">{group.intro}</p>
          <ul className="skill-chips">{group.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
          <a className="text-link" href={`${person.github}/${group.repo}`}><GitBranch size={16} /> See it in code</a>
        </div>
        {selection !== null && <SkillMotion panel={panel} selected={selected} />}
      </div>
    </div>
  );
}

export function RepositoryArchive({ repos }: { repos: Repo[] }) {
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [topic, setTopic] = useState("");
  const languages = [...new Set(repos.flatMap((repo) => repo.language ?? []))].sort();
  const topics = [...new Set(repos.flatMap((repo) => repo.topics))].sort();
  const filtered = repos.filter((repo) =>
    (!language || repo.language === language) &&
    (!topic || repo.topics.includes(topic)) &&
    [repo.name, archiveDescriptions[repo.name], repo.description, repo.language, ...repo.topics]
      .some((value) => value?.toLowerCase().includes(search.trim().toLowerCase())),
  ).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <>
      <div className="archive-controls">
        <label className="archive-search"><Search size={18} aria-hidden="true" /><input aria-label="Search repositories" placeholder="Search repositories" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        <select aria-label="Filter by language" value={language} onChange={(event) => setLanguage(event.target.value)}>
          <option value="">All languages</option>
          {languages.map((name) => <option key={name}>{name}</option>)}
        </select>
        {topics.length > 0 && <select aria-label="Filter by topic" value={topic} onChange={(event) => setTopic(event.target.value)}>
          <option value="">All topics</option>
          {topics.map((name) => <option key={name}>{name}</option>)}
        </select>}
      </div>
      <p className="archive-count" role="status">{filtered.length} {filtered.length === 1 ? "repository" : "repositories"}</p>
      <ul className="archive-grid">
        {filtered.map((repo) => (
          <li key={repo.name}>
            <a href={repo.url} className="archive-card">
              <div><FolderGit2 size={17} aria-hidden="true" /><h3>{repo.name}</h3></div>
              <p>{archiveDescriptions[repo.name] ?? repo.description ?? "Public GitHub repository."}</p>
              {repo.language && <span>{repo.language}</span>}
            </a>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && <p className="muted">No repositories match your search.</p>}
    </>
  );
}

export function CopyEmail() {
  const [message, setMessage] = useState("");
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(person.email);
      setMessage("Email copied");
    } catch {
      setMessage("Copy unavailable. Select the email address to copy it.");
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(""), 4500);
  }

  return (
    <div className="copy-wrap">
      <button className="button secondary copy" type="button" onClick={copy}>{message === "Email copied" ? <Check size={16} /> : <Copy size={16} />} {message === "Email copied" ? "Copied" : "Copy email"}</button>
      <span className="copy-status" role="status">{message}</span>
    </div>
  );
}
