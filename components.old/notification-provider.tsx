'use client'

// @ts-ignore - Force l'utilisation des types React
import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface NotificationContextType {
  notifications: any[]
  unreadCount: number
  markAsRead: (id: string) => void
  addNotification: (notification: any) => void
}

// Créer le contexte avec une assertion de type
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
) as any

export function NotificationProvider ({
  children
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      // Mock new notification every 30 seconds
      const newNotification = {
        id: Date.now().toString(),
        type: 'view',
        title: 'Property Viewed',
        message: 'Your property has been viewed',
        timestamp: new Date().toISOString(),
        read: false
      }

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)])
      setUnreadCount(prev => prev + 1)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const addNotification = (notification: any) => {
    setNotifications(prev => [notification, ...prev])
    if (!notification.read) {
      setUnreadCount(prev => prev + 1)
    }
  }

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    addNotification
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications () {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    )
  }
  return context as NotificationContextType
}

export function NotificationBell () {
  const { unreadCount } = useNotifications()

  return (
    <Button variant='ghost' size='sm' className='relative'>
      <Bell className='h-5 w-5' />
      {unreadCount > 0 && (
        <Badge className='absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center p-0'>
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </Button>
  )
}
