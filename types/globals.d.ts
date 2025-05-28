// Global type fixes for React components
import React from 'react'

declare global {
  namespace React {
    interface ReactNode {
      children?: React.ReactNode
    }
    
    interface ReactPortal {
      children?: React.ReactNode
    }
  }
}

export {}
