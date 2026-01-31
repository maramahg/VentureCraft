/**
 * Translates Firebase Auth error codes into human-readable messages.
 */
export function getAuthErrorMessage(code: string): string {
    switch (code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'Incorrect email or password. Please check your credentials and try again.';
        case 'auth/email-already-in-use':
            return 'This email is already registered. Try signing in instead.';
        case 'auth/weak-password':
            return 'Password is too weak. Please use at least 6 characters.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        case 'auth/operation-not-allowed':
            return 'Authentication method not allowed. Please contact support.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later or reset your password.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection and try again.';
        case 'auth/internal-error':
            return 'An internal error occurred. Please try again later.';
        default:
            return 'An error occurred during authentication. Please try again.';
    }
}
