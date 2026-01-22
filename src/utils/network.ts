import NetInfo from '@react-native-community/netinfo';

/**
 * Network utility for checking internet connectivity
 */
class Network {
  /**
   * Check if device is connected to internet
   * @returns Promise<boolean> - true if connected, false otherwise
   */
  async isConnected(): Promise<boolean> {
    try {
      const state = await NetInfo.fetch();
      return state.isConnected === true && state.isInternetReachable === true;
    } catch (error) {
      console.error('Error checking network connectivity:', error);
      return false;
    }
  }

  /**
   * Get current network state
   * @returns Promise<NetInfoState> - Current network state
   */
  async getNetworkState() {
    try {
      return await NetInfo.fetch();
    } catch (error) {
      console.error('Error getting network state:', error);
      return null;
    }
  }

  /**
   * Subscribe to network state changes
   * @param callback - Function to call when network state changes
   * @returns Unsubscribe function
   */
  subscribe(callback: (state: NetInfo.NetInfoState) => void) {
    return NetInfo.addEventListener(callback);
  }
}

export default new Network();

