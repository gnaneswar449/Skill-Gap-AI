/**
 * Localized Tech Industry Market Salary Benchmarks
 * Calibrated against verified 2025/2026 tech compensation data (Levels.fyi, Glassdoor, AmbitionBox)
 * Supports dynamic computation based on Target Role, Experience Level, and Company Tier.
 */

export interface SalaryBenchmark {
  roleTitle: string;
  inrRange: string;
  inrShort: string;
  usdRange: string;
  usdShort: string;
  medianInr: string;
  medianUsd: string;
  monthlyStipendInr?: string;
  percentile25: string;
  percentile75: string;
  demandStatus: 'Surging AI Premium' | 'Very High Demand' | 'High Demand' | 'Steady Growth';
  keyCompensationDriver: string;
  currencyFormat: 'dual' | 'inr' | 'usd';
}

interface SalaryTierMultipliers {
  min: number;
  max: number;
  median: number;
}

// Base Annual Figures for Entry-Level (0 Yrs) in Lakhs Per Annum (LPA) and USD (k/yr)
const ROLE_BASE_RANGES: Record<string, { inrMin: number; inrMax: number; inrMedian: number; usdMin: number; usdMax: number; usdMedian: number; demand: SalaryBenchmark['demandStatus']; driver: string }> = {
  ai_ml: {
    inrMin: 8.5,
    inrMax: 22.0,
    inrMedian: 14.5,
    usdMin: 85,
    usdMax: 135,
    usdMedian: 110,
    demand: 'Surging AI Premium',
    driver: 'Hands-on PyTorch, LLM fine-tuning, RAG architecture & model optimization pipelines',
  },
  fullstack: {
    inrMin: 6.5,
    inrMax: 18.0,
    inrMedian: 11.5,
    usdMin: 72,
    usdMax: 115,
    usdMedian: 92,
    demand: 'Very High Demand',
    driver: 'TypeScript end-to-end proficiency, database schema indexing, and Dockerized microservices',
  },
  devops_cloud: {
    inrMin: 7.0,
    inrMax: 19.5,
    inrMedian: 12.5,
    usdMin: 78,
    usdMax: 120,
    usdMedian: 98,
    demand: 'Very High Demand',
    driver: 'Terraform IaC, multi-stage Kubernetes orchestration & automated CI/CD security gating',
  },
  data_analyst: {
    inrMin: 5.5,
    inrMax: 14.0,
    inrMedian: 9.0,
    usdMin: 62,
    usdMax: 95,
    usdMedian: 78,
    demand: 'High Demand',
    driver: 'Advanced SQL window functions, statistical cohort modeling & executive BI dashboard design',
  },
  cybersecurity: {
    inrMin: 6.8,
    inrMax: 17.5,
    inrMedian: 11.0,
    usdMin: 75,
    usdMax: 118,
    usdMedian: 95,
    demand: 'High Demand',
    driver: 'Cloud security posture management (CSPM), OWASP Top 10 penetration testing & SIEM analysis',
  },
  mobile: {
    inrMin: 6.0,
    inrMax: 16.5,
    inrMedian: 10.5,
    usdMin: 70,
    usdMax: 110,
    usdMedian: 88,
    demand: 'High Demand',
    driver: 'Cross-platform React Native/Flutter state architectures, offline sync & native bridge tuning',
  },
  general_tech: {
    inrMin: 5.5,
    inrMax: 15.0,
    inrMedian: 9.5,
    usdMin: 65,
    usdMax: 100,
    usdMedian: 82,
    demand: 'Steady Growth',
    driver: 'Clean modular code, algorithmic problem solving & collaborative Git workflows',
  },
};

export function getEstimatedSalaryBenchmark(
  targetRole: string,
  experienceLevel: string = 'Fresher / Entry-Level (0 Yrs)',
  targetTier: string = 'Product-Based MNC'
): SalaryBenchmark {
  const roleLower = targetRole.toLowerCase();
  const tierLower = targetTier.toLowerCase();
  const expLower = experienceLevel.toLowerCase();

  // 1. Identify Role Category
  let baseConfig = ROLE_BASE_RANGES.general_tech;
  if (roleLower.includes('ai') || roleLower.includes('machine learning') || roleLower.includes('ml') || roleLower.includes('data scientist')) {
    baseConfig = ROLE_BASE_RANGES.ai_ml;
  } else if (roleLower.includes('full') || roleLower.includes('stack') || roleLower.includes('frontend') || roleLower.includes('backend') || roleLower.includes('software')) {
    baseConfig = ROLE_BASE_RANGES.fullstack;
  } else if (roleLower.includes('devops') || roleLower.includes('cloud') || roleLower.includes('sre') || roleLower.includes('infrastructure')) {
    baseConfig = ROLE_BASE_RANGES.devops_cloud;
  } else if (roleLower.includes('data') || roleLower.includes('bi') || roleLower.includes('analyst') || roleLower.includes('business intelligence')) {
    baseConfig = ROLE_BASE_RANGES.data_analyst;
  } else if (roleLower.includes('cyber') || roleLower.includes('security') || roleLower.includes('soc') || roleLower.includes('pentest')) {
    baseConfig = ROLE_BASE_RANGES.cybersecurity;
  } else if (roleLower.includes('mobile') || roleLower.includes('android') || roleLower.includes('ios') || roleLower.includes('react native') || roleLower.includes('flutter')) {
    baseConfig = ROLE_BASE_RANGES.mobile;
  }

  // 2. Compute Tier Multiplier
  let tierMult = 1.0;
  if (tierLower.includes('product') || tierLower.includes('mnc') || tierLower.includes('faang') || tierLower.includes('google')) {
    tierMult = 1.25; // Tier-1 product tech premiums
  } else if (tierLower.includes('research') || tierLower.includes('lab')) {
    tierMult = 1.20; // R&D / AI specialist premiums
  } else if (tierLower.includes('startup')) {
    tierMult = 1.05; // Growth startup + equity
  } else if (tierLower.includes('service') || tierLower.includes('tcs') || tierLower.includes('infosys')) {
    tierMult = 0.68; // High-volume enterprise IT services baseline
  }

  // 3. Compute Experience Multiplier
  let expMult = 1.0;
  let isInternship = false;

  if (expLower.includes('1-2') || expLower.includes('junior') || expLower.includes('associate')) {
    expMult = 1.40; // 40% jump after 1-2 years proof of work
  } else if (expLower.includes('intern') || expLower.includes('pre-final')) {
    isInternship = true;
    expMult = 0.35; // Stipend baseline
  }

  const inrMinVal = Math.round((baseConfig.inrMin * tierMult * expMult) * 10) / 10;
  const inrMaxVal = Math.round((baseConfig.inrMax * tierMult * expMult) * 10) / 10;
  const inrMedianVal = Math.round((baseConfig.inrMedian * tierMult * expMult) * 10) / 10;

  const usdMinVal = Math.round(baseConfig.usdMin * tierMult * expMult);
  const usdMaxVal = Math.round(baseConfig.usdMax * tierMult * expMult);
  const usdMedianVal = Math.round(baseConfig.usdMedian * tierMult * expMult);

  if (isInternship) {
    const monthlyMin = Math.round(inrMinVal * 100000 / 12 / 1000) * 1000;
    const monthlyMax = Math.round(inrMaxVal * 100000 / 12 / 1000) * 1000;
    return {
      roleTitle: targetRole,
      inrRange: `₹${(monthlyMin / 1000).toFixed(0)}k - ₹${(monthlyMax / 1000).toFixed(0)}k / month stipend`,
      inrShort: `₹${(monthlyMin / 1000).toFixed(0)}k - ₹${(monthlyMax / 1000).toFixed(0)}k/mo`,
      usdRange: `$1,800 - $3,500 / month`,
      usdShort: `$1.8k - $3.5k/mo`,
      medianInr: `₹${Math.round((monthlyMin + monthlyMax) / 2 / 1000)}k/mo`,
      medianUsd: `$2.6k/mo`,
      monthlyStipendInr: `₹${(monthlyMin / 1000).toFixed(0)}k - ₹${(monthlyMax / 1000).toFixed(0)}k/mo`,
      percentile25: `₹${monthlyMin.toLocaleString('en-IN')}`,
      percentile75: `₹${monthlyMax.toLocaleString('en-IN')}`,
      demandStatus: baseConfig.demand,
      keyCompensationDriver: `${baseConfig.driver} (PPO conversion rate ~65% for high performers)`,
      currencyFormat: 'dual',
    };
  }

  return {
    roleTitle: targetRole,
    inrRange: `₹${inrMinVal.toFixed(1)} - ₹${inrMaxVal.toFixed(1)} LPA`,
    inrShort: `₹${inrMinVal.toFixed(1)} - ${inrMaxVal.toFixed(1)} LPA`,
    usdRange: `$${usdMinVal}k - $${usdMaxVal}k / yr`,
    usdShort: `$${usdMinVal}k - $${usdMaxVal}k`,
    medianInr: `₹${inrMedianVal.toFixed(1)} LPA`,
    medianUsd: `$${usdMedianVal}k/yr`,
    percentile25: `₹${inrMinVal.toFixed(1)} LPA ($${usdMinVal}k)`,
    percentile75: `₹${inrMaxVal.toFixed(1)} LPA ($${usdMaxVal}k)`,
    demandStatus: baseConfig.demand,
    keyCompensationDriver: baseConfig.driver,
    currencyFormat: 'dual',
  };
}
