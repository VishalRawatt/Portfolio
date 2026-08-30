export type Lang = "de" | "en";

// Only static, hand-written UI copy is translated here. Structured
// content (project/skill/tool/cert data in content.ts) stays in English,
// which is normal for technical terminology and tool names.
export const dict = {
  nav: {
    work: { de: "ARBEIT", en: "WORK" },
    about: { de: "ÜBER MICH", en: "ABOUT" },
    certifications: { de: "ZERTIFIKATE", en: "CERTIFICATIONS" },
    contact: { de: "KONTAKT", en: "CONTACT" },
  },
  hero: {
    description: {
      de: "Ich betreibe offensive Sicherheit, Threat Hunting und Incident Response — ich breche Systeme auf, um stärkere Verteidigungen zu bauen, von Active-Directory-Exploitation bis zu SIEM-gestützten SOC-Operations.",
      en: "I run offensive security, threat hunting and incident response — breaking systems to build stronger defenses, from Active Directory exploitation to SIEM-driven SOC operations.",
    },
    scroll: { de: "SCROLLEN", en: "SCROLL" },
  },
  stats: {
    rooms: { de: "Rooms abgeschlossen", en: "Rooms Completed" },
    badges: { de: "Security Badges", en: "Security Badges" },
    vulns: { de: "Schwachstellen gefunden", en: "Vulnerabilities Found" },
    rank: { de: "TryHackMe Rang", en: "TryHackMe Global Rank" },
  },
  work: {
    tag: { de: "// AUSGEWÄHLTE ARBEITEN", en: "// SELECTED WORK" },
    title: { de: "Meine Fallstudien", en: "My Case Studies" },
  },
  skills: {
    tag: { de: "// SKILL-MATRIX", en: "// SKILL MATRIX" },
    title: { de: "Meine Fähigkeiten", en: "My Capabilities" },
  },
  adSurface: {
    tag: { de: "// MODUL: ACTIVE DIRECTORY", en: "// MODULE: ACTIVE DIRECTORY" },
    title: { de: "Mein AD-Angriffsvektor", en: "My AD Attack Surface" },
    desc: {
      de: "Die komplette Kill Chain, die ich beherrsche — Enumeration, Credential-Angriffe, Privilege Escalation, Lateral Movement — zusammen mit den Detection- und Hardening-Maßnahmen, die sie stoppen.",
      en: "The full kill chain I work through — enumeration, credential attacks, privilege escalation, lateral movement — alongside the detection and hardening controls that stop it.",
    },
  },
  tools: {
    tag: { de: "// ARSENAL", en: "// ARSENAL" },
    title: { de: "Meine Tools & Tech", en: "My Tools & Tech" },
  },
  about: {
    tag: { de: "// ÜBER MICH", en: "// ABOUT" },
    bio: {
      de: "Meine Arbeit deckt das gesamte Spektrum ab — vom Eindringen in Netzwerke bis zum Aufbau der Detection-Regeln, die Angreifer auf frischer Tat ertappen. Offensiv: Network Pentesting, das Aufdecken von Fehlkonfigurationen, Lateral-Movement-Pfaden und Privilege-Escalation-Vektoren, dazu Web-Pentesting über die OWASP Top 10 hinaus. Im SOC: Splunk, SIEM-Plattformen und n8n-Automatisierung, um Alerts in großem Maßstab zu triagieren und schnell zu reagieren.",
      en: "My work spans the full spectrum — from breaking into networks to building the detection rules that catch attackers in the act. On the offensive side: network penetration testing, uncovering misconfigurations, lateral-movement paths and privilege-escalation vectors, plus web pentesting across the OWASP Top 10 and beyond. In the SOC: Splunk, SIEM platforms and n8n automation to triage alerts at scale and respond with speed.",
    },
  },
  certifications: {
    tag: { de: "// NACHWEISLICH ZERTIFIZIERT", en: "// CREDENTIALS VERIFIED" },
    title: { de: "Meine Zertifizierungen", en: "My Certifications" },
  },
  terminal: {
    tag: { de: "// SYSTEMZUGRIFF", en: "// SYSTEM ACCESS" },
    title: { de: "Kommandozeile", en: "Command Line" },
    hint: {
      de: "Gib 'help' ein, um verfügbare Befehle zu sehen.",
      en: "Type 'help' to see available commands.",
    },
  },
  contact: {
    tag: { de: "// KONTAKT", en: "// CONTACT" },
    title: {
      de: "Lass uns etwas bauen, das es wert ist, geknackt zu werden.",
      en: "Let's build something worth breaking.",
    },
    message: {
      de: "Ich bin verfügbar für freiberufliche Pentesting-Aufträge, SOC-Beratung und Security-Advisory-Rollen.",
      en: "I'm available for freelance pentesting engagements, SOC consulting, and security advisory roles.",
    },
  },
} as const;

export function t<K1 extends keyof typeof dict, K2 extends keyof (typeof dict)[K1]>(
  lang: Lang,
  section: K1,
  key: K2
): string {
  const entry = dict[section][key] as unknown as Record<Lang, string>;
  return entry[lang] ?? entry.en;
}
