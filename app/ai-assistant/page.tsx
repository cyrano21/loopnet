'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Bot,
  User,
  Sparkles,
  TrendingUp,
  Calculator,
  FileText,
  Building2
} from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RoleGuard } from '@/components/role-guard'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  suggestions?: string[]
}

export default function AIAssistantPage () {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content:
        "Hello! I'm your AI Real Estate Assistant powered by advanced language models. I can help you with property valuations, market analysis, generating property descriptions, and much more. How can I assist you today?",
      timestamp: new Date(),
      suggestions: [
        'Generate a property description',
        'Analyze market trends',
        'Calculate property valuation',
        'Create marketing content'
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const aiFeatures = [
    {
      title: 'Property Descriptions',
      description:
        'Generate compelling, professional property descriptions automatically',
      icon: FileText,
      color: 'text-blue-600',
      example:
        'Create a description for a 15,000 sq ft office building in downtown SF'
    },
    {
      title: 'Market Analysis',
      description:
        'Get AI-powered insights on market trends and property values',
      icon: TrendingUp,
      color: 'text-green-600',
      example: 'Analyze the office market trends in San Francisco for Q4 2024'
    },
    {
      title: 'Property Valuation',
      description: 'Estimate property values using advanced AI algorithms',
      icon: Calculator,
      color: 'text-purple-600',
      example: 'Value a 50,000 sq ft warehouse in Phoenix, AZ'
    },
    {
      title: 'Investment Analysis',
      description: 'Analyze investment potential and ROI calculations',
      icon: Building2,
      color: 'text-orange-600',
      example: 'Calculate ROI for a $2.5M office building with 6.5% cap rate'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Call AI API (Hugging Face or OpenAI)
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: inputValue,
          context: 'real_estate',
          history: messages.slice(-5) // Send last 5 messages for context
        })
      })

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('AI chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content:
          "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const handleFeatureExample = (example: string) => {
    setInputValue(example)
  }

  return (
    <RoleGuard requiredRole='premium' redirectTo='/pricing'>
      <div className='min-h-screen bg-background'>
        {/* ...existing code... */}
      </div>
    </RoleGuard>
  )
}
