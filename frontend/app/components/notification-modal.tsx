'use client'

import { useState, useEffect } from 'react'
import { CheckCheck } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Notification {
  id: string
  avatar?: string
  title: string
  description: string
  timestamp: string
  threshold: string
  read: boolean
  hasDetails?: boolean
  proposedBy?: {
    name: string
  }
}

export default function NotificationModal() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Initialize notifications from localStorage or use default data
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications')
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    } else {
      setNotifications([
        {
          id: '1',
          avatar: '/placeholder.svg?height=40&width=40',
          title: 'Glenn Quagmire',
          description:
            'Approved your 30 STRK withdrawer funds from Backstage Boys',
          timestamp: '11 hours ago',
          threshold: 'Threshold 3/5',
          read: false,
          proposedBy: {
            name: 'Peter Griffin',
          },
        },
        {
          id: '2',
          title: 'Your withdraw transaction has been approved and executed',
          description:
            'Your 100 STRK withdraw transaction has been approved and executed by the Backstage Boys members',
          timestamp: '11 hours ago',
          threshold: 'Threshold 5/5',
          read: false,
        },
        {
          id: '3',
          avatar: '/placeholder.svg?height=40&width=40',
          title: 'Lois Griffin',
          description: 'proposed for 25 STRK from Backstage Boys',
          timestamp: '11 hours ago',
          threshold: 'Threshold 1/5',
          read: true,
          hasDetails: true,
        },
      ])
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications))
    }
  }, [notifications])

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }))
    setNotifications(updatedNotifications)
  }

  // Count unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length

  return (
    <Card className="w-full max-w-md bg-zinc-900 text-white border-none shadow-xl">
      <div className="flex justify-between items-center p-4 border-b border-zinc-800">
        <h2 className="text-xl font-bold">Notifications</h2>
        <Button
          variant="ghost"
          className="text-zinc-400 hover:text-white flex items-center gap-2"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck className="h-4 w-4" />
          <span>Mark all as read</span>
        </Button>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex gap-3">
              {!notification.read && (
                <div className="mt-2 h-2 w-2 rounded-full bg-purple-500 flex-shrink-0" />
              )}
              {notification.avatar && (
                <Avatar className="h-8 w-8 rounded-full">
                  <img
                    src={notification.avatar || '/placeholder.svg'}
                    alt={notification.title}
                  />
                </Avatar>
              )}
              <div className="flex-1">
                <div className="flex flex-col">
                  <div className="text-sm">
                    <span className="font-medium">{notification.title}</span>{' '}
                    <span className="text-zinc-400">
                      {notification.description}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-zinc-500 mt-1">
                    <span>{notification.timestamp}</span>
                    <span className="mx-1">•</span>
                    <span>{notification.threshold}</span>
                  </div>
                  {notification.proposedBy && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 12.75C8.83 12.75 6.25 10.17 6.25 7C6.25 3.83 8.83 1.25 12 1.25C15.17 1.25 17.75 3.83 17.75 7C17.75 10.17 15.17 12.75 12 12.75ZM12 2.75C9.66 2.75 7.75 4.66 7.75 7C7.75 9.34 9.66 11.25 12 11.25C14.34 11.25 16.25 9.34 16.25 7C16.25 4.66 14.34 2.75 12 2.75Z"
                            fill="currentColor"
                          />
                          <path
                            d="M20.5901 22.75C20.1801 22.75 19.8401 22.41 19.8401 22C19.8401 18.55 16.3601 15.75 12.0001 15.75C7.64012 15.75 4.16012 18.55 4.16012 22C4.16012 22.41 3.82012 22.75 3.41012 22.75C3.00012 22.75 2.66012 22.41 2.66012 22C2.66012 17.73 6.85012 14.25 12.0001 14.25C17.1501 14.25 21.3401 17.73 21.3401 22C21.3401 22.41 21.0001 22.75 20.5901 22.75Z"
                            fill="currentColor"
                          />
                        </svg>
                        Proposed by
                      </span>
                      <span className="font-medium">
                        {notification.proposedBy.name}
                      </span>
                    </div>
                  )}
                  {notification.hasDetails && (
                    <button className="text-xs text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded mt-2 w-fit transition-colors">
                      View Transaction Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
