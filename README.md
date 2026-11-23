# Praw · Personal portfolio

Pratyush Halwai’s portfolio, built with Next.js App Router, TypeScript, Tailwind CSS, GSAP ScrollTrigger, Lenis, and Motion.

## Run locally

Use Node.js 22 or newer. From this directory:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. To run the production build:

```bash
npm run typecheck
npm run build
npm start
```

## Environment

Copy `.env.example` to `.env.local` to configure optional settings.

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Production origin, such as your custom domain with `https://`. Sets the canonical URL, sitemap, share images, and Person schema. Defaults to the Vercel production URL when available, then localhost. |
| `GITHUB_TOKEN` | Optional server-side GitHub token for higher REST API rate limits. Requests use public data. |

## Deploy on Vercel

1. Push the repository to a Git provider and import it as a Vercel project.
2. Use the **Next.js** framework preset and Node.js 22 or newer.
3. Set `SITE_URL` to the production origin if using a custom domain. Add `GITHUB_TOKEN` if the unauthenticated API limit becomes an issue.
4. Deploy and check the home page, `/robots.txt`, `/sitemap.xml`, and the social preview. [Vercel’s Next.js deployment guide](https://vercel.com/docs/frameworks/full-stack/nextjs).

## Update content

- Edit `lib/content.ts` for the featured projects, skills, timeline, social links, and archive descriptions. Add a project’s verified public URL as `demoUrl` to show its Live demo button.
- Edit `components/project-art.tsx` and `public/media` for new project imagery. Agent, Insurance, and Chess have labeled illustrations. Glasswave includes an alternate-style study and the original local capture.
- The home page prerenders with public GitHub repository data, language bytes, events, and contribution counts. Next.js revalidates after 24 hours on traffic. If a request fails or the calendar markup changes, the affected data falls back to `lib/github-snapshot.json` and the activity section displays the snapshot date.
- Replace the desktop and mobile hero crops, About portrait, and generated social card together when updating the portrait. Theme and layout tokens are in `app/globals.css`.

The [research brief](docs/research.md) records project selection, source findings, and gaps. The [design notes](docs/design.md) document the visual direction.
