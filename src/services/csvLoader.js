import Papa from 'papaparse';

const urls = {
  articles: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRAxw-uQQG_ZhJQquLCMmj0QdQTldDmFoCd-tAA4l56-Ebe4OA04G3MgcR0FSgacn6PE52KJUL-sT3i/pub?output=csv',
  authors: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRSnFHgBLMF9x_CpJKXJthp8DEJGw9WzR1Iu1ew4skgPkPxApgIlcZH6216mwgQJ2bp3rl4pZVSOsle/pub?output=csv',
  modules: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0xgunGSnLbpZjEI84lA6bFWEBct4Dh_C4tUjaNt8KfHfu4Dkgg2e880ECk_sSegw1f8lxM-uuo-Ky/pub?gid=0&single=true&output=csv',
  courses: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0xgunGSnLbpZjEI84lA6bFWEBct4Dh_C4tUjaNt8KfHfu4Dkgg2e880ECk_sSegw1f8lxM-uuo-Ky/pub?gid=221126423&single=true&output=csv',
  biographies: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSJ2PvMA78hA2qu1opboquB54evwyBiDrXr-TdXXQgbFOZQDAPBRPXkvKxUX9hFyXmhlCOPV2_Izp5S/pub?gid=0&single=true&output=csv',
  books: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSJ2PvMA78hA2qu1opboquB54evwyBiDrXr-TdXXQgbFOZQDAPBRPXkvKxUX9hFyXmhlCOPV2_Izp5S/pub?gid=852367346&single=true&output=csv',
  scholarships: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSJ2PvMA78hA2qu1opboquB54evwyBiDrXr-TdXXQgbFOZQDAPBRPXkvKxUX9hFyXmhlCOPV2_Izp5S/pub?gid=437444125&single=true&output=csv',
};

async function loadCSV(key, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(urls[key], { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const text = await response.text();
      console.log(`Raw CSV for ${key}:`, text.substring(0, 200)); // Log first 200 chars for debugging
      const parsed = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        encoding: 'utf-8',
      });
      if (parsed.errors.length > 0) {
        console.error(`Papa Parse errors for ${key}:`, parsed.errors);
        throw new Error('CSV parsing failed');
      }
      console.log(`Parsed ${key} data:`, parsed.data);
      return parsed.data;
    } catch (error) {
      console.error(`Attempt ${attempt} failed for ${key}:`, error.message);
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw new Error(`Failed to load ${key} CSV after ${retries} attempts: ${error.message}`);
      }
    }
  }
}

export { loadCSV };