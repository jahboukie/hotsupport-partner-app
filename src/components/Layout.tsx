import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  HomeIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  HeartIcon,
  UserIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Quick Help', href: '/quick-help', icon: ExclamationTriangleIcon },
    { name: 'Understanding Her', href: '/understanding', icon: HeartIcon },
    { name: 'Communication', href: '/communication', icon: ChatBubbleLeftRightIcon },
    { name: 'Education', href: '/education', icon: AcademicCapIcon },
    { name: 'Daily Tips', href: '/tips', icon: LightBulbIcon },
    { name: 'Support Groups', href: '/support', icon: HandRaisedIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center px-6 border-b border-gray-200">
          <div className="flex items-center">
            <HandRaisedIcon className="h-8 w-8 text-partner-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">SupportivePartner</span>
          </div>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-partner-100 text-partner-700 border-r-2 border-partner-500'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Emergency Support */}
        <div className="absolute bottom-20 left-4 right-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <p className="text-xs font-medium text-red-800">Emergency Help</p>
                <p className="text-xs text-red-600">She's crying and I don't know why</p>
              </div>
            </div>
            <button className="w-full mt-2 bg-red-600 text-white text-xs py-1 rounded">
              Get Immediate Guidance
            </button>
          </div>
        </div>

        {/* Ecosystem Status */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-partner-50 to-empathy-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">🌐 Ecosystem</p>
                <p className="text-xs text-gray-500">Monitoring Sarah</p>
              </div>
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-8 px-8">
          {children}
        </main>
      </div>
    </div>
  )
}