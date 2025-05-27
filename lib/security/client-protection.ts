"use client"

export class ClientProtection {
  private static isInitialized = false

  static initialize() {
    if (this.isInitialized || typeof window === "undefined") return

    this.disableDevTools()
    this.disableRightClick()
    this.disableTextSelection()
    this.disableKeyboardShortcuts()
    this.obfuscateConsole()
    this.detectDevTools()
    this.preventSourceViewing()

    this.isInitialized = true
  }

  // Désactiver les outils de développement
  private static disableDevTools() {
    // Détecter l'ouverture des DevTools
    const devtools = { open: false, orientation: null }

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
        if (!devtools.open) {
          devtools.open = true
          this.handleDevToolsDetection()
        }
      } else {
        devtools.open = false
      }
    }, 500)

    // Détecter via console.log timing
    const start = performance.now()
    console.log("%c", "")
    const end = performance.now()
    if (end - start > 100) {
      this.handleDevToolsDetection()
    }
  }

  // Désactiver le clic droit
  private static disableRightClick() {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault()
      return false
    })
  }

  // Désactiver la sélection de texte
  private static disableTextSelection() {
    document.addEventListener("selectstart", (e) => {
      e.preventDefault()
      return false
    })

    document.addEventListener("dragstart", (e) => {
      e.preventDefault()
      return false
    })

    // CSS pour désactiver la sélection
    const style = document.createElement("style")
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      input, textarea, [contenteditable] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `
    document.head.appendChild(style)
  }

  // Désactiver les raccourcis clavier
  private static disableKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "u") ||
        (e.ctrlKey && e.key === "s") || // Ctrl+S (save)
        (e.ctrlKey && e.key === "a") || // Ctrl+A (select all)
        (e.ctrlKey && e.key === "p") || // Ctrl+P (print)
        (e.ctrlKey && e.shiftKey && e.key === "K") // Ctrl+Shift+K
      ) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    })
  }

  // Obfusquer la console
  private static obfuscateConsole() {
    const originalConsole = { ...console }

    // Rediriger les méthodes de console
    Object.keys(console).forEach((key) => {
      if (typeof console[key as keyof Console] === "function") {
        ;(console as any)[key] = () => {
          // Ne rien faire ou afficher un message trompeur
        }
      }
    })

    // Message trompeur dans la console
    setTimeout(() => {
      originalConsole.log("%c🚫 ACCÈS INTERDIT", "color: red; font-size: 50px; font-weight: bold;")
      originalConsole.log(
        "%cCette application est protégée contre le reverse engineering.",
        "color: red; font-size: 16px;",
      )
      originalConsole.log(
        "%cToute tentative de copie ou d'extraction du code est illégale.",
        "color: red; font-size: 16px;",
      )
    }, 1000)
  }

  // Détecter l'ouverture des DevTools
  private static detectDevTools() {
    const element = new Image()
    let devtoolsOpen = false

    element.__defineGetter__("id", () => {
      devtoolsOpen = true
      ClientProtection.handleDevToolsDetection()
    })

    setInterval(() => {
      devtoolsOpen = false
      console.log(element)
      console.clear()
      if (devtoolsOpen) {
        ClientProtection.handleDevToolsDetection()
      }
    }, 1000)
  }

  // Empêcher la visualisation du source
  private static preventSourceViewing() {
    // Désactiver le glisser-déposer d'images
    document.addEventListener("dragover", (e) => e.preventDefault())
    document.addEventListener("drop", (e) => e.preventDefault())

    // Empêcher l'impression
    window.addEventListener("beforeprint", (e) => {
      e.preventDefault()
      alert("L'impression est désactivée pour protéger le contenu.")
    })

    // Détecter les tentatives de copie
    document.addEventListener("copy", (e) => {
      e.clipboardData?.setData("text/plain", "Copie non autorisée")
      e.preventDefault()
    })
  }

  // Gérer la détection des DevTools
  private static handleDevToolsDetection() {
    // Rediriger ou masquer le contenu
    document.body.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
        z-index: 999999;
      ">
        <div style="text-align: center;">
          <h1>🚫 Accès Interdit</h1>
          <p>Les outils de développement ne sont pas autorisés.</p>
          <p>Veuillez fermer les DevTools pour continuer.</p>
        </div>
      </div>
    `

    // Optionnel : rediriger vers une autre page
    // window.location.href = "/access-denied"
  }

  // Chiffrer les données sensibles côté client
  static encryptSensitiveData(data: string): string {
    // Simple obfuscation (en production, utiliser une vraie encryption)
    return btoa(encodeURIComponent(data))
  }

  static decryptSensitiveData(encryptedData: string): string {
    try {
      return decodeURIComponent(atob(encryptedData))
    } catch {
      return ""
    }
  }
}

// Auto-initialisation
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    ClientProtection.initialize()
  })
}
