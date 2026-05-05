import { useNavigate } from 'react-router-dom'
import {
  Moon, Bell, Eye, Shield, HelpCircle,
  ChevronRight, LogOut, Heart,
  Smartphone, Globe, Lock
} from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { authService } from '../services/auth.service'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { useState } from 'react'

function Toggle({ value, onChange }) {
  return (
    <div
      onClick={e => { e.stopPropagation(); onChange(!value) }}
      className={clsx(
        'w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 cursor-pointer relative',
        value ? 'bg-rose-500' : 'bg-gray-200'
      )}
    >
      <div className={clsx(
        'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm',
        'transition-all duration-300',
        value ? 'left-[22px]' : 'left-0.5'
      )} />
    </div>
  )
}

function SettingRow({ icon: Icon, label, sublabel, onClick, right, danger = false }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'flex items-center gap-3 w-full p-4 text-left cursor-pointer',
        'hover:bg-gray-50 active:bg-gray-100 transition-colors',
        danger && 'hover:bg-red-50 active:bg-red-100'
      )}
    >
      <div className={clsx(
        'w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0',
        danger ? 'bg-red-100' : 'bg-rose-50'
      )}>
        <Icon size={18} className={danger ? 'text-red-500' : 'text-rose-500'} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={clsx(
          'text-sm font-semibold',
          danger ? 'text-red-500' : 'text-gray-900'
        )}>
          {label}
        </p>
        {sublabel && (
          <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>
        )}
      </div>
      {right ?? <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />}
    </div>
  )
}

function SettingSection({ title, children }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 mb-1">
        {title}
      </p>
      <div className="bg-white rounded-3xl shadow-card overflow-hidden divide-y divide-gray-50">
        {children}
      </div>
    </div>
  )
}

export default function Settings() {
  const { profile } = useAuth()
  const { dark, setDark } = useTheme()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(true)
  const [showOnline, setShowOnline]       = useState(true)
  const [swipeMode, setSwipeMode]         = useState(
    profile?.swipe_mode !== 'button'
  )

  async function handleLogout() {
    try {
      await authService.signOut()
      toast.success('Logged out. Come back soon.')
    } catch {
      toast.error('Logout failed.')
    }
  }

  async function handleSwipeModeToggle(val) {
    setSwipeMode(val)
    try {
      await supabase
        .from('profiles')
        .update({ swipe_mode: val ? 'swipe' : 'button' })
        .eq('id', profile?.id)
      toast.success(val ? 'Swipe mode on.' : 'Button mode on.')
    } catch {
      toast.error('Could not update setting.')
    }
  }

  return (
    <PageWrapper title="Settings" showBack>
      <div className="px-4 pt-4">

        {/* Profile preview */}
        <div className="bg-white rounded-3xl shadow-card p-4 mb-6
                        flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl gradient-rose flex items-center
                          justify-center text-white font-bold text-lg flex-shrink-0">
            {profile?.username?.slice(0, 2).toUpperCase() ?? 'ME'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900">{profile?.username}</p>
            <p className="text-xs text-gray-400 truncate">{profile?.email}</p>
          </div>
          <button
            onClick={() => navigate('/profile/edit')}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600
                       transition-colors px-3 py-1.5 bg-rose-50 rounded-xl"
          >
            Edit
          </button>
        </div>

        {/* Preferences */}
        <SettingSection title="Preferences">
          <SettingRow
            icon={Heart}
            label="Swipe mode"
            sublabel={swipeMode ? 'Drag cards to like or pass' : 'Use buttons instead'}
            right={<Toggle value={swipeMode} onChange={handleSwipeModeToggle} />}
          />
          <SettingRow
            icon={Bell}
            label="Notifications"
            sublabel="Match alerts and new messages"
            right={<Toggle value={notifications} onChange={setNotifications} />}
          />
          <SettingRow
            icon={Eye}
            label="Show online status"
            sublabel="Let matches see when you're active"
            right={<Toggle value={showOnline} onChange={setShowOnline} />}
          />
          <SettingRow
            icon={Moon}
            label="Dark mode"
            sublabel={dark ? 'Looking mysterious' : 'Easy on the eyes'}
            right={<Toggle value={dark} onChange={setDark} />}
          />
        </SettingSection>

        {/* Privacy */}
        <SettingSection title="Privacy">
          <SettingRow
            icon={Lock}
            label="Block list"
            sublabel="People you've blocked"
            onClick={() => toast('Coming soon.')}
          />
          <SettingRow
            icon={Shield}
            label="Safety center"
            sublabel="Tips and resources"
            onClick={() => toast('Coming soon.')}
          />
          <SettingRow
            icon={Globe}
            label="Data and privacy"
            sublabel="How we use your data"
            onClick={() => toast('Coming soon.')}
          />
        </SettingSection>

        {/* Support */}
        <SettingSection title="Support">
          <SettingRow
            icon={HelpCircle}
            label="Help center"
            sublabel="FAQs and contact"
            onClick={() => toast('Coming soon.')}
          />
          <SettingRow
            icon={Smartphone}
            label="App version"
            sublabel="Rom v1.0.0 -- Portfolio build"
            onClick={() => {}}
            right={<span className="text-xs text-gray-300">v1.0.0</span>}
          />
        </SettingSection>

        {/* Account */}
        <SettingSection title="Account">
          <SettingRow
            icon={LogOut}
            label="Log out"
            onClick={handleLogout}
            danger
          />
        </SettingSection>

        <p className="text-center text-xs text-gray-300 py-6 font-medium">
          Made with 🔥 by rom
        </p>

      </div>
    </PageWrapper>
  )
}