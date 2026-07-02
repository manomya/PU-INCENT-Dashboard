import { headers } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api` : 'http://localhost:3000/api');

export interface DashboardData {
  total_startups: number;
  active_startups?: number;
  total_domains?: number;
  total_mentors: number;
  total_funding: string;
  active_events: number;
  startups_growth: { month: string; startups: number }[];
  domain_distribution: { name: string; value: number }[];
  upcoming_events: { id: string; title: string; date: string; time: string }[];
  pending_tasks: { id: string; title: string; status: string }[];
}

export interface Startup {
  startup_id: string;
  startup_name: string;
  logo: string;
  domain: string;
  founder_name: string;
  founders_photo: string;
  college_email: string;
  phone_number: string;
  year: string;
  department: string;
  registration_number: string;
  branch: string;
  co_founder: string;
  stage: string;
  website: string;
  incubation_start_date: string;
  personal_email: string;
  msme_registration: string;
  pitch_deck: string;
}

export interface StartupDetails {
  "Startup Registration number"?: string;
  "Startup Name"?: string;
  "Logo"?: string;
  "Domain"?: string;
  "Founder Name"?: string;
  "Founder's Photo"?: string;
  "College Email"?: string;
  "Phone Number"?: string | number;
  "Year"?: string | number;
  "Department"?: string;
  "Registration Number"?: string;
  "Branch"?: string;
  "Co - Founder"?: string;
  "Stage"?: string;
  "Website"?: string;
  "Incubation Start Date"?: string;
  "Personal Email"?: string;
  "MSME Registration "?: string;
  "Pitch Deck"?: string;
}

export interface Mentor {
  ID: string;
  Name: string;
  Expertise: string;
  Company: string;
  "Experience Years"?: number;
  "Assigned Startups"?: string;
}

import { getSheetData } from '@/lib/google-sheets';

export async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const startups = await getSheetData("Master_Database 2026-27");
    if (!startups || startups.length === 0) {
      return { total_startups: 0, active_startups: 0, total_domains: 0 } as any;
    }
    const validStartups = startups.filter((row: any) => 
      row["Startup Registration number"] && String(row["Startup Registration number"]).trim() !== ""
    );
    const activeStartups = validStartups.filter((row: any) => {
      const stage = String(row["Stage"] || "").trim().toUpperCase();
      return stage !== "" && stage !== "NO IDEA";
    });
    const domains = new Set(validStartups.map((row: any) => String(row["Domain"] || "").trim().toLowerCase()).filter(Boolean));

    return {
      total_startups: validStartups.length,
      active_startups: activeStartups.length,
      total_domains: domains.size,
    } as any;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getStartups(): Promise<Startup[] | null> {
  try {
    const startups = await getSheetData("Master_Database 2026-27");
    if (!startups || startups.length === 0) return [];
    
    // Map the google sheets headers to the Startup interface format
    return startups.map((row: any) => ({
      startup_id: row["Startup Registration number"] || "",
      startup_name: row["Startup Name"] || "",
      logo: row["Logo"] || "",
      domain: row["Domain"] || "",
      founder_name: row["Founder Name"] || "",
      founders_photo: row["Founder's Photo"] || "",
      college_email: row["College Email"] || "",
      phone_number: row["Phone Number"] || "",
      year: row["Year"] || "",
      department: row["Department"] || "",
      registration_number: row["Registration Number"] || "",
      branch: row["Branch"] || "",
      co_founder: row["Co - Founder"] || "",
      stage: row["Stage"] || "",
      website: row["Website"] || "",
      incubation_start_date: row["Incubation Start Date"] || "",
      personal_email: row["Personal Email"] || "",
      msme_registration: row["MSME Registration "] || "",
      pitch_deck: row["Pitch Deck"] || "",
    }));
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getStartupById(id: string): Promise<StartupDetails | null> {
  try {
    const data = await getSheetData("Master_Database 2026-27");
    for (const startup of data) {
      if (String(startup["Startup Registration number"] || "").trim() === String(id).trim()) {
        return startup as StartupDetails;
      }
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getMentors(): Promise<Mentor[] | null> {
  // Mock or empty if mentors aren't implemented yet, to prevent fetch errors
  return [];
}

export async function getStartupCategories(): Promise<string[] | null> {
  try {
    const data = await getSheetData("Master_Database 2026-27");
    const categories: Record<string, number> = {};
    for (const startup of data) {
      const category = startup["Domain"];
      if (category) {
        categories[category] = (categories[category] || 0) + 1;
      }
    }
    return Object.keys(categories);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getStartupStages(): Promise<string[] | null> {
  try {
    const data = await getSheetData("Master_Database 2026-27");
    const stages: Record<string, number> = {};
    for (const startup of data) {
      const stage = startup["Stage"];
      if (stage) {
        stages[stage] = (stages[stage] || 0) + 1;
      }
    }
    return Object.keys(stages);
  } catch (error) {
    console.error(error);
    return null;
  }
}