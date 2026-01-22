import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage utility for managing AsyncStorage operations
 */
class Storage {
  private readonly ACCESS_TOKEN_KEY = '@auth:access_token';
  private readonly USER_KEY = '@auth:user';
  private readonly ACCOUNT_CREATION_COMPLETE_KEY = '@auth:account_creation_complete';
  private readonly JOURNEY_STATUS_KEY = '@journey:status';
  private readonly LAST_VISITED_SCREEN_KEY = '@journey:last_visited_screen';

  /**
   * Store access token
   */
  async setAccessToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error storing access token:', error);
      throw error;
    }
  }

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving access token:', error);
      return null;
    }
  }

  /**
   * Store user data
   */
  async setUser(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user data:', error);
      throw error;
    }
  }

  /**
   * Get user data
   */
  async getUser(): Promise<any | null> {
    try {
      const userString = await AsyncStorage.getItem(this.USER_KEY);
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  /**
   * Store account creation completion status
   */
  async setAccountCreationComplete(isComplete: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(this.ACCOUNT_CREATION_COMPLETE_KEY, JSON.stringify(isComplete));
    } catch (error) {
      console.error('Error storing account creation completion status:', error);
      throw error;
    }
  }

  /**
   * Get account creation completion status
   */
  async getAccountCreationComplete(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(this.ACCOUNT_CREATION_COMPLETE_KEY);
      return value ? JSON.parse(value) : false;
    } catch (error) {
      console.error('Error retrieving account creation completion status:', error);
      return false;
    }
  }

  /**
   * Store journey status
   */
  async setJourneyStatus(status: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.JOURNEY_STATUS_KEY, status);
    } catch (error) {
      console.error('Error storing journey status:', error);
      throw error;
    }
  }

  /**
   * Get journey status
   */
  async getJourneyStatus(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.JOURNEY_STATUS_KEY);
    } catch (error) {
      console.error('Error retrieving journey status:', error);
      return null;
    }
  }

  /**
   * Store last visited screen
   */
  async setLastVisitedScreen(screen: string | null): Promise<void> {
    try {
      if (screen) {
        await AsyncStorage.setItem(this.LAST_VISITED_SCREEN_KEY, screen);
      } else {
        await AsyncStorage.removeItem(this.LAST_VISITED_SCREEN_KEY);
      }
    } catch (error) {
      console.error('Error storing last visited screen:', error);
      throw error;
    }
  }

  /**
   * Get last visited screen
   */
  async getLastVisitedScreen(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.LAST_VISITED_SCREEN_KEY);
    } catch (error) {
      console.error('Error retrieving last visited screen:', error);
      return null;
    }
  }

  /**
   * Clear all auth data
   */
  async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.ACCESS_TOKEN_KEY,
        this.USER_KEY,
        this.ACCOUNT_CREATION_COMPLETE_KEY,
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  }

  /**
   * Clear journey data
   */
  async clearJourneyData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.JOURNEY_STATUS_KEY,
        this.LAST_VISITED_SCREEN_KEY,
      ]);
    } catch (error) {
      console.error('Error clearing journey data:', error);
      throw error;
    }
  }

  /**
   * Remove access token
   */
  async removeAccessToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error removing access token:', error);
      throw error;
    }
  }

  /**
   * Remove user data
   */
  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error('Error removing user data:', error);
      throw error;
    }
  }
}

export default new Storage();

