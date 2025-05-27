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
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='border-b bg-white'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-8'>
              <Link href='/' className='flex items-center space-x-2'>
                <Building2 className='h-8 w-8 text-blue-600' />
                <span className='text-2xl font-bold text-blue-600'>
                  LoopNet
                </span>
              </Link>
              <nav className='hidden md:flex space-x-6'>
                <Link
                  href='/properties'
                  className='text-gray-700 hover:text-blue-600'
                >
                  Properties
                </Link>
                <Link
                  href='/ai-assistant'
                  className='text-blue-600 font-medium'
                >
                  AI Assistant
                </Link>
                <Link
                  href='/dashboard'
                  className='text-gray-700 hover:text-blue-600'
                >
                  Dashboard
                </Link>
              </nav>
            </div>
            <div className='flex items-center space-x-4'>
              <Badge className='bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
                <Sparkles className='h-3 w-3 mr-1' />
                AI Powered
              </Badge>
              <Button variant='ghost'>Profile</Button>
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-6'>
        <div className='max-w-6xl mx-auto'>
          <Tabs defaultValue='chat' className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-3xl font-bold flex items-center gap-3'>
                  <Bot className='h-8 w-8 text-blue-600' />
                  AI Real Estate Assistant
                </h1>
                <p className='text-gray-600'>
                  Powered by advanced language models and real estate expertise
                </p>
              </div>
              <TabsList>
                <TabsTrigger value='chat'>Chat Assistant</TabsTrigger>
                <TabsTrigger value='features'>AI Features</TabsTrigger>
                <TabsTrigger value='tools'>AI Tools</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value='chat' className='space-y-6'>
              <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
                {/* Chat Interface */}
                <div className='lg:col-span-3'>
                  <Card className='h-[600px] flex flex-col'>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Bot className='h-5 w-5 text-blue-600' />
                        AI Chat Assistant
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='flex-1 flex flex-col p-0'>
                      {/* Messages */}
                      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                        {messages.map(message => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${
                              message.type === 'user'
                                ? 'justify-end'
                                : 'justify-start'
                            }`}
                          >
                            {message.type === 'ai' && (
                              <Avatar className='w-8 h-8'>
                                <AvatarFallback className='bg-blue-100 text-blue-600'>
                                  <Bot className='h-4 w-4' />
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.type === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className='text-sm'>{message.content}</p>
                              <p className='text-xs opacity-70 mt-1'>
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                              {message.suggestions && (
                                <div className='mt-3 space-y-2'>
                                  <p className='text-xs font-medium'>
                                    Suggested actions:
                                  </p>
                                  <div className='flex flex-wrap gap-2'>
                                    {message.suggestions.map(
                                      (suggestion, index) => (
                                        <Button
                                          key={index}
                                          size='sm'
                                          variant='outline'
                                          className='text-xs h-6'
                                          onClick={() =>
                                            handleSuggestionClick(suggestion)
                                          }
                                        >
                                          {suggestion}
                                        </Button>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            {message.type === 'user' && (
                              <Avatar className='w-8 h-8'>
                                <AvatarFallback className='bg-green-100 text-green-600'>
                                  <User className='h-4 w-4' />
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        ))}
                        {isLoading && (
                          <div className='flex gap-3 justify-start'>
                            <Avatar className='w-8 h-8'>
                              <AvatarFallback className='bg-blue-100 text-blue-600'>
                                <Bot className='h-4 w-4' />
                              </AvatarFallback>
                            </Avatar>
                            <div className='bg-gray-100 rounded-lg p-3'>
                              <div className='flex space-x-1'>
                                <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                                <div
                                  className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                                  style={{ animationDelay: '0.1s' }}
                                ></div>
                                <div
                                  className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                                  style={{ animationDelay: '0.2s' }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input */}
                      <div className='border-t p-4'>
                        <div className='flex gap-2'>
                          <Input
                            value={inputValue}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => setInputValue(e.target.value)}
                            placeholder='Ask me anything about real estate...'
                            onKeyDown={(
                              e: React.KeyboardEvent<HTMLInputElement>
                            ) => e.key === 'Enter' && handleSendMessage()}
                            disabled={isLoading}
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={isLoading || !inputValue.trim()}
                          >
                            <Send className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Features Sidebar */}
                <div className='space-y-4'>
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-lg'>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                      {aiFeatures.map((feature, index) => (
                        <div key={index} className='border rounded-lg p-3'>
                          <div className='flex items-center gap-2 mb-2'>
                            <feature.icon
                              className={`h-4 w-4 ${feature.color}`}
                            />
                            <h4 className='font-medium text-sm'>
                              {feature.title}
                            </h4>
                          </div>
                          <p className='text-xs text-gray-600 mb-2'>
                            {feature.description}
                          </p>
                          <Button
                            size='sm'
                            variant='outline'
                            className='w-full text-xs'
                            onClick={() =>
                              handleFeatureExample(feature.example)
                            }
                          >
                            Try Example
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className='text-lg'>AI Capabilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-2 text-sm'>
                        <div className='flex items-center gap-2'>
                          <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                          <span>Property Valuation</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                          <span>Market Analysis</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                          <span>Content Generation</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                          <span>Investment Analysis</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                          <span>Document Review</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value='features' className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {aiFeatures.map((feature, index) => (
                  <Card
                    key={index}
                    className='border-2 hover:border-blue-300 transition-colors'
                  >
                    <CardContent className='p-6'>
                      <div className='flex items-center gap-3 mb-4'>
                        <feature.icon className={`h-8 w-8 ${feature.color}`} />
                        <h3 className='text-xl font-semibold'>
                          {feature.title}
                        </h3>
                      </div>
                      <p className='text-gray-600 mb-4'>
                        {feature.description}
                      </p>
                      <div className='bg-gray-50 p-3 rounded-lg mb-4'>
                        <p className='text-sm font-medium text-gray-700 mb-1'>
                          Example:
                        </p>
                        <p className='text-sm text-gray-600 italic'>
                          "{feature.example}"
                        </p>
                      </div>
                      <Button
                        className='w-full'
                        onClick={() => handleFeatureExample(feature.example)}
                      >
                        Try This Feature
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value='tools' className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Property Description Generator</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-gray-600 mb-4'>
                      Generate professional property descriptions using AI
                    </p>
                    <Button className='w-full'>Launch Tool</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Market Analysis Tool</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-gray-600 mb-4'>
                      Get AI-powered market insights and trends
                    </p>
                    <Button className='w-full'>Launch Tool</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Valuation Calculator</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-gray-600 mb-4'>
                      AI-powered property valuation and analysis
                    </p>
                    <Button className='w-full'>Launch Tool</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
