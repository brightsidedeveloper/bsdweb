import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient'
import brightBaseSingleton from './BrightBaseSingleton'

export default class BrightBaseAuth {
  auth: SupabaseAuthClient

  /**
   * Creates an instance of BrightBaseAuth.
   */
  constructor() {
    this.auth = brightBaseSingleton.getSupabase().auth
  }

  first(callback: () => void): this {
    try {
      callback()
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Unknown error')
    }
    return this
  }

  /**
   * Signs up a user with an email and password.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<any>} The signup data.
   * @throws {Error} If there is an error during the signup process.
   * @example
   * auth.signUpWithEmail('user@example.com', 'password123')
   *   .then(data => console.log('Signed up:', data))
   *   .catch(error => console.error('Signup error:', error.message));
   */
  async signUpWithEmail(email: string, password: string) {
    const { data, error } = await this.auth.signUp({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  /**
   * Signs in a user with an email and password.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<any>} The sign-in data.
   * @throws {Error} If there is an error during the sign-in process.
   * @example
   * auth.signInWithEmail('user@example.com', 'password123')
   *   .then(data => console.log('Signed in:', data))
   *   .catch(error => console.error('Sign-in error:', error.message));
   */
  async signInWithEmail(email: string, password: string) {
    const { data, error } = await this.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  /**
   * Signs in a user with Google OAuth.
   * @returns {Promise<any>} The sign-in data.
   * @throws {Error} If there is an error during the sign-in process.
   * @example
   * auth.signInWithGoogle()
   *   .then(data => console.log('Signed in with Google:', data))
   *   .catch(error => console.error('Google sign-in error:', error.message));
   */
  async signInWithGoogle() {
    const { data, error } = await this.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  /**
   * Signs in a user with Apple OAuth.
   * @returns {Promise<any>} The sign-in data.
   * @throws {Error} If there is an error during the sign-in process.
   * @example
   * auth.signInWithApple()
   *   .then(data => console.log('Signed in with Apple:', data))
   *   .catch(error => console.error('Apple sign-in error:', error.message));
   */
  async signInWithApple() {
    const { data, error } = await this.auth.signInWithOAuth({
      provider: 'apple',
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  /**
   * Sends a password reset email to the user.
   * @param {string} email - The user's email address.
   * @returns {Promise<any>} The password reset data.
   * @throws {Error} If there is an error during the reset process.
   * @example
   * auth.resetPassword('user@example.com')
   *   .then(data => console.log('Password reset email sent:', data))
   *   .catch(error => console.error('Password reset error:', error.message));
   */
  async resetPassword(email: string) {
    const { data, error } = await this.auth.resetPasswordForEmail(email)

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  /**
   * Updates the user's password.
   * @param {string} newPassword - The user's new password.
   * @returns {Promise<any>} The update data.
   * @throws {Error} If there is an error during the update process.
   * @example
   * auth.updatePassword('newpassword123')
   *   .then(data => console.log('Password updated:', data))
   *   .catch(error => console.error('Password update error:', error.message));
   */
  async updatePassword(newPassword: string) {
    const { data, error } = await this.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  /**
   * Signs out the current user.
   * @returns {Promise<boolean>} Resolves true if the user was signed out successfully.
   * @throws {Error} If there is an error during the sign-out process.
   * @example
   * auth.signOut()
   *   .then(() => console.log('User signed out'))
   *   .catch(error => console.error('Sign-out error:', error.message));
   */
  async signOut() {
    const { error } = await this.auth.signOut()

    if (error) {
      throw new Error(error.message)
    }

    return true
  }

  /**
   * Gets the current signed-in user.
   * @returns {Promise<any>} The current user data.
   * @throws {Error} If there is an error retrieving the current user.
   * @example
   * auth.getCurrentUser()
   *   .then(user => console.log('Current user:', user))
   *   .catch(error => console.error('Get current user error:', error.message));
   */
  async getCurrentUser() {
    const { data, error } = await this.auth.getUser()

    if (error) {
      throw new Error(error.message)
    }

    return data.user
  }

  /**
   * Recovers the user's password using a token.
   * This is usually handled on a
   * This is usually handled on a frontend route where the user provides a new password.
   * @param {string} newPassword - The user's new password.
   * @returns {Promise<any>} The recovery data.
   * @throws {Error} If there is an error during the password recovery process.
   * @example
   * auth.recoverPassword('newpassword123')
   *   .then(data => console.log('Password recovered:', data))
   *   .catch(error => console.error('Password recovery error:', error.message));
   */
  async recoverPassword(newPassword: string) {
    const { data, error } = await this.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  /**
   * Updates the user's email address.
   * @param {string} newEmail - The user's new email address.
   * @returns {Promise<any>} The update data.
   * @throws {Error} If there is an error during the email update process.
   * @example
   * auth.updateEmail('newemail@example.com')
   *   .then(data => console.log('Email updated:', data))
   *   .catch(error => console.error('Email update error:', error.message));
   */
  async updateEmail(newEmail: string) {
    const { data, error } = await this.auth.updateUser({
      email: newEmail,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }
}
