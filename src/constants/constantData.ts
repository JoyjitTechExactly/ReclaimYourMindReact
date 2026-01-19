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

export const homeJourneyStages = [
  {
    id: '1',
    title: 'Awareness',
    description: 'Recognize patterns and how relationships are maintained.',
    progress: 19,
    total: 20,
    completed: false,
    icon: ImagePath.Journey1
  },
  {
    id: '2',
    title: 'Acceptance',
    description: 'Transition intense emotions to a place of calm clarity.',
    progress: 4,
    total: 20,
    completed: false,
    icon: ImagePath.Journey2
  },
  {
    id: '3',
    title: 'Appreciation',
    description: 'Develop a balanced perspective of the relationship.',
    progress: 0,
    total: 0,
    completed: false,
    icon: ImagePath.Journey3
  },
  {
    id: '4',
    title: 'Action',
    description: 'Learn coping skills to reclaim inner peace and reset patterns.',
    progress: 0,
    total: 0,
    completed: false,
    icon: ImagePath.Journey4
  }
];

// Resources Data
export interface CrisisHotline {
  id: string;
  name: string;
  phone: string;
  textNumber?: string;
  textKeyword?: string;
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