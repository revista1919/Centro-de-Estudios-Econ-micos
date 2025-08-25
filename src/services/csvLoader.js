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

async function loadCSV(key) {
  const response = await fetch(urls[key]);
  const text = await response.text();
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true }).data;
  return parsed;
}

export { loadCSV };