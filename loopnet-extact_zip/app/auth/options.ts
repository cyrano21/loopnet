import { authConfig } from "./config"

export const authOptions = {
  ...authConfig,
  providers: [
    // Configurez vos fournisseurs d'authentification ici
    // Par exemple, pour l'authentification par email :
    /*
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    */
  ],
}
