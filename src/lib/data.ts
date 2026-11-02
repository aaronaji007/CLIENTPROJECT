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
  photo: string;
};

export const specialties: Specialty[] = [
  {
    slug: "orthopedics",
    category: "Orthopedics",
    name: "Orthopedic & Joint Surgery",
    tagline: "Joint replacement, ligament reconstruction & shoulder arthroplasty",
    summary:
      "Joint replacement and sports-medicine procedures at accredited surgical centers, with physiotherapy aligned before you fly home.",
    overview:
      "Our orthopedic practice encompasses primary and revision joint replacements, sports ligament reconstructions, and advanced shoulder arthroplasty. Every patient is matched to a specialized surgical center, a dedicated case manager, and a structured rehabilitation plan.",
    procedures: [
      "ACL Reconstruction · 3 Days",
      "MCL Repair · 3 Days",
      "PCL Reconstruction · 3 Days",
      "ARCR (Rotator Cuff Repair) · 3 Days",
      "Reverse Shoulder Arthroplasty · 5 Days",
      "Hemi Shoulder Arthroplasty · 5 Days",
      "ACR Balloon Spacer · 3–4 Days",
      "Bankart Repair · 3–4 Days",
      "Total Knee Replacement · 6–8 Days",
      "Total Hip Replacement · 6–8 Days",
      "Partial Knee Replacement · 4–6 Days",
    ],
    recovery: "In-hospital mobilization begins within 24–48 hours of surgery, followed by tailored outpatient physiotherapy and telemetry follow-ups after you return home.",
    outcomes: "Every quoted outcome is a placeholder — replace with real published joint-center data before launch.",
    travelDays: "Stay 3–8 days (Procedure dependent)",
    photo: "/images/orthopedics.webp",
  },
  {
    slug: "cosmetic-reconstruction",
    category: "Aesthetic & Plastic Surgery",
    name: "Aesthetic & Plastic Surgery",
    tagline: "Board-certified plastic surgeons and discreet care coordination",
    summary:
      "Comprehensive aesthetic, reconstructive, and corrective plastic surgery delivered with utmost privacy and dedicated aftercare.",
    overview:
      "From body contouring and facial aesthetics to complex reconstructive and microvascular surgeries, our accredited aesthetic centers pair board-certified plastic surgeons with private recovery suites and dedicated concierge care.",
    procedures: [
      "Breast Augmentation / Reduction · 3–5 Days",
      "Tummy Tuck (Abdominoplasty) · 3–5 Days",
      "Brachioplasty (Arm Lift) · 4–6 Days",
      "Liposuction (Abdomen / Arm / Back) · 2–4 Days",
      "Rhinoplasty · 3–5 Days",
      "Dimple Creation · 1–2 Days",
      "Ptosis Correction · 1–2 Days",
      "Blepharoplasty (Eyelid Surgery) · 1–2 Days",
      "Facelift / Neck Lift · 1–3 Days",
      "Lip Reduction / Augmentation · 1–2 Days",
      "Axillary Tail Breast Excision · 1–3 Days",
      "Fat Grafting · 1 Day",
      "Otoplasty (Ear Pinning) · 1 Day",
      "Double Chin Reduction · 1 Day",
      "Hemangioma / Vascular Malformation · 1–2 Days",
      "Scarless Lipoma Excision · 1 Day",
      "Hand Anomalies Reconstruction · 1–5 Days",
      "Skin Tumors & Lesions · 1 Day",
      "Pilonidal Sinus Surgery · 1–2 Days",
      "Brachial Plexus Surgery · 1–10 Days",
      "Hair Transplant · 1–2 Days",
      "Tattoo Removal · 1 Day",
    ],
    recovery: "Private recovery suites with 24/7 care, tailored dressing changes, and remote follow-up consultations scheduled through your healing period.",
    outcomes: "Every quoted outcome is a placeholder — replace with real surgeon-reported data before launch.",
    travelDays: "Stay 1–6 days (Procedure dependent)",
    photo: "/images/cosmetic.webp",
  },
  {
    slug: "fertility",
    category: "Fertility & Reproductive",
    name: "Fertility & Reproductive Medicine",
    tagline: "IVF and reproductive care coordinated across borders",
    summary:
      "Fertility treatment planned around your cycle and calendar, with legal and logistical guidance included.",
    overview:
      "Fertility care is deeply personal and time sensitive. We coordinate IVF cycles around your own calendar, arrange legal and logistical guidance, and ensure continuous communication with accredited reproductive medicine centers.",
    procedures: [
      "In Vitro Fertilization (IVF) · 15–20 Days",
      "Intracytoplasmic Sperm Injection (ICSI)",
      "Egg and Embryo Donation",
      "Pre-implantation Genetic Screening (PGD/PGS)",
      "Blastocyst Culture & Cryopreservation",
    ],
    recovery: "Cycle planning is sequenced for optimal comfort and success, with a dedicated 15–20 day stay covering ovarian stimulation through egg retrieval and embryo transfer.",
    outcomes: "Every quoted outcome is a placeholder — replace with real clinic-reported data before launch.",
    travelDays: "Stay 15–20 days per cycle",
    photo: "/images/service-doctor.png",
  },
  {
    slug: "urology",
    category: "Urology",
    name: "Urology & Men's Health",
    tagline: "Minimally invasive urological surgery and reconstructive care",
    summary:
      "Advanced kidney stone treatment, laser prostate enucleation, and male reproductive care with leading specialists.",
    overview:
      "Our urology practice connects international patients with accredited centers specializing in laser stone removal, robotic prostate care, and male reproductive health, with all pre-op diagnostic imaging and recovery scheduled end-to-end.",
    procedures: [
      "Laser Kidney Stone Surgery (RIRS / PCNL)",
      "Prostate Laser Surgery (HoLEP / TURP)",
      "Reconstructive Urological Surgery",
      "Male Fertility & Andrology Procedures",
      "Minimally Invasive Bladder Surgery",
    ],
    recovery: "Short-stay inpatient monitoring with seamless catheter removal, outpatient recovery, and tele-health follow-up.",
    outcomes: "Every quoted outcome is a placeholder — replace with real clinic-reported data before launch.",
    travelDays: "Stay 5–10 days (Confirming with Doctor)",
    photo: "/images/robotic.webp",
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
    photo: "/images/essential.webp",
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
    photo: "/images/tailored.webp",
  },
  {
    slug: "ophthalmology",
    category: "Ophthalmology",
    name: "Ophthalmology & Vision",
    tagline: "Precision vision correction and cataract surgery on your schedule",
    summary:
      "Advanced cataract surgery and LASIK vision correction with rapid recovery and international cost advantage.",
    overview:
      "State-of-the-art vision care including micro-incision cataract surgery with advanced monofocal and multifocal intraocular lenses (IOLs) and laser vision correction, offering immediate access without lengthy public waiting lists.",
    procedures: [
      "Advanced Cataract Surgery (Phaco + IOL) · 3–5 Days",
      "LASIK and SMILE Laser Vision · 2–3 Days",
      "Refractive Lens Exchange · 3–4 Days",
      "Corneal & Retinal Procedures",
    ],
    recovery: "Most patients experience rapid visual recovery within 24–48 hours, with protective eyewear and scheduled remote follow-ups.",
    outcomes: "Every quoted outcome is a placeholder — replace with real clinic data before launch.",
    travelDays: "Stay 2–5 days",
    photo: "/images/serenity.webp",
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
  photo: string;
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
    photo: "/images/orthopedics.webp",
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
    photo: "/images/royal.webp",
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
    photo: "/images/tailored.webp",
  },
  {
    slug: "ivf-cycle",
    name: "Coordinated IVF Cycle",
    country: "Spain",
    city: "Barcelona",
    price: "6,750",
    currency: "USD",
    days: 16,
    specialty: "Fertility",
    summary: "A complete 15–20 day IVF cycle planned around your calendar with legal and logistical guidance included.",
    includes: [
      "Initial fertility assessment & ultrasound scan",
      "Ovarian stimulation & hormone monitoring",
      "Ovum retrieval & blastocyst transfer",
      "Accommodation and transfers for 16 days",
      "Continuous case manager coordination",
    ],
    notes: "Stay duration adjusted to 15–20 days for optimal stimulation and transfer pacing.",
    photo: "/images/serenity.webp",
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
    photo: "/images/essential.webp",
  },
  {
    slug: "cataract-surgery",
    name: "Advanced Cataract Surgery (Phaco + Multifocal IOL)",
    country: "India",
    city: "Chennai",
    price: "1,250",
    currency: "USD",
    days: 4,
    specialty: "Ophthalmology",
    summary: "Complete micro-incision cataract surgery with premium multifocal IOL, rapid recovery, and comprehensive aftercare.",
    includes: [
      "Pre-operative optical biometry & corneal topography",
      "Phacoemulsification surgery with premium foldable IOL",
      "Post-operative reviews & protective eye drops",
      "Private transfers both ways",
      "Bilingual personal case coordinator",
    ],
    notes: "Compare with private Australian procedures costing $2,500–$4,500 AUD per eye with immediate scheduling.",
    photo: "/images/serenity.webp",
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
  photo: string;
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
    photo: "/images/blog-hospital.webp",
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
    photo: "/images/backwaters.png",
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
    photo: "/images/service-doctor.png",
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
    photo: "/images/heal-faster.png",
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

export type FaqItem = {
  q: string;
  a: string;
};

export const generalFaqs: FaqItem[] = [
  {
    q: "Is MedyCare 2₹ism a hospital or a clinic?",
    a: "Neither, in the traditional sense. We are a concierge that coordinates your care across vetted providers, hospitals, and surgical centers in other countries. We are the single point of contact who owns your file, your travel, and your timeline — not a place that performs the surgery itself.",
  },
  {
    q: "How is a provider chosen for me?",
    a: "Providers are selected against your condition, timeline, and preferences, then matched by a case manager. For this demonstration, the full accreditation and vetting process is a placeholder — in production it would be documented per provider.",
  },
  {
    q: "What does the concierge actually coordinate?",
    a: "The journey end to end: understanding and choosing care, visas and travel, transfers and accommodation, hospital admission, treatment, physiotherapy or rehab, and the handoff to a provider near your home. One person owns the whole thread.",
  },
  {
    q: "Are the prices and outcomes real?",
    a: "No. This is a concept demonstration. Every price, credential, and clinical outcome shown is a labeled placeholder and must not be relied on. Confirm everything with a case manager before making any decision.",
  },
  {
    q: "Does this site provide medical advice?",
    a: "No. Nothing here is medical advice, a diagnosis, or a verified clinical promise. Your own doctors remain in charge of your decisions. We provide coordination, not clinical direction.",
  },
  {
    q: "How do time zones and language work?",
    a: "Your case manager schedules and communicates in your local time and language. The booking flow on this site is timezone-aware, and reminders arrive in the timezone you live in.",
  },
];

export const specialtyFaqs: Record<string, FaqItem[]> = {
  orthopedics: [
    { q: "How soon after surgery can I fly home?", a: "For sports-medicine procedures like ACL/MCL or arthroscopy, stays are 3–4 days. For joint replacements, stays are 6–8 days. Your surgeon and case manager confirm fitness to fly before departure." },
    { q: "Is physiotherapy included after I return?", a: "A physiotherapy protocol begins immediately in hospital and is handed over to a provider near you, with scheduled remote milestones." },
  ],
  fertility: [
    { q: "How long should I plan to stay for an IVF cycle?", a: "A complete IVF cycle is typically sequenced over a 15–20 day stay to encompass ovarian stimulation, serial ultrasound monitoring, egg retrieval, and embryo transfer without rushed pacing." },
    { q: "Can the cycle be planned around my own calendar?", a: "Yes — IVF is coordinated around your personal cycle and schedule, with legal guidance and continuous communication with your home doctor." },
  ],
  urology: [
    { q: "What urological procedures are available?", a: "Our partner centers specialize in minimally invasive laser kidney stone surgery (RIRS/PCNL), advanced prostate laser surgery (HoLEP/TURP), and reconstructive urology." },
    { q: "How long is the typical stay for urology surgery?", a: "Most laser stone and prostate procedures require a 5–10 day stay to ensure catheter removal, normal voiding, and travel clearance." },
  ],
  ophthalmology: [
    { q: "What is the cost comparison for Cataract Surgery?", a: "In private Australian healthcare, cataract surgery can cost $2,500–$4,500 AUD per eye with long public hospital waitlists. Through our coordinated Indian medical centers, advanced phacoemulsification with premium multifocal IOLs is provided promptly at a fraction of the cost." },
    { q: "Can I really fly home after eye surgery?", a: "Most vision correction and cataract patients can fly home within 3–5 days following their post-operative slit-lamp review and stabilization check." },
  ],
  cosmetic_reconstruction: [
    { q: "Will my visit be private and discreet?", a: "Discretion is central to our aesthetic and plastic surgery pathway. Private recovery suites, unlisted appointments, and private transfers preserve your confidentiality end to end." },
  ],
  "cosmetic-reconstruction": [
    { q: "Will my visit be private and discreet?", a: "Discretion is central to our aesthetic and plastic surgery pathway. Private recovery suites, unlisted appointments, and private transfers preserve your confidentiality end to end." },
  ],
};

export type Testimonial = {
  quote: string;
  name: string;
  care: string;
};

export const testimonials: Testimonial[] = [
  {
    quote: "The difference was having one person who knew my name, my file, and my questions from the first call to the handoff back home.",
    name: "A. Rivera",
    care: "Total knee replacement",
  },
  {
    quote: "Every flight, transfer, and appointment moved together. I never had to manage the logistics myself — just the recovery.",
    name: "M. Okafor",
    care: "ACL ligament reconstruction",
  },
  {
    quote: "It felt less like buying a procedure and more like being walked through a plan on someone's calendar with mine beside it.",
    name: "S. Lindqvist",
    care: "Coordinated IVF cycle",
  },
];

