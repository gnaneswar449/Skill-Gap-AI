/**
 * Complete Prompt Engineering Specification for
 * "SkillGap AI: Dynamic Skill-to-Job Readiness & Portfolio Generator"
 * Aligned with UN SDG 8: Decent Work & Economic Growth
 */

export interface PromptVariable {
  key: string;
  label: string;
  description: string;
  placeholder: string;
  defaultValue: string;
  required: boolean;
}

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CandidateSkill {
  name: string;
  proficiency: SkillProficiency;
}

export interface SkillGapItem {
  skill: string;
  category: 'core_language' | 'framework' | 'tools_devops' | 'system_design' | 'testing' | 'database';
  priority: 'Critical' | 'High' | 'Moderate';
  marketDemandReason: string;
  recommendedFreeResource: string;
  estimatedHoursToLearn?: number;
}

export interface RoadmapWeek {
  weekNumber: number;
  theme: string;
  coreConcepts: string[];
  checklist: string[];
  capstoneDeliverable: string;
  estimatedHours: number;
}

export interface CareerGuidanceOutput {
  readinessScore: number;
  readinessLevel: 'High Readiness' | 'Moderate Bridge Needed' | 'Foundational / Pivot Stage';
  executiveSummary: string;
  skillGaps: SkillGapItem[];
  roadmap: RoadmapWeek[];
  portfolioSummary: string;
  marketViabilityAnalysis: {
    targetRoleDemand: string;
    entryLevelExpectations: string[];
    sdg8ImpactNote: string;
  };
  searchQueries?: string[];
  searchSources?: Array<{ title: string; url: string }>;
  targetTier?: string;
  experienceLevel?: string;
}

export const PROMPT_VARIABLES: PromptVariable[] = [
  {
    key: 'studentName',
    label: 'Student Name',
    description: 'Name of the candidate or student',
    placeholder: 'e.g. Aarav Sharma',
    defaultValue: 'Aarav Sharma',
    required: true,
  },
  {
    key: 'academicMajor',
    label: 'Academic Major / Degree',
    description: 'Current degree, branch, or field of study',
    placeholder: 'e.g. B.Tech in Electronics & Communication (Tier-3 College)',
    defaultValue: 'B.Tech in Electronics & Communication Engineering',
    required: true,
  },
  {
    key: 'currentSkills',
    label: 'Current Skills & Tools',
    description: 'Languages, frameworks, academic coursework, or self-taught tools',
    placeholder: 'e.g. C++, Basic Python, HTML/CSS, Git, MySQL, Object-Oriented Programming',
    defaultValue: 'C++, Basic Python, HTML, CSS, JavaScript basics, MySQL, Git basics',
    required: true,
  },
  {
    key: 'targetRole',
    label: 'Target Job Role',
    description: 'Desired entry-level job title or internship',
    placeholder: 'e.g. Junior Full-Stack Developer (MERN / Node.js)',
    defaultValue: 'Junior Full-Stack Developer (React & Node.js)',
    required: true,
  },
  {
    key: 'experienceLevel',
    label: 'Experience Level / Year',
    description: 'Current year of study or post-graduate status',
    placeholder: 'e.g. Final Year Undergraduate (Class of 2026)',
    defaultValue: 'Final Year Undergraduate (Class of 2026)',
    required: false,
  },
  {
    key: 'locationContext',
    label: 'Regional / College Context',
    description: 'Tier-2/3 university context or regional employment goal',
    placeholder: 'e.g. Tier-3 University, aiming for remote or metro tech hub placement',
    defaultValue: 'Tier-3 University in Bhopal, targeting remote or Bangalore/Hyderabad tech hubs',
    required: false,
  },
];

export const SYSTEM_INSTRUCTION_TEXT = `### ROLE & PERSONA
You are an Elite Career Coach, Senior Technical Hiring Architect, and Global Talent Scout specializing in matching university students and early-career job seekers with modern tech market demands.
Your mission is directly anchored to UN Sustainable Development Goal 8 (SDG 8: Decent Work and Economic Growth) — to dismantle regional placement barriers, demystify tech recruiting standards, and empower ambitious candidates (especially from tier-2 and tier-3 colleges, autonomous institutes, and non-traditional backgrounds) with high-signal, proof-of-work hiring portfolios.

### CORE OBJECTIVES
When supplied with candidate inputs (academic major, current skills, target role, and educational context):
1. Evaluate Real-World Market Readiness: Benchmark the candidate's existing skill stack against current industry job postings (2025-2026 hiring standards). Compute an honest, objective \`readinessScore\` (0-100).
2. Pinpoint High-Friction Skill Gaps: Distinguish between baseline academic syllabus knowledge (e.g., textbook SQL, basic syntax) and production-grade tools (e.g., ORMs, containerization, async handling, RESTful API design, automated testing, CI/CD).
3. Architect an Intensive 4-Week Upskilling Roadmap: Deliver an actionable, week-by-week checklist with concrete project milestones, verified free/open learning resources, and realistic study hours.
4. Construct a High-Converting Portfolio Summary: Generate a polished, recruiter-tested markdown summary block featuring quantified resume impact bullet points, a punchy LinkedIn headline/bio, and a production capstone project blueprint.

### SCORING CALIBRATION RULES (0 - 100%)
- 0-35%: Exploratory / Fundamental Pivot (Candidate knows minimal core fundamentals of the target domain; requires full foundational ramp-up).
- 36-65%: High Potential Bridge Stage (Candidate has general coding aptitude or relevant degree fundamentals like OOP, algorithms, or SQL, but lacks production frameworks, API development, or deployment experience. Typical for high-potential tier-2/3 graduates).
- 66-84%: Industry Apprentice Ready (Candidate has built toy or tutorial apps; needs testing, architecture hygiene, containerization, and quantified proof-of-work).
- 85-100%: Job-Ready / High Demand (Has demonstrable production-grade projects, automated testing, CI/CD, and clean portfolio architecture).
*Rule:* Do NOT artificially inflate scores to flatter the candidate. Realistic, constructive honesty builds trust and unlocks genuine employment.

### TONE & DEMOGRAPHIC GUIDANCE
- Tone: Highly encouraging, authoritative yet approachable, pragmatic, and empowering.
- Never use condescending recruiter jargon without explaining it in practical terms.
- Understand the reality of tier-2/3 institutions: limited campus recruiting pipelines, lack of alumni referral networks, and curriculum lag behind industry frameworks.
- Prioritize "Proof-of-Work" (GitHub repositories with clean READMEs, live deployed demos on free tiers like Vercel/Render, and test suites) to overcome credential bias.

### STRUCTURED OUTPUT CONSTRAINTS
You MUST return ONLY a valid JSON object matching the requested schema. No conversational preamble, no markdown backticks outside of the JSON string values.`;

export const PROMPT_TEMPLATE_TEXT = `Please evaluate the following candidate for the role of {{targetRole}} and generate an actionable skill-to-job readiness evaluation, 4-week roadmap, and portfolio block aligned with SDG 8.

Candidate Profile:
- Full Name: {{studentName}}
- Academic Major & Degree: {{academicMajor}}
- Current Technical Skills: {{currentSkills}}
- Target Role: {{targetRole}}
- Experience Status: {{experienceLevel}}
- Institution / Location Context: {{locationContext}}

Analyze the candidate's profile against 2026 industry standards and provide:
1. An objective readiness percentage score (0-100) and readiness stage classification.
2. An executive summary summarizing strengths, latent potential, and primary bridges needed.
3. Categorized critical skill gaps prioritized by hiring urgency, explaining why each is required on day-one and recommending high-quality free learning resources.
4. A 4-week intensive upskilling roadmap with weekly themes, core topics, concrete task checklists, realistic weekly study hours, and a weekly capstone deliverable.
5. A recruiter-ready Portfolio Summary in Markdown format containing:
   - A high-impact LinkedIn Headline and About Bio.
   - Three quantified resume bullet points highlighting technical outcomes (Google XYZ format: "Accomplished [X], as measured by [Y], by doing [Z]").
   - A Capstone Project Blueprint designed to prove production readiness to hiring managers.
6. A brief market viability analysis highlighting target role hiring trends and SDG 8 economic mobility context.`;

export const JSON_SCHEMA_SPEC = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "SkillGapAnalysisResult",
  type: "object",
  properties: {
    readinessScore: {
      type: "integer",
      minimum: 0,
      maximum: 100,
      description: "Objective market readiness percentage (0-100)."
    },
    readinessLevel: {
      type: "string",
      enum: ["High Readiness", "Moderate Bridge Needed", "Foundational / Pivot Stage"],
      description: "Readiness stage classification."
    },
    executiveSummary: {
      type: "string",
      description: "2-3 sentence overview assessing candidate strengths and primary ramp-up requirements."
    },
    skillGaps: {
      type: "array",
      description: "List of critical missing technical skills or tools.",
      items: {
        type: "object",
        properties: {
          skill: { type: "string" },
          category: {
            type: "string",
            enum: ["core_language", "framework", "tools_devops", "system_design", "testing", "database"]
          },
          priority: {
            type: "string",
            enum: ["Critical", "High", "Moderate"]
          },
          marketDemandReason: {
            type: "string",
            description: "Why hiring managers filter for this skill in technical screens."
          },
          recommendedFreeResource: {
            type: "string",
            description: "Free, high-signal documentation, course, or tutorial."
          }
        },
        required: ["skill", "category", "priority", "marketDemandReason", "recommendedFreeResource"]
      }
    },
    roadmap: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      description: "Structured 4-week actionable checklist.",
      items: {
        type: "object",
        properties: {
          weekNumber: { type: "integer", minimum: 1, maximum: 4 },
          theme: { type: "string" },
          coreConcepts: {
            type: "array",
            items: { type: "string" }
          },
          checklist: {
            type: "array",
            items: { type: "string" },
            description: "Actionable concrete tasks the student can check off."
          },
          capstoneDeliverable: {
            type: "string",
            description: "Concrete output by Sunday (e.g. deployed service, repository link, schema design)."
          },
          estimatedHours: { type: "integer", minimum: 5, maximum: 30 }
        },
        required: ["weekNumber", "theme", "coreConcepts", "checklist", "capstoneDeliverable", "estimatedHours"]
      }
    },
    portfolioSummary: {
      type: "string",
      description: "A professional markdown block suitable for resumes, GitHub profile READMEs, and LinkedIn."
    },
    marketViabilityAnalysis: {
      type: "object",
      properties: {
        targetRoleDemand: { type: "string" },
        entryLevelExpectations: {
          type: "array",
          items: { type: "string" }
        },
        sdg8ImpactNote: { type: "string" }
      },
      required: ["targetRoleDemand", "entryLevelExpectations", "sdg8ImpactNote"]
    }
  },
  required: [
    "readinessScore",
    "readinessLevel",
    "executiveSummary",
    "skillGaps",
    "roadmap",
    "portfolioSummary",
    "marketViabilityAnalysis"
  ]
};

export const SAMPLE_PRESETS = [
  {
    id: 'tier3-ece-to-fullstack',
    title: 'Tier-3 ECE Student → Junior Full-Stack Developer',
    subtitle: 'Electronics background with basic C++/JS pivoting to MERN/Node.js',
    data: {
      studentName: 'Aarav Sharma',
      academicMajor: 'B.Tech in Electronics & Communication Engineering (Tier-3 College)',
      currentSkills: 'C++, Basic Python, HTML, CSS, JavaScript (ES5 basics), MySQL, Git fundamentals',
      targetRole: 'Junior Full-Stack Developer (React & Node.js / TypeScript)',
      experienceLevel: 'Final Year Engineering Student (Class of 2026)',
      locationContext: 'Tier-3 University in Indore, targeting remote or Bangalore startup ecosystem',
    },
  },
  {
    id: 'bca-to-cloud-devops',
    title: 'BCA Graduate → Cloud & DevOps Associate',
    subtitle: 'Computer Application degree with Linux basics seeking cloud infrastructure role',
    data: {
      studentName: 'Priya Patel',
      academicMajor: 'Bachelor of Computer Applications (BCA)',
      currentSkills: 'Linux basic commands, Bash scripting basics, Python fundamentals, Networking fundamentals (TCP/IP), MySQL',
      targetRole: 'Junior Cloud & DevOps Associate (Docker, AWS, CI/CD)',
      experienceLevel: 'Recent Graduate (0-6 months freelance experience)',
      locationContext: 'Regional college in Gujarat, preparing for pan-India remote and GCC hiring',
    },
  },
  {
    id: 'math-to-data-analyst',
    title: 'B.Sc Mathematics → Entry-Level Data Analyst / Scientist',
    subtitle: 'Strong quantitative foundation transitioning to Pandas, SQL, & BI pipelines',
    data: {
      studentName: 'Amit Kumar',
      academicMajor: 'B.Sc in Mathematics & Statistics',
      currentSkills: 'Advanced Calculus, Probability & Statistics, Basic Python, Excel formulas, Linear Algebra',
      targetRole: 'Junior Data Analyst & Business Intelligence Specialist',
      experienceLevel: 'Pre-final Year Student',
      locationContext: 'Tier-2 State University, seeking corporate analytics role',
    },
  },
  {
    id: 'civil-to-frontend',
    title: 'Non-CS Graduate (Civil) → Frontend Web Engineer',
    subtitle: 'Self-taught career switcher focusing on React, TypeScript, and modern UI',
    data: {
      studentName: 'Sneha Reddy',
      academicMajor: 'B.Tech in Civil Engineering (Career Switcher)',
      currentSkills: 'HTML5, CSS3, Modern JavaScript (ES6+), Responsive Design, Figma basics, Git',
      targetRole: 'Junior Frontend Developer (React, TypeScript, Tailwind)',
      experienceLevel: 'Self-taught 8 months, 2 personal pet projects',
      locationContext: 'Hyderabad periphery, actively applying via LinkedIn and GitHub showcase',
    },
  },
];

export const FEW_SHOT_EXAMPLE = {
  input: {
    studentName: 'Rohan Deshmukh',
    academicMajor: 'B.E. Information Technology (Tier-3 Private College)',
    currentSkills: 'Java (Core & OOPs), HTML/CSS, Basic SQL, JDBC, Git clone/push basics',
    targetRole: 'Junior Backend Engineer (Java Spring Boot / Microservices)',
    experienceLevel: 'Final Year Student (Looking for off-campus placement)',
    locationContext: 'Nagpur, targeting off-campus MNC and product startup drives',
  },
  output: {
    readinessScore: 58,
    readinessLevel: 'Moderate Bridge Needed',
    executiveSummary:
      'Rohan demonstrates solid theoretical Java OOP fundamentals and relational database concepts from academic coursework. However, commercial entry-level roles require hands-on experience with Spring Boot, RESTful contract design, ORM persistence (Spring Data JPA), automated unit testing, and Docker containerization.',
    skillGaps: [
      {
        skill: 'Spring Boot 3 & REST API Architecture',
        category: 'framework',
        priority: 'Critical',
        marketDemandReason:
          'Over 85% of enterprise Java entry-level roles expect candidates to scaffold and build RESTful endpoints using Spring Web, dependency injection, and controller-service-repository patterns.',
        recommendedFreeResource: 'Spring.io official "Building a RESTful Web Service" guide & freeCodeCamp Spring Boot tutorial.',
      },
      {
        skill: 'Hibernate / Spring Data JPA & PostgreSQL',
        category: 'database',
        priority: 'Critical',
        marketDemandReason:
          'Raw JDBC queries covered in college syllabi are rarely written manually in modern production; hiring managers test candidates on entity relationships, pagination, indexing, and connection pools.',
        recommendedFreeResource: 'Baeldung Spring Data JPA Guides and Vlad Mihalcea High-Performance Java Persistence blog.',
      },
      {
        skill: 'JUnit 5 & Mockito Unit Testing',
        category: 'testing',
        priority: 'High',
        marketDemandReason:
          'Tier-2/3 candidates who submit test-driven code with Mockito mocks instantly differentiate themselves from 90% of applicants who only write happy-path code.',
        recommendedFreeResource: 'JUnit 5 User Guide and Marco Behler Testing with Spring Boot course.',
      },
      {
        skill: 'Docker & Containerized Deployment',
        category: 'tools_devops',
        priority: 'High',
        marketDemandReason:
          'Recruiters value candidates who can deliver a Dockerfile that allows any interviewer to clone and run the service in one command (\`docker compose up\`).',
        recommendedFreeResource: 'Docker Official Getting Started Tutorial & freeCodeCamp Docker for Beginners.',
      },
    ],
    roadmap: [
      {
        weekNumber: 1,
        theme: 'Modern Java & Spring Boot Fundamentals',
        coreConcepts: ['Java 17/21 Records & Streams', 'Spring IoC & Dependency Injection', 'RESTful Controller & DTO pattern', 'Bean Validation'],
        checklist: [
          'Setup Spring Initializr project with Web, Lombok, and DevTools dependencies',
          'Implement CRUD endpoints for a Student/Course management API using clean HTTP verbs (GET, POST, PUT, DELETE)',
          'Add Jakarta validation (@NotNull, @Email, @Size) with centralized @ControllerAdvice error handling',
          'Verify all endpoints using Postman / Thunder Client collection',
        ],
        capstoneDeliverable: 'GitHub repository: Clean Spring Boot REST API with Swagger/OpenAPI documentation and input validation.',
        estimatedHours: 14,
      },
      {
        weekNumber: 2,
        theme: 'Data Persistence, PostgreSQL & JPA Relationships',
        coreConcepts: ['PostgreSQL setup', 'Spring Data JPA', 'Entity Mappings (@OneToMany, @ManyToOne)', 'Pagination and Sorting'],
        checklist: [
          'Spin up a local PostgreSQL database or free Supabase instance',
          'Replace in-memory lists with Spring Data JPA entities and custom repository query methods',
          'Implement indexed search, pagination, and sorting for high-volume record queries',
          'Configure database connection pooling with HikariCP and database migrations via Flyway',
        ],
        capstoneDeliverable: 'Relational DB persistence layer with Flyway migration scripts committed to version control.',
        estimatedHours: 16,
      },
      {
        weekNumber: 3,
        theme: 'Test-Driven Quality & Containerization',
        coreConcepts: ['JUnit 5 Assertions', 'Mockito Mocks (@Mock, @InjectMocks)', 'MockMvc Integration Testing', 'Dockerization'],
        checklist: [
          'Write unit tests for the Service layer testing business logic and edge conditions with Mockito',
          'Write slice integration tests for Controllers with MockMvc verifying HTTP status codes and JSON payloads',
          'Write a multi-stage Dockerfile optimizing the Spring Boot layered JAR image size',
          'Create a docker-compose.yml file that launches both PostgreSQL and the Spring Boot application',
        ],
        capstoneDeliverable: 'Test suite achieving >80% code coverage report + Docker Compose file that runs locally in 1 command.',
        estimatedHours: 15,
      },
      {
        weekNumber: 4,
        theme: 'Cloud Deployment, README Architecture & Portfolio Packaging',
        coreConcepts: ['Render / Railway cloud deployment', 'GitHub Actions CI workflow', 'Recruiter-facing Architecture README', 'Demo Video walkthrough'],
        checklist: [
          'Deploy the containerized backend to Render or Railway with health-check endpoint (\`/actuator/health\`)',
          'Add a GitHub Actions workflow that executes tests automatically on every pull request',
          'Write a pristine README.md containing an architecture diagram, API documentation, and curl demo snippets',
          'Record a 90-second Loom/YouTube demo showcasing API requests, database queries, and code organization',
        ],
        capstoneDeliverable: 'Live deployed production URL + Public GitHub repository linked to LinkedIn featured section.',
        estimatedHours: 12,
      },
    ],
    portfolioSummary: `### Recruiter-Ready Portfolio Summary for Rohan Deshmukh

#### 💼 Targeted LinkedIn Headline:
**Aspiring Backend Software Engineer | Java 21, Spring Boot 3, PostgreSQL, Docker | Building Scalable REST APIs**

#### 📌 LinkedIn About Bio:
Passionate backend engineer with a strong foundation in Object-Oriented Design, relational database modeling, and microservice architectures. Focused on building high-reliability RESTful web services with Java, Spring Boot, and PostgreSQL. Dedicated to writing clean, test-driven code validated with JUnit/Mockito and containerized with Docker. Actively seeking junior backend engineering opportunities where I can contribute to mission-critical distributed systems.

#### 🎯 Quantified Resume Impact Bullets:
- **Architected and Deployed RESTful Microservice:** Engineered a multi-tier course enrollment API using **Java 21, Spring Boot 3, and PostgreSQL**, implementing centralized exception handling and custom DTO mapping that reduced payload size by 30%.
- **Optimized Persistence & Query Performance:** Designed relational entity models utilizing **Spring Data JPA and HikariCP**, implementing indexed queries and server-side pagination to sustain sub-50ms query response times.
- **Enforced Production Code Reliability:** Authored comprehensive test suites using **JUnit 5 and Mockito**, achieving **84% code coverage** and integrating automated CI test execution via **GitHub Actions** and containerized deployment via **Docker**.

#### 🚀 Recommended Proof-of-Work Capstone:
- **Project Title:** \`EduPulse: Resilient Course Registration Engine\`
- **Tech Stack:** Java 21, Spring Boot 3, Spring Data JPA, PostgreSQL, Docker, GitHub Actions, OpenAPI 3.0
- **Key Differentiator:** Includes real-time concurrency handling for limited seat enrollments, pessimistic locking, and automated CI/CD pipeline.`,
    marketViabilityAnalysis: {
      targetRoleDemand: 'High enterprise demand across BFSI, SaaS startups, and Global Capability Centers (GCCs) in India.',
      entryLevelExpectations: [
        'Strong grasp of Core Java memory model, collections, and streams',
        'Ability to build clean REST contracts without leaking internal database entities',
        'Experience reading and writing unit tests with Mockito',
        'Familiarity with Git branching and Docker basics',
      ],
      sdg8ImpactNote:
        'Targeted upskilling empowers talented graduates from tier-2/3 engineering colleges to bypass off-campus credential bias, directly demonstrating production skills required for decent work and livable compensation.',
    },
  },
};
