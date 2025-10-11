// /server/types/session.d.ts

// This tells TypeScript what data can be stored in our session.
// We are "augmenting" the SessionData interface from nuxt-security.
declare module 'nuxt-security' {
  interface SessionData {
    loggedIn: boolean
  }
}

// It's important to add this export line to make the file a module
export {}
