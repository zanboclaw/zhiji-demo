export const AUTH_STORAGE_KEY = 'robot-figma-login'

export function readAuthState() {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
}

export function writeAuthState(nextValue) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(AUTH_STORAGE_KEY, String(nextValue))
}
