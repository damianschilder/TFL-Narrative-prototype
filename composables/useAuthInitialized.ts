// /composables/useAuthInitialized.ts
export const useAuthInitialized = () => useState<boolean>('auth-initialized', () => false)