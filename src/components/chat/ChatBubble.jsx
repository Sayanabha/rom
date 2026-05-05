import clsx from 'clsx'
import Avatar from '../ui/Avatar'

function timeStr(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ChatBubble({ message, isMe, showAvatar }) {
  return (
    <div className={clsx(
      'flex items-end gap-2 mb-2',
      isMe ? 'flex-row-reverse' : 'flex-row'
    )}>
      {/* Avatar */}
      <div className="w-7 flex-shrink-0">
        {showAvatar && !isMe && (
          <Avatar
            src={message.profiles?.avatar_url}
            name={message.profiles?.username}
            size="xs"
          />
        )}
      </div>

      {/* Bubble */}
      <div className={clsx(
        'max-w-[72%] flex flex-col',
        isMe ? 'items-end' : 'items-start'
      )}>
        <div className={clsx(
          'px-4 py-2.5 rounded-3xl text-sm leading-relaxed',
          isMe
            ? 'gradient-rose text-white rounded-br-lg'
            : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-lg'
        )}>
          {message.content}
        </div>
        <span className="text-[10px] text-gray-300 mt-1 px-1">
          {timeStr(message.created_at)}
          {isMe && (
            <span className="ml-1">
              {message.seen ? '  Read' : '  Sent'}
            </span>
          )}
        </span>
      </div>
    </div>
  )
}