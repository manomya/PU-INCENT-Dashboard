import { headers } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface DashboardData {
  total_startups: number;
  active_startups?: number;
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

export async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const headersList = await headers();
    const cookie = headersList.get('cookie') || '';
    const res = await fetch(`${API_BASE_URL}/dashboard`, { 
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie }
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getStartups(): Promise<Startup[] | null> {
  try {
    const headersList = await headers();
    const cookie = headersList.get('cookie') || '';
    const res = await fetch(`${API_BASE_URL}/startups`, { 
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie }
    });
    if (!res.ok) throw new Error('Failed to fetch startups');
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getStartupById(id: string): Promise<StartupDetails | null> {
  try {
    const headersList = await headers();
    const cookie = headersList.get('cookie') || '';
    const res = await fetch(`${API_BASE_URL}/startups/${id}`, { 
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie }
    });
    if (!res.ok) throw new Error('Failed to fetch startup');
    const data = await res.json();
    if (data.error) return null;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getMentors(): Promise<Mentor[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/mentors/`, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error('Failed to fetch mentors');
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getStartupCategories(): Promise<string[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/startups/categories`, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error('Failed to fetch startup categories');
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getStartupStages(): Promise<string[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/startups/stages`, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error('Failed to fetch startup stages');
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}