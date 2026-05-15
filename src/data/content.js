// All static content lives here so copy can be edited without touching components.
//
// To enable the CV download button, drop a PDF into `public/` and set
// `cv` below to its path (e.g. '/Namit_Singh_Sarna_CV.pdf'). Until then
// leave it as `null` and the Hero will hide the button automatically.

export const profile = {
  name: 'Namit Singh Sarna',
  shortName: 'Namit',
  role: 'Final-year BSc Computer Science · University of Leicester',
  // Replace with your preferred contact address.
  email: 'namitmec@gmail.com',
  links: {
    github: 'https://github.com/namitzz',
    linkedin: 'https://www.linkedin.com/in/namit-singh-sarna-55a021323',
    // Set to a real path once the CV PDF is added to /public.
    cv: null,
  },
  headline: 'I build AI systems that are practical, explainable, and human-centred.',
  subheadline:
    'Working across applied AI, retrieval-augmented generation, education technology, computer vision, data science, UX, and digital transformation.',
  about: [
    "I'm Namit, a final-year Computer Science student at the University of Leicester, graduating July 2026.",
    'My work sits at the intersection of AI research and applied product thinking. I care less about benchmarks and more about whether a system actually helps the person on the other side of the screen — a student trying to understand a lecture, an analyst trying to read a city, a business trying to look credible online.',
    'Most of what I build follows three rules: be grounded in real evidence, explain itself, and refuse to pretend when it does not know. The projects below are the clearest examples.',
  ],
}

export const projects = [
  {
    id: 'uniwise',
    themeKey: 'uniwise',
    index: '01',
    title: 'UniWise',
    tagline:
      'A source-grounded RAG assistant for higher education — final-year dissertation prototype.',
    problem:
      'University students rely on lecture material that is fragmented across PDFs, slides, and notes. General-purpose LLMs answer confidently from training data — including for things the lecturer never taught — which actively damages how students learn.',
    solution:
      'UniWise restricts answers to lecture-only context. Every claim is retrieved from the course corpus, reranked, and cited inline. Below a confidence threshold the assistant refuses to answer instead of hallucinating, and routes the student to office hours.',
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
      'Built as my final-year dissertation project. The harder problem turned out not to be retrieval — it was building a UI that makes refusal feel like trust rather than failure.',
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
    title: 'Posture AI — Real-Time Gym Form Correction',
    tagline:
      'A real-time computer vision prototype for gym posture correction, rep tracking, and AI coaching feedback.',
    problem:
      'Form mistakes in the gym are the main source of injury and stalled progress, but personal trainers are expensive and most form-check apps are static, post-hoc, or vague. There is no cheap way to get live, specific feedback on a rep while it is happening.',
    solution:
      'A modular MediaPipe-based pose pipeline that tracks squat depth, knee tracking, and torso angle in real time, counts reps, scores form against reference landmarks, and produces a short AI-written coaching summary at the end of a set.',
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
      'Taught me where the cost actually lives in a vision pipeline — it is rarely the model, almost always the per-frame Python glue around it.',
    cta: {
      caseStudy: null,
      github: 'https://github.com/namitzz/posture',
      demo: null,
    },
  },
  {
    id: 'cloud',
    themeKey: 'cloud',
    index: '03',
    title: 'Cloud Seven Realty',
    tagline:
      'A frontend/brand website for a Srinagar-based real estate brand, powered by Google Sheets and Drive so listings can be updated without redeploying.',
    problem:
      'A property brand built on local knowledge — verified titles, on-ground support, neighbourhood-level relationships in J&K — had no online presence that signalled any of that. Generic listing templates would have flattened the exact things that make the business trustworthy, and the team needed to update listings themselves without touching code.',
    solution:
      'A calm, premium site built around three signals buyers actually care about in this market: verified titles, local presence, and curated listings. Properties, project pages, and images live in Google Sheets and Google Drive, fetched via API and revalidated on a short ISR cache so the team can update listings without a deploy.',
    stack: [
      'Next.js 14',
      'React',
      'Tailwind CSS',
      'Google Sheets API',
      'Google Drive API',
      'ISR / 5-minute cache',
      'Responsive design',
    ],
    features: [
      'Hero framed around the brand promise: verified titles + on-ground support.',
      'Featured listings sourced live from a Google Sheet — no redeploy needed.',
      'Property images pulled from a connected Google Drive folder.',
      'Trust strip dedicated to local credibility, not generic certifications.',
      'Property pages structured by area and listing type (Rent / Buy / Land).',
      'Fully responsive — most traffic for this market is on mobile.',
    ],
    impact:
      'Design is a research discipline first. The brief was J&K property buyer psychology, not page templates — and the brand promise had to survive being scrolled past in three seconds.',
    cta: {
      caseStudy: null,
      // Repository is private — omit the GitHub button.
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
      'Coursework project on Metropolitan Police records — modelling and clustering at the LSOA level.',
    problem:
      'Raw police open data is large, messy, and area-imbalanced. Most public dashboards stop at counts and pie charts — useful for headlines, useless for decisions.',
    solution:
      'Cleaned and aggregated around 1M+ Met Police records into LSOA-month panels, trained regression models to predict volume, and used K-Means to surface area profiles that group neighbourhoods by crime shape rather than postcode.',
    stack: ['Python', 'Pandas', 'scikit-learn', 'NumPy', 'Matplotlib', 'Jupyter'],
    features: [
      'Pipeline for ~1M+ Met Police records → LSOA-month panels.',
      'Linear Regression, Decision Tree (with overfit diagnostics), and Random Forest predictors.',
      'K-Means clustering for area-profile segmentation (K=4 selected via elbow + silhouette).',
      'Evaluation with R², RMSE, MAE, and 10-fold cross-validation.',
      'Cluster diagnostics: silhouette score, inertia elbow.',
      'Stylised dashboard view of KPIs, trends, heatmap, and model performance.',
    ],
    impact:
      'Convinced me that the cleaning step is where the actual modelling decisions are made — the model is just the part that gets graded.',
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
    items: ['Python', 'FastAPI', 'Pydantic', 'REST', 'Auth basics', 'SQL'],
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
    items: ['Git', 'Docker basics', 'Linux', 'VS Code', 'Jupyter'],
  },
  {
    group: 'Product & UX Thinking',
    items: ['Problem framing', 'Information design', 'Edge-case mapping', 'Stakeholder writing'],
  },
]

export const timeline = [
  {
    year: '2023 — 2026',
    title: 'BSc Computer Science',
    org: 'University of Leicester',
    body:
      'Final-year, graduating July 2026. Coursework spans AI, software engineering, databases, HCI, and applied data science. Dissertation: UniWise — source-grounded RAG for higher education.',
  },
  {
    year: '2025',
    title: 'AI in Education — applied work',
    org: 'Independent / micro-internship',
    body:
      'Worked on AI education strategy and digital transformation framing — how universities should adopt LLM tooling without eroding learning outcomes. Fed directly into UniWise.',
  },
  {
    year: '2024 — present',
    title: 'Independent projects',
    org: 'Self-directed',
    body:
      'Built Posture AI, Cloud Seven Realty, and the Crime Prediction Dashboard as deliberate practice across computer vision, frontend/brand work, and applied data science.',
  },
]
