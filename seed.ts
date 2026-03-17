import { db } from './src/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const cases = [
  {
    caseName: "Amaechi v. INEC",
    citation: "(2008) 5 NWLR (Pt. 1080) 227",
    court: "Supreme Court",
    year: 2008,
    legalDomain: "electoral_law",
    judge: "Katsina-Alu, JSC",
    summary: "A landmark case on the substitution of candidates and the power of the court to grant consequential orders in election matters.",
    fullText: "The Supreme Court held that where a candidate was unlawfully substituted, the court has the power to declare the rightful candidate as the winner of the election, even if they did not participate in the general election, as it is the party that contests the election...",
    authorityWeight: 10,
    citatorStatus: "followed",
    cites: [],
    citedBy: []
  },
  {
    caseName: "Fawehinmi v. Abacha",
    citation: "(2000) 6 NWLR (Pt. 660) 228",
    court: "Supreme Court",
    year: 2000,
    legalDomain: "constitutional_law",
    judge: "Ogundare, JSC",
    summary: "A critical case on the domestic application of the African Charter on Human and Peoples' Rights and the supremacy of the Constitution.",
    fullText: "The court examined the status of international treaties in Nigeria and held that while the African Charter has been domesticated, it remains subject to the supremacy of the Nigerian Constitution...",
    authorityWeight: 9,
    citatorStatus: "followed",
    cites: [],
    citedBy: []
  },
  {
    caseName: "Ukeje v. Ukeje",
    citation: "(2014) 11 NWLR (Pt. 1418) 384",
    court: "Supreme Court",
    year: 2014,
    legalDomain: "constitutional_law",
    judge: "Rhodes-Vivour, JSC",
    summary: "A landmark judgment on the right of female children to inherit property in Igboland, declaring discriminatory customs unconstitutional.",
    fullText: "The Supreme Court held that the Igbo customary law which disentitles a female child from partaking in the sharing of her deceased father's estate is in breach of Section 42(1) and (2) of the Constitution...",
    authorityWeight: 10,
    citatorStatus: "followed",
    cites: [],
    citedBy: []
  },
  {
    caseName: "Centre for Oil Pollution Watch v. NNPC",
    citation: "(2019) 5 NWLR (Pt. 1666) 518",
    court: "Supreme Court",
    year: 2019,
    legalDomain: "administrative_law",
    judge: "Aka'ahs, JSC",
    summary: "A significant case expanding the doctrine of locus standi in environmental litigation in Nigeria.",
    fullText: "The court relaxed the strict requirement of locus standi in public interest litigation, particularly concerning environmental protection...",
    authorityWeight: 9,
    citatorStatus: "followed",
    cites: [],
    citedBy: []
  }
];

const statutes = [
  {
    actName: "1999 Constitution",
    section: "36",
    subsection: "1",
    title: "Right to Fair Hearing",
    content: "In the determination of his civil rights and obligations, including any question or determination by or against any government or authority, a person shall be entitled to a fair hearing within a reasonable time by a court or other tribunal established by law and constituted in such manner as to secure its independence and impartiality.",
    legalDomain: "constitutional_law"
  },
  {
    actName: "1999 Constitution",
    section: "42",
    subsection: "1",
    title: "Right to Freedom from Discrimination",
    content: "A citizen of Nigeria of a particular community, ethnic group, place of origin, circumstance of birth, sex, religion or political opinion shall not, by reason only that he is such a person, be subjected either expressly by, or in the practical application of, any law in force in Nigeria or any executive or administrative action of the government to disabilities or restrictions to which citizens of Nigeria of other communities, ethnic groups, places of origin, circumstances of birth, sex, religions or political opinions are not made subject.",
    legalDomain: "constitutional_law"
  },
  {
    actName: "Evidence Act",
    section: "84",
    subsection: "1",
    title: "Admissibility of Computer-Generated Evidence",
    content: "In any proceeding, a statement contained in a document produced by a computer shall be admissible as evidence of any fact stated in it of which direct oral evidence would be admissible, if it is shown that the conditions in subsection (2) of this section are satisfied...",
    legalDomain: "civil_litigation"
  },
  {
    actName: "Electoral Act",
    section: "29",
    subsection: "1",
    title: "Submission of List of Candidates",
    content: "Every political party shall, not later than 180 days before the date appointed for a general election under this Act, submit to the Commission, in the prescribed forms, the list of the candidates the party proposes to sponsor at the elections, who must have emerged from valid primaries conducted by the political party.",
    legalDomain: "electoral_law"
  }
];

async function seed() {
  console.log("Starting seed...");
  
  for (const c of cases) {
    const q = query(collection(db, 'cases'), where('caseName', '==', c.caseName));
    const snap = await getDocs(q);
    if (snap.empty) {
      await addDoc(collection(db, 'cases'), c);
      console.log(`Added case: ${c.caseName}`);
    }
  }

  for (const s of statutes) {
    const q = query(collection(db, 'statutes'), where('title', '==', s.title));
    const snap = await getDocs(q);
    if (snap.empty) {
      await addDoc(collection(db, 'statutes'), s);
      console.log(`Added statute: ${s.title}`);
    }
  }

  console.log("Seed complete.");
}

// We'll call this from a button in the dashboard or just export it.
export { seed };
