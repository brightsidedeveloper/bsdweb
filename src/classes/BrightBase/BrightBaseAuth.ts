import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient'
import brightBaseSingleton from './BrightBaseSingleton'

export default class BrightBaseAuth {
  auth: SupabaseAuthClient

  constructor() {
    this.auth = brightBaseSingleton.getSupabase().auth
  }

  first(callback: () => void): this {
    callback()
    return this
  }

  // Sign up with email and password
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

  // Sign in with email and password
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

  // Sign in with Google
  async signInWithGoogle() {
    const { data, error } = await this.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  // Sign in with Apple
  async signInWithApple() {
    const { data, error } = await this.auth.signInWithOAuth({
      provider: 'apple',
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  // Reset password (send password reset email)
  async resetPassword(email: string) {
    const { data, error } = await this.auth.resetPasswordForEmail(email)

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  // Update password
  async updatePassword(newPassword: string) {
    const { data, error } = await this.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  // Sign out
  async signOut() {
    const { error } = await this.auth.signOut()

    if (error) {
      throw new Error(error.message)
    }

    return true
  }

  // Get the current user
  async getCurrentUser() {
    const { data, error } = await this.auth.getUser()

    if (error) {
      throw new Error(error.message)
    }

    return data.user
  }

  // Recover password using a token (usually handled in a frontend route)
  async recoverPassword(newPassword: string) {
    const { data, error } = await this.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  // Update user email
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
