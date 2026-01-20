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

// Mock topic data
export const mockTopics: StepTopics[] = [
  {
    stepId: '1',
    stepType: 'Awareness',
    title: 'Awareness',
    description: 'Recognize patterns & warning signs',
    topics: [
      {
        id: 'awareness-1',
        title: 'Building Understanding',
        description: 'Recognize the signs and impacts of emotional abuse.',
        status: 'COMPLETED',
        stepType: 'Awareness',
        videoUrl: 'https://example.com/video1',
        videoTitle: 'Control Patterns in Relationships',
        videoDuration: '4:32',
        keyLearningPoints: [
          'Recognizing these patterns is the first step toward understanding your situation and considering your options, your input.',
          'Understanding emotional abuse helps you identify unhealthy dynamics.',
          'Knowledge empowers you to make informed decisions about your relationships.',
        ],
        reflectionQuestions: [
          'When do you notice feeling uncertain or questioning your own perspective?',
          'What patterns do you see in situations that leave you feeling confused?',
          'How do you typically respond if someone challenges your memory or experiences?',
        ],
        extraVideos: [
          { id: 'extra-1', title: 'Communication Styles impact', duration: '3:16' },
          { id: 'extra-2', title: 'Conflict Resolution Techniques', duration: '2:09' },
          { id: 'extra-3', title: 'Control Patterns in Relationships', duration: '4:32' },
          { id: 'extra-4', title: 'Building Trust and Intimacy', duration: '4:50' },
        ],
      },
      {
        id: 'awareness-2',
        title: 'Cycle of Emotional Abuse',
        description: 'Examine the patterns of tension, drama, reconciliation, and calm.',
        status: 'COMPLETED',
        stepType: 'Awareness',
        keyLearningPoints: [
          'The cycle of abuse follows predictable patterns.',
          'Understanding the cycle helps break free from it.',
        ],
        reflectionQuestions: [
          'What patterns do you notice in your relationship dynamics?',
        ],
      },
      {
        id: 'awareness-3',
        title: 'Effects of Emotional Abuse',
        description: 'Explore emotional, mental and physical consequences.',
        status: 'COMPLETED',
        stepType: 'Awareness',
        keyLearningPoints: [
          'Emotional abuse has lasting effects on mental and physical health.',
        ],
        reflectionQuestions: [],
      },
      {
        id: 'awareness-4',
        title: 'Who are Controllers?',
        description: 'Identify traits of controlling individuals and their behaviors.',
        status: 'COMPLETED',
        stepType: 'Awareness',
        keyLearningPoints: [],
        reflectionQuestions: [],
      },
      {
        id: 'awareness-5',
        title: 'Who are Adapters?',
        description: 'Understand characteristics of those who adapt to control.',
        status: 'COMPLETED',
        stepType: 'Awareness',
        keyLearningPoints: [],
        reflectionQuestions: [],
      },
      {
        id: 'awareness-6',
        title: 'Am I the Controller or Adapter?',
        description: 'Assess your role in unhealthy dynamics.',
        status: 'IN_PROGRESS',
        stepType: 'Awareness',
        videoUrl: 'https://example.com/video2',
        videoTitle: 'Control Patterns in Relationships',
        videoDuration: '4:32',
        keyLearningPoints: [
          'Recognizing these patterns is the first step toward understanding your situation and considering your options, your input.',
        ],
        reflectionQuestions: [
          'When do you notice feeling uncertain or questioning your own perspective?',
          'What patterns do you see in situations that leave you feeling confused?',
          'How do you typically respond if someone challenges your memory or experiences?',
        ],
        extraVideos: [
          { id: 'extra-5', title: 'Communication Styles impact', duration: '3:16' },
          { id: 'extra-6', title: 'Conflict Resolution Techniques', duration: '2:09' },
          { id: 'extra-7', title: 'Control Patterns in Relationships', duration: '4:32' },
          { id: 'extra-8', title: 'Building Trust and Intimacy', duration: '4:50' },
        ],
      },
      {
        id: 'awareness-7',
        title: 'Self Validation and Compassion',
        description: 'Foster self-recognition and compassion for healing.',
        status: 'NOT_STARTED',
        stepType: 'Awareness',
        keyLearningPoints: [],
        reflectionQuestions: [],
      },
    ],
  },
  {
    stepId: '2',
    stepType: 'Acceptance',
    title: 'Acceptance',
    description: 'Process stages of grief to better understand your healing journey.',
    showVersionToggle: true,
    topics: [
      // Controller Version Topics
      {
        id: 'acceptance-controller-1',
        title: 'Denial',
        description: 'Examining the challenges of fully recognizing the dysfunction within the relationship.',
        status: 'COMPLETED',
        stepType: 'Acceptance',
        version: 'Controller',
        videoUrl: 'https://example.com/video1',
        videoTitle: 'Control Patterns in Relationships',
        videoDuration: '4:32',
        keyLearningPoints: [
          'Recognizing these patterns is the first step toward understanding your situation and considering your options, your input.',
          'Denial is a natural defense mechanism that protects us from painful truths.',
          'Acknowledging denial allows for genuine healing to begin.',
        ],
        reflectionQuestions: [
          'When do you notice feeling uncertain or questioning your own perspective?',
          'What patterns do you see in situations that leave you feeling confused?',
          'How do you typically respond if someone challenges your memory or experiences?',
        ],
        extraVideos: [
          { id: 'extra-controller-1', title: 'Communication Styles impact', duration: '3:15' },
          { id: 'extra-controller-2', title: 'Conflict Resolution Techniques', duration: '2:09' },
          { id: 'extra-controller-3', title: 'Control Patterns in Relationships', duration: '4:32' },
          { id: 'extra-controller-4', title: 'Building Trust and Intimacy', duration: '4:50' },
        ],
      },
      {
        id: 'acceptance-controller-2',
        title: 'Anger',
        description: 'Feelings of frustration and resentment towards the Controller.',
        status: 'COMPLETED',
        stepType: 'Acceptance',
        version: 'Controller',
        keyLearningPoints: [],
        reflectionQuestions: [],
      },
      {
        id: 'acceptance-controller-3',
        title: 'Bargaining',
        description: 'Attempts to regain control through \'what if\' scenarios, reflecting difficulty accepting reality.',
        status: 'COMPLETED',
        stepType: 'Acceptance',
        version: 'Controller',
        keyLearningPoints: [],
        reflectionQuestions: [],
      },
      {
        id: 'acceptance-controller-4',
        title: 'Depression',
        description: 'Profound sadness and a sense of loss stemming from unmet expectations of a healthy relationship.',
        status: 'IN_PROGRESS',
        stepType: 'Acceptance',
        version: 'Controller',
        videoUrl: 'https://example.com/video2',
        videoTitle: 'Control Patterns in Relationships',
        videoDuration: '4:32',
        keyLearningPoints: [
          'Recognizing these patterns is the first step toward understanding your situation and considering your options, your input.',
        ],
        reflectionQuestions: [
          'When do you notice feeling uncertain or questioning your own perspective?',
          'What patterns do you see in situations that leave you feeling confused?',
          'How do you typically respond if someone challenges your memory or experiences?',
        ],
        extraVideos: [
          { id: 'extra-controller-5', title: 'Communication Styles impact', duration: '3:15' },
          { id: 'extra-controller-6', title: 'Conflict Resolution Techniques', duration: '2:09' },
          { id: 'extra-controller-7', title: 'Control Patterns in Relationships', duration: '4:32' },
          { id: 'extra-controller-8', title: 'Building Trust and Intimacy', duration: '4:50' },
        ],
      },
      {
        id: 'acceptance-controller-5',
        title: 'Acceptance',
        description: 'Recognizing the reality of the relationship, which paves the way for healing and personal growth.',
        status: 'NOT_STARTED',
        stepType: 'Acceptance',
        version: 'Controller',
        keyLearningPoints: [],
        reflectionQuestions: [],
      },
      // Adapter Version Topics
      {
        id: 'acceptance-adapter-1',
        title: 'Denial',
        description: 'Examining the challenges of fully recognizing the dysfunction within the relationship.',
        status: 'COMPLETED',
        stepType: 'Acceptance',
        version: 'Adapter',
        keyLearningPoints: [],
        reflectionQuestions: [],
      },
      {
        id: 'acceptance-adapter-2',
        title: 'Anger',
        description: 'Feelings of frustration and resentment towards the Controller.',
        status: 'COMPLETED',
        stepType: 'Acceptance',
        version: 'Adapter',
        keyLearningPoints: [],
        reflectionQuestions: [],
      },
      {
        id: 'acceptance-adapter-3',
        title: 'Bargaining',
        description: 'Attempts to regain control through \'what if\' scenarios, reflecting difficulty accepting reality.',
        status: 'COMPLETED',
        stepType: 'Acceptance',
        version: 'Adapter',
        keyLearningPoints: [],
        reflectionQuestions: [],
      },
      {
        id: 'acceptance-adapter-4',
        title: 'Depression',
        description: 'Profound sadness and a sense of loss stemming from unmet expectations of a healthy relationship.',
        status: 'IN_PROGRESS',
        stepType: 'Acceptance',
        version: 'Adapter',
        keyLearningPoints: [],
        reflectionQuestions: [],
      },
      {
        id: 'acceptance-adapter-5',
        title: 'Acceptance',
        description: 'Recognizing the reality of the relationship, which paves the way for healing and personal growth.',
        status: 'NOT_STARTED',
        stepType: 'Acceptance',
        version: 'Adapter',
        keyLearningPoints: [],
        reflectionQuestions: [],
      },
    ],
  },
  {
    stepId: '3',
    stepType: 'Appreciation',
    title: 'Appreciation',
    description: 'Learn to recognize positives realistically and practice gratitude.',
    topics: [
      {
        id: 'appreciation-1',
        title: 'Denial vs. Balanced Evaluation',
        description: 'Shifting from an emphasis on the unhelpful behaviors the Controller once exhibited to recognizing their current positive actions.',
        status: 'COMPLETED',
        stepType: 'Appreciation',
        keyLearningPoints: [],
        reflectionQuestions: [],
      },
      {
        id: 'appreciation-2',
        title: 'Understanding Mental Illnesses',
        description: 'Gaining insight into how mental health issues may influence a Controller\'s behavior, fostering empathy and understanding.',
        status: 'IN_PROGRESS',
        stepType: 'Appreciation',
        videoUrl: 'https://example.com/video1',
        videoTitle: 'Control Patterns in Relationships',
        videoDuration: '4:32',
        keyLearningPoints: [
          'Recognizing these patterns is the first step toward understanding your situation and considering your options, your input.',
          'Recognizing these patterns is the first step toward understanding your situation and considering your options, your input.',
          'Recognizing these patterns is the first step toward understanding your situation and considering your options, your input.',
          'Recognizing these patterns is the first step toward understanding your situation and considering your options, your input.',
          'Recognizing these patterns is the first step toward understanding your situation and considering your options, your input.',
        ],
        reflectionQuestions: [
          'When do you notice feeling uncertain or questioning your own perspective?',
          'What patterns do you see in situations that leave you feeling confused?',
          'How do you typically respond if someone challenges your memory or experience?',
        ],
        extraVideos: [
          { id: 'extra-appreciation-1', title: 'Communication Styles Impact', duration: '3:15' },
          { id: 'extra-appreciation-2', title: 'Conflict Resolution Techniques', duration: '2:09' },
          { id: 'extra-appreciation-3', title: 'Control Patterns in Relationships', duration: '4:32' },
          { id: 'extra-appreciation-4', title: 'Building Trust and Intimacy', duration: '4:50' },
        ],
      },
      {
        id: 'appreciation-3',
        title: 'Balanced Evaluations',
        description: 'Learning to assess the Controller\'s actions with a fair perspective, acknowledging their strengths alongside their flaws.',
        status: 'NOT_STARTED',
        stepType: 'Appreciation',
        keyLearningPoints: [],
        reflectionQuestions: [],
      },
      {
        id: 'appreciation-4',
        title: 'Radical Acceptance and Gratitude',
        description: 'Embracing the reality of the relationship and finding gratitude for lessons learned, and positive Controller contributions.',
        status: 'NOT_STARTED',
        stepType: 'Appreciation',
        keyLearningPoints: [],
        reflectionQuestions: [],
      },
    ],
  },
  {
    stepId: '4',
    stepType: 'Action',
    title: 'Action',
    description: 'Practical steps to prevent and empower yourself',
    categories: [
      {
        id: 'action-category-1',
        title: 'Internal Change',
        description: 'Build inner strength and emotional resilience',
        status: 'IN_PROGRESS',
        topics: [
          {
            id: 'action-internal-1',
            title: 'Cognitive Behavioral Therapy',
            description: 'Strategies designed to change negative thought patterns, leading to unhealthy behaviors and beliefs.',
            status: 'COMPLETED',
            stepType: 'Action',
            keyLearningPoints: [],
            reflectionQuestions: [],
          },
          {
            id: 'action-internal-2',
            title: 'Thought Errors',
            description: 'Common cognitive distortions that skew perception, leading to unhealthy emotions and reactivity.',
            status: 'IN_PROGRESS',
            stepType: 'Action',
            videoUrl: 'https://example.com/video1',
            videoTitle: 'Common Patterns in Relationship',
            videoDuration: '4:00',
            keyLearningPoints: [
              'Recognizing these patterns is the first step toward understanding your situation and considering your options, your input.',
              'Recognizing these patterns is the first step toward understanding your situation and considering your options, your input.',
              'Recognizing these patterns is the first step toward understanding your situation and considering your options, your input.',
              'Recognizing these patterns is the first step toward understanding your situation and considering your options, your input.',
            ],
            reflectionQuestions: [
              'When do you notice feeling unstable or questioning your own perspective?',
              'What patterns do you see in situations that leave you feeling confused?',
              'How do you typically respond if someone challenges your normalcy or experiences?',
            ],
            extraVideos: [
              { id: 'extra-action-1', title: 'Communication Styles Impact', duration: '3:30' },
              { id: 'extra-action-2', title: 'Conflict Resolution Techniques', duration: '2:00' },
              { id: 'extra-action-3', title: 'Common Patterns in Relationships', duration: '4:00' },
              { id: 'extra-action-4', title: 'Building Trust & Intimacy', duration: '4:00' },
            ],
          },
          {
            id: 'action-internal-3',
            title: 'Childhood Trauma Thought Patterns',
            description: 'Mental schemas formed in response to intense trauma, which affect relationships, behavior and self-worth.',
            status: 'NOT_STARTED',
            stepType: 'Action',
            keyLearningPoints: [],
            reflectionQuestions: [],
          },
          {
            id: 'action-internal-4',
            title: 'Cognitive Therapy Tools',
            description: 'Practical methods used in cognitive therapy to challenge thoughts and reframe distorted thoughts.',
            status: 'NOT_STARTED',
            stepType: 'Action',
            keyLearningPoints: [],
            reflectionQuestions: [],
          },
          {
            id: 'action-internal-5',
            title: 'Locus of Control',
            description: 'The degree to which individuals believe they can control events affecting them, influencing their responses to challenges.',
            status: 'NOT_STARTED',
            stepType: 'Action',
            keyLearningPoints: [],
            reflectionQuestions: [],
          },
          {
            id: 'action-internal-6',
            title: 'Addiction Method',
            description: 'A therapeutic method to help individuals explore the causes of their addictions and develop skills for self-control.',
            status: 'NOT_STARTED',
            stepType: 'Action',
            keyLearningPoints: [],
            reflectionQuestions: [],
          },
          {
            id: 'action-internal-7',
            title: 'Centric Accountability',
            description: 'A comprehensive approach to holding oneself accountable for actions, encouraging growth and self-esteem.',
            status: 'NOT_STARTED',
            stepType: 'Action',
            keyLearningPoints: [],
            reflectionQuestions: [],
          },
          {
            id: 'action-internal-8',
            title: 'Return of Grief',
            description: 'Recognizing that grief can resurface unexpectedly, requiring ongoing processing and healing.',
            status: 'NOT_STARTED',
            stepType: 'Action',
            keyLearningPoints: [],
            reflectionQuestions: [],
          },
          {
            id: 'action-internal-9',
            title: 'Connecting with God',
            description: 'Exploring spiritual practices that foster inner peace, forgiveness, support, and guidance during difficult times.',
            status: 'NOT_STARTED',
            stepType: 'Action',
            keyLearningPoints: [],
            reflectionQuestions: [],
          },
          {
            id: 'action-internal-10',
            title: 'Radical Forgiveness',
            description: 'A transformative approach to forgiveness that emphasizes letting go of resentment and embracing healing.',
            status: 'NOT_STARTED',
            stepType: 'Action',
            keyLearningPoints: [],
            reflectionQuestions: [],
          },
        ],
      },
      {
        id: 'action-category-2',
        title: 'External Change',
        description: 'Practical ways to change your environment',
        status: 'NOT_STARTED',
        topics: [],
      },
      {
        id: 'action-category-3',
        title: 'After Relationship',
        description: 'Healing and moving forward after leaving',
        status: 'NOT_STARTED',
        topics: [],
      },
    ],
  },
];