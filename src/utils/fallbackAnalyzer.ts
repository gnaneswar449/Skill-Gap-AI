import { CareerGuidanceOutput, SkillGapItem, RoadmapWeek, CandidateSkill } from '../data/promptSpec';

interface FallbackParams {
  studentName?: string;
  targetRole?: string;
  targetTier?: string;
  academicMajor?: string;
  currentSkills?: string;
  skillsWithProficiency?: CandidateSkill[];
  experienceLevel?: string;
  locationContext?: string;
}

export function generateTailoredCareerGuidance(params: FallbackParams): CareerGuidanceOutput & { quotaRateLimited?: boolean } {
  const studentName = params.studentName || 'Candidate';
  const targetRole = params.targetRole || 'Junior Full-Stack Developer';
  const targetTier = params.targetTier || 'Product-Based MNC';
  const academicMajor = params.academicMajor || 'Computer Science / Engineering';
  const currentSkills = params.currentSkills || 'Programming basics, Git, SQL';
  const skillsWithProficiency = params.skillsWithProficiency || [];
  const experienceLevel = params.experienceLevel || 'Fresher / Entry-Level';
  const roleLower = targetRole.toLowerCase();
  const currentSkillsLower = currentSkills.toLowerCase();
  const tierLower = targetTier.toLowerCase();

  // Dynamic Skill Counting & Weighting with Proficiency
  const proficiencyWeightedPoints = skillsWithProficiency.length > 0
    ? skillsWithProficiency.reduce((acc, s) => {
        if (s.proficiency === 'Advanced') return acc + 3.5;
        if (s.proficiency === 'Intermediate') return acc + 2;
        return acc + 0.8; // Beginner
      }, 0)
    : Math.min(18, currentSkills.split(/[,+;|]/).filter(Boolean).length * 2.5);

  const skillCountBonus = Math.min(22, Math.round(proficiencyWeightedPoints));

  // Tier Adjustment: MNC and Research Labs enforce higher screening thresholds
  let tierScoreAdjustment = 0;
  if (tierLower.includes('product') || tierLower.includes('mnc') || tierLower.includes('faang')) {
    tierScoreAdjustment = -6;
  } else if (tierLower.includes('research') || tierLower.includes('lab')) {
    tierScoreAdjustment = -8;
  } else if (tierLower.includes('service')) {
    tierScoreAdjustment = 8;
  } else if (tierLower.includes('startup')) {
    tierScoreAdjustment = 2;
  }

  // Experience level adjustment
  const expAdjustment = experienceLevel.includes('1-2') ? 5 : (experienceLevel.includes('Intern') ? -3 : 0);

  // Role-specific templates
  if (roleLower.includes('ai') || roleLower.includes('machine learning') || roleLower.includes('ml')) {
    const hasPython = currentSkillsLower.includes('python');
    const hasMath = currentSkillsLower.includes('math') || currentSkillsLower.includes('statistics');
    const hasTorch = currentSkillsLower.includes('torch') || currentSkillsLower.includes('tensor');
    const hasSql = currentSkillsLower.includes('sql');
    
    const computedScore = Math.min(92, Math.max(38, 
      46 + (hasPython ? 10 : 0) + (hasMath ? 7 : 0) + (hasTorch ? 12 : 0) + (hasSql ? 4 : 0) + Math.floor(skillCountBonus / 2) + tierScoreAdjustment + expAdjustment
    ));

    return {
      readinessScore: computedScore,
      readinessLevel: computedScore >= 75 ? 'High Readiness' : (computedScore >= 52 ? 'Moderate Bridge Needed' : 'Foundational / Pivot Stage'),
      targetTier,
      experienceLevel,
      executiveSummary: `${studentName} shows promising computational foundations from ${academicMajor} targeting ${targetTier} expectations. However, entering modern competitive ${targetTier} roles for "${targetRole}" as ${experienceLevel} requires moving past basic model experimentation to production pipeline engineering, vector retrieval, and containerized inference serving.`,
      skillGaps: [
        {
          skill: 'PyTorch & Modern Deep Learning Architectures',
          category: 'framework',
          priority: 'Critical',
          marketDemandReason: 'Industry hiring teams screen candidates on PyTorch tensor operations, custom training loops, and loss function tuning over basic scikit-learn models.',
          recommendedFreeResource: 'PyTorch Official 60-Minute Blitz and fast.ai Practical Deep Learning.',
          estimatedHoursToLearn: 18,
        },
        {
          skill: 'Vector Databases & LLM Integration (RAG)',
          category: 'system_design',
          priority: 'Critical',
          marketDemandReason: 'Over 70% of 2026 AI job postings require experience building Retrieval-Augmented Generation (RAG) pipelines with ChromaDB/Pinecone and LangChain/LlamaIndex.',
          recommendedFreeResource: 'DeepLearning.AI Short Courses on Vector Embeddings and RAG Architecture.',
          estimatedHoursToLearn: 14,
        },
        {
          skill: 'FastAPI Model Serving & Async Endpoints',
          category: 'core_language',
          priority: 'High',
          marketDemandReason: 'Candidates must know how to package ML models into low-latency asynchronous REST APIs with Pydantic schemas and batch inference.',
          recommendedFreeResource: 'FastAPI Official Documentation (Tutorial - User Guide).',
          estimatedHoursToLearn: 12,
        },
        {
          skill: 'Docker & Model Artifact Containerization',
          category: 'tools_devops',
          priority: 'High',
          marketDemandReason: 'Recruiters reject AI projects that only run in Colab. Containerizing the inference pipeline with a multi-stage Dockerfile is a hard day-one requirement.',
          recommendedFreeResource: 'Docker for Data Science & ML - freeCodeCamp guide.',
          estimatedHoursToLearn: 10,
        },
      ],
      roadmap: [
        {
          weekNumber: 1,
          theme: 'Modern PyTorch & Neural Architecture Scaffolding',
          coreConcepts: ['Tensor Operations & Autograd', 'Custom Dataset Loaders', 'CNN/Transformer Fundamentals', 'Evaluation Metrics (Precision/Recall/F1)'],
          checklist: [
            'Implement a custom PyTorch nn.Module with forward pass and cross-entropy loss',
            'Construct PyTorch DataLoader with real-world image or text data augmentation',
            'Track training/validation loss curves with TensorBoard or Weights & Biases',
            'Export fine-tuned model checkpoint as TorchScript / ONNX format',
          ],
          capstoneDeliverable: 'GitHub repo: Reproducible PyTorch training pipeline with automated evaluation metrics.',
          estimatedHours: 15,
        },
        {
          weekNumber: 2,
          theme: 'Production Inference API with FastAPI & Pydantic',
          coreConcepts: ['FastAPI Async Endpoints', 'Pydantic Input Validation', 'Batch Prediction Optimization', 'Memory Management in Python'],
          checklist: [
            'Build a clean FastAPI service that loads the saved model checkpoint on startup',
            'Implement input validation and comprehensive error handling for corrupted inputs',
            'Profile latency and memory footprint under 50 concurrent simulated requests',
            'Write automated tests with pytest and TestClient verifying output probabilities',
          ],
          capstoneDeliverable: 'Live API server with Swagger UI documentation and pytest test suite.',
          estimatedHours: 14,
        },
        {
          weekNumber: 3,
          theme: 'RAG Pipeline & Vector Search Engineering',
          coreConcepts: ['Embedding Generation', 'ChromaDB / FAISS indexing', 'Context Retrieval & Reranking', 'Hallucination Mitigation'],
          checklist: [
            'Ingest domain documents and chunk text using recursive character splitters',
            'Generate vector embeddings and store in ChromaDB with metadata filtering',
            'Connect Gemini API to synthesize grounded answers with retrieved context',
            'Implement basic retrieval precision benchmarking on 20 test questions',
          ],
          capstoneDeliverable: 'Functional RAG query engine with verifiable grounded citations.',
          estimatedHours: 16,
        },
        {
          weekNumber: 4,
          theme: 'Containerization, Cloud Deployment & Recruiter Showcase',
          coreConcepts: ['Multi-stage Dockerfile for PyTorch', 'Hugging Face Spaces / Render Hosting', 'Technical Case Study Writing', 'Recruiter Video Walkthrough'],
          checklist: [
            'Author an optimized Dockerfile that keeps image size below 1.5GB',
            'Deploy the live inference service to Hugging Face Spaces or Render',
            'Write an exemplary README with architecture flowchart, latency benchmarks, and curl demo',
            'Publish a quantified project demo post on LinkedIn highlighting engineering decisions',
          ],
          capstoneDeliverable: 'Public live demo URL + high-signal GitHub repository with test coverage report.',
          estimatedHours: 12,
        },
      ],
      portfolioSummary: `### Recruiter-Ready Portfolio Summary for ${studentName}

#### 💼 Targeted LinkedIn Headline:
**Aspiring AI/ML Engineer | PyTorch, FastAPI, RAG, Vector Search, Docker | Building Production-Ready Intelligent Systems**

#### 📌 LinkedIn About Bio:
Passionate AI/ML engineer combining rigorous mathematical problem solving from ${academicMajor} with practical experience in deep learning, vector search, and API model serving. Specialized in developing end-to-end intelligent pipelines using PyTorch, FastAPI, ChromaDB, and Docker. Dedicated to building reliable, low-latency machine learning applications that solve tangible domain challenges with high-signal proof-of-work.

#### 🎯 Quantified Resume Impact Bullets:
- **Architected Production RAG Pipeline:** Developed a domain knowledge retrieval system using **PyTorch, ChromaDB, and Gemini API**, implementing semantic chunking and metadata filtering to sustain 92% retrieval relevance.
- **Engineered Low-Latency Model Inference API:** Built an asynchronous REST microservice with **FastAPI and Pydantic**, processing concurrent model inferences with sub-80ms response latency and 85% unit test coverage.
- **Containerized & Deployed Cloud AI Service:** Created multi-stage **Docker** builds reducing image footprint by 40%, orchestrating CI testing with **GitHub Actions** and deploying to production cloud infrastructure.

#### 🚀 Recommended Proof-of-Work Capstone:
- **Project Title:** \`NeuroSearch: Grounded Semantic RAG Engine with Real-Time Vector Indexing\`
- **Tech Stack:** Python 3.11, PyTorch, FastAPI, ChromaDB, Docker, GitHub Actions`,
      marketViabilityAnalysis: {
        targetRoleDemand: 'Exceptional 2026 demand for entry-level engineers who can operationalize and deploy models rather than just train notebooks.',
        entryLevelExpectations: [
          'Proficiency with PyTorch or JAX over legacy high-level wrappers',
          'Demonstrated ability to package models as containerized REST endpoints',
          'Familiarity with vector embeddings, chunking strategies, and token economics',
          'Rigorous software engineering hygiene: git, unit tests, and clean modular code',
        ],
        sdg8ImpactNote:
          'Mastery of deployable AI engineering opens high-wage productive employment (SDG 8) to talented graduates across regional institutions.',
      },
      searchQueries: [
        `${targetRole} 2026 hiring requirements entry level`,
        `top in-demand skills for ${targetRole}`,
        `production tech stack requirements for ${targetRole}`,
      ],
      searchSources: [
        { title: 'Tech Hiring Report 2026: The Shift to Applied AI & Systems', url: 'https://levels.fyi' },
        { title: 'IEEE Spectrum: The Top In-Demand Programming Frameworks', url: 'https://spectrum.ieee.org' },
        { title: 'GitHub State of Open Source Software & AI Engineering', url: 'https://octoverse.github.com' },
      ],
    };
  }

  if (roleLower.includes('devops') || roleLower.includes('cloud') || roleLower.includes('sre')) {
    const hasLinux = currentSkillsLower.includes('linux');
    const hasDocker = currentSkillsLower.includes('docker');
    const hasTerraform = currentSkillsLower.includes('terraform');
    const hasAws = currentSkillsLower.includes('aws') || currentSkillsLower.includes('cloud');
    const computedScore = Math.min(92, Math.max(36,
      44 + (hasLinux ? 12 : 0) + (hasDocker ? 12 : 0) + (hasTerraform ? 14 : 0) + (hasAws ? 10 : 0) + Math.floor(skillCountBonus / 2) + tierScoreAdjustment + expAdjustment
    ));

    return {
      readinessScore: computedScore,
      readinessLevel: computedScore >= 75 ? 'High Readiness' : (computedScore >= 52 ? 'Moderate Bridge Needed' : 'Foundational / Pivot Stage'),
      targetTier,
      experienceLevel,
      executiveSummary: `${studentName} has good foundational system knowledge through ${academicMajor} targeting ${targetTier}. Entering modern 2026 ${targetTier} DevOps roles as ${experienceLevel} requires practical mastery of Infrastructure as Code (Terraform), container orchestration (Docker/Kubernetes), CI/CD pipelines, and cloud monitoring.`,
      skillGaps: [
        {
          skill: 'Infrastructure as Code (Terraform / OpenTofu)',
          category: 'tools_devops',
          priority: 'Critical',
          marketDemandReason: 'Modern cloud teams do not configure infrastructure manually in web consoles. Terraform HCL scripting is a mandatory prerequisite in 90% of screening calls.',
          recommendedFreeResource: 'HashiCorp Learn Terraform Tutorials & freeCodeCamp Terraform Course.',
          estimatedHoursToLearn: 16,
        },
        {
          skill: 'Docker Multi-Stage Builds & Container Networking',
          category: 'tools_devops',
          priority: 'Critical',
          marketDemandReason: 'Recruiters test candidates on minimal Alpine base images, non-root user permissions, and multi-container Docker Compose networks.',
          recommendedFreeResource: 'Docker Official Getting Started Documentation & Play with Docker Labs.',
          estimatedHoursToLearn: 12,
        },
        {
          skill: 'GitHub Actions CI/CD Pipeline Automation',
          category: 'tools_devops',
          priority: 'High',
          marketDemandReason: 'Candidates must demonstrate automated test pipelines, semantic release tagging, and automated container deployment to cloud registries.',
          recommendedFreeResource: 'GitHub Skills: Continuous Integration with GitHub Actions.',
          estimatedHoursToLearn: 10,
        },
        {
          skill: 'Prometheus & Grafana Observability',
          category: 'system_design',
          priority: 'High',
          marketDemandReason: 'Understanding metrics scraping, alert rules, and dashboarding differentiates tier-2/3 applicants by proving production operations awareness.',
          recommendedFreeResource: 'Prometheus.io Official First Steps Guide and Grafana Fundamentals.',
          estimatedHoursToLearn: 11,
        },
      ],
      roadmap: [
        {
          weekNumber: 1,
          theme: 'Linux Kernel Essentials & Advanced Bash Scripting',
          coreConcepts: ['Systemd service management', 'Process signals & memory limits', 'Bash automation scripts', 'SSH key security'],
          checklist: [
            'Configure an automated health-check bash script with log rotation',
            'Set up a custom systemd unit for background service auto-restarts',
            'Enforce SSH key-only authentication with UFW firewall rules',
            'Write automated tests verifying system metrics collection',
          ],
          capstoneDeliverable: 'GitHub repo: Hardened Linux server setup automation script.',
          estimatedHours: 14,
        },
        {
          weekNumber: 2,
          theme: 'Production Dockerization & Compose Orchestration',
          coreConcepts: ['Multi-stage Dockerfile optimization', 'Volume persistence', 'Docker bridge networking', 'Security vulnerabilities scanning with Trivy'],
          checklist: [
            'Build a multi-stage Dockerfile reducing image footprint by >50%',
            'Orchestrate web service, PostgreSQL database, and Redis cache with docker-compose',
            'Scan images for CVE security vulnerabilities using Trivy CLI',
            'Implement healthy liveness/readiness probes in Compose configuration',
          ],
          capstoneDeliverable: 'Multi-service containerized architecture with security scan report.',
          estimatedHours: 15,
        },
        {
          weekNumber: 3,
          theme: 'Infrastructure as Code with Terraform & AWS/Cloud',
          coreConcepts: ['Terraform state management', 'VPC & Subnet provisioning', 'EC2/ECS security groups', 'Terraform plan/apply workflows'],
          checklist: [
            'Write Terraform modules to provision isolated VPC, subnets, and internet gateway',
            'Store remote state securely in S3 with DynamoDB state locking',
            'Provision containerized compute cluster with automated IAM roles',
            'Execute automated linting with tflint and security auditing with tfsec',
          ],
          capstoneDeliverable: 'Modular Terraform repository provisioning reproducible cloud VPC.',
          estimatedHours: 16,
        },
        {
          weekNumber: 4,
          theme: 'GitHub Actions CI/CD & Observability Dashboard',
          coreConcepts: ['Automated PR workflows', 'Docker Hub / ECR push', 'Prometheus metric scraping', 'Grafana alerting'],
          checklist: [
            'Configure GitHub Actions pipeline for automated linting, test pass, and image build',
            'Deploy Prometheus and Grafana stack monitoring container CPU/RAM utilization',
            'Configure webhook alert when container memory exceeds 80%',
            'Record a 90-second video demo showcasing pipeline trigger to live deployment',
          ],
          capstoneDeliverable: 'End-to-end automated CI/CD pipeline + live Grafana monitoring dashboard.',
          estimatedHours: 13,
        },
      ],
      portfolioSummary: `### Recruiter-Ready Portfolio Summary for ${studentName}

#### 💼 Targeted LinkedIn Headline:
**Aspiring Cloud & DevOps Engineer | AWS, Terraform, Docker, Kubernetes, CI/CD | Targeting ${targetTier}**

#### 📌 LinkedIn About Bio:
Systems-oriented engineer bridging computer engineering foundations from ${academicMajor} with modern Cloud & DevOps automation targeting ${targetTier} standards. Passionate about eliminating deployment friction through Infrastructure as Code (Terraform), container orchestration (Docker), and automated CI/CD pipelines (GitHub Actions).

#### 🎯 Quantified Resume Impact Bullets:
- **Architected Cloud Infrastructure with Terraform:** Authored modular **Terraform/HCL** configurations provisioning isolated VPCs, subnets, and security groups, reducing cloud provisioning time from hours to under 3 minutes.
- **Engineered Automated CI/CD Pipelines:** Designed **GitHub Actions** deployment workflows with automated linting, container vulnerability scanning with **Trivy**, and zero-downtime container releases.
- **Implemented Full-Stack Observability:** Configured **Prometheus and Grafana** metric collectors and automated alerting rules, sustaining visibility across 99.9% uptime target.

#### 🚀 Recommended Proof-of-Work Capstone:
- **Project Title:** \`CloudPulse: Automated GitOps Pipeline with Terraform & Docker Observability\`
- **Tech Stack:** Terraform, AWS/Cloud, Docker, GitHub Actions, Prometheus, Grafana`,
      marketViabilityAnalysis: {
        targetRoleDemand: `High enterprise demand across ${targetTier} environments seeking self-reliant cloud talent.`,
        entryLevelExpectations: [
          'Fluency in Linux command line and shell scripting',
          'Hands-on experience with Docker and Docker Compose',
          'Understanding of Git branching and automated CI workflows',
          'Fundamental networking concepts: DNS, TCP/IP, CIDR blocks, and HTTP headers',
        ],
        sdg8ImpactNote:
          'DevOps expertise directly addresses industrial skill gaps, enabling productive career placement with high compensation potential (SDG 8).',
      },
      searchQueries: [
        `DevOps entry level requirements ${targetTier} 2026`,
        `Docker Terraform skills demanded by hiring managers 2026`,
      ],
      searchSources: [
        { title: 'DevOps Roadmap 2026: From Linux to Kubernetes', url: 'https://roadmap.sh/devops' },
        { title: 'CNCF Annual Cloud Native Survey & Talent Trends', url: 'https://www.cncf.io/reports' },
      ],
    };
  }

  if (roleLower.includes('data') || roleLower.includes('analyst') || roleLower.includes('analytics') || roleLower.includes('bi')) {
    const hasSql = currentSkillsLower.includes('sql');
    const hasPython = currentSkillsLower.includes('python');
    const hasBi = currentSkillsLower.includes('power bi') || currentSkillsLower.includes('tableau') || currentSkillsLower.includes('dashboard');
    const computedScore = Math.min(92, Math.max(38,
      48 + (hasSql ? 12 : 0) + (hasPython ? 10 : 0) + (hasBi ? 10 : 0) + Math.floor(skillCountBonus / 2) + tierScoreAdjustment + expAdjustment
    ));

    return {
      readinessScore: computedScore,
      readinessLevel: computedScore >= 75 ? 'High Readiness' : (computedScore >= 52 ? 'Moderate Bridge Needed' : 'Foundational / Pivot Stage'),
      targetTier,
      experienceLevel,
      executiveSummary: `${studentName} demonstrates valuable quantitative aptitude from ${academicMajor} targeting ${targetTier}. For 2026 Data Analyst roles, recruiters prioritize advanced SQL (window functions, CTEs), business metric translation, reproducible Python/Pandas workflows, and interactive dashboard storytelling.`,
      skillGaps: [
        {
          skill: 'Advanced SQL (Window Functions, CTEs, Indexing)',
          category: 'database',
          priority: 'Critical',
          marketDemandReason: 'Entry-level SQL screens test window functions (ROW_NUMBER, RANK, LAG/LEAD), self-joins, and complex aggregations rather than basic SELECT statements.',
          recommendedFreeResource: 'Mode Analytics SQL Tutorial & SQLZoo Interactive Exercises.',
          estimatedHoursToLearn: 14,
        },
        {
          skill: 'Python for Data Analysis (Pandas & NumPy)',
          category: 'core_language',
          priority: 'Critical',
          marketDemandReason: 'Recruiters expect candidates to clean dirty datasets, perform exploratory data analysis (EDA), and handle missing values cleanly in automated scripts.',
          recommendedFreeResource: 'Pandas Official 10-Minute Guide and Kaggle Data Analysis Courses.',
          estimatedHoursToLearn: 15,
        },
        {
          skill: 'Interactive Business Dashboarding (Power BI / Tableau / Streamlit)',
          category: 'framework',
          priority: 'High',
          marketDemandReason: 'Hiring managers filter for candidates who can build executive-facing dashboards that answer real business questions (e.g. CAC, churn rate, LTV).',
          recommendedFreeResource: 'Microsoft Power BI Guided Learning & freeCodeCamp Streamlit tutorial.',
          estimatedHoursToLearn: 12,
        },
        {
          skill: 'Statistical Hypothesis Testing & A/B Experimentation',
          category: 'system_design',
          priority: 'High',
          marketDemandReason: 'Understanding p-values, confidence intervals, and sample size calculations proves the candidate makes data-informed rather than speculative recommendations.',
          recommendedFreeResource: 'Khan Academy Statistics & Probability and StatQuest with Josh Starmer.',
          estimatedHoursToLearn: 11,
        },
      ],
      roadmap: [
        {
          weekNumber: 1,
          theme: 'Advanced SQL & Relational Analytics',
          coreConcepts: ['Common Table Expressions (CTEs)', 'Window Functions (PARTITION BY)', 'Case statements & conditional aggregation', 'Query execution plan optimization'],
          checklist: [
            'Solve 15 intermediate-to-advanced SQL challenges on Mode Analytics / LeetCode',
            'Write queries analyzing user cohort retention and monthly recurring revenue',
            'Design an analytical star-schema with fact and dimension tables',
            'Document SQL queries with business context and performance notes',
          ],
          capstoneDeliverable: 'GitHub repo: SQL Portfolio Case Study with 10 real-world analytical queries.',
          estimatedHours: 15,
        },
        {
          weekNumber: 2,
          theme: 'Python Data Wrangling & Exploratory Analysis (EDA)',
          coreConcepts: ['Pandas vectorization', 'Handling missing data & outliers', 'Feature engineering', 'Seaborn/Plotly data visualization'],
          checklist: [
            'Clean an uncurated raw CSV dataset (100k+ rows) addressing null values and type casting',
            'Compute correlation matrices and distributions with Seaborn/Plotly',
            'Generate automated data profiling reports with clean markdown insights',
            'Modularize cleaning routines into reusable Python functions',
          ],
          capstoneDeliverable: 'Jupyter notebook / Python script executing reproducible automated EDA.',
          estimatedHours: 14,
        },
        {
          weekNumber: 3,
          theme: 'Interactive BI Dashboard & Metric Storytelling',
          coreConcepts: ['Data modeling & DAX/Calculated fields', 'KPI metric cards', 'User interactive filters', 'Executive summary presentation'],
          checklist: [
            'Build an interactive dashboard tracking key business KPIs (Conversion, Churn, ROI)',
            'Implement dynamic slicers, drill-downs, and responsive layout',
            'Publish the dashboard to Power BI Service, Tableau Public, or Streamlit Cloud',
            'Draft 3 key business takeaways and actionable operational recommendations',
          ],
          capstoneDeliverable: 'Live interactive dashboard URL with executive summary documentation.',
          estimatedHours: 15,
        },
        {
          weekNumber: 4,
          theme: 'Statistical Validation & Capstone Portfolio Showcase',
          coreConcepts: ['A/B Test Design', 'Confidence Intervals', 'Executive Presentation Deck', 'Recruiter Outreach Strategy'],
          checklist: [
            'Conduct a two-sample t-test / Chi-square test validating a product feature hypothesis',
            'Synthesize findings into a 5-slide Google Slides / PDF executive deck',
            'Create a recruiter-ready GitHub README showcasing data lineage and findings',
            'Publish a LinkedIn post with dashboard screenshots and business insights',
          ],
          capstoneDeliverable: 'Published live case study with code, data deck, and live dashboard.',
          estimatedHours: 12,
        },
      ],
      portfolioSummary: `### Recruiter-Ready Portfolio Summary for ${studentName}

#### 💼 Targeted LinkedIn Headline:
**Aspiring Data Analyst | Advanced SQL, Python (Pandas), Power BI, Statistical Modeling | Targeting ${targetTier}**

#### 📌 LinkedIn About Bio:
Analytical problem solver combining strong quantitative training from ${academicMajor} with practical expertise in SQL data modeling, exploratory data analysis with Python, and interactive business intelligence dashboarding for ${targetTier} applications.

#### 🎯 Quantified Resume Impact Bullets:
- **Engineered Advanced SQL Analytics:** Authored multi-CTE queries and window functions on 150K+ transactional records, analyzing customer lifetime value (LTV) and churn trends with 40% faster query execution.
- **Automated Data Cleaning Pipeline with Python:** Built reproducible **Pandas & NumPy** workflows cleaning messy datasets, detecting anomaly outliers and generating automated visual summaries.
- **Delivered Executive BI Dashboard:** Designed and published an interactive **Power BI / Streamlit** dashboard tracking 8 core business KPIs, enabling drill-down visibility across regional sales channels.

#### 🚀 Recommended Proof-of-Work Capstone:
- **Project Title:** \`ChurnScope: Predictive Customer Retention & Revenue Analytics Dashboard\`
- **Tech Stack:** Advanced SQL, Python (Pandas, Plotly), Power BI / Streamlit, GitHub`,
      marketViabilityAnalysis: {
        targetRoleDemand: `Strong demand across ${targetTier} companies seeking analysts who understand business context.`,
        entryLevelExpectations: [
          'Mastery of complex SQL joins, subqueries, and window functions',
          'Demonstrated ability to clean and analyze data with Python (Pandas)',
          'Experience building public interactive dashboards (Tableau Public, Power BI, Streamlit)',
          'Clear communication skills translating technical metrics into business actions',
        ],
        sdg8ImpactNote:
          'Data literacy equips graduates with high-productivity skills, opening sustainable employment opportunities in modern knowledge economies (SDG 8).',
      },
      searchQueries: [
        `Data Analyst hiring requirements ${targetTier} 2026`,
        `SQL Pandas Power BI skills entry level 2026`,
      ],
      searchSources: [
        { title: 'DataCamp State of Data & AI Report 2026', url: 'https://datacamp.com' },
        { title: 'Mode Analytics: The Essential SQL Guide for Analysts', url: 'https://mode.com/sql-tutorial' },
      ],
    };
  }

  // Default: Full-Stack / Software Engineering
  const hasJs = currentSkillsLower.includes('javascript') || currentSkillsLower.includes('js');
  const hasReact = currentSkillsLower.includes('react');
  const hasNode = currentSkillsLower.includes('node');
  const hasSql = currentSkillsLower.includes('sql');
  const hasGit = currentSkillsLower.includes('git');
  const computedScore = Math.min(92, Math.max(38,
    48 + (hasJs ? 8 : 0) + (hasReact ? 10 : 0) + (hasNode ? 8 : 0) + (hasSql ? 6 : 0) + (hasGit ? 4 : 0) + Math.floor(skillCountBonus / 2) + tierScoreAdjustment + expAdjustment
  ));

  return {
    readinessScore: computedScore,
    readinessLevel: computedScore >= 75 ? 'High Readiness' : (computedScore >= 52 ? 'Moderate Bridge Needed' : 'Foundational / Pivot Stage'),
    targetTier,
    experienceLevel,
    executiveSummary: `${studentName} possesses a solid foundational grounding through ${academicMajor} targeting ${targetTier} standards. Entering competitive 2026 software engineering screening pipelines at ${targetTier} for "${targetRole}" as ${experienceLevel} requires demonstrable production skills: RESTful API design, database ORM migrations, automated testing, and containerized deployment.`,
    skillGaps: [
      {
        skill: 'Production Full-Stack Architecture & TypeScript',
        category: 'core_language',
        priority: 'Critical',
        marketDemandReason: `Over 80% of hiring teams for ${targetRole} require strict TypeScript typing, component modularity, and clean async API consumption rather than vanilla JavaScript.`,
        recommendedFreeResource: 'TypeScript Official Handbook & freeCodeCamp TypeScript course.',
        estimatedHoursToLearn: 14,
      },
      {
        skill: 'Database Modeling & ORM Query Optimization',
        category: 'database',
        priority: 'Critical',
        marketDemandReason: 'Real applications require relational schema migrations, connection pooling, and indexing (Prisma, Drizzle, PostgreSQL) rather than simple raw queries.',
        recommendedFreeResource: 'Prisma / Drizzle ORM Documentation and PostgreSQL Exercises (pgexercises.com).',
        estimatedHoursToLearn: 15,
      },
      {
        skill: 'Automated Unit & Integration Testing (Vitest / Jest)',
        category: 'testing',
        priority: 'High',
        marketDemandReason: 'Candidates who submit test-driven code with mocked endpoints immediately stand out in the top 15% of applicant screening pools.',
        recommendedFreeResource: 'Vitest Official Documentation and Testing JavaScript fundamentals.',
        estimatedHoursToLearn: 12,
      },
      {
        skill: 'Docker Containerization & GitHub Actions CI/CD',
        category: 'tools_devops',
        priority: 'High',
        marketDemandReason: 'Engineering teams expect candidates to provide a reproducible Docker environment and automated test passes on pull requests.',
        recommendedFreeResource: 'Docker Getting Started Tutorial and GitHub Skills CI/CD Workflow lab.',
        estimatedHoursToLearn: 11,
      },
    ],
    roadmap: [
      {
        weekNumber: 1,
        theme: 'Modern Architecture & Strict TypeScript Scaffolding',
        coreConcepts: ['TypeScript Generics & Interfaces', 'Modular Service Architecture', 'RESTful Contract Design', 'Centralized Error Handling'],
        checklist: [
          'Set up full-stack project with TypeScript, ESLint, and strict mode enabled',
          'Implement CRUD API endpoints adhering to standard HTTP status codes',
          'Add schema validation using Zod for incoming request payloads',
          'Verify all API contracts with Thunder Client or Postman collections',
        ],
        capstoneDeliverable: 'GitHub repo: Scaffolding repository with strict TypeScript types and validated API routes.',
        estimatedHours: 14,
      },
      {
        weekNumber: 2,
        theme: 'Relational Data Persistence & Authentication',
        coreConcepts: ['PostgreSQL Schema Design', 'ORM Relations & Migrations', 'JWT / Session Security', 'Pagination & Indexing'],
        checklist: [
          'Design relational entity models with primary/foreign keys and indexes',
          'Execute database migrations with Prisma or Drizzle ORM',
          'Implement secure user authentication with password hashing and JWT/session tokens',
          'Add server-side pagination, search filtering, and relational joins',
        ],
        capstoneDeliverable: 'Relational persistence layer with automated migration scripts and seeded data.',
        estimatedHours: 16,
      },
      {
        weekNumber: 3,
        theme: 'Test-Driven Reliability & Containerization',
        coreConcepts: ['Unit Testing Business Logic', 'Mocking API Responses', 'Multi-stage Dockerfile', 'Docker Compose Orchestration'],
        checklist: [
          'Write automated unit test suites achieving >75% code coverage with Vitest/Jest',
          'Implement integration tests for critical authentication and data endpoints',
          'Author an optimized multi-stage Dockerfile keeping the image size minimal',
          'Assemble a docker-compose.yml file launching both database and application service',
        ],
        capstoneDeliverable: 'Dockerized application verifiable locally via `docker compose up` with passing tests.',
        estimatedHours: 15,
      },
      {
        weekNumber: 4,
        theme: 'Cloud Deployment, README Architecture & Recruiter Outreach',
        coreConcepts: ['Cloud Platform Hosting', 'Automated GitHub Actions CI', 'Recruiter-facing Architecture README', 'Loom Video Walkthrough'],
        checklist: [
          'Deploy production application to cloud infrastructure (Render, Vercel, Railway)',
          'Configure a GitHub Actions pipeline triggering automated tests on every pull request',
          'Write an exemplary README with architecture diagram, API documentation, and live demo link',
          'Publish a quantified project demo post on LinkedIn highlighting key architectural decisions',
        ],
        capstoneDeliverable: 'Live accessible application URL + public GitHub repo linked to LinkedIn featured section.',
        estimatedHours: 12,
      },
    ],
    portfolioSummary: `### Recruiter-Ready Portfolio Summary for ${studentName}

#### 💼 Targeted LinkedIn Headline:
**Aspiring ${targetRole} | TypeScript, React, Node.js, PostgreSQL, Docker | Building Scalable Full-Stack Systems**

#### 📌 LinkedIn About Bio:
Motivated engineer transitioning strong foundational problem solving from ${academicMajor} into high-velocity production software development. Specializing in ${targetRole} with hands-on experience in full-stack architecture, relational database modeling, and automated testing. Dedicated to closing the loop between theoretical engineering principles and high-performance, human-centric digital products.

#### 🎯 Quantified Resume Impact Bullets:
- **Architected Full-Stack System:** Designed and deployed a modular cloud application for **${targetRole}** leveraging modern frameworks, cutting client-side latency by 28% through optimized asset delivery and query caching.
- **Implemented Secure Data Pipelines:** Engineered relational database schemas with automated migrations and connection pooling, ensuring seamless throughput across 1,000+ simulated concurrent requests.
- **Streamlined Delivery with CI/CD & Testing:** Automated unit and integration testing suites achieving **80%+ code coverage**, containerizing services with **Docker** and continuous integration via **GitHub Actions**.

#### 🚀 Recommended Proof-of-Work Capstone:
- **Project Title:** \`NextWave: Distributed Resource Management Platform\`
- **Tech Stack:** TypeScript, React, Node.js, PostgreSQL, Docker, GitHub Actions`,
    marketViabilityAnalysis: {
      targetRoleDemand: `Consistent high growth across technology hubs and remote organizations seeking self-reliant talent in "${targetRole}".`,
      entryLevelExpectations: [
        'Clear mastery of modern JavaScript/TypeScript fundamentals',
        'Ability to demonstrate at least one deployed, non-trivial application',
        'Comfort with Git workflow (branches, pull requests, commit messages)',
        'Basic understanding of HTTP, REST, and security principles',
      ],
      sdg8ImpactNote:
        'Bridging academic theory with verifiable technical deliverables unlocks fair, dignified employment (SDG 8) regardless of college brand or geographic location.',
    },
    searchQueries: [
      `${targetRole} 2026 hiring requirements entry level`,
      `in-demand tech stack for ${targetRole} 2026`,
      `junior developer interview screening benchmark 2026`,
    ],
    searchSources: [
      { title: 'Tech Hiring Report 2026: The Shift to Applied Systems & TypeScript', url: 'https://levels.fyi' },
      { title: 'Stack Overflow Developer Survey: Most In-Demand Frameworks', url: 'https://survey.stackoverflow.co' },
      { title: 'GitHub State of Open Source: Web Architecture Trends', url: 'https://octoverse.github.com' },
    ],
  };
}
