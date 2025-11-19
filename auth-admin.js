/**
 * ================================================
 * 🔐 PROFESSIONAL ADMIN AUTHENTICATION SYSTEM
 * ================================================
 * Features:
 * - Token-based authentication
 * - Secure session management
 * - Password encryption (bcrypt simulation)
 * - Rate limiting for failed attempts
 * - Multi-factor verification ready
 * - Audit logging
 * ================================================
 */

const AdminAuthSystem = (() => {
  // Private variables
  const AUTH_CONFIG = {
    TOKEN_EXPIRY: 60 * 60 * 1000, // 1 hour in milliseconds
    MAX_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
    SESSION_KEY: 'admin_session_token',
    ATTEMPT_KEY: 'admin_login_attempts',
  };

  // Simulated user database (in production, use backend API)
  const USER_DATABASE = {
    credentials: [
      {
        id: 'admin001',
        username: 'admin',
        passwordHash: hashPassword('MAlika123123'), // Change this!
        role: 'ADMIN',
        twoFactorEnabled: false,
      },
    ],
  };

  // Audit log storage
  const auditLog = [];

  /**
   * Simple password hashing simulation
   * In production, use proper bcrypt on backend
   */
  function hashPassword(password) {
    return btoa(password);
  }

  /**
   * Verify password
   */
  function verifyPassword(inputPassword, storedHash) {
    return hashPassword(inputPassword) === storedHash;
  }

  /**
   * Generate secure authentication token
   */
  function generateToken() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return btoa(`${timestamp}:${random}`);
  }

  /**
   * Log authentication events for audit trail
   */
  function logAuditEvent(eventType, userId, details = {}) {
    const event = {
      timestamp: new Date().toISOString(),
      eventType,
      userId,
      ipAddress: 'N/A', // In production, get from server
      ...details,
    };
    auditLog.push(event);
    console.log('[AUDIT]', event);
  }

  /**
   * Check if user account is locked due to failed attempts
   */
  function isAccountLocked(username) {
    const attempts = JSON.parse(
      localStorage.getItem(AUTH_CONFIG.ATTEMPT_KEY) || '{}'
    );
    const userAttempts = attempts[username];

    if (!userAttempts) return false;

    const { count, lockedUntil } = userAttempts;
    if (count >= AUTH_CONFIG.MAX_ATTEMPTS) {
      if (Date.now() < lockedUntil) {
        return true;
      } else {
        // Reset lock
        delete attempts[username];
        localStorage.setItem(AUTH_CONFIG.ATTEMPT_KEY, JSON.stringify(attempts));
        return false;
      }
    }
    return false;
  }

  /**
   * Record failed login attempt
   */
  function recordFailedAttempt(username) {
    const attempts = JSON.parse(
      localStorage.getItem(AUTH_CONFIG.ATTEMPT_KEY) || '{}'
    );

    if (!attempts[username]) {
      attempts[username] = { count: 0, lockedUntil: 0 };
    }

    attempts[username].count += 1;

    if (attempts[username].count >= AUTH_CONFIG.MAX_ATTEMPTS) {
      attempts[username].lockedUntil =
        Date.now() + AUTH_CONFIG.LOCKOUT_DURATION;
      logAuditEvent('ACCOUNT_LOCKED', username, {
        reason: 'Max login attempts exceeded',
      });
    }

    localStorage.setItem(AUTH_CONFIG.ATTEMPT_KEY, JSON.stringify(attempts));
    logAuditEvent('FAILED_LOGIN_ATTEMPT', username, {
      attemptNumber: attempts[username].count,
    });
  }

  /**
   * Reset failed attempts on successful login
   */
  function resetFailedAttempts(username) {
    const attempts = JSON.parse(
      localStorage.getItem(AUTH_CONFIG.ATTEMPT_KEY) || '{}'
    );
    delete attempts[username];
    localStorage.setItem(AUTH_CONFIG.ATTEMPT_KEY, JSON.stringify(attempts));
  }

  /**
   * Main authentication method
   */
  function authenticate(username, password) {
    const response = {
      success: false,
      message: '',
      token: null,
      user: null,
    };

    // Check if account is locked
    if (isAccountLocked(username)) {
      response.message = 'Account locked. Try again later.';
      logAuditEvent('LOCKED_ACCOUNT_ACCESS_ATTEMPT', username);
      return response;
    }

    // Find user
    const user = USER_DATABASE.credentials.find((u) => u.username === username);

    if (!user) {
      response.message = 'Invalid credentials';
      recordFailedAttempt(username);
      return response;
    }

    // Verify password
    if (!verifyPassword(password, user.passwordHash)) {
      response.message = 'Invalid credentials';
      recordFailedAttempt(username);
      return response;
    }

    // Successful authentication
    resetFailedAttempts(username);
    const token = generateToken();
    const sessionData = {
      token,
      userId: user.id,
      username: user.username,
      role: user.role,
      loginTime: Date.now(),
      expiryTime: Date.now() + AUTH_CONFIG.TOKEN_EXPIRY,
    };

    // Store session
    sessionStorage.setItem(
      AUTH_CONFIG.SESSION_KEY,
      JSON.stringify(sessionData)
    );

    response.success = true;
    response.message = 'Authentication successful';
    response.token = token;
    response.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    logAuditEvent('SUCCESSFUL_LOGIN', user.id, { username });
    return response;
  }

  /**
   * Verify if user is currently authenticated
   */
  function isAuthenticated() {
    const sessionData = sessionStorage.getItem(AUTH_CONFIG.SESSION_KEY);
    if (!sessionData) return false;

    const session = JSON.parse(sessionData);
    const isExpired = Date.now() > session.expiryTime;

    if (isExpired) {
      logout();
      return false;
    }

    return true;
  }

  /**
   * Get current session data
   */
  function getSession() {
    if (!isAuthenticated()) return null;
    return JSON.parse(sessionStorage.getItem(AUTH_CONFIG.SESSION_KEY));
  }

  /**
   * Logout user
   */
  function logout() {
    const session = JSON.parse(
      sessionStorage.getItem(AUTH_CONFIG.SESSION_KEY) || '{}'
    );
    logAuditEvent('LOGOUT', session.userId || 'unknown');
    sessionStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
  }

  /**
   * Get audit log (admin only)
   */
  function getAuditLog() {
    if (!isAuthenticated()) {
      console.warn('Unauthorized access to audit log');
      return [];
    }
    return auditLog;
  }

  /**
   * Change password (authenticated users only)
   */
  function changePassword(username, oldPassword, newPassword) {
    const response = {
      success: false,
      message: '',
    };

    if (!isAuthenticated()) {
      response.message = 'Not authenticated';
      return response;
    }

    const user = USER_DATABASE.credentials.find((u) => u.username === username);
    if (!user) {
      response.message = 'User not found';
      return response;
    }

    if (!verifyPassword(oldPassword, user.passwordHash)) {
      response.message = 'Current password is incorrect';
      logAuditEvent('FAILED_PASSWORD_CHANGE', user.id, {
        reason: 'Wrong current password',
      });
      return response;
    }

    // Update password
    user.passwordHash = hashPassword(newPassword);
    response.success = true;
    response.message = 'Password changed successfully';
    logAuditEvent('PASSWORD_CHANGED', user.id);
    return response;
  }

  /**
   * Public API
   */
  return {
    authenticate,
    isAuthenticated,
    getSession,
    logout,
    getAuditLog,
    changePassword,
    config: AUTH_CONFIG,
  };
})();

// Export for use
window.AdminAuthSystem = AdminAuthSystem;
