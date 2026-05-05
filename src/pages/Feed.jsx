import { useNavigate } from 'react-router-dom'
import { Gamepad2 } from 'lucide-react'
import { motion } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'
import StoryReel from '../components/feed/StoryReel'
import PostComposer from '../components/feed/PostComposer'
import PostCard from '../components/feed/PostCard'
import Loader from '../components/ui/Loader'
import { useFeed } from '../hooks/useFeed'

export default function Feed() {
  const navigate = useNavigate()
  const {
    posts,
    stories,
    loading,
    posting,
    createPost,
    createStory,
    toggleReaction,
    deletePost,
    refresh,
  } = useFeed()

  const topBarRight = (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={() => navigate('/games')}
      className="p-2 -mr-2 rounded-xl hover:bg-gray-100 text-gray-500
                 transition-colors relative"
    >
      <Gamepad2 size={22} />
      <span className="absolute top-1.5 right-1.5 w-2 h-2
                       bg-rose-500 rounded-full border-2 border-white" />
    </motion.button>
  )

  return (
    <PageWrapper
      showLogo
      showSettings
      topBarRight={topBarRight}
      onRefresh={refresh}
    >
      <div className="border-b border-gray-100 mb-4">
        <StoryReel stories={stories} onAddStory={createStory} />
      </div>

      <PostComposer onPost={createPost} posting={posting} />

      {loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center
                        py-16 px-8 text-center">
          <span className="text-5xl mb-4">👀</span>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Nothing here yet
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Be the first to post something. Don't leave us hanging.
          </p>
        </div>
      ) : (
        <div className="pb-4">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onReact={toggleReaction}
              onDelete={deletePost}
            />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}