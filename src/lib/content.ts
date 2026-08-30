import type { Lang } from "./i18n";

// Content extracted from the uploaded portfolio project, restructured
// so prose fields carry both languages (site defaults to German, see
// LanguageContext.tsx) while proper nouns — tool names, certification
// titles, tag chips — stay untranslated, which is normal practice for
// technical/brand terms.

export type Bi = { en: string; de: string };

export function L(field: Bi, lang: Lang): string {
  return field[lang] ?? field.en;
}

export const site = {
  name: "Vishal Rawat",
  role: "Cyber Security Analyst",
  // Personal title/brand line — kept identical in both languages, the
  // same way a name or job title on a business card wouldn't be
  // translated mid-brand.
  tagline: "Cyber Security Analyst",
  heroTitleLines: ["VISHAL", "RAWAT"],
  nav: [
    { label: "WORK", href: "#work" },
    { label: "ABOUT", href: "#about" },
    { label: "CERTIFICATIONS", href: "#certifications" },
    { label: "CONTACT", href: "#contact" },
  ],
  marquee: [
    "PENETRATION TESTING",
    "THREAT HUNTING",
    "SOC OPERATIONS",
    "ACTIVE DIRECTORY",
    "SOAR",
    "INCIDENT RESPONSE",
  ],
};

export const stats = [
  { count: 300, suffix: "+", key: "rooms" as const },
  { count: 30, suffix: "+", key: "badges" as const },
  { count: 100, suffix: "+", key: "vulns" as const },
  { count: 4200, suffix: "", key: "rank" as const },
];

export const about = {
  whoami: {
    en: "Cyber Security Analyst",
    de: "Cyber Security Analyst",
  } satisfies Bi,
  focus: ["Network Pentesting", "Web App Security", "SOC Operations", "AD Exploitation"],
};

// Used as the WebGL "moving photo" treatments — real photos run through
// the same dot/bayer pipeline as the hero video, so the site uses every
// piece of media supplied rather than looping one clip.
export const media = {
  aboutPhoto: "/images/defender-shield.jpg",
  skillsPhoto: "/images/hacker-attack.jpg",
};

export type Project = {
  id: string;
  title: Bi;
  category: Bi;
  description: Bi;
  tags: string[];
  image: string;
  algorithm: "halftone" | "bayer4" | "bayer8";
};

export const projects: Project[] = [
  {
    id: "ad-exploitation",
    title: { en: "Active Directory Exploitation", de: "Active Directory Exploitation" },
    category: { en: "Offensive Security", de: "Offensive Security" },
    description: {
      en: "I map full Active Directory kill chains end to end — Kerberoasting, Pass-the-Hash, BloodHound enumeration, GPO abuse and DCSync.",
      de: "Ich kartiere komplette Active-Directory-Kill-Chains von Anfang bis Ende — Kerberoasting, Pass-the-Hash, BloodHound-Enumeration, GPO-Missbrauch und DCSync.",
    },
    tags: ["BloodHound", "Mimikatz", "Kerberoast", "DCSync"],
    image: "/images/ad.jpg",
    algorithm: "halftone",
  },
  {
    id: "web-pentesting",
    title: { en: "Web Application Security", de: "Web Application Security" },
    category: { en: "Penetration Testing", de: "Penetration Testing" },
    description: {
      en: "I assess web applications by hand and with tooling — injection, auth bypass, business-logic flaws and fuzzing-driven discovery.",
      de: "Ich prüfe Webanwendungen manuell und toolgestützt — Injection, Auth-Bypass, Business-Logic-Schwachstellen und Fuzzing-gestützte Entdeckung.",
    },
    tags: ["Burp Suite", "SQLmap", "FFUF", "Nuclei"],
    image: "/images/web-app-sec.jpg",
    algorithm: "bayer8",
  },
  {
    id: "soc",
    // Kept tight to just SOC / SOAR, as requested — no "Detection
    // Engineering" phrasing.
    title: { en: "SOC & SOAR", de: "SOC & SOAR" },
    category: { en: "Blue Team", de: "Blue Team" },
    description: {
      en: "I run SOC operations day to day — SIEM-driven alert triage and SOAR playbooks that turn raw telemetry into fast, accurate response.",
      de: "Ich betreibe SOC-Operations im Tagesgeschäft — SIEM-gestützte Alert-Triage und SOAR-Playbooks, die rohe Telemetrie in schnelle, präzise Reaktionen verwandeln.",
    },
    tags: ["Splunk", "TheHive", "n8n", "SOAR"],
    image: "/images/soc.jpg",
    algorithm: "bayer4",
  },
];

export const skills = [
  {
    name: { en: "Network Pentesting", de: "Netzwerk-Pentesting" } satisfies Bi,
    pct: 92,
    tags: ["Nmap", "Metasploit", "Nessus", "Wireshark"],
  },
  {
    name: { en: "Web App Pentesting", de: "Web-App-Pentesting" } satisfies Bi,
    pct: 90,
    tags: ["Burp Suite", "SQLmap", "OWASP ZAP", "XSS", "SSRF"],
  },
  {
    name: { en: "Active Directory", de: "Active Directory" } satisfies Bi,
    pct: 91,
    tags: ["BloodHound", "Kerberoast", "PTH", "DCSync"],
  },
  {
    name: { en: "SOC Operations", de: "SOC-Operations" } satisfies Bi,
    pct: 88,
    tags: ["Threat Hunting", "Triage", "DFIR", "IOC Analysis"],
  },
  {
    name: { en: "Splunk & SIEM", de: "Splunk & SIEM" } satisfies Bi,
    pct: 87,
    tags: ["SPL", "Dashboards", "Correlation", "QRadar"],
  },
  {
    name: { en: "n8n Automation", de: "n8n-Automatisierung" } satisfies Bi,
    pct: 83,
    tags: ["Workflows", "Webhooks", "SOAR"],
  },
  // Added from the HTB CDSA (Certified Defensive Security Analyst)
  // curriculum: Incident Handling Process, and Windows Event Logs &
  // Finding Evil (Sysmon/ETW-based threat hunting).
  {
    name: { en: "Incident Handling (DFIR)", de: "Incident Handling (DFIR)" } satisfies Bi,
    pct: 85,
    tags: ["Incident Handling Process", "Chain of Custody", "Reporting"],
  },
  {
    name: { en: "Windows Event Log Forensics", de: "Windows-Event-Log-Forensik" } satisfies Bi,
    pct: 84,
    tags: ["Sysmon", "ETW", "Get-WinEvent", "Threat Hunting"],
  },
];

export const adSurface = [
  {
    name: { en: "Enumeration", de: "Enumeration" } satisfies Bi,
    items: [
      {
        en: "BloodHound / SharpHound collection",
        de: "BloodHound-/SharpHound-Erhebung",
      },
      {
        en: "LDAP enumeration (users, groups, GPOs)",
        de: "LDAP-Enumeration (Benutzer, Gruppen, GPOs)",
      },
      {
        en: "SPN scanning for Kerberoastable accounts",
        de: "SPN-Scanning für kerberoastbare Konten",
      },
      {
        en: "ACL/ACE abuse path discovery",
        de: "Aufdeckung von ACL-/ACE-Missbrauchspfaden",
      },
    ] satisfies Bi[],
  },
  {
    name: { en: "Credential Attacks", de: "Credential-Angriffe" } satisfies Bi,
    items: [
      { en: "Kerberoasting (SPN-based hash extraction)", de: "Kerberoasting (SPN-basierte Hash-Extraktion)" },
      { en: "AS-REP Roasting (no-preauth accounts)", de: "AS-REP Roasting (Konten ohne Preauth)" },
      { en: "Pass-the-Hash / Pass-the-Ticket", de: "Pass-the-Hash / Pass-the-Ticket" },
      { en: "NTLM relay (Responder + ntlmrelayx)", de: "NTLM-Relay (Responder + ntlmrelayx)" },
    ] satisfies Bi[],
  },
  {
    name: { en: "Privilege Escalation", de: "Privilege Escalation" } satisfies Bi,
    items: [
      { en: "DCSync attack (replicating NTDS.dit)", de: "DCSync-Angriff (Replikation von NTDS.dit)" },
      { en: "Golden Ticket & Silver Ticket attacks", de: "Golden-Ticket- & Silver-Ticket-Angriffe" },
      { en: "GPO abuse for code execution", de: "GPO-Missbrauch zur Codeausführung" },
      { en: "Constrained / unconstrained delegation", de: "Constrained / Unconstrained Delegation" },
    ] satisfies Bi[],
  },
  {
    name: { en: "Lateral Movement", de: "Lateral Movement" } satisfies Bi,
    items: [
      { en: "WMI / PSExec / SMB lateral movement", de: "Laterale Bewegung via WMI / PSExec / SMB" },
      { en: "RDP pivoting and tunneling", de: "RDP-Pivoting und Tunneling" },
      { en: "DCOM abuse for remote execution", de: "DCOM-Missbrauch zur Remote-Ausführung" },
      { en: "Living-off-the-land (LOLBins)", de: "Living-off-the-Land (LOLBins)" },
    ] satisfies Bi[],
  },
  {
    name: { en: "Detection & Defense", de: "Detection & Defense" } satisfies Bi,
    items: [
      { en: "Event ID monitoring (4624, 4768, 4769, 4776)", de: "Event-ID-Monitoring (4624, 4768, 4769, 4776)" },
      { en: "Splunk AD audit dashboards", de: "Splunk-AD-Audit-Dashboards" },
      { en: "Honey accounts and honey SPNs", de: "Honey Accounts und Honey SPNs" },
      { en: "Tiered admin model implementation", de: "Implementierung eines Tiered-Admin-Modells" },
    ] satisfies Bi[],
  },
  {
    name: { en: "Hardening", de: "Hardening" } satisfies Bi,
    items: [
      { en: "Disabling NTLM where possible", de: "NTLM wo möglich deaktivieren" },
      { en: "Protected Users security group", de: "Protected-Users-Sicherheitsgruppe" },
      { en: "Credential Guard & VBS", de: "Credential Guard & VBS" },
      { en: "Forest / domain trust review & cleanup", de: "Überprüfung und Bereinigung von Forest-/Domain-Trusts" },
    ] satisfies Bi[],
  },
];

// Trimmed to the tools that actually matter day to day, rather than an
// exhaustive list.
export const tools = [
  { name: "Nmap", cat: { en: "Network Recon", de: "Netzwerk-Recon" } satisfies Bi },
  { name: "Burp Suite", cat: { en: "Web Security", de: "Web-Sicherheit" } satisfies Bi },
  { name: "SQLmap", cat: { en: "SQL Injection", de: "SQL-Injection" } satisfies Bi },
  { name: "Wireshark", cat: { en: "Packet Analysis", de: "Paketanalyse" } satisfies Bi },
  { name: "BloodHound", cat: { en: "AD Enumeration", de: "AD-Enumeration" } satisfies Bi },
  { name: "Mimikatz", cat: { en: "Credential Access", de: "Credential Access" } satisfies Bi },
  { name: "Splunk", cat: { en: "SIEM", de: "SIEM" } satisfies Bi },
  { name: "Kali Linux", cat: { en: "Pentest Platform", de: "Pentest-Plattform" } satisfies Bi },
];

export const certifications = [
  { name: "EC-Council – Certified Ethical Hacker (CEHv13)", status: "CERTIFIED" },
  { name: "TheSecOps – Certified Network Security Practitioner (CNSP)", status: "CERTIFIED" },
  { name: "Cisco – CCNA: Introduction to Networks", status: "CERTIFIED" },
  { name: "Cisco – Junior Cybersecurity Analyst Career Path", status: "CERTIFIED" },
  { name: "Google – Foundations of Cybersecurity", status: "CERTIFIED" },
  { name: "AWS Academy – Cloud Foundations", status: "CERTIFIED" },
  { name: "HackerRank – Problem Solving (Intermediate)", status: "CERTIFIED" },
  { name: "PortSwigger – Burp Suite Community Practitioner", status: "PURSUING" },
  { name: "Hack The Box – CDSA (Certified Defensive Security Analyst)", status: "PURSUING" },
];

export function getTerminalCommands(lang: Lang): Record<string, string> {
  return {
    help: lang === "de"
      ? "Verfügbar: whoami, skills, certs, tools, contact, clear"
      : "Available: whoami, skills, certs, tools, contact, clear",
    whoami:
      lang === "de"
        ? "Vishal Rawat — Cyber Security Analyst\nWeb-Pentesting / Netzwerk-Pentesting / SOC-Operations / AD-Sicherheit"
        : "Vishal Rawat — Cyber Security Analyst\nWeb Pentesting / Network Pentesting / SOC Operations / AD Security",
    skills: skills.map((s) => `${L(s.name, lang).padEnd(26, ".")} ${s.pct}%`).join("\n"),
    certs: certifications.map((c) => `[${c.status}] ${c.name}`).join("\n"),
    tools: tools.map((tool) => tool.name).join(", "),
    contact:
      "email: vshalrawal@gmail.com\nlinkedin: linkedin.com/in/vishal-rawat-22b788225\ngithub: github.com/VishalRawatt",
  };
}

export const contact = {
  email: "vshalrawal@gmail.com",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/vishal-rawat-22b788225/" },
    { label: "GitHub", href: "https://github.com/VishalRawatt/" },
    { label: "TryHackMe", href: "https://tryhackme.com/p/Dcypher" },
    { label: "Hack The Box", href: "https://app.hackthebox.com/users/2285266" },
  ],
};
