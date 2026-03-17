import { constitution1999Structure } from './constitution1999';

export const statuteStructures: Record<string, any[]> = {
  '1999 Constitution': constitution1999Structure,
  'Evidence Act': [
    { chapter: "Part I", title: "Preliminary", parts: [{ part: "Sections 1-3", title: "General Application", sections: "1-3" }] },
    { chapter: "Part II", title: "Relevancy", parts: [{ part: "Sections 4-15", title: "Facts in Issue", sections: "4-15" }, { part: "Sections 16-19", title: "Admissions", sections: "16-19" }, { part: "Sections 20-24", title: "Confessions", sections: "20-24" }] },
    { chapter: "Part III", title: "Proof", parts: [{ part: "Sections 128-134", title: "Burden of Proof", sections: "128-134" }] },
    { chapter: "Part IV", title: "Oral Evidence", parts: [{ part: "Sections 125-126", title: "Oral Evidence", sections: "125-126" }] },
    { chapter: "Part V", title: "Documentary Evidence", parts: [{ part: "Sections 83-92", title: "Primary and Secondary Evidence", sections: "83-92" }] }
  ],
  'Electoral Act': [
    { chapter: "Part I", title: "Establishment of INEC", parts: [{ part: "Sections 1-8", title: "Functions and Powers", sections: "1-8" }] },
    { chapter: "Part III", title: "National Register of Voters", parts: [{ part: "Sections 9-23", title: "Registration", sections: "9-23" }] },
    { chapter: "Part IV", title: "Procedure at Election", parts: [{ part: "Sections 24-74", title: "Conduct of Elections", sections: "24-74" }] },
    { chapter: "Part V", title: "Political Parties", parts: [{ part: "Sections 75-94", title: "Registration and Finances", sections: "75-94" }] },
    { chapter: "Part VII", title: "Electoral Offences", parts: [{ part: "Sections 114-129", title: "Offences", sections: "114-129" }] },
    { chapter: "Part VIII", title: "Election Petitions", parts: [{ part: "Sections 130-140", title: "Tribunals and Procedures", sections: "130-140" }] }
  ],
  'Labour Act': [
    { chapter: "Part I", title: "General Provisions", parts: [{ part: "Sections 1-6", title: "Protection of Wages", sections: "1-6" }, { part: "Sections 7-12", title: "Contracts of Employment", sections: "7-12" }, { part: "Sections 13-22", title: "Terms and Conditions", sections: "13-22" }] },
    { chapter: "Part II", title: "Recruiting", parts: [{ part: "Sections 23-44", title: "Recruiting of Workers", sections: "23-44" }] },
    { chapter: "Part III", title: "Special Classes of Worker", parts: [{ part: "Sections 45-53", title: "Apprentices", sections: "45-53" }, { part: "Sections 54-58", title: "Employment of Women", sections: "54-58" }, { part: "Sections 59-64", title: "Young Persons", sections: "59-64" }] },
    { chapter: "Part IV", title: "Administration", parts: [{ part: "Sections 65-72", title: "Labour Health Areas", sections: "65-72" }] }
  ],
  'ACJA': [
    { chapter: "Part 1", title: "Preliminary", parts: [{ part: "Sections 1-2", title: "Purpose and Application", sections: "1-2" }] },
    { chapter: "Part 2", title: "Arrest, Bail and Preventive Justice", parts: [{ part: "Sections 3-34", title: "Arrest", sections: "3-34" }, { part: "Sections 158-188", title: "Bail", sections: "158-188" }] },
    { chapter: "Part 3", title: "Warrants", parts: [{ part: "Sections 35-49", title: "Warrants of Arrest", sections: "35-49" }] },
    { chapter: "Part 15", title: "Information", parts: [{ part: "Sections 104-112", title: "Filing of Information", sections: "104-112" }] },
    { chapter: "Part 24", title: "Trial", parts: [{ part: "Sections 260-277", title: "Hearing", sections: "260-277" }] }
  ],
  'Companies and Allied Matters Act (CAMA)': [
    { chapter: "Part A", title: "Corporate Affairs Commission", parts: [{ part: "Sections 1-17", title: "Establishment", sections: "1-17" }] },
    { chapter: "Part B", title: "Incorporation of Companies", parts: [{ part: "Sections 18-42", title: "Formation", sections: "18-42" }, { part: "Sections 43-56", title: "Capacity and Powers", sections: "43-56" }] },
    { chapter: "Part C", title: "Limited Liability Partnership", parts: [{ part: "Sections 746-794", title: "LLP", sections: "746-794" }] },
    { chapter: "Part E", title: "Business Names", parts: [{ part: "Sections 814-822", title: "Registration", sections: "814-822" }] },
    { chapter: "Part F", title: "Incorporated Trustees", parts: [{ part: "Sections 823-835", title: "NGOs and Trustees", sections: "823-835" }] }
  ],
  'Cybercrimes Act': [
    { chapter: "Part I", title: "Objectives and Application", parts: [{ part: "Sections 1-2", title: "Objectives", sections: "1-2" }] },
    { chapter: "Part II", title: "Protection of Critical Infrastructure", parts: [{ part: "Sections 3-4", title: "Critical Infrastructure", sections: "3-4" }] },
    { chapter: "Part III", title: "Offences and Penalties", parts: [{ part: "Sections 5-36", title: "Offences", sections: "5-36" }] },
    { chapter: "Part IV", title: "Duties of Service Providers", parts: [{ part: "Sections 37-40", title: "Service Providers", sections: "37-40" }] }
  ]
};
