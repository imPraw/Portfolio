import Image, { getImageProps } from "next/image";
import { AudioLines, Blocks, Code2, Cpu, Globe, Mail, Star, Terminal } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";
import { Activity } from "@/components/activity";
import { ProjectArt } from "@/components/project-art";
import { Controls, CopyEmail, EmailLink, RepositoryArchive, SkillExplorer } from "@/components/interactive";
import { MotionLoader } from "@/components/motion-loader";
import { education, experience, person, projects } from "@/lib/content";
import { getGitHubData } from "@/lib/github";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 86400;

const indexIcons = { agent: Cpu, insurance: Blocks, glass: AudioLines, chess: Code2 };
const heroImage = {
  alt: "Portrait of Praw overlooking a futuristic skyline during an eclipse",
  fill: true,
  quality: 80,
  fetchPriority: "high",
  loading: "eager",
} as const;
const { props: heroDesktop } = getImageProps({ ...heroImage, src: "/media/eclipse.webp", sizes: "(max-width: 850px) 155vw, 100vw" });
const mobileHeroSizes = "(max-width: 400px) 430px, 520px";

function BackgroundSection({ id, title, entries }: { id: string; title: string; entries: typeof experience }) {
  const heading = `${id}-title`;
  return (
    <section className="section shell background-section" id={id} aria-labelledby={heading}>
      <div className="section-head" data-reveal><h2 id={heading}>{title}</h2></div>
      <ol className="timeline">
        {entries.map((item) => (
          <li key={item.name}>
            <span className="label">{item.date}</span>
            <div><h3>{item.name}</h3><p>{item.role}</p><p className="muted">{item.description}</p></div>
          </li>
        ))}
      </ol>
    </section>
  );
}

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
          <picture className="hero-visual">
            <source media="(max-width: 640px)" type="image/avif" srcSet="/media/eclipse-mobile-small.avif 560w, /media/eclipse-mobile.avif 840w" sizes={mobileHeroSizes} />
            <source media="(max-width: 640px)" type="image/webp" srcSet="/media/eclipse-mobile-small.webp 560w, /media/eclipse-mobile.webp 840w" sizes={mobileHeroSizes} />
            <img {...heroDesktop} decoding="sync" />
          </picture>
          <div className="hero-shade" />
          <div className="shell hero-shell">
            <div className="hero-mast"><span>Personal portfolio</span><span><Globe size={14} aria-hidden="true" /> Kathmandu, Nepal</span></div>
            <div className="hero-copy">
              <p className="hero-eyebrow hero-enter">Computer science student</p>
              <h1 id="hero-title"><span className="hero-enter">Pratyush</span><em className="hero-enter hero-accent">Halwai.</em></h1>
              <p className="hero-intro hero-enter">I go by Praw. I build tools for everyday tasks, from sorting an inbox to playing a favorite track.</p>
              <div className="hero-actions hero-enter">
                <a className="button primary" href="#work">Explore my work</a>
                <a className="button hero-secondary" href={person.github}><FaGithub size={17} aria-hidden="true" /> GitHub</a>
              </div>
            </div>
            <nav className="project-index" aria-label="Featured project shortcuts">
              {projects.map((project) => {
                const Icon = indexIcons[project.id];
                return <a key={project.id} href={`#${project.id}`}><Icon size={21} strokeWidth={1.5} aria-hidden="true" /><span>{project.name}</span></a>;
              })}
            </nav>
          </div>
        </section>

        <section className="section shell work" id="work" aria-labelledby="work-title">
          <div className="section-head" data-reveal>
            <h2 id="work-title">Selected work.</h2>
            <a className="text-link archive-jump" href="#more">Browse repository archive</a>
          </div>
          {projects.map((project) => {
            const repo = data.repos.find(({ name }) => name === project.repo);
            const url = repo?.url ?? `${person.github}/${project.repo}`;
            return (
              <article className="project" id={project.id} key={project.id}>
                <div className="project-detail">
                  <p className="label">{project.discipline}</p>
                  <h3>{project.name}</h3>
                  <p className="muted">{project.problem}</p>
                  <p className="muted">{project.solution}</p>
                  <ul className="chips" aria-label="Technologies">{project.stack.map((tech) => <li key={tech}>{tech}</li>)}</ul>
                  <div className="project-actions">
                    {project.demoUrl && <a className="button primary" href={project.demoUrl}><Globe size={16} /> Live demo</a>}
                    <a className="button secondary" href={url}><FaGithub size={16} aria-hidden="true" /> View repository</a>
                    {!!repo?.stars && <span className="repo-stat"><Star size={14} /> {repo.stars} {repo.stars === 1 ? "star" : "stars"}</span>}
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

        <section className="section shell about" id="about" aria-labelledby="about-title">
          <div className="about-copy">
            <p className="label">Behind the work</p>
            <h2 id="about-title" data-reveal>A little about me.</h2>
            <p className="about-story">
              I like taking a repetitive task or a messy process and figuring out what a little software could make simpler.
            </p>
            <p className="muted">Lately, that has meant writing Python automation, building C# applications, and paying close attention to how the browser interfaces I make feel to use.</p>
          </div>
          <figure className="about-portrait">
            <div><Image src="/media/portrait.webp" alt="A closer view of Praw in the eclipse portrait" width={750} height={941} sizes="(max-width: 760px) 80vw, 365px" /></div>
            <figcaption>Pratyush Halwai <span>@imPraw</span></figcaption>
          </figure>
        </section>

        <section className="section shell" id="stack" aria-labelledby="stack-title">
          <div className="section-head" data-reveal><p className="label">Tools & languages</p><h2 id="stack-title">What I work with.</h2></div>
          <SkillExplorer />
        </section>

        <Activity data={data} />

        <BackgroundSection id="experience" title="Experience." entries={experience} />
        <BackgroundSection id="education" title="Education." entries={education} />

        <section className="section shell" id="more" aria-labelledby="archive-title">
          <div className="section-head" data-reveal><p className="label">Repository archive</p><h2 id="archive-title">More work.</h2></div>
          <RepositoryArchive repos={data.repos.filter(({ name }) => !selected.has(name))} />
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-title">
          <div className="shell contact-inner">
            <p className="label"><Mail size={16} /> Get in touch</p>
            <h2 id="contact-title" data-reveal>Let’s build<br />something.</h2>
            <p>Have a project in mind or something interesting to share? I’d like to hear from you.</p>
            <div className="contact-actions"><EmailLink /><CopyEmail /></div>
            <div className="socials">
              <a href={person.github}><FaGithub size={17} aria-hidden="true" /> GitHub</a>
              <a href={person.linkedin}><FaLinkedin size={17} aria-hidden="true" /> LinkedIn</a>
              <a href={person.instagram}><FaInstagram size={17} aria-hidden="true" /> Instagram</a>
            </div>
          </div>
        </section>
      </main>
      <footer className="shell site-footer"><a href="#top" className="wordmark" aria-label="Praw, back to top">praw<span>.</span></a><span>Designed and built by me.</span><a className="text-link" href="#top">Back to top</a></footer>
    </>
  );
}
