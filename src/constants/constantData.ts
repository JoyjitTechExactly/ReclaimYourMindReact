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
