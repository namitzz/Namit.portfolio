// All static content lives here so copy can be edited without touching components.
//
// TODO (CV): drop the PDF at `public/Namit_Singh_Sarna_CV.pdf`, then set
// `profile.links.cv` to '/Namit_Singh_Sarna_CV.pdf'. Until that file is in
// place, `cv` stays `null` and the Hero hides the download button.

export const profile = {
  name: 'Namit Singh Sarna',
  shortName: 'Namit',
  role: 'Final-year BSc Computer Science · University of Leicester',
  // Replace with your preferred contact address.
  email: 'namitmec@gmail.com',
  links: {
    github: 'https://github.com/namitzz',
    linkedin: 'https://www.linkedin.com/in/namit-singh-sarna-55a021323',
    cv: '/Namit_Singh_Sarna_CV.pdf',
  },
  headline:
    'I build practical AI and software systems that help people learn, decide, and work better.',
  subheadline:
    'Final-year Computer Science student at the University of Leicester, focused on source-grounded RAG, AI integration, backend systems, and full-stack software, with a strong interest in education technology and trustworthy learning tools.',
  positioning:
    'Main direction: practical AI and software systems, with a strong education-tech angle.',
  highlights: [
    'Expecting First Class.',
    'Built UniWise, a source-grounded RAG academic assistant with a pluggable LLM backend.',
    'Shipped Cloud Seven Realty, a live property platform for a paying client.',
    'Contributor to ClassFutures guidance on responsible Generative AI use in studies.',
  ],
  about: [
    "I'm Namit, a final-year Computer Science student at the University of Leicester, graduating in July 2026.",
    'I build practical systems across AI, backend development, data, and user-facing software. My strongest direction is AI for learning and trustworthy knowledge, but I also enjoy building full-stack and backend systems that solve real problems.',
    'UniWise is the clearest example of the work I want to do more of: a source-grounded RAG assistant that answers from course material, shows evidence, and refuses when the support is weak.',
  ],
}

export const projects = [
  {
    id: 'uniwise',
    themeKey: 'uniwise',
    index: '01',
    title: 'UniWise',
    tagline:
      'A source-grounded RAG study assistant. Dissertation project.',
    problem:
      'University students rely on lecture material that is fragmented across PDFs, slides, and notes. General-purpose LLMs can answer confidently from training data, even when the answer is not based on what the lecturer taught, which can make it harder for students to judge whether an answer is actually grounded in their module material.',
    solution:
      'UniWise restricts answers to lecture-only context. Relevant chunks are retrieved from the course corpus, reranked, and shown with source evidence. Below a confidence threshold the assistant refuses to answer instead of hallucinating, and points the student back to supported material or appropriate academic support.',
    stack: [
      'FastAPI',
      'Streamlit',
      'ChromaDB',
      'sentence-transformers',
      'Cross-encoder reranking',
      'OpenAI / Ollama adapter',
      'Pydantic',
    ],
    features: [
      'Ingestion for PDF, DOCX, PPTX, TXT, MD with chunk-level metadata.',
      'Dense vector retrieval with cross-encoder reranking for citation precision.',
      'Refusal thresholds and confidence indicators to reduce hallucinations.',
      'Source citations showing file, page, and chunk-level metadata.',
      'Telemetry and analytics for module-level question patterns.',
      'Pluggable LLM backend with OpenAI and Ollama adapters.',
    ],
    impact:
      'Retrieval was the part I expected to be hard. It was not. The harder problem was how to handle "I do not know." A refusal that looks like the system breaking ruins the trust the citations are meant to build. Getting that one detail right took longer than the rest of the pipeline.',
    cta: {
      caseStudy: null,
      github: null,
      demo: null,
    },
  },
  {
    id: 'vision',
    themeKey: 'vision',
    index: '02',
    title: 'Posture AI',
    status: 'Prototype · In development',
    tagline:
      'An AI-assisted computer vision prototype, currently in development, exploring gym form feedback, rep tracking, and coaching summaries.',
    problem:
      'Form mistakes in the gym can increase injury risk and slow progress, but personal trainers are expensive and most form-check apps are static, post-hoc, or vague. Getting live, specific feedback during a set is still difficult without a coach watching.',
    solution:
      'A modular MediaPipe-based pose pipeline that tracks squat depth, knee tracking, and torso angle in real time, counts reps, scores form against reference landmarks, and produces a short LLM-generated coaching summary at the end of a set.',
    stack: [
      'Python',
      'OpenCV',
      'MediaPipe',
      'NumPy',
      'Pose landmark math',
      'Audio cues',
      'LLM summary',
    ],
    features: [
      'Live pose landmark tracking with per-joint confidence.',
      'Squat depth, knee tracking, and torso-angle scoring against a reference skeleton.',
      'Rep counting with state-machine logic for clean reps vs. partials.',
      'Form-feedback overlay and audio cues during the set.',
      'Frame-skipping and per-stage budgets to keep the pipeline at interactive FPS.',
      'End-of-set AI coaching summary describing what to fix next.',
    ],
    impact:
      'Working on this taught me a lot about how real-time vision prototypes are actually put together. Pose tracking is the easy part to demo. Getting frame budgets, feedback timing, and overlay state to behave is where the real work lives. It also pushed me to be more careful about reviewing AI-assisted code, since shipping something a model wrote without reading it line by line is a fast way to introduce bugs you cannot explain later.',
    cta: {
      caseStudy: null,
      // Repo is private for now. To make public later, set:
      //   github: 'https://github.com/namitzz/posture',
      // and remove the `githubPrivate` field below.
      github: null,
      githubPrivate: {
        reason:
          'Repository is private for now while the prototype is being cleaned up. Happy to share access or walk through the code on request.',
      },
      demo: null,
    },
  },
  {
    id: 'cloud',
    themeKey: 'cloud',
    index: '03',
    title: 'Cloud Seven Realty',
    tagline:
      'A frontend and brand website for a Srinagar-based real estate brand, powered by Google Sheets and Drive so listings can be updated without redeploying.',
    problem:
      'The business needed an online presence that showed its local knowledge, verified-title focus, and on-ground support. Generic listing templates would have flattened the things that make the business trustworthy, and the team needed to update listings themselves without touching code.',
    solution:
      'A calm, premium site built around three signals buyers care about: verified titles, local presence, and curated listings. Properties, project pages, and images live in Google Sheets and Google Drive, fetched via API and revalidated on a short ISR cache so the team can update listings without a deploy.',
    stack: [
      'Next.js 15',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'Google Sheets API',
      'Google Drive API',
      'ISR / 5-minute cache',
      'Responsive design',
    ],
    features: [
      'Hero framed around the brand promise: verified titles and on-ground support.',
      'Featured listings sourced live from a Google Sheet, no redeploy needed.',
      'Property images pulled from a connected Google Drive folder.',
      'Trust strip dedicated to local credibility, not generic certifications.',
      'Property pages structured by area and listing type (Rent, Buy, Land).',
      'Fully responsive, since most traffic for this market is on mobile.',
    ],
    impact:
      'I went in thinking this was a frontend job and came out understanding it was a client job. Most of the decisions had nothing to do with code. They were about how a non-technical team would actually keep the site alive, who buyers trust in this market, and what could be safely changed in a spreadsheet without a deploy. The code was the easy half.',
    cta: {
      caseStudy: null,
      // Repository is private, so the GitHub button is omitted.
      github: null,
      demo: 'https://www.cloudsevenrealty.com/',
    },
  },
  {
    id: 'crime',
    themeKey: 'crime',
    index: '04',
    title: 'Crime Prediction Dashboard',
    tagline:
      'Coursework project on Metropolitan Police records, with modelling and clustering at the LSOA level.',
    problem:
      'Raw police open data is large, messy, and area-imbalanced. Basic dashboards can show counts, but they often miss the cleaning, modelling, and evaluation work needed to understand patterns properly.',
    solution:
      'Cleaned and aggregated around 1M+ Met Police records into LSOA-month panels, trained regression models to predict volume, and used K-Means to surface area profiles that group neighbourhoods by crime shape rather than postcode.',
    stack: ['Python', 'Pandas', 'scikit-learn', 'NumPy', 'Matplotlib', 'Jupyter'],
    features: [
      'Pipeline for ~1M+ Met Police records into LSOA-month panels.',
      'Linear Regression, Decision Tree (with overfit diagnostics), and Random Forest predictors.',
      'K-Means clustering for area-profile segmentation (K=4 selected via elbow and silhouette).',
      'Evaluation with R², RMSE, MAE, and 10-fold cross-validation.',
      'Cluster diagnostics: silhouette score, inertia elbow.',
      'Stylised dashboard view of KPIs, trends, heatmap, and model performance.',
    ],
    impact:
      'Most of the lessons here happened before the modelling even started. The data was uneven, the area sizes were not comparable, and the categories did not line up cleanly across years. By the time I was tuning models I had already made the decisions that actually mattered. Picking R squared, RMSE, and MAE side by side, and explaining why a Decision Tree could match a Random Forest on test but still be the wrong choice, was the part that taught me the most.',
    cta: {
      caseStudy: null,
      github: null,
      demo: null,
    },
  },
  {
    id: 'course',
    themeKey: 'course',
    index: '05',
    title: 'Course Companion Web App',
    tagline:
      'A Spring Boot and MySQL coursework project for managing and searching course-related content.',
    problem:
      'Course-related information can become difficult to manage when it is spread across separate views, datasets, and backend logic. The project focused on creating a structured system for storing, searching, and managing course content.',
    solution:
      'Built as a group coursework project, the app uses a Spring Boot backend with MySQL for persistent storage, Spring Security for login and registration, Thymeleaf for server-rendered pages, and REST-style routes for application logic. A preloaded dataset supports testing search and badge-related behaviour. I contributed to backend design, database integration, debugging, testing, and team integration.',
    stack: [
      'Java',
      'Spring Boot',
      'Spring Security',
      'MySQL',
      'Thymeleaf',
      'Gradle',
      'REST APIs',
      'JUnit',
    ],
    features: [
      'Spring Boot backend for application logic and request handling.',
      'MySQL database integration for persistent course data.',
      'Structured course management entities.',
      'Search functionality for discovering courses and content.',
      'Spring Security for login and registration, with Thymeleaf-rendered pages.',
      'Preloaded dataset for testing search and badge-related behaviour.',
      'JUnit testing and local deployment through localhost.',
      'Collaborative group development with shared debugging and integration work.',
    ],
    impact:
      'The technical bit was Java, Spring Security, and MySQL, and I came out a lot more comfortable with all three. The less obvious lesson was how to work inside someone else\'s code. Reading a teammate\'s controller before you change it, asking what a method is meant to do before you "fix" it, and keeping commits small enough that the next person on integration day does not curse your name. That has stayed with me more than any of the syntax.',
    cta: {
      caseStudy: null,
      github: 'https://github.com/namitzz/Course-Companion-Web-App-',
      demo: null,
    },
  },
  // Placeholder. Shows in the Project directory only; the full project
  // section is suppressed via `comingSoon` so the homepage doesn't render
  // an empty Problem/Solution/Stack block for it.
  {
    id: 'agentforge',
    themeKey: 'base',
    index: '06',
    title: 'AgentForge',
    status: 'Coming soon',
    comingSoon: true,
    tagline: '',
    cta: {
      caseStudy: null,
      github: null,
      demo: null,
    },
  },
]

export const skills = [
  {
    group: 'AI & Machine Learning',
    items: ['Applied ML', 'Model evaluation', 'Feature engineering', 'scikit-learn', 'PyTorch basics'],
  },
  {
    group: 'RAG & LLM Systems',
    items: [
      'Retrieval-Augmented Generation',
      'Vector DBs (Chroma)',
      'Sentence-transformers',
      'Cross-encoder reranking',
      'Refusal & grounding',
      'OpenAI / Ollama',
    ],
  },
  {
    group: 'Backend / API',
    items: ['Python', 'FastAPI', 'Pydantic', 'Java', 'Spring Boot', 'REST', 'Auth basics', 'SQL', 'MySQL'],
  },
  {
    group: 'Frontend / UI',
    items: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Streamlit', 'Responsive design'],
  },
  {
    group: 'Data Science',
    items: ['Pandas', 'NumPy', 'Matplotlib', 'Clustering', 'Regression', 'Cross-validation'],
  },
  {
    group: 'Computer Vision',
    items: ['OpenCV', 'MediaPipe', 'Pose landmarks', 'Real-time pipelines'],
  },
  {
    group: 'Tools & Deployment',
    items: ['Git', 'Gradle', 'Docker basics', 'Linux', 'VS Code', 'Jupyter', 'JUnit'],
  },
  {
    group: 'Product & UX Thinking',
    items: ['Problem framing', 'Information design', 'Edge-case mapping', 'Stakeholder writing'],
  },
]

export const timeline = [
  {
    year: '2023 – 2026',
    title: 'BSc Computer Science',
    org: 'University of Leicester',
    body:
      'Final-year, graduating July 2026. Coursework spans AI, software engineering, databases, HCI, and applied data science. Dissertation: UniWise, a source-grounded RAG assistant for higher education.',
  },
  {
    year: '2025',
    title: 'Contributor, ClassFutures Generative AI guidance',
    org: 'ClassFutures',
    body:
      'Contributor to ClassFutures guidance on responsible Generative AI use in studies, focusing on academic integrity, critical thinking, and ethical adoption.',
  },
  {
    year: '2025',
    title: 'AI in Education, applied work',
    org: 'Independent / micro-internship',
    body:
      'Worked on AI education strategy and digital transformation framing: how universities should adopt LLM tooling without eroding learning outcomes. Fed directly into UniWise.',
  },
  {
    year: '2024 – present',
    title: 'Independent and group projects',
    org: 'Self-directed and university',
    body:
      'Built Posture AI, Cloud Seven Realty, and the Crime Prediction Dashboard as deliberate practice across computer vision, frontend and brand work, and applied data science. Also contributed to the Course Companion Web App as a group coursework project for CO2302 at Leicester.',
  },
]

export const writing = [
  {
    id: 'classfutures-ai-guide',
    title: 'Using Generative AI in Your Studies',
    role: 'Contributor',
    publisher: 'ClassFutures',
    url: 'https://classfutures.co.uk/resources/ai/generative-ai-studies-guide',
    tags: ['Generative AI', 'Education', 'Academic integrity', 'Critical thinking'],
    summary:
      'Contributed to guidance on responsible Generative AI use in learning, with a focus on academic integrity, critical thinking, and ethical adoption.',
    description:
      'This connects closely with the direction of UniWise: AI should support learning, not replace thinking. My contribution focused on responsible use, academic integrity, and helping students treat AI as study support rather than a shortcut.',
  },
]
