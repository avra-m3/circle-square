import { logEvent } from '@firebase/analytics';
import { analytics } from '@/components/firebase/app';

type Events = 'circle_added' | 'rect_added' | 'circle_removed' | 'rect_removed' | 'pan' | 'zoom'

export const log = (type: Events) => {
    logEvent(analytics, type);
}