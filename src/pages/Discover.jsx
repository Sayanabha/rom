import PageWrapper from '../components/layout/PageWrapper'
import SwipeStack from '../components/match/SwipeStack'
import MatchModal from '../components/match/MatchModal'
import Loader from '../components/ui/Loader'
import { useDiscover } from '../hooks/useMatches'
import { RefreshCw } from 'lucide-react'

export default function Discover() {
  const { profiles, loading, match, swipe, clearMatch, reload } = useDiscover()

  const topBarRight = (
    <button
      onClick={reload}
      className="p-2 -mr-2 rounded-xl hover:bg-gray-100 text-gray-500
                 transition-colors active:scale-95"
    >
      <RefreshCw size={18} />
    </button>
  )

  return (
    <PageWrapper title="Discover" topBarRight={topBarRight}>
      <div className="px-4 h-[calc(100vh-10rem)]">
        {loading ? (
          <Loader />
        ) : (
          <SwipeStack profiles={profiles} onSwipe={swipe} />
        )}
      </div>

      <MatchModal matchedProfile={match} onClose={clearMatch} />
    </PageWrapper>
  )
}