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
export interface CrisisHotline {
  id: string;
  name: string;
  phone?: string;
  textNumber?: string;
  textKeyword?: string;
  website?: string;
  contactInfo?: string; // Custom contact info text
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

export const crisisHotlines: CrisisHotline[] = [
  {
    id: '1',
    name: 'National Domestic Violence Hotline',
    phone: '1-800-799-7233',
    textNumber: '88788',
    textKeyword: 'START',
  },
  {
    id: '2',
    name: 'National Domestic Violence Hotline',
    phone: '1-800-799-7233',
    textNumber: '88788',
    textKeyword: 'START',
  },
  {
    id: '3',
    name: 'Crisis Text Line',
    textNumber: '741741',
    textKeyword: 'HOME',
    website: 'crisistextline.org',
    contactInfo: 'Text or WhatsApp HOME to 741741',
  },
  {
    id: '4',
    name: 'Your Local 911 for Emergencies',
    phone: '911',
    textNumber: '911',
    contactInfo: 'Text or Call 911',
  },
];

export const booksArticles: BookArticle[] = [
  {
    id: '1',
    title: 'Why Does He Do That?',
    author: 'Lundy Bancroft',
    type: 'Book',
    url: 'https://example.com/book1',
  },
  {
    id: '2',
    title: 'Recognizing Emotional Abuse',
    author: 'National Coalition Against DV',
    type: 'Article',
    url: 'https://example.com/article1',
  },
];

export const websitesReferrals: WebsiteReferral[] = [
  {
    id: '1',
    name: 'National Coalition Against DV',
    website: 'ncadv.org',
    type: 'Organization',
    url: 'https://ncadv.org',
  },
  {
    id: '2',
    name: 'Legal Aid Society',
    website: 'legalaid.org',
    type: 'Legal Help',
    url: 'https://legalaid.org',
  },
];

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
