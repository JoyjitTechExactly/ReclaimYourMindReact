import { ImagePath } from './imagePath';

export interface JourneyStep {
  title: string;
  description: string;
  icon: any;
}

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    title: 'Awareness',
    description: 'Recognize patterns and how relationships are maintained',
    icon: ImagePath.Journey1,
  },
  {
    title: 'Acceptance',
    description: 'Transition intense emotions to a place of calm clarity',
    icon: ImagePath.Journey2,
  },
  {
    title: 'Appreciation',
    description: 'Develop a balanced perspective of the relationship',
    icon: ImagePath.Journey3,
  },
  {
    title: 'Action',
    description: 'Learn coping skills to reclaim inner peace',
    icon: ImagePath.Journey4,
  },
];


// Resources Data
export interface ResourceItem {
  type: "hotline" | "book" | "website";
  badge: string;
  title: string;
  description?: string;
  descriptionTop?: string;
  phone?: string;
  text?: string;
  website?: string;
  additional_notes?: string;
  url?: string;
}

export const supportItems: ResourceItem[] = [
  {
    type: "hotline",
    badge: "24/7",
    title: "National Domestic \nViolence Hotline",
    description: "800-799-7233 • Text 'BEGIN' to 88788",
    descriptionTop: undefined,
    phone: "18007997233",
    text: "88788",
    website:'thehotline.org',
    additional_notes:'Has chat feature on website',
  },
  {
    type: "hotline",
    badge: "24/7",
    title: "Suicide & Crisis \nLifeline (US)",
    description: "988 • Text 988",
    descriptionTop: undefined,
    phone: "988",
    text: "988",
    website:'988lifeline.org',
    additional_notes:'Has chat feature on website',
  },
  {
    type: "hotline",
    badge: "24/7",
    title: "Crisis Text Line",
    description: "741741 • Text 'HOME' to 741741",
    descriptionTop: undefined,
    phone: "741741",
    text: "741741",
    website:'crisistextline.org',
    additional_notes:'Has chat feature on website',
  },
  {
    type: "hotline",
    badge: "24/7",
    title: "Local Emergency \nServices (911)",
    description: "911 • Text 911",
    descriptionTop: undefined,
    phone: "911",
    text: "911",
    website:'',
    additional_notes:'Include name, exact address, nature of the emergency, who you need to respond (police, fire), describe the situation-English Only',
  },
  {
    type: "book",
    badge: "Book",
    title: "Why Does He Do That?",
    description: undefined,
    descriptionTop: "By Lundy Bancroft",
    url: "https://www.amazon.com/Why-Does-He-That-Controlling/dp/0425191656"
  },
  {
    type: "book",
    badge: "Book",
    title: "Stop Walking on Eggshells",
    description: undefined,
    descriptionTop: "By Paul T. Mason & Randi Kreger",
    url: "https://www.amazon.com/Stop-Walking-Eggshells-Borderline-Personality/dp/1572246901"
  },
  {
    type: "book",
    badge: "Book",
    title: "It's Not You",
    description: undefined,
    descriptionTop: "By Ramani Durvasula",
    url: "https://www.amazon.com/Its-Not-You-author/dp/1785045024/ref=monarch_sidesheet_title"
  },
  {
    type: "book",
    badge: "Book",
    title: "The Covert Passive Aggressive Narcissist",
    description: undefined,
    descriptionTop: "By Debbie Mirza",
    url: "https://www.amazon.com/Covert-Passive-Aggressive-Narcissist-Recognizing-Psychological/dp/099862134X/ref=monarch_sidesheet_title"
  },
  {
    type: "book",
    badge: "Book",
    title: "The New Codependency",
    description: undefined,
    descriptionTop: "By Melody Beattie",
    url: "https://www.amazon.com/s?k=new+codependency&crid=3QQJIRS4ZODD0&sprefix=new+codepen%2Caps%2C119&ref=nb_sb_ss_fb_1_11_p13n-expert-pd-ops-ranker"
  },
  {
    type: "book",
    badge: "Book",
    title: "Facing Love Addiction",
    description: undefined,
    descriptionTop: "By Pia Mellody",
    url: "https://www.amazon.com/dp/0062506048/?bestFormat=true&k=facing%20love%20addiction%20book&ref_=nb_sb_ss_w_scx-ent-bk-ww_k2_1_9_de&crid=3GIG3LMOSP50K&sprefix=facing%20lo"
  },
  {
    type: "book",
    badge: "Book",
    title: "Facing Codependence",
    description: undefined,
    descriptionTop: "By Pia Mellody",
    url: "https://www.amazon.com/Facing-Codependence-Where-Comes-Sabotages/dp/0062505890/ref=monarch_sidesheet_title"
  },
  {
    type: "book",
    badge: "Book",
    title: "Out of the Shadows: Understanding Sex Addiction",
    description: undefined,
    descriptionTop: "By Patrick Carnes",
    url: "https://www.amazon.com/s?k=out+of+the+shadows&i=stripbooks&crid=11FDO6A2NVM3H&sprefix=Out+of+the+sh%2Cstripbooks%2C106&ref=nb_sb_ss_p13n-expert-pd-ops-ranker_1_13"
  },
  {
    type: "book",
    badge: "Book",
    title: "Complex PTSD: From Surviving to Thriving",
    description: undefined,
    descriptionTop: "By Pete Walker",
    url: "https://www.amazon.com/Complex-PTSD-Surviving-RECOVERING-CHILDHOOD/dp/1492871842/ref=monarch_sidesheet_title"
  },
  {
    type: "book",
    badge: "Book",
    title: "Blind to Betrayal",
    description: undefined,
    descriptionTop: "By Freyd & Birrell",
    url: "https://www.amazon.com/s?k=Blind+to+betrayal+freyd&i=stripbooks&crid=2NWF7IOREXPD0&sprefix=blind+to+betrayal+freyd%2Cstripbooks%2C95&ref=nb_sb_noss"
  },
  {
    type: "book",
    badge: "Book",
    title: "Self-Compassion",
    description: undefined,
    descriptionTop: "By Jennifer Neff",
    url: "https://www.amazon.com/Self-Compassion-Proven-Power-Being-Yourself/dp/0061733520"
  },
  {
    type: "book",
    badge: "Book",
    title: "I Thought It Was Just Me",
    description: undefined,
    descriptionTop: "By Brene Brown",
    url: "https://www.amazon.com/Thought-Was-Just-but-isnt/dp/1592403352/ref=monarch_sidesheet_title"
  },
  {
    type: "book",
    badge: "Book",
    title: "Radical Compassion",
    description: undefined,
    descriptionTop: "By Tara Brach",
    url: "https://www.amazon.com/Radical-Compassion-Learning-Yourself-Practice/dp/0525522832/ref=monarch_sidesheet_title"
  },
  {
    type: "book",
    badge: "Book",
    title: "Radical Acceptance",
    description: undefined,
    descriptionTop: "By Tara Brach",
    url: "https://www.amazon.com/Radical-Acceptance-Embracing-Heart-Buddha/dp/0553380990/ref=monarch_sidesheet_title"
  },
  {
    type: "book",
    badge: "Book",
    title: "DomesticShelters.org",
    description: undefined,
    descriptionTop: "Book Recommendations",
    url: "https://www.domesticshelters.org/resources/books/identifying-and-escaping-abuse"
  },
  {
    type: "book",
    badge: "Book",
    title: "Emotional Blackmail",
    description: undefined,
    descriptionTop: "Forward & Frazier",
    url: "https://www.amazon.com/Emotional-Blackmail-People-Obligation-Manipulate/dp/0060928972"
  },
  {
    type: "book",
    badge: "Book",
    title: "Emotionally Immature Parents",
    description: undefined,
    descriptionTop: "By Lindsay C. Gibson",
    url: "https://www.amazon.com/Adult-Children-Emotionally-Immature-Parents/dp/1626251703"
  },
  {
    type: "book",
    badge: "Book",
    title: "Grief Recovery Handbook",
    description: undefined,
    descriptionTop: "James & Friedman",
    url: "https://www.amazon.com/dp/0061686077/?bestFormat=true&k=grief%20recovery%20handbook&ref_=nb_sb_ss_w_scx-ent-pd-bk-d_k0_1_8_de&crid=203H1D9AYVGG9&sprefix=grief%20re"
  },
  {
    type: "book",
    badge: "Book",
    title: "Loving Parent Guidebook",
    description: undefined,
    descriptionTop: "Adult Children of Alcoholics (ACA)",
    url: "https://adultchildren.org/loving-parent-guidebook/"
  },
  {
    type: "book",
    badge: "Book",
    title: "Set Boundaries, Find Peace",
    description: undefined,
    descriptionTop: "By Nedra Glover Tawwab",
    url: "https://www.amazon.com/Set-Boundaries-Find-Peace-Reclaiming/dp/0349426953/ref=monarch_sidesheet_title"
  },
  {
    type: "book",
    badge: "Book",
    title: "Feel the Fear…And Beyond",
    description: undefined,
    descriptionTop: "By Susan Jeffers",
    url: "https://www.amazon.com/Feel-Fear-Beyond-Mastering-Techniques/dp/0449003612/ref=monarch_sidesheet_title"
  },
  {
    type: "book",
    badge: "Book",
    title: "Learned Optimism",
    description: undefined,
    descriptionTop: "By Martin P Seligman",
    url: "https://www.amazon.com/Learned-Optimism-Change-Your-Mind/dp/1400078393/ref=monarch_sidesheet_title"
  },
  {
    type: "book",
    badge: "Book",
    title: "Flourish",
    description: undefined,
    descriptionTop: "By Martin P Seligman",
    url: "https://www.amazon.com/Flourish-Visionary-Understanding-Happiness-Well-being/dp/1439190763/ref=monarch_sidesheet_title"
  },
  {
    type: "book",
    badge: "Book",
    title: "Boundaries",
    description: undefined,
    descriptionTop: "By Cloud & Townsend",
    url: "https://www.amazon.com/Boundaries-Updated-Expanded-When-Control/dp/0310351804/ref=monarch_sidesheet_title"
  },
  {
    type: "book",
    badge: "Book",
    title: "Boundaries in Marriage",
    description: undefined,
    descriptionTop: "By Cloud & Townsend",
    url: "https://www.amazon.com/Boundaries-Marriage-Henry-Cloud/dp/0310243149/ref=monarch_sidesheet_title"
  },
  {
    type: "book",
    badge: "Book",
    title: "Assertiveness Training",
    description: undefined,
    descriptionTop: "By Andy Gardner",
    url: "https://www.amazon.com/Assertiveness-Training-Assertive-Offending-Intelligence/dp/B0C47YGH59/ref=monarch_sidesheet_title"
  },
  {
    type: "book",
    badge: "Book",
    title: "Gaslighting",
    description: undefined,
    descriptionTop: "By Andy Gardner",
    url: "https://www.amazon.com/Gaslighting-Manipulation-Narcissistic-Relationship-Intelligence/dp/B0BR27VVTS/ref=tmm_pap_swatch_0"
  },
  {
    type: "book",
    badge: "Book",
    title: "Empath and Narcissist",
    description: undefined,
    descriptionTop: "By Andy Gardner",
    url: "https://www.amazon.com/Empath-Narcissist-Narcissistic-Manipulation-Intelligence/dp/B0CSW88KS9/ref=monarch_sidesheet_title"
  },
  { 
    type: "website", 
    badge: "Organization", 
    title: "National Coalition Against DV", 
    description: undefined, 
    descriptionTop: "ncadv.org", 
    url: "http://ncadv.org", 
  },
  { 
    type: "website", 
    badge: "Legal Help", 
    title: "Legal Aid Society", 
    description: undefined, 
    descriptionTop: "legalaid.org", 
    url: "http://legalaid.org", 
  },
  { 
    type: "website", 
    badge: "Meditation", 
    title: "RAIN Meditation - Brach", 
    description: undefined, 
    descriptionTop: "youtube.com", 
    url: "https://www.youtube.com/watch?v=ZuqXf9T6bpM", 
  },
  { 
    type: "website", 
    badge: "Meditation", 
    title: "Happier Meditation", 
    description: undefined, 
    descriptionTop: "meditatehappier.com", 
    url: "https://www.meditatehappier.com/", 
  },
  { 
    type: "website", 
    badge: "Support", 
    title: "Out of The Fog Support Group", 
    description: undefined, 
    descriptionTop: "outofthefog.net", 
    url: "https://www.outofthefog.net/forum/index.php", 
  },
  { 
    type: "website", 
    badge: "Support", 
    title: "Al Anon (Families of Alcoholics)", 
    description: undefined, 
    descriptionTop: "al-anon.org", 
    url: "https://al-anon.org/", 
  },
  { 
    type: "website", 
    badge: "Support", 
    title: "COSA (Family of Sex & Love Addicts)", 
    description: undefined, 
    descriptionTop: "cosa-recovery.org", 
    url: "https://cosa-recovery.org/", 
  },
  { 
    type: "website", 
    badge: "Support", 
    title: "Co-Dependents Anon", 
    description: undefined, 
    descriptionTop: "coda.org", 
    url: "https://coda.org/", 
  },
  { 
    type: "website", 
    badge: "Support", 
    title: "Adult Children of Alcoholics Anon", 
    description: undefined, 
    descriptionTop: "adultchildren.org", 
    url: "https://adultchildren.org/", 
  },
  { 
    type: "website", 
    badge: "Support", 
    title: "SLAA Sex and Love Addiction", 
    description: undefined, 
    descriptionTop: "slaafws.org", 
    url: "https://slaafws.org/", 
  },
  { 
    type: "website", 
    badge: "Support", 
    title: "Emotions Anonymous", 
    description: undefined, 
    descriptionTop: "emotionsanonymous.org", 
    url: "https://emotionsanonymous.org/", 
  },
  { 
    type: "website", 
    badge: "Help Tool", 
    title: "Understanding PTSD", 
    description: undefined, 
    descriptionTop: "ptsd.va.gov", 
    url: "https://www.ptsd.va.gov/PTSD/understand/what/index.asp", 
  },
  { 
    type: "website", 
    badge: "Help Tool", 
    title: "Understanding Complex PTSD", 
    description: undefined, 
    descriptionTop: "ptsd.va.gov", 
    url: "https://www.ptsd.va.gov/understand/what/complex_ptsd.asp", 
  },
  { 
    type: "website", 
    badge: "Help Tool", 
    title: "Screening for Depression", 
    description: undefined, 
    descriptionTop: "ismanet.org", 
    url: "https://www.ismanet.org/doctoryourspirit/pdfs/Beck-Depression-Inventory-BDI.pdf", 
  },
  { 
    type: "website", 
    badge: "Help Tool", 
    title: "Anxiety Screening", 
    description: undefined, 
    descriptionTop: "screening.mhanational.org", 
    url: "https://screening.mhanational.org/screening-tools/anxiety/?layout=actions_b", 
  },
  { 
    type: "website", 
    badge: "Help Tool", 
    title: "PTSD Screening Tool", 
    description: undefined, 
    descriptionTop: "ptsd.va.gov", 
    url: "https://www.ptsd.va.gov/professional/assessment/documents/PCL5_Standard_form.pdf", 
  },
  { 
    type: "website", 
    badge: "Help Tool", 
    title: "Locus of Control Assessment", 
    description: undefined, 
    descriptionTop: "oakland.edu", 
    url: "https://www.oakland.edu/Assets/upload/docs/Instructor-Handbook/Locus-of-Control.pdf", 
  },
];

// Legacy interfaces for backward compatibility (if needed)
export interface CrisisHotline {
  id: string;
  name: string;
  phone?: string;
  textNumber?: string;
  textKeyword?: string;
  website?: string;
  contactInfo?: string;
}

export interface BookArticle {
  id: string;
  title: string;
  author: string;
  type: 'Book' | 'Article';
  url?: string;
}

export interface WebsiteReferral {
  id: string;
  name: string;
  website: string;
  type: 'Organization' | 'Legal Help' | 'Support Group';
  url: string;
}

export const crisisHotlines: CrisisHotline[] = [];
export const booksArticles: BookArticle[] = [];
export const websitesReferrals: WebsiteReferral[] = [];

// Journal Data
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  time: string;
  createdAt: Date;
  tag?: string; // Journey stage tag like "Awareness", "Acceptance", etc.
}

export interface QAReflection {
  id: string;
  focusOfAdvice: string;
  date: string;
  time: string;
  questions: string[];
  reflection: string;
  createdAt: Date;
  tag?: string; // Journey stage tag like "Awareness", "Acceptance", etc.
}

export const sampleJournalEntries: JournalEntry[] = [
  {
    id: '1',
    title: 'Self-Compassion & Validation',
    content: 'Today I realized something important about setting boundaries. I\'ve been afraid to say no because I worry about disappointing others or being seen as difficult. But I\'m learning that my needs matter too.',
    date: '23 Oct 2025',
    time: '1:11 PM',
    tag: 'Awareness',
    createdAt: new Date('2025-10-23T13:11:00'),
  },
  {
    id: '2',
    title: 'Forms of Abuse',
    content: 'Today I had another difficult conversation with my partner. I noticed the pattern again - first the criticism about small things, then it escalates to personal attacks. I\'m starting to see this more clearly now.',
    date: '20 Oct 2025',
    time: '5:08 AM',
    tag: 'Acceptance',
    createdAt: new Date('2025-10-20T05:08:00'),
  },
];

export const sampleQAReflections: QAReflection[] = [
  {
    id: '1',
    focusOfAdvice: 'Self-Compassion & Validation',
    date: '23 Oct 2025',
    time: '1:11 PM',
    tag: 'Awareness',
    questions: [
      'What do you notice feeling unhelpful or overwhelming your perspective?',
      'How can you practice self-compassion in this moment?',
      'What steps can you take to protect your emotional well-being?',
    ],
    reflection: 'Today I realized something important about setting boundaries, I\'ve been afraid to express my needs and desires, and this has often led to feeling overwhelmed and unheard.',
    createdAt: new Date('2025-10-23T13:11:00'),
  },
  {
    id: '2',
    focusOfAdvice: 'Forms of Abuse',
    date: '12 Oct 2025',
    time: '10:10 PM',
    tag: 'Acceptance',
    questions: [
      'What patterns do you notice in your relationship?',
      'How do these patterns make you feel?',
      'What would healthy boundaries look like for you?',
    ],
    reflection: 'Today I realized something important about setting boundaries, I\'ve been afraid to express my needs and desires, and this has often led to feeling overwhelmed and unheard.',
    createdAt: new Date('2025-10-12T22:10:00'),
  },
];

// Journey Topic Data
export type TopicStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'LOCKED';
export type JourneyStepType = 'Awareness' | 'Acceptance' | 'Appreciation' | 'Action';
export type VersionType = 'Controller' | 'Adapter';

export interface ExtraVideo {
  id: string;
  title: string;
  duration: string; // e.g., "4:32"
  videoUrl?: string;
  thumbnailUrl?: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  status: TopicStatus;
  stepType: JourneyStepType;
  version?: VersionType; // Only for Acceptance step
  videoUrl?: string;
  videoTitle?: string;
  videoDuration?: string;
  keyLearningPoints: string[];
  reflectionQuestions: string[];
  extraVideos?: ExtraVideo[];
  pdfUrl?: string;
}

export interface ActionCategory {
  id: string;
  title: string;
  description: string;
  status: TopicStatus;
  topics: Topic[];
}

export interface StepTopics {
  stepId: string;
  stepType: JourneyStepType;
  title: string;
  description: string;
  topics: Topic[];
  showVersionToggle?: boolean; // Only for Acceptance
  categories?: ActionCategory[]; // Only for Action step
}
