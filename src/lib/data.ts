export type Specialty = {
  slug: string;
  category: string;
  name: string;
  tagline: string;
  summary: string;
  overview: string;
  procedures: string[];
  recovery: string;
  outcomes: string;
  travelDays: string;
};

export const specialties: Specialty[] = [
  {
    slug: "orthopedics",
    category: "Orthopedics",
    name: "Orthopedic & Joint Surgery",
    tagline: "Hip and knee replacement coordinated end to end",
    summary:
      "Joint replacement and sports-medicine procedures at accredited surgical centers, with physiotherapy aligned before you fly home.",
    overview:
      "Orthopedic care is our founding service. Every hip and knee replacement is matched to an accredited joint center, a dedicated case manager, and a physiotherapy plan that begins in hospital and continues with your home team after you return.",
    procedures: [
      "Total hip replacement",
      "Total knee replacement",
      "Partial knee replacement",
      "Arthroscopic repair",
    ],
    recovery: "In-hotel physiotherapy starts within 48 hours of discharge, with a remote check-in at week two, week six, and month three.",
    outcomes: "Every quoted outcome is a placeholder — replace with real published joint-center data before launch.",
    travelDays: "Stay 6–8 days",
  },
  {
    slug: "cardiology",
    category: "Cardiology",
    name: "Cardiac & Vascular Care",
    tagline: "Heart surgery and intervention on coordinated timelines",
    summary:
      "Coronary and valve care planned around elective timing, with cardiac rehab built into the same journey.",
    overview:
      "From diagnostic angiography to bypass and valve surgery, cardiac care is sequenced so that testing, procedure, and rehabilitation happen on one coordinated timeline — not a series of disconnected appointments.",
    procedures: [
      "Coronary artery bypass grafting",
      "Valve repair and replacement",
      "Angioplasty and stenting",
      "Cardiac rehabilitation",
    ],
    recovery: "A structured cardiac-rehab program, with telemetry-supported home milestones after you return.",
    outcomes: "Every quoted outcome is a placeholder — replace with real published cardiac-center data before launch.",
    travelDays: "Stay 7–10 days",
  },
  {
    slug: "cosmetic-reconstruction",
    category: "Aesthetic & Reconstructive",
    name: "Aesthetic & Reconstructive Surgery",
    tagline: "Board-certified surgeons and discreet coordination",
    summary:
      "Cosmetic and reconstructive procedures carried out by board-certified surgeons with private aftercare.",
    overview:
      "Aesthetic and reconstructive surgery demands discretion and precision. Our network pairs you with board-certified surgeons, private recovery accommodation, and a concierge who manages every transfer and appointment.",
    procedures: [
      "Rhinoplasty",
      "Breast augmentation and reduction",
      "Body contouring",
      "Reconstructive procedures",
    ],
    recovery: "Private recovery suites with 24/7 nursing and scheduled postoperative review at home via telemedicine.",
    outcomes: "Every quoted outcome is a placeholder — replace with real surgeon-reported data before launch.",
    travelDays: "Stay 5–7 days",
  },
  {
    slug: "fertility",
    category: "Fertility",
    name: "Fertility & Reproductive Medicine",
    tagline: "IVF and reproductive care across borders",
    summary:
      "Fertility treatment planned around your cycle and calendar, with legal and logistical guidance included.",
    overview:
      "Fertility care is deeply personal and time sensitive. We coordinate IVF cycles around your own calendar, arrange legal guidance where it applies, and keep communication with your local specialist continuous.",
    procedures: [
      "In vitro fertilization (IVF)",
      "Egg and embryo donation",
      "Intracytoplasmic sperm injection",
      "Genetic screening",
    ],
    recovery: "Cycle planning prioritizes minimal disruption, with a clear return plan between stimulation and transfer.",
    outcomes: "Every quoted outcome is a placeholder — replace with real clinic-reported data before launch.",
    travelDays: "Stay 5–14 days per cycle",
  },
  {
    slug: "neurosurgery",
    category: "Neurosurgery",
    name: "Neurosurgery & Spine",
    tagline: "Spine and cranial surgery with dedicated coordination",
    summary:
      "Complex spine and cranial procedures handled by high-volume specialists with seamless aftercare.",
    overview:
      "Neurosurgery is among the most consequential decisions a patient makes. High-volume spine and cranial teams, dedicated anesthesia, and a case manager who stays with you from first consult to discharge.",
    procedures: [
      "Spinal fusion and decompression",
      "Disc replacement",
      "Cranial procedures",
      "Stereotactic and endoscopic surgery",
    ],
    recovery: "Extended inpatient recovery with rehabilitation and a neuro follow-up schedule that continues at home.",
    outcomes: "Every quoted outcome is a placeholder — replace with real high-volume center data before launch.",
    travelDays: "Stay 8–14 days",
  },
  {
    slug: "oncology",
    category: "Oncology",
    name: "Oncology & Precision Treatment",
    tagline: "Coordinated cancer care with continuous communication",
    summary:
      "Targeted and surgical oncology where privacy, speed, and coordinating with your home oncologist matter.",
    overview:
      "Cancer care can mean a long, uncertain journey. We coordinate second opinions, biopsy review, surgery, and follow-up while keeping your home oncologist continuously in the loop.",
    procedures: [
      "Second-opinion tumor board review",
      "Oncologic surgery",
      "Targeted and precision therapy",
      "Long-term surveillance planning",
    ],
    recovery: "Treatment schedules are built around your needs, with a shared record your home team can follow.",
    outcomes: "Every quoted outcome is a placeholder — replace with real center data before launch.",
    travelDays: "Variable by treatment plan",
  },
  {
    slug: "dental",
    category: "Dental & Maxillofacial",
    name: "Dental & Maxillofacial Care",
    tagline: "Full-arch and surgical dentistry in one visit",
    summary:
      "Full-arch implants and complex dental work concentrated into a single coordinated stay.",
    overview:
      "Full-arch rehabilitation is a journey, but it should not be a marathon. We concentrate planning scans, surgery, and provisional restoration into a single stay with a clear path to your final set.",
    procedures: [
      "Full-arch implant restoration",
      "All-on-4 and all-on-6",
      "Sinus lifts and grafting",
      "Maxillofacial surgery",
    ],
    recovery: "Provisional restorations fitted before you leave, with remote check-ins through the integration period.",
    outcomes: "Every quoted outcome is a placeholder — replace with real clinic-reported data before launch.",
    travelDays: "Stay 5–7 days",
  },
  {
    slug: "ophthalmology",
    category: "Ophthalmology",
    name: "Ophthalmology & Vision",
    tagline: "Precision vision correction on your schedule",
    summary:
      "LASIK, cataract, and refractive surgery with a same-week or next-day return plan.",
    overview:
      "Vision surgery is often possible in under a day. Selection, surgery, and first reviews are compressed so a short stay delivers a complete result without rushed decisions.",
    procedures: [
      "LASIK and SMILE",
      "Cataract surgery",
      "Refractive lens exchange",
      "Retinal procedures",
    ],
    recovery: "Most patients return within days, with scheduled remote follow-ups through the stabilization period.",
    outcomes: "Every quoted outcome is a placeholder — replace with real clinic data before launch.",
    travelDays: "Stay 2–4 days",
  },
];

export type TravelPackage = {
  slug: string;
  name: string;
  country: string;
  city: string;
  price: string;
  currency: string;
  days: number;
  specialty: string;
  summary: string;
  includes: string[];
  notes: string;
};

export const packages: TravelPackage[] = [
  {
    slug: "total-knee-replacement",
    name: "Total Knee Replacement",
    country: "Turkey",
    city: "Istanbul",
    price: "8,900",
    currency: "USD",
    days: 7,
    specialty: "Orthopedics",
    summary:
      "Full joint-center package including hospital, physiotherapy, transfers, and a companion stay.",
    includes: [
      "Pre-op consultation and imaging review",
      "Hospital stay and surgery",
      "In-hotel physiotherapy",
      "Airport transfers both ways",
      "Companion accommodation",
    ],
    notes: "Price is a placeholder for demonstration — confirm a live quote before publishing.",
  },
  {
    slug: "hip-replacement",
    name: "Total Hip Replacement",
    country: "Turkey",
    city: "Istanbul",
    price: "9,400",
    currency: "USD",
    days: 7,
    specialty: "Orthopedics",
    summary:
      "Accredited joint-center hip replacement with a structured rehabilitation plan.",
    includes: [
      "Pre-op consultation and imaging review",
      "Hospital stay and surgery",
      "In-hotel physiotherapy",
      "Airport transfers both ways",
      "Follow-up telemedicine",
    ],
    notes: "Price is a placeholder for demonstration — confirm a live quote before publishing.",
  },
  {
    slug: "all-on-4-implants",
    name: "All-on-4 Full Arch",
    country: "Hungary",
    city: "Budapest",
    price: "12,500",
    currency: "USD",
    days: 6,
    specialty: "Dental & Maxillofacial",
    summary: "Full-arch implant rehabilitation with provisional teeth before departure.",
    includes: [
      "3D planning scans",
      "Implant surgery",
      "Provisional restoration",
      "Accommodation and transfers",
      "Integration-period check-ins",
    ],
    notes: "Price is a placeholder for demonstration — confirm a live quote before publishing.",
  },
  {
    slug: "ivf-cycle",
    name: "Coordinated IVF Cycle",
    country: "Spain",
    city: "Barcelona",
    price: "6,750",
    currency: "USD",
    days: 12,
    specialty: "Fertility",
    summary: "A complete IVF cycle planned around your calendar with legal guidance included.",
    includes: [
      "Initial fertility assessment",
      "Stimulation and monitoring",
      "Retrieval and transfer",
      "Accommodation and transfers",
      "Legal and logistics guidance",
    ],
    notes: "Price is a placeholder for demonstration — confirm a live quote before publishing.",
  },
  {
    slug: "lasik-vision",
    name: "LASIK Vision Correction",
    country: "Poland",
    city: "Warsaw",
    price: "2,400",
    currency: "USD",
    days: 3,
    specialty: "Ophthalmology",
    summary: "Fast, complete refractive correction with remote follow-ups after you return.",
    includes: [
      "Pre-op refraction and screening",
      "LASIK procedure",
      "First follow-up reviews",
      "Airport transfers",
      "Remote aftercare",
    ],
    notes: "Price is a placeholder for demonstration — confirm a live quote before publishing.",
  },
  {
    slug: "coronary-bypass",
    name: "Coronary Bypass Program",
    country: "India",
    city: "Chennai",
    price: "11,200",
    currency: "USD",
    days: 10,
    specialty: "Cardiac & Vascular Care",
    summary: "Surgical coronary care with a structured rehabilitation and remote monitoring plan.",
    includes: [
      "Diagnostic angiography",
      "Surgery and ICU care",
      "Cardiac rehabilitation",
      "Accommodation and transfers",
      "Telemetry-supported home follow-up",
    ],
    notes: "Price is a placeholder for demonstration — confirm a live quote before publishing.",
  },
];

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  body: string[];
};

export const posts: BlogPost[] = [
  {
    slug: "what-to-ask-before-surgery-abroad",
    title: "What to ask before surgery abroad",
    date: "2026-06-18",
    readTime: "6 min read",
    category: "Planning",
    excerpt:
      "The questions that separate a coordinated journey from an unmanaged one — asked before you commit to a surgeon.",
    body: [
      "Choosing a surgeon across borders is an information problem with real stakes. The temptation is to compare prices; the discipline is to compare the whole pathway around the procedure.",
      "Ask who confirms independence. A credential, an accreditation, and a second opinion are not the same thing, and each answers a different question.",
      "Ask who owns your record. Your imaging, notes, and pathology should be a single portable file you can hand to any doctor, in any country, on any day.",
      "Ask what happens on the home stretch. The hardest weeks are usually after discharge, not before. A clear physiotherapy or recovery plan that continues with a local provider is the difference between a procedure and a recovery.",
      "Ask who is reachable. Time zones matter. Know, before you travel, exactly who answers and when — in your hours, not theirs.",
      "None of this guarantees a perfect outcome. But it converts an opaque purchase into a plan you can hold, and that is the point of a concierge.",
    ],
  },
  {
    slug: "the-travel-phase-explained",
    title: "The travel phase, explained",
    date: "2026-05-02",
    readTime: "4 min read",
    category: "Journey",
    excerpt:
      "How the middle phase of the journey is actually coordinated — from visa timelines to the return flight.",
    body: [
      "The travel phase is where most journeys quietly fall apart, not because the surgery fails, but because the logistics around it are treated as background noise.",
      "A well-run travel phase has dates that were settled before you left: a visa timeline, a flight, a transfer, a hospital admission, and a return window that leaves room for clinical reality.",
      "It also has a single point of contact. When your flight changes, your hotel, your transfer, and your hospital appointment should move together — because one person owns the whole thread.",
      "The lesson is simple: the travel phase is not an obstacle to treatment. It is the bridge on which the treatment stands, and it deserves the same planning as the operation itself.",
    ],
  },
  {
    slug: "telemedicine-what-happens-next",
    title: "Telemedicine: what happens next",
    date: "2026-04-11",
    readTime: "5 min read",
    category: "Care",
    excerpt:
      "How a timezone-aware consult works, and what to prepare so your first meeting is worth having.",
    body: [
      "A telemedicine consultation exists to close the gap between 'I am interested' and 'I have a plan.' Done well, it leaves you with a concrete next step and a named person responsible for it.",
      "Prepare like a first-class meeting. Bring your imaging, your current medication list, and the single question you most want answered. The quality of the consult tracks the quality of the brief.",
      "Timezone is not a convenience, it is a coordination problem. A good booking flow schedules in your local time, confirms the conversion, and sends reminders in the timezone you live in — not the one the clinic is in.",
      "After the consult, you should hold a written summary: what was discussed, what is recommended, and what happens next, in terms you can take to another doctor.",
    ],
  },
  {
    slug: "recovery-begins-at-home",
    title: "Recovery begins at home",
    date: "2026-03-22",
    readTime: "4 min read",
    category: "Recovery",
    excerpt:
      "Why the follow-up plan matters more than the flight, and how to keep it from evaporating.",
    body: [
      "There is a strange asymmetry in medical travel: patients invest extraordinary care choosing a surgeon and almost none choosing what happens after they land.",
      "A recovery plan with named dates, a local provider who receives your records, and a scheduled check-in is not optional garnish. It is the phase where outcomes are actually decided.",
      "Insist on a handoff. Your records should migrate to a provider near you before you fly, not after a problem appears. And schedule the follow-up before you leave, while the momentum exists.",
      "You do not need to be an expert in aftercare. You need one person who owns your file and a calendar that already has the appointments on it.",
    ],
  },
];

export const journeyPhases = [
  {
    id: "01",
    name: "Discovery",
    focus:
      "Understand your condition, choose a specialty and a trusted provider, and start a real conversation with your case manager.",
    actions: ["Explore specialties", "Review packages", "Book a consult"],
  },
  {
    id: "02",
    name: "Travel",
    focus:
      "A settled plan: visa, flights, transfers, hospital admission, and accommodation coordinated by one point of contact.",
    actions: ["Receive your care plan", "Confirm travel dates", "Arrive orchestrated"],
  },
  {
    id: "03",
    name: "Treatment & Recovery",
    focus:
      "Surgery and aftercare, followed by a handoff to a provider near you — recovery planned before you fly home.",
    actions: ["Treatment", "Physiotherapy", "Home handoff & follow-up"],
  },
];
