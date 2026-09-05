// All static content lives here so copy can be edited without touching components.
//
// CV lives at `public/Namit_Singh_Sarna_CV.pdf`. Set `links.cv` to null to
// hide the download links site-wide.

export const profile = {
  email: 'namitmec@gmail.com',
  links: {
    github: 'https://github.com/namitzz',
    linkedin: 'https://www.linkedin.com/in/namit-singh-sarna-55a021323',
    cv: '/Namit_Singh_Sarna_CV.pdf',
  },
  // Rendered as metadata in About's left column, so it is written as
  // terms rather than a sentence. The separator is what About splits on.
  positioning: 'AI · Software · Transformation',

  // NOT CURRENTLY RENDERED. About used to list these under a Highlights
  // heading; that list is gone and the heading is now only the marker
  // handing over to the next section. Kept because the claims are still
  // true and worth a home, not because anything reads them today.
  highlights: [
    'Built UniWise: a source-grounded RAG study assistant with reranking, citations, and an evaluation harness.',
    'Shipped Cloud Seven Realty, a live production frontend for a paying client.',
    'Modelled ~1M+ Met Police records for LSOA-level regression and area profiling.',
    'Contributor to ClassFutures guidance on responsible Generative AI use.',
  ],

  // About carries no education: the timeline is where study belongs, and
  // saying it twice made the section longer without making it stronger.
  about: [
    'I build practical AI and software systems that solve real problems.',
    'Interested in the space where technology, data and business meet.',
  ],
}

export const projects = [
  {
    id: 'uniwise',
    themeKey: 'uniwise',
    index: '01',
    domain: 'RAG · EdTech',
    year: '2026',
    title: 'UniWise',
    tagline:
      'A source-grounded RAG study assistant. Dissertation project.',
    problem:
      'Students rely on lecture material spread across PDFs, slides, and notes. General-purpose LLMs answer confidently from training data even when the answer isn\'t in the module, making it hard to know what\'s actually grounded.',
    solution:
      'UniWise restricts answers to lecture-only context. Chunks are retrieved, reranked, and shown with source evidence, so every answer can be traced back to the exact slide or page it came from.',
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
      'Confidence indicators and grounding checks that keep answers tied to retrieved sources.',
      'Source citations showing file, page, and chunk-level metadata.',
      'Telemetry and analytics for module-level question patterns.',
      'Pluggable LLM backend with OpenAI and Ollama adapters.',
    ],
    impact:
      'Retrieval was the part I expected to be hard. It was not. The harder problem was trust: an answer only helps a student if they can see exactly where it came from. Most of the work went into citation precision, reranking, and an evaluation harness that scored whether each answer was genuinely grounded in the retrieved source. Getting that verification loop right took longer than the rest of the pipeline.',
    cta: {
      caseStudy: null,
      github: 'https://github.com/namitzz/UniWise',
      demo: null,
    },
  },
  {
    id: 'vision',
    themeKey: 'vision',
    index: '02',
    domain: 'Computer Vision',
    year: '2025',
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
    domain: 'Brand · Frontend',
    year: '2025',
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
    domain: 'Data Science',
    year: '2024',
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
      github: 'https://github.com/namitzz/crime-prediction-ml',
      demo: null,
    },
  },
  {
    id: 'course',
    themeKey: 'course',
    index: '05',
    domain: 'Spring Boot · MySQL',
    year: '2024',
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
  {
    id: 'tovo',
    themeKey: 'tovo',
    index: '06',
    domain: 'React · Supabase',
    year: '2026',
    title: 'Tovo',
    status: 'Live',
    tagline:
      'A React + Supabase app for learning German across CEFR levels A1 to C1.',
    problem:
      'Language apps tend to gamify everything but drift from real curriculum. Learners want structured practice tied to actual proficiency levels, not just streaks.',
    solution:
      'Tovo is structured around the CEFR framework (A1 to C1), with a personalised onboarding flow, level-appropriate content, audio prompts, and progress tracking backed by Supabase. Built with React 19, TypeScript, Zustand for state, and Framer Motion for the interaction feel.',
    stack: [
      'React 19',
      'TypeScript',
      'Vite',
      'Supabase',
      'Zustand',
      'Framer Motion',
      'Recharts',
      'Sentry',
    ],
    features: [
      'Personalised onboarding: name, current level, learning goals.',
      'Structured CEFR levels A1 through C1 with level-appropriate content.',
      'Supabase backend for auth and persistent progress.',
      'Zustand state store for a fast, reactive UI.',
      'Audio prompts to reinforce listening and pronunciation.',
      'Recharts-based progress visualisation.',
    ],
    impact:
      'Working on Tovo taught me how much of a language product lives outside the language: onboarding, streak logic, level gating, latency on audio. The interesting engineering was making the CEFR structure feel like a companion rather than a syllabus.',
    cta: {
      caseStudy: null,
      github: 'https://github.com/namitzz/Tovo',
      demo: 'https://namitzz.github.io/Tovo/',
    },
  },
]

// Kept deliberately short. A long list of every tool ever touched
// flattens the strong signals into the same weight as the weak ones.
export const skills = [
  {
    group: 'RAG & LLM Systems',
    items: [
      'Retrieval-Augmented Generation',
      'Vector DBs (Chroma)',
      'Cross-encoder reranking',
      'Answer grounding & citations',
      'OpenAI / Ollama',
    ],
  },
  {
    group: 'Backend / API',
    items: ['Python', 'FastAPI', 'Java', 'Spring Boot', 'REST', 'SQL'],
  },
  {
    group: 'Machine Learning & Data',
    items: ['scikit-learn', 'Pandas', 'NumPy', 'Regression', 'Clustering'],
  },
  {
    group: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    group: 'Computer Vision',
    items: ['OpenCV', 'MediaPipe', 'Real-time pipelines'],
  },
]

// One chronological route: study, internships and competitions on a single
// line, earliest first, so the timeline reads left to right as a journey.
// `accent` is the organisation's own colour and `tint` a lighter variant for
// small text where the real one is too dark to read on the dark ground.
// Each stop draws an outline mark from TimelineMarks, matched on `id` or on
// `markKey` for the shared ones ('placement', 'competition').
export const timeline = [
  {
    id: 'leicester',
    kind: 'education',
    year: '2023',
    short: 'Leicester',
    title: 'Started BSc Computer Science',
    org: 'University of Leicester',
    monogram: 'UL',
    markKey: 'leicester',
    accent: '#d5203d',
    tint: '#E8455F',
    href: 'https://le.ac.uk/',
    body:
      'Modules across foundations of AI, big data and predictive analytics, software architecture, algorithms and data structures, internet and cloud computing, databases and domain modelling, and user interface design.',
  },
  {
    id: 'modelling',
    kind: 'award',
    year: '2025',
    short: 'Modelling',
    title: 'Meritorious Team Award, CMS Mathematical Modelling Competition',
    org: 'Competition',
    markKey: 'competition',
    accent: '#F5B447',
    body:
      'Led a Newsvendor inventory model that supported pricing and output recommendations.',
  },
  {
    id: 'consultancy',
    kind: 'award',
    year: '2025',
    short: 'Consultancy',
    title: 'Winners, International Student Consultancy Challenge',
    org: 'Competition',
    markKey: 'competition',
    accent: '#F5B447',
    body:
      'Co-led the Global Career Navigator pitch for international students.',
  },
  {
    id: 'consul',
    kind: 'work',
    year: 'May 2025',
    short: 'Consul visit',
    title: 'Student Representative',
    org: 'University of Leicester',
    monogram: 'UL',
    markKey: 'leicester',
    accent: '#d5203d',
    tint: '#E8455F',
    body:
      'Selected to represent Indian students during the official visit of Dr Venkatachalam Murugan, Consul General of India to the UK. Took part in a roundtable with university leadership on international student experience and collaboration.',
  },
  {
    id: 'ctf',
    kind: 'award',
    year: '2025',
    short: 'CTF',
    title: 'PWN2PLAY Silicon Siege CTF',
    org: 'De Montfort University',
    markKey: 'competition',
    accent: '#34F5C5',
    body:
      'Contributed across OSINT, cipher analysis, LFSR and geolocation challenges, finishing on 2030 points.',
  },
  {
    id: 'microinternship',
    kind: 'work',
    year: 'July 2025',
    short: 'Micro-internship',
    title: 'AI Education and Digital Transformation Micro-Internship',
    org: 'University of Leicester',
    monogram: 'UL',
    markKey: 'placement',
    accent: '#d5203d',
    tint: '#E8455F',
    body:
      'Led technical work in a cross-disciplinary team exploring responsible generative AI use in higher education. Built learning-assistant prototypes and supported non-CS teammates on engineering decisions and delivery.',
  },
  {
    id: 'cloudseven',
    kind: 'work',
    year: '2025 – 2026',
    short: 'Cloud Seven',
    title: 'Freelance Web Developer, Cloud Seven Realty',
    org: 'Solo client project',
    markKey: 'project',
    accent: '#C9A86A',
    href: 'https://www.cloudsevenrealty.com/',
    body:
      'Designed, built and launched a production real estate site for a paying client, owning it from planning through delivery. Built a spreadsheet-driven listings workflow so non-technical staff can update property content without a developer, and handed over documentation.',
  },
  {
    id: 'classfutures',
    kind: 'work',
    year: '2025',
    short: 'ClassFutures',
    title: 'Contributor, ClassFutures Generative AI guidance',
    org: 'ClassFutures',
    markKey: 'classfutures',
    accent: '#7FC8A0',
    href: 'https://classfutures.co.uk/resources/ai/generative-ai-studies-guide',
    body:
      'Contributor to published guidance on responsible Generative AI use in studies, focusing on academic integrity, critical thinking and ethical adoption.',
  },
  {
    id: 'uniwise',
    kind: 'work',
    year: '2025 – 2026',
    short: 'UniWise',
    title: 'UniWise, final year project',
    org: 'Retrieval-augmented academic assistant',
    markKey: 'project',
    accent: '#F4552A',
    href: 'https://github.com/namitzz/UniWise',
    body:
      'A multi-backend RAG system over ChromaDB with cross-encoder reranking and a confidence-based refusal mechanism, behind a Streamlit interface with three response modes. 52 tests, 84% coverage.',
  },
  {
    id: 'graduation',
    kind: 'education',
    year: 'July 2026',
    short: 'Graduation',
    title: 'Graduated BSc Computer Science',
    org: 'University of Leicester',
    monogram: 'UL',
    markKey: 'leicester',
    status: 'First Class Honours',
    accent: '#d5203d',
    tint: '#E8455F',
    href: 'https://le.ac.uk/',
    body:
      'Three years across AI, software engineering, databases, cloud and applied data science, closing with UniWise as the dissertation project.',
  },
  {
    id: 'aston',
    kind: 'education',
    year: '2026 – present',
    short: 'Aston',
    title: 'MSc AI for Business Transformation',
    org: 'Aston University · Birmingham',
    monogram: 'A',
    markKey: 'aston',
    status: 'In progress',
    accent: '#7D2B62',
    tint: '#C561A6',
    href: 'https://www.aston.ac.uk/study/courses/ai-business-transformation-msc',
    body:
      'How organisations actually adopt AI: strategy, deployment, governance, and measurable impact. A continuation of the applied AI direction from my undergraduate work.',
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
