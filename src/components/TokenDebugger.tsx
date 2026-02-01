'use client';

import { useEffect } from 'react';
import { AuthService } from '@/services';

/**
 * Token Debug Component
 * Add this to your layout to monitor token state
 */
export function TokenDebugger() {
  useEffect(() => {
    // Check token on mount
    const checkToken = () => {
      const token = AuthService.getToken();
      const isAuth = AuthService.isAuthenticated();

      console.log('🔍 Token Debug on Page Load:', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        isAuthenticated: isAuth,
        tokenPreview: token ? token.substring(0, 30) + '...' : 'None',
      });

      if (!token) {
        console.warn('⚠️ No authentication token found!');
      }
    };

    checkToken();

    // Also check on focus (when user returns to tab)
    window.addEventListener('focus', checkToken);

    return () => {
      window.removeEventListener('focus', checkToken);
    };
  }, []);

  // Don't render anything
  return null;
}
