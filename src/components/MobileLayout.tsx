import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  ChatBubbleLeftRightIcon as ChatIconSolid,
  ExclamationTriangleIcon as EmergencyIconSolid,
  ChartBarIcon as ProgressIconSolid,
  UserIcon as ProfileIconSolid
} from '@heroicons/react/24/solid'

interface MobileLayoutProps {
  children: React.ReactNode
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onlineState !== false)
  const location = useLocation()

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: HomeIcon, 
      iconSolid: HomeIconSolid,
      description: 'Your support hub'
    },
    { 
      name: 'Communication', 
      href: '/communication', 
      icon: ChatBubbleLeftRightIcon, 
      iconSolid: ChatIconSolid,
      description: 'What to say & how'
    },
    { 
      name: 'Emergency', 
      href: '/emergency', 
      icon: ExclamationTriangleIcon, 
      iconSolid: EmergencyIconSolid,
      description: 'Crisis support',
      urgent: true
    },
    { 
      name: 'Progress', 
      href: '/progress', 
      icon: ChartBarIcon, 
      iconSolid: ProgressIconSolid,
      description: 'Your journey'
    },
    { 
      name: 'Profile', 
      href: '/profile', 
      icon: UserIcon, 
      iconSolid: ProfileIconSolid,
      description: 'Settings & account'
    }
  ]

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const currentPath = location.pathname

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-white px-4 py-3 shadow-sm border-b">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <HeartIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">SupportPartner</h1>
                {!isOnline && (
                  <p className="text-xs text-orange-600">Offline mode</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Connection status indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-orange-500'
            }`} />
            <span className="text-xs text-gray-600">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 flex">
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6 text-white" />
                </button>
              </div>
              
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4 mb-8">
                  <HeartIcon className="h-10 w-10 text-blue-600" />
                  <div className="ml-3">
                    <h2 className="text-xl font-bold text-gray-900">SupportPartner</h2>
                    <p className="text-sm text-gray-600">Your support journey</p>
                  </div>
                </div>
                
                <nav className="px-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = currentPath === item.href
                    const Icon = isActive ? item.iconSolid : item.icon
                    
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-2 py-3 text-base font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                            : 'text-gray-700 hover:bg-gray-100'
                        } ${item.urgent ? 'ring-2 ring-red-200' : ''}`}
                      >
                        <Icon 
                          className={`mr-4 flex-shrink-0 h-6 w-6 ${
                            isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                          } ${item.urgent ? 'text-red-500' : ''}`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={item.urgent ? 'text-red-700 font-semibold' : ''}>{item.name}</span>
                            {item.urgent && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                24/7
                              </span>
                            )}
                          </div>
                          <p className={`text-xs ${
                            isActive ? 'text-blue-600' : 'text-gray-500'
                          } ${item.urgent ? 'text-red-600' : ''}`}>
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </nav>
              </div>
              
              {/* Bottom section */}
              <div className="flex-shrink-0 border-t border-gray-200 p-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    🤝 Built with Human-Claude collaboration
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Transforming relationships worldwide
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <HeartIcon className="h-10 w-10 text-blue-600" />
              <div className="ml-3">
                <h2 className="text-xl font-bold text-gray-900">SupportPartner</h2>
                <p className="text-sm text-gray-600">Your support journey</p>
              </div>
            </div>
            
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = currentPath === item.href
                const Icon = isActive ? item.iconSolid : item.icon
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${item.urgent ? 'ring-2 ring-red-200' : ''}`}
                  >
                    <Icon 
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      } ${item.urgent ? 'text-red-500' : ''}`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={item.urgent ? 'text-red-700 font-semibold' : ''}>{item.name}</span>
                        {item.urgent && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            24/7
                          </span>
                        )}
                      </div>
                      <p className={`text-xs ${
                        isActive ? 'text-blue-600' : 'text-gray-500'
                      } ${item.urgent ? 'text-red-600' : ''}`}>
                        {item.description}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </nav>
          </div>
          
          {/* Connection status */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className={`flex items-center space-x-3 p-3 rounded-lg ${
              isOnline ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                isOnline ? 'bg-green-500' : 'bg-orange-500'
              }`} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  isOnline ? 'text-green-900' : 'text-orange-900'
                }`}>
                  {isOnline ? 'Connected' : 'Offline Mode'}
                </p>
                <p className={`text-xs ${
                  isOnline ? 'text-green-700' : 'text-orange-700'
                }`}>
                  {isOnline ? 'Real-time updates active' : 'Limited functionality'}
                </p>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">
                🤝 Built with Human-Claude collaboration
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="flex-1">
          {/* Mobile content padding */}
          <div className="lg:hidden h-16" />
          
          {/* Page content */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Offline notification banner */}
            {!isOnline && (
              <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-orange-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-orange-800">
                      You're offline
                    </h3>
                    <p className="text-sm text-orange-700 mt-1">
                      Some features may be limited. Data will sync when you reconnect.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex">
          {navigation.slice(0, 5).map((item) => {
            const isActive = currentPath === item.href
            const Icon = isActive ? item.iconSolid : item.icon
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                } ${item.urgent ? 'bg-red-50' : ''}`}
              >
                <Icon className={`h-6 w-6 ${item.urgent ? 'text-red-500' : ''}`} />
                <span className={`text-xs mt-1 ${
                  item.urgent ? 'text-red-700 font-medium' : ''
                }`}>
                  {item.name}
                </span>
                {item.urgent && (
                  <span className="absolute -top-1 right-1/2 transform translate-x-1/2">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      !
                    </span>
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Bottom spacing for mobile nav */}
      <div className="lg:hidden h-16" />
    </div>
  )
}