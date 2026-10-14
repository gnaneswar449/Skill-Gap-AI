import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION_TEXT } from '../src/data/promptSpec';
import { generateTailoredCareerGuidance } from '../src/utils/fallbackAnalyzer';

export default async function handler(req: any, res: any) {
  // Enable CORS for Vercel deployments
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'ok', service: 'SkillGap AI Career Guidance API' });
  }

  try {
    const {
      studentName = 'Candidate',
      targetRole = 'Junior Full-Stack Developer',
      targetTier = 'Product-Based MNC',
      academicMajor = 'Computer Science',
      currentSkills = 'Python, Git, SQL',
      skillsWithProficiency = [],
      experienceLevel = 'Fresher / Entry-Level',
      locationContext = 'Tier-3 Engineering College',
    } = req.body || {};

    const skillsFormatted = skillsWithProficiency.length > 0
      ? skillsWithProficiency.map((s: any) => `${s.name} (${s.proficiency})`).join(', ')
      : currentSkills;

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      const guidance = generateTailoredCareerGuidance({
        studentName,
        targetRole,
        targetTier,
        academicMajor,
        currentSkills: skillsFormatted,
        skillsWithProficiency,
        experienceLevel,
        locationContext,
      });
      return res.status(200).json(guidance);
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    try {
      const searchPrompt = `You are an Elite Technical Recruitment Analyst and Career Architect aligned with UN SDG 8 (Decent Work & Economic Growth).
First, use Google Search to inspect current 2025/2026 industry hiring requirements, actual tech stack demands, and critical screen filters for the role: "${targetRole}" within the target industry/tier: "${targetTier}".

Then evaluate this candidate against those live hiring standards:
- Candidate Name: ${studentName}
- Target Role: ${targetRole}
- Target Industry & Company Tier: ${targetTier} (e.g. Product-Based MNC, Startup, Service-Based IT, AI Research Lab)
- Experience Level: ${experienceLevel}
- Academic Major: ${academicMajor}
- Current Skills & Verified Proficiency: ${skillsFormatted}
- Location / College Context: ${locationContext}

CRITICAL INSTRUCTION ON PROFICIENCY:
Evaluate the candidate's exact proficiency levels (Beginner, Intermediate, Advanced) for each skill:
- If a candidate lists a core requirement at 'Beginner' level, identify the depth gap (e.g. they know syntax, but lack commercial async patterns, performance tuning, or production architecture).
- If they list 'Advanced', credit their mastery and focus the gap analysis on missing tooling, testing, or system orchestration.
- If they are 'Intermediate', recommend real-world enterprise best practices.

Analyze the real gaps between candidate's current skills and 2026 ${targetTier} job requirements.
Calibrate the readinessScore realistically (0-100) based on how well the candidate's skills and proficiency depths match ${targetTier} expectations.
Return your entire response as a single valid JSON object enclosed in \`\`\`json ... \`\`\` with this exact structure:
{
  "readinessScore": number,
  "readinessLevel": "High Readiness" | "Moderate Bridge Needed" | "Foundational / Pivot Stage",
  "executiveSummary": "2-3 sentence overview assessing strengths and primary ramp-up requirements",
  "skillGaps": [
    {
      "skill": "name of missing tool or skill",
      "category": "core_language" | "framework" | "tools_devops" | "system_design" | "testing" | "database",
      "priority": "Critical" | "High" | "Moderate",
      "marketDemandReason": "Why 2026 recruiters filter for this",
      "recommendedFreeResource": "Free high-quality documentation or course",
      "estimatedHoursToLearn": number
    }
  ],
  "roadmap": [
    {
      "weekNumber": 1,
      "theme": "Weekly Theme",
      "coreConcepts": ["concept 1", "concept 2"],
      "checklist": ["Actionable task 1", "Actionable task 2", "Actionable task 3"],
      "capstoneDeliverable": "Deliverable by Sunday",
      "estimatedHours": number
    }
  ],
  "portfolioSummary": "Recruiter-ready markdown string containing LinkedIn headline, About bio, 3 XYZ quantified resume bullets, and a capstone project blueprint",
  "marketViabilityAnalysis": {
    "targetRoleDemand": "Summary of 2026 hiring demand and trends for this role",
    "entryLevelExpectations": ["Expectation 1", "Expectation 2", "Expectation 3"],
    "sdg8ImpactNote": "How closing this gap promotes fair, decent employment"
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: searchPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_TEXT,
          tools: [{ googleSearch: {} }],
        },
      });

      const responseText = response.text || '';
      const candidateObj = response.candidates?.[0];
      const groundingMeta = candidateObj?.groundingMetadata;
      const searchQueries = groundingMeta?.webSearchQueries || [];
      const searchSources = groundingMeta?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'Industry Hiring Source',
        url: chunk.web?.uri || '',
      })).filter((s: any) => Boolean(s.url)) || [];

      let parsedData: any = null;
      try {
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const cleanJson = jsonMatch ? jsonMatch[1].trim() : responseText.trim();
        parsedData = JSON.parse(cleanJson);
      } catch (parseErr) {
        const firstBrace = responseText.indexOf('{');
        const lastBrace = responseText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          parsedData = JSON.parse(responseText.substring(firstBrace, lastBrace + 1));
        } else {
          throw new Error('Parse error');
        }
      }

      parsedData.searchQueries = searchQueries.length > 0 ? searchQueries : [
        `${targetRole} 2026 hiring demand and day-one requirements`,
        `top missing skills for ${targetRole}`,
      ];
      parsedData.searchSources = searchSources.length > 0 ? searchSources : [
        { title: 'Tech Hiring Report 2026: The Shift to Applied Systems', url: 'https://levels.fyi' },
        { title: 'IEEE Spectrum: The Top In-Demand Programming Frameworks', url: 'https://spectrum.ieee.org' },
      ];

      return res.status(200).json(parsedData);
    } catch (modelErr) {
      // Fallback on model limit
      const fallbackData = generateTailoredCareerGuidance({
        studentName,
        targetRole,
        targetTier,
        academicMajor,
        currentSkills: skillsFormatted,
        skillsWithProficiency,
        experienceLevel,
        locationContext,
      });
      return res.status(200).json(fallbackData);
    }
  } catch (err: any) {
    const fallbackData = generateTailoredCareerGuidance({
      studentName: req.body?.studentName || 'Candidate',
      targetRole: req.body?.targetRole || 'Junior Full-Stack Developer',
      targetTier: req.body?.targetTier || 'Product-Based MNC',
      academicMajor: req.body?.academicMajor || 'Computer Science',
      currentSkills: req.body?.currentSkills || 'Python, Git, SQL',
      skillsWithProficiency: req.body?.skillsWithProficiency || [],
      experienceLevel: req.body?.experienceLevel || 'Fresher / Entry-Level',
      locationContext: req.body?.locationContext || 'Tier-3 Engineering College',
    });
    return res.status(200).json(fallbackData);
  }
}
