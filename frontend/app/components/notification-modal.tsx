'use client'
import { useState, useEffect } from 'react'
import { CheckCheck, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { StaticImageData } from 'next/image'
import GlennAvatar from '@/public/Images/reviewers1.png'
import LoisAvatar from '@/public/Images/reviewers2.png'

// Defines the structure for a single notification item.
interface Notification {
  id: string // Unique identifier for the notification.
  avatar?: StaticImageData // Optional URL for the user's avatar image.
  title: string // Main title of the notification.
  description: string // Detailed description of the event.
  timestamp: string // Time when the notification was generated (e.g., "11 hours ago").
  threshold: string // The required threshold for the transaction (e.g., "Threshold 3/5").
  read: boolean // Indicates if the notification has been read.
  hasDetails?: boolean // Optional flag to show a "View Details" button.
  proposedBy?: {
    // Optional details about who proposed the transaction.
    name: string
  }
}

// Default notifications data to be used if none are found in localStorage.
const defaultNotifications: Notification[] = [
  {
    id: '1',
    avatar: GlennAvatar,
    title: 'Glenn Quagmire',
    description: 'Approved your 30 STRK withdrawer funds from Backstage Boys',
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
    avatar: LoisAvatar,
    title: 'Lois Griffin',
    description: 'proposed for 25 STRK from Backstage Boys',
    timestamp: '11 hours ago',
    threshold: 'Threshold 1/5',
    read: true,
    hasDetails: true,
  },
]

/**
 * Renders a modal displaying a list of notifications.
 * It loads notifications from localStorage or uses a default set.
 * Users can mark all notifications as read.
 */
export default function NotificationModal({ onClose }: { onClose?: () => void }) {
  // Initialize with default data to prevent hydration mismatch.
  const [notifications, setNotifications] =
    useState<Notification[]>(defaultNotifications)

  // After mount on the client, synchronize the read state from localStorage.
  useEffect(() => {
    const saved = localStorage.getItem('spherre-notifications')
    if (saved) {
      try {
        const readStatuses = JSON.parse(saved) as {
          id: string
          read: boolean
        }[]
        const readStatusMap = new Map(readStatuses.map((n) => [n.id, n.read]))

        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            read: readStatusMap.get(n.id) ?? n.read,
          })),
        )
      } catch {
        // If localStorage is corrupt, we'll just use the defaults.
        console.error('Could not parse notifications from localStorage.')
      }
    }
  }, []) // Empty dependency array ensures this runs only once on the client.

  // Persist the 'read' state to localStorage whenever notifications change.
  useEffect(() => {
    const toSave = notifications.map(({ id, read }) => ({ id, read }))
    localStorage.setItem('spherre-notifications', JSON.stringify(toSave))
  }, [notifications])

  /**
   * Marks all notifications as read by updating their `read` status.
   */
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }))
    setNotifications(updatedNotifications)
  }

  // Calculate the number of unread notifications.
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length

  // Portal/modal overlay for full-screen center
  return (
    <div className="absolute z-50 left-[30%] sm:left-[42%] sm:right-0 top-3 mt-2 w-[95vw] max-w-[350px] sm:max-w-[530px] pointer-events-auto">
      {/*
        NOTE: The parent of this modal (the notification icon/button container) MUST have className="relative" for correct dropdown positioning.
        This modal will appear directly below the icon/button.
      */}
      <Card className="w-full px-2 py-3 bg-[#1C1D1F] text-white shadow-xl rounded-xl overflow-hidden border-0">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-3 sm:p-4 relative">
          <h2 className="text-lg sm:text-xl font-bold">Notifications</h2>
          <div className='flex items-center gap-3'>
            <Button
              className="bg-[#272729] text-zinc-400 hover:text-white flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-4 w-4" />
              <span className="hidden md:inline-block">Mark all as read</span>
            </Button>
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close notifications"
              className="text-gray-400 hover:text-white bg-transparent rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-[#6F2FCE]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[60vh] overflow-y-auto notification-scrollbar px-1 sm:px-2 flex flex-col gap-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-3 sm:p-4 bg-[#232325] rounded-lg hover:bg-zinc-800/50 transition-colors flex items-start gap-3"
            >
              <div className="flex gap-2 sm:gap-3">
                {/* Unread indicator */}
                {!notification.read && (
                  <div className="mt-2 h-2 w-2 rounded-full bg-purple-500 flex-shrink-0" />
                )}
                {notification.avatar && (
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage
                      src={notification.avatar.src}
                      alt={notification.title}
                    />
                    <AvatarFallback>
                      {notification.title.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col">
                    {/* Notification Content */}
                    <div className="text-sm">
                      <span className="font-medium">{notification.title}</span>{' '}
                      <span className="text-zinc-400">
                        {notification.description}
                      </span>
                    </div>

                    {/* Notification Metadata */}
                    <div className="flex items-center text-xs text-zinc-500 mt-1">
                      <span>{notification.timestamp}</span>
                      <span className="mx-1">•</span>
                      <span>{notification.threshold}</span>
                    </div>

                    {/* Proposed By Information */}
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
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
