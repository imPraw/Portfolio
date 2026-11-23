import Image, { getImageProps } from "next/image";
import { ArrowDown, ArrowUp, BriefcaseBusiness, Camera, GitBranch, Globe, GraduationCap, Mail, Star, Terminal } from "lucide-react";
import { Activity } from "@/components/activity";
import { ProjectArt } from "@/components/project-art";
import { Controls, CopyEmail, RepositoryArchive, SkillExplorer } from "@/components/interactive";
import { MotionLoader } from "@/components/motion-loader";
import { person, projects, timeline } from "@/lib/content";
import { getGitHubData } from "@/lib/github";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 86400;

const about = "I’m Pratyush Halwai, a computer science student in Nepal. I like taking a repetitive task or a messy process and figuring out what a little software could make simpler.";
const heroImage = {
  alt: "Portrait of Praw overlooking a futuristic skyline during an eclipse",
  fill: true,
  quality: 80,
  fetchPriority: "high",
  loading: "eager",
} as const;
const { props: heroDesktop } = getImageProps({ ...heroImage, src: "/media/eclipse.webp", sizes: "(max-width: 850px) 155vw, 100vw" });
const mobileHeroSizes = "(max-width: 400px) 430px, 520px";

export default async function Home() {
  const data = await getGitHubData();
  const selected = new Set<string>(projects.map((project) => project.repo));
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    alternateName: person.brand,
    url: getSiteUrl().href,
    image: new URL("/media/portrait.webp", getSiteUrl()).href,
    description: person.description,
    sameAs: [person.github, person.linkedin, person.instagram],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <a className="skip-link" href="#main">Skip to content</a>
      <Controls />
      <MotionLoader />
      <main id="main">
        <section id="top" className="hero" aria-labelledby="hero-title">
          <picture className="hero-visual" data-hero-art>
            <source media="(max-width: 640px)" type="image/avif" srcSet="/media/eclipse-mobile-small.avif 560w, /media/eclipse-mobile.avif 840w" sizes={mobileHeroSizes} />
            <source media="(max-width: 640px)" type="image/webp" srcSet="/media/eclipse-mobile-small.webp 560w, /media/eclipse-mobile.webp 840w" sizes={mobileHeroSizes} />
            <img {...heroDesktop} decoding="sync" />
          </picture>
          <div className="hero-shade" />
          <div className="shell hero-shell">
            <div className="hero-copy">
              <p className="hero-eyebrow hero-enter"><i /> PRATYUSH HALWAI <span> / </span> NEPAL</p>
              <h1 id="hero-title"><span className="hero-enter">Built with</span><span className="hero-enter hero-accent">curiosity.</span></h1>
              <p className="hero-intro hero-enter">I’m Praw, a computer science student building practical automation and thoughtfully designed software.</p>
              <div className="hero-actions hero-enter">
                <a className="button primary" data-magnetic href="#work">Explore my work <ArrowDown size={16} aria-hidden="true" /></a>
                <a className="button hero-secondary" href={person.github}><GitBranch size={17} aria-hidden="true" /> GitHub</a>
              </div>
            </div>
            <a className="hero-scroll" href="#about"><ArrowDown size={16} aria-hidden="true" /> Scroll to explore</a>
            <span className="hero-terminal" aria-hidden="true"><Terminal size={15} /> whoami <i /></span>
          </div>
        </section>

        <section className="section shell about" id="about" aria-labelledby="about-title">
          <div className="about-copy">
            <p className="label">About me</p>
            <h2 id="about-title" data-reveal>Curious by default.</h2>
            <p className="about-story">
              <span className="sr-only">{about}</span>
              <span data-word-story aria-hidden="true">{about.split(" ").map((word, i) => <span key={i}>{word} </span>)}</span>
            </p>
            <p className="muted">Lately, that has meant writing Python automation, building C# applications, and paying close attention to how the browser interfaces I make feel to use.</p>
          </div>
          <figure className="about-portrait">
            <div><Image src="/media/portrait.webp" alt="A closer view of Praw in the eclipse portrait" width={750} height={941} sizes="(max-width: 760px) 80vw, 365px" data-portrait /></div>
            <figcaption>Pratyush Halwai <span>@imPraw</span></figcaption>
          </figure>
        </section>

        <section className="section shell work" id="work" aria-labelledby="work-title">
          <div className="section-head" data-reveal>
            <p className="label">Selected work</p>
            <h2 id="work-title">Things I’ve built.</h2>
          </div>
          {projects.map((project) => {
            const repo = data.repos.find(({ name }) => name === project.repo);
            const url = repo?.url ?? `${person.github}/${project.repo}`;
            return (
              <article className="project" id={project.id} key={project.id}>
                <div className="project-detail">
                  <p className="label">{project.discipline}</p>
                  <h3>{project.headline}</h3>
                  <p className="project-name">{project.name}</p>
                  <p className="muted">{project.problem}</p>
                  <p className="muted">{project.solution}</p>
                  <ul className="chips" aria-label="Technologies">{project.stack.map((tech) => <li key={tech}>{tech}</li>)}</ul>
                  <div className="project-actions">
                    {project.demoUrl && <a className="button primary" href={project.demoUrl}><Globe size={16} /> Live demo</a>}
                    <a className="button secondary" href={url}><GitBranch size={16} /> GitHub</a>
                    {repo && <span className="repo-stat"><Star size={14} /> {repo.stars} {repo.stars === 1 ? "star" : "stars"}{repo.language && ` · ${repo.language}`}</span>}
                  </div>
                  <details className="source">
                    <summary><Terminal size={15} /> View source excerpt</summary>
                    <p className="source-path">{project.file}</p>
                    <pre tabIndex={0} aria-label="Source code"><code>{project.snippet}</code></pre>
                  </details>
                </div>
                <div className="project-sticky"><ProjectArt project={project} /></div>
              </article>
            );
          })}
        </section>

        <section className="section shell" id="stack" aria-labelledby="stack-title">
          <div className="section-head" data-reveal><p className="label">Tools & languages</p><h2 id="stack-title">What I work with.</h2></div>
          <SkillExplorer />
        </section>

        <Activity data={data} />

        <section className="section shell" id="timeline" aria-labelledby="timeline-title">
          <div className="section-head" data-reveal><p className="label"><GraduationCap size={16} /> Experience & education</p><h2 id="timeline-title">Where I’ve learned.</h2></div>
          <ol className="timeline">
            {timeline.map((item) => (
              <li key={item.name}><span className="label">{item.date}</span><div><h3>{item.name}</h3><p>{item.role}</p><p className="muted">{item.description}</p></div></li>
            ))}
          </ol>
        </section>

        <section className="section shell" id="more" aria-labelledby="archive-title">
          <div className="section-head" data-reveal><p className="label">Repository archive</p><h2 id="archive-title">More work.</h2></div>
          <RepositoryArchive repos={data.repos.filter(({ name }) => !selected.has(name))} />
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-title">
          <div className="shell contact-inner">
            <p className="label"><Mail size={16} /> Get in touch</p>
            <h2 id="contact-title" data-reveal>Let’s build<br />something.</h2>
            <p>Have a project in mind or something interesting to share? I’d like to hear from you.</p>
            <div className="contact-actions"><a className="button primary" data-magnetic href={`mailto:${person.email}`}>{person.email}</a><CopyEmail /></div>
            <div className="socials"><a href={person.github}><GitBranch size={17} /> GitHub</a><a href={person.linkedin}><BriefcaseBusiness size={17} /> LinkedIn</a><a href={person.instagram}><Camera size={17} /> Instagram</a></div>
          </div>
        </section>
      </main>
      <footer className="shell site-footer"><a href="#top" className="wordmark" aria-label="Praw, back to top">praw<span>.</span></a><span>Designed and built by me.</span><a className="text-link" href="#top">Back to top <ArrowUp size={15} aria-hidden="true" /></a></footer>
    </>
  );
}
