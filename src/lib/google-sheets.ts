import { google } from "googleapis";
import path from "path";
import dbConnect from '@/lib/mongodb';
import { AuditLog } from '@/models/AuditLog';
import { StartupSnapshot } from '@/models/StartupSnapshot';

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive",
];

// Determine whether to use environment variables or local keyFile
const useEnvAuth = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY;

export const auth = new google.auth.GoogleAuth(
  useEnvAuth
    ? {
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        },
        scopes: SCOPES,
      }
    : {
        keyFile: path.join(process.cwd(), "credentials/service-account.json"),
        scopes: SCOPES,
      }
);

const SHEET_ID = "1wWCxLnNGoKZNQMrOd8ZRfdACdVxSK21F9eUM_1uH9oA";

// Simple memory cache to prevent Google Sheets rate limits and speed up responses. 
// Set to 5 seconds so manual sheet edits reflect almost instantly on page refresh!
const CACHE: Record<string, { data: any[]; timestamp: number }> = {};
const CACHE_TTL = 5 * 1000; // 5 seconds in ms

export function clearSheetCache(sheetName: string) {
  if (CACHE[sheetName]) {
    delete CACHE[sheetName];
  }
}

export async function getSheetData(sheetName: string) {
  const currentTime = Date.now();

  if (CACHE[sheetName]) {
    const { data, timestamp } = CACHE[sheetName];
    if (currentTime - timestamp < CACHE_TTL) {
      return data;
    }
  }

  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client as any });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: sheetName,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return [];
  }

  const headers = rows[0] as string[];
  const data = rows.slice(1).map((row) => {
    const rowData: Record<string, any> = {};
    headers.forEach((header, index) => {
      rowData[header] = row[index] || "";
    });
    return rowData;
  });

  CACHE[sheetName] = { data, timestamp: currentTime };
  
  // Track direct sheet edits asynchronously
  if (sheetName.startsWith("Master_Database")) {
    trackSheetEdits(sheetName, data).catch(err => console.error(err));
  }
  
  return data;
}

async function trackSheetEdits(sheetName: string, newData: any[]) {
  try {
    await dbConnect();
    const snapshot = await StartupSnapshot.findOne({ sheetName });
    
    if (!snapshot) {
      await StartupSnapshot.create({ sheetName, data: JSON.stringify(newData) });
      return;
    }
    
    const oldData = JSON.parse(snapshot.data);
    const oldMap = new Map(oldData.map((s: any) => [s["Startup Registration number"], s]));
    
    const changesToLog = [];
    
    for (const newStartup of newData) {
      const id = newStartup["Startup Registration number"];
      if (!id || String(id).trim() === "") continue;
      
      const oldStartup = oldMap.get(id);
      if (!oldStartup) {
        // Check if there's a recent CREATE log (within 2 mins)
        const recentLog = await AuditLog.findOne({ startupId: id, action: 'CREATE' }).sort({ timestamp: -1 });
        if (!recentLog || (Date.now() - new Date(recentLog.timestamp).getTime() > 120000)) {
           changesToLog.push({
             action: 'CREATE',
             startupId: id,
             startupName: newStartup["Startup Name"] || 'Unknown',
             user: 'Google Sheet (Direct Edit)',
             changes: []
           });
        }
      } else {
        const fieldChanges = [];
        const ns = newStartup as Record<string, any>;
        const os = oldStartup as Record<string, any>;
        for (const key of Object.keys(ns)) {
          if (ns[key] !== os[key]) {
            fieldChanges.push({
              field: key,
              oldValue: os[key],
              newValue: ns[key]
            });
          }
        }
        
        if (fieldChanges.length > 0) {
          const recentLog = await AuditLog.findOne({ startupId: id, action: 'UPDATE' }).sort({ timestamp: -1 });
          if (!recentLog || (Date.now() - new Date(recentLog.timestamp).getTime() > 120000)) {
            changesToLog.push({
               action: 'UPDATE',
               startupId: id,
               startupName: newStartup["Startup Name"] || 'Unknown',
               user: 'Google Sheet (Direct Edit)',
               changes: fieldChanges
            });
          }
        }
      }
    }
    
    const newMap = new Map(newData.map((s: any) => [s["Startup Registration number"], s]));
    for (const oldStartup of oldData) {
      const id = oldStartup["Startup Registration number"];
      if (!id || String(id).trim() === "") continue;
      
      if (!newMap.has(id)) {
        const recentLog = await AuditLog.findOne({ startupId: id, action: 'DELETE' }).sort({ timestamp: -1 });
        if (!recentLog || (Date.now() - new Date(recentLog.timestamp).getTime() > 120000)) {
           changesToLog.push({
             action: 'DELETE',
             startupId: id,
             startupName: oldStartup["Startup Name"] || 'Unknown',
             user: 'Google Sheet (Direct Edit)',
             changes: []
           });
        }
      }
    }
    
    if (changesToLog.length > 0) {
      await AuditLog.insertMany(changesToLog);
    }
    
    // Update snapshot
    snapshot.data = JSON.stringify(newData);
    snapshot.timestamp = new Date();
    await snapshot.save();
    
  } catch (err) {
    console.error("Error tracking sheet edits:", err);
  }
}
