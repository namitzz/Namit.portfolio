// All static content lives here so copy can be edited without touching components.

export const profile = {
  name: 'Namit Singh Sarna',
  shortName: 'Namit',
  role: 'Final-year BSc Computer Science · University of Leicester',
  email: 'hello@namitsarna.com',
  links: {
    github: 'https://github.com/namitsinghsarna',
    linkedin: 'https://linkedin.com/in/namitsinghsarna',
    cv: '/Namit_Singh_Sarna_CV.pdf',
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
    tagline: 'A source-grounded RAG assistant for higher education.',
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
      'Hybrid retrieval with cross-encoder reranking for citation precision.',
      'Refusal thresholds and confidence indicators to reduce hallucinations.',
      'Inline citations linked back to slide / page / paragraph.',
      'Telemetry and analytics for module-level question patterns.',
      'Pluggable LLM backend — OpenAI in production, Ollama for offline marking.',
    ],
    impact:
      'Designed as my final-year dissertation. The harder problem turned out not to be retrieval — it was building a UI that makes refusal feel like trust rather than failure.',
    cta: { caseStudy: '#', github: 'https://github.com/namitsinghsarna/uniwise', demo: null },
  },
  {
    id: 'vision',
    themeKey: 'vision',
    index: '02',
    title: 'Vision AI — Posture & Gesture',
    tagline: 'Real-time webcam computer vision for posture, gesture, face and emotion.',
    problem:
      'Off-the-shelf fitness and accessibility tools either ship as a closed black box or run at single-digit FPS once you stack face, pose, and emotion models. Neither is useful for live feedback.',
    solution:
      'A modular pipeline that runs face, gesture, posture, and emotion detection concurrently from a single webcam frame. Frame skipping, model warm-up, and a configurable processing graph keep it usable at interactive frame rates.',
    stack: ['Python', 'OpenCV', 'MediaPipe', 'face_recognition', 'DeepFace', 'NumPy'],
    features: [
      'Live pose landmark tracking with confidence overlay.',
      'Gesture classification (open palm, fist, point, peace, thumbs up/down).',
      'Posture scoring against a reference skeleton.',
      'Emotion + identity from face crops via DeepFace.',
      'Frame-skipping scheduler with per-module FPS budget.',
      'Modular config so individual detectors can be swapped or disabled.',
    ],
    impact:
      'Taught me where the cost actually lives in a vision pipeline — it is rarely the model, almost always the per-frame Python glue.',
    cta: { caseStudy: '#', github: 'https://github.com/namitsinghsarna/vision-ai', demo: null },
  },
  {
    id: 'cloud',
    themeKey: 'cloud',
    index: '03',
    title: 'Cloud Seven Realty',
    tagline:
      'A premium digital identity for a Srinagar-based real estate brand operating across Jammu & Kashmir.',
    problem:
      'A property brand built on local knowledge — verified titles, on-ground support, neighbourhood-level relationships in J&K — had no online presence that signalled any of that. Generic listing templates would have flattened the exact things that make the business trustworthy.',
    solution:
      'A calm, premium site built around three signals buyers actually care about in this market: verified titles, local presence, and curated listings. Restrained typography, warm neutral palette, real Srinagar neighbourhoods front-and-centre, and a contact strip that does not hide the phone numbers.',
    stack: ['React', 'Tailwind CSS', 'Framer Motion', 'Responsive design', 'Brand system'],
    features: [
      'Hero framed around the brand promise: verified titles + on-ground support.',
      'Featured listings — Karanagar (rent), Bemina (buy), Nishaat (land).',
      'Trust strip dedicated to local credibility, not generic certifications.',
      'Contact ribbon with phone, email, and Srinagar location always visible.',
      'Property pages structured by area and listing type (Rent / Buy / Land).',
      'Fully responsive — most traffic for this market is on mobile.',
    ],
    impact:
      'Design is a research discipline first. The brief was J&K property buyer psychology, not page templates — and the brand promise had to survive being scrolled past in three seconds.',
    cta: {
      caseStudy: '#',
      github: 'https://github.com/namitsinghsarna/cloud-seven',
      demo: 'https://www.cloudsevenrealty.com/',
    },
  },
  {
    id: 'crime',
    themeKey: 'crime',
    index: '04',
    title: 'Crime Prediction Dashboard',
    tagline: 'Big-data modelling and clustering on Metropolitan Police records.',
    problem:
      'Raw police open data is large, messy, and area-imbalanced. Most public dashboards stop at counts and pie charts — useful for headlines, useless for decisions.',
    solution:
      'Cleaned and aggregated around 1M crime records into area-month panels, trained regression models to predict volume, and used K-Means to surface area profiles that group neighbourhoods by crime shape rather than postcode.',
    stack: ['Python', 'Pandas', 'scikit-learn', 'NumPy', 'Matplotlib', 'Jupyter'],
    features: [
      'Pipeline for ~1M Met Police records → area-month panels.',
      'Linear Regression, Decision Tree, and Random Forest predictors.',
      'K-Means clustering for area-profile segmentation.',
      'Evaluation with R², RMSE, MAE, cross-validation.',
      'Cluster diagnostics: silhouette, inertia elbow.',
      'Dashboard view of KPIs, trends, heatmap, and model performance.',
    ],
    impact:
      'Convinced me that the cleaning step is where the actual modelling decisions are made — the model is just the part that gets graded.',
    cta: { caseStudy: '#', github: 'https://github.com/namitsinghsarna/crime-dashboard', demo: null },
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
    items: ['React', 'Tailwind CSS', 'Framer Motion', 'Streamlit', 'Responsive design'],
  },
  {
    group: 'Data Science',
    items: ['Pandas', 'NumPy', 'Matplotlib', 'Clustering', 'Regression', 'Cross-validation'],
  },
  {
    group: 'Computer Vision',
    items: ['OpenCV', 'MediaPipe', 'face_recognition', 'DeepFace', 'Real-time pipelines'],
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
      'Built Vision AI, Cloud Seven Reality, and the Crime Prediction Dashboard as deliberate practice across CV, frontend, and applied data science.',
  },
]
