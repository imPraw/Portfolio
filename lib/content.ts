export const person = {
  name: "Pratyush Halwai",
  brand: "Praw",
  description: "Computer science student building practical automation and thoughtfully designed software.",
  email: "pratyushalwai@gmail.com",
  github: "https://github.com/imPraw",
  linkedin: "https://www.linkedin.com/in/pratyush-halwai-b3a3a2321/",
  instagram: "https://www.instagram.com/pratyushalwai/",
};

export const sections = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "activity", label: "Activity" },
  { id: "timeline", label: "Timeline" },
  { id: "more", label: "More work" },
  { id: "contact", label: "Contact" },
];

export const projects = [
  {
    id: "agent",
    repo: "praw-s-agent",
    name: "Praw’s Agent",
    discipline: "AI & automation",
    headline: "A calmer inbox.",
    problem: "Routine emails take time to sort, especially when a straightforward reply is all they need.",
    solution: "A Python workflow separates instructions from execution and uses rules and confidence scores to classify email before deciding how to respond.",
    stack: ["Python", "Gmail API", "DOE"],
    file: "execution/classify_and_reply.py",
    snippet: "def score_rules(subject, body):\n    text = f\"{subject}\\n{body}\".lower()\n    cleaned = re.sub(r\"\\s+\", \" \", text).strip()",
  },
  {
    id: "insurance",
    repo: "InsuranceManagementApp",
    name: "Insurance Management App",
    discipline: "Full-stack web",
    headline: "From policy to claim.",
    problem: "Policies and claims need a shared view, with access scoped to the person using it.",
    solution: "An ASP.NET Core application connects a Razor dashboard to role-aware claim endpoints and SQLite-backed records through Entity Framework Core.",
    stack: ["C#", "ASP.NET Core", "Razor", "EF Core", "SQLite"],
    file: "Controllers/ClaimsApiController.cs",
    snippet: "var query = _context.Claims\n    .Include(c => c.InsurancePolicy)\n    .Include(c => c.User)\n    .AsQueryable();",
  },
  {
    id: "glass",
    repo: "Glasswave",
    name: "Glasswave",
    discipline: "Web interface",
    headline: "Music, in focus.",
    problem: "Give a small playlist a dedicated interface with room for artwork and familiar controls.",
    solution: "An HTML audio player pairs glass styling and animated artwork with custom seek, skip, loop, and shuffle controls in vanilla JavaScript.",
    stack: ["JavaScript", "HTML", "CSS", "HTML Audio"],
    file: "index.js",
    snippet: "audio.addEventListener('timeupdate',()=> {\n    const progress = (audio.currentTime/audio.duration)*100\n    progress_slider.value = progress || 0;\n})",
  },
  {
    id: "chess",
    repo: "python-project",
    name: "Python Chess Prototype",
    discipline: "Programming fundamentals",
    headline: "An eight-by-eight experiment.",
    problem: "How do you turn a coordinate like e2 into a move on a text-based board?",
    solution: "A command-line prototype maps algebraic coordinates to an 8×8 list, alternates turns, and checks movement for kings and pawns.",
    stack: ["Python", "Command line"],
    file: "chess.py",
    snippet: "def pos_to_index(pos):\n    col = ord(pos[0]) - ord('a')\n    row = 8 - int(pos[1])\n    return row, col",
  },
] as const;

export type Project = (typeof projects)[number];

export const skillGroups = [
  {
    name: "Automation",
    intro: "Rules, integrations, and repeatable workflows.",
    skills: ["Python", "Gmail API", "DOE"],
    repo: projects[0].repo,
  },
  {
    name: "Application development",
    intro: "Web applications backed by relational data.",
    skills: ["C#", "ASP.NET Core", "Razor", "Entity Framework Core", "SQLite"],
    repo: projects[1].repo,
  },
  {
    name: "Web interfaces",
    intro: "Browser-native interfaces, styling, and media controls.",
    skills: ["JavaScript", "HTML", "CSS", "HTML Audio"],
    repo: projects[2].repo,
  },
  {
    name: "Computer science",
    intro: "Algorithms and exercises in core programming languages.",
    skills: ["C++", "C#", "Python", "Jupyter Notebook"],
    repo: "DCS403-AssignmentsBN240217",
  },
];

export const archiveDescriptions: Record<string, string> = {
  "C--Assignments": "C# coursework and console exercises.",
  "C-SimpleBankingSystem": "Console banking simulation written in C#.",
  CPP_Assignment: "C++ coursework and programming exercises.",
  "DCS403-AssignmentsBN240217": "Weekly C++ assignments and algorithm exercises.",
  Portfolio: "Earlier personal portfolio built in HTML, CSS, and JavaScript.",
  PraroraPortfolioSite: "Portfolio site for Prarora Koirala.",
  pratyush_python_assignment: "Python coursework in Jupyter notebooks.",
  "Web-Development": "Coursework in browser-based web development.",
};

export const timeline = [
  { date: "Dec 2024 – Feb 2025", name: "Prixa Technologies", role: "Business Development Intern", description: "Researched markets, qualified leads, and worked with sales and technical teams on demos and client communication." },
  { date: "2024 – Present", name: "King’s College, Babarmahal", role: "Bachelor of Science in Computer Science", description: "Computer science studies in Kathmandu, Nepal." },
];
