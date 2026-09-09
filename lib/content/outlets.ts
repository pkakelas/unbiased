/**
 * Outlet name → domain. The icon for each domain is self-hosted under
 * /outlets/<domain>.png (see scripts/fetch-outlet-icons.mjs), so a reader
 * never makes a third-party request to see who reported what.
 */
export const outlets: Record<string, string> = {
  "Πρώτο Θέμα": "protothema.gr",
  "Κουτί της Πανδώρας": "koutipandoras.gr",
  Έθνος: "ethnos.gr",
  MEGA: "megatv.com",
  PrimeNews: "primenews.press",
  "Το Βήμα": "tovima.gr",
  "Οικονομικός Ταχυδρόμος": "ot.gr",
  gocar: "gocar.gr",
  "in.gr": "in.gr",
  LiFO: "lifo.gr",
  GOVNews: "govnews.gr",
  Ναυτεμπορική: "naftemporiki.gr",
  ΕφΣυν: "efsyn.gr",
  ΣΚΑΪ: "skai.gr",
  "hania.news": "hania.news",
  "ΕΡΤ Χανίων": "ertnews.gr",
  Dnews: "dnews.gr",
  inews: "inewsgr.com",
  zarpanews: "zarpanews.gr",
};

/** Matches the outlet name at the start of a source line like "Έθνος, 16/07 — …". */
export function outletOf(text: string): { name: string; domain: string } | undefined {
  const name = Object.keys(outlets)
    .filter((n) => text.startsWith(n))
    .sort((a, b) => b.length - a.length)[0];
  return name ? { name, domain: outlets[name] } : undefined;
}
