import { NavigationContainerRefWithCurrent, CommonActions } from '@react-navigation/native';
import { RootStackParamList } from '../navigators/types';

/**
 * Navigation reference for global navigation access
 * This allows navigation from outside React components (e.g., API interceptors)
 */
export const navigationRef: {
  current: NavigationContainerRefWithCurrent<RootStackParamList> | null;
} = {
  current: null,
};

/**
 * Navigate to a specific screen
 */
export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.current?.isReady()) {
    navigationRef.current.navigate(name as never, params as never);
  }
}

/**
 * Reset navigation stack
 */
export function resetNavigation(routes: Array<{ name: keyof RootStackParamList; params?: any }>, index: number = 0) {
  if (navigationRef.current?.isReady()) {
    navigationRef.current.dispatch(
      CommonActions.reset({
        index,
        routes: routes as never[],
      })
    );
  }
}

/**
 * Reset navigation to login screen
 * This resets the entire navigation stack to Auth > SignIn
 */
export function resetToLogin() {
  if (navigationRef.current?.isReady()) {
    try {
      // Reset to Auth navigator, then navigate to SignIn
      navigationRef.current.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        })
      );
      
      // Navigate to SignIn within Auth navigator after a short delay
      // This ensures the Auth navigator is mounted first
      setTimeout(() => {
        if (navigationRef.current?.isReady()) {
          // Use navigate with nested screen
          navigationRef.current.navigate('Auth' as never, { screen: 'SignIn' } as never);
        }
      }, 50);
    } catch (error) {
      console.error('Error resetting to login:', error);
    }
  }
}

