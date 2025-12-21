import { useState } from 'react';
import { Search, MessageSquare, Settings, Send, Paperclip, Smile, MoreVertical } from 'lucide-react';

const ChatScreen =() => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageInput, setMessageInput] = useState(''); 

    const conversations = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      lastMessage: 'That sounds great! Let me know when you...',
      time: '7:45 PM',
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Alex Chen',
      avatar: 'https://i.pravatar.cc/150?img=2',
      lastMessage: 'The meeting is scheduled for 3 PM tomorrow',
      time: '7:17 PM',
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: 'Design Team',
      avatar: 'https://i.pravatar.cc/150?img=3',
      lastMessage: 'Emma: Updated the mockups, check them...',
      time: '6:47 PM',
      unread: 5,
      online: false
    },
    {
      id: 4,
      name: 'Michael Brown',
      avatar: 'https://i.pravatar.cc/150?img=4',
      lastMessage: 'Thanks for your help!',
      time: '4:47 PM',
      unread: 0,
      online: false
    },
    {
      id: 5,
      name: 'Emily Davis',
      avatar: 'https://i.pravatar.cc/150?img=5',
      lastMessage: 'typing...',
      time: 'Yesterday',
      unread: 0,
      online: true,
      typing: true
    },
    {
      id: 6,
      name: 'David Wilson',
      avatar: 'https://i.pravatar.cc/150?img=6',
      lastMessage: 'The report is ready for review',
      time: 'Fri',
      unread: 3,
      online: false
    }
  ];

    const messages = selectedChat ? [
    {
      id: 1,
      text: 'Hey! How are you doing?',
      time: '6:47 PM',
      sender: 'other'
    },
    {
      id: 2,
      text: "I'm great, thanks! Just finished that project we talked about",
      time: '6:52 PM',
      sender: 'me'
    },
    {
      id: 3,
      text: "Oh wow, that's amazing! How did it turn out?",
      time: '6:57 PM',
      sender: 'other'
    },
    {
      id: 4,
      text: 'Really well! The client loved it. We should celebrate 🎉',
      time: '7:37 PM',
      sender: 'me'
    },
    {
      id: 5,
      text: "That sounds great! Let me know when you're free 😊",
      time: '7:45 PM',
      sender: 'other'
    }
  ] : [];


  const handleSendMessage = () => {
    if(messageInput.trim() === '') return;
    console.log("Sending message:", messageInput);
    setMessageInput('');
  }

  return (
    <div className="flex h-screen bg-gray-50">
        <div className='w-80 bg-white border-r border-gray-200 flex flex-col'>
            {/* Header */}
            <div className='p-4 border-b border-gray-200'>
                <div className="flex items-center justify-between mb-4" >
                    <h1 className='text-xl font-semibold text-gray-800'>Messages</h1>
                    <div className='flex items-center gap-2'>
                        <button className='p-2 hover:bg-gray-100 rounded-lg transition'>
                            <MessageSquare className='w-5 h-5 text-gray-600' />
                        </button>
                        <button className='p-2 hover:bg-gray-100 rounded-lg transition'>
                            <Settings className='w-5 h-5 text-gray-600' />
                        </button>
                    </div>
                </div >

                {/* Search Bar */}
                <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2  w-4 h-4 text-gray-400' />
                    <input 
                      type="text"
                      placeholder='Search conversations'
                      className='w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500'
                    />
                </div>
            </div>

            {/* conversations lists */}
            <div className='flex-1 overflow-y-auto'>
                {conversations.map((conversation) => (
                    <div 
                        key={conversation.id}
                        onClick={() => setSelectedChat(conversation)}
                        className={`flex items-center p-4 gap-3 hover:bg-gray-50 cursor-pointer transition ${
                            selectedChat?.id === conversation.id ? 'bg-emerald-50' : ''
                        }`}
                    >
                       {/* Avatar */}
                       <div className='relative flex-shrink-0'>
                        <img 
                            src={conversation.avatar}
                            alt={conversation.name}
                            className='w-12 h-12 rounded-full object-cover'
                        />
                        {conversation.online && (
                            <span className='absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white'></span>
                        )}
                       </div>

                       {/* content */}
                       <div className='flex-1 min-w-0'> 
                          <div className='flex items-center justify-between mb-1'>
                            <h3 className='font-semibold text-gray-800 truncate'>
                                {conversation.name}
                            </h3>
                            <span className='text-xs text-gray-500'>{conversation.time}</span>
                          </div>
                          <p className={`text-sm truncate ${
                            conversation.typing ? 'text-emerald-600 italic' : 'text-gray-600'
                          }`}>
                            {conversation.lastMessage}
                          </p>
                       </div>

                       {conversation.unread > 0 && (
                        <div className='flex-shrink-0 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center'>
                            <span className='text-xs text-white font-semibold'>
                                {conversation.unread}
                            </span>
                        </div>
                       )}
                    </div>
                ))}
            </div>
        </div>

        <div className='flex-1 flex flex-col bg-gray-50'>
            {selectedChat ? (
                <>
                  {/* chat Header */}
                  <div className='bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='relative'>
                            <img 
                                src={selectedChat.avatar}
                                alt={selectedChat.name}
                                className='w-10 h-10 rounded-full object-cover'
                            />
                            {selectedChat.online && (
                                <span className='absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white'></span>
                            )}
                        </div>
                        <div>
                            <h2 className='font-semibold text-gray-800'>{selectedChat.name}</h2>
                            <p className="text-xs text-gray-500">
                                {selectedChat.online ? 'Online' : 'Offline'}
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <button className='p-2 hover:bg-gray-100 rounded-lg transistion'>
                            <Vedio className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className='p-2 hover:bg-gray-100 rounded-lg transistion'>
                            <Phone className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className='p-2 hover:bg-gray-100 rounded-lg transistion'>
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                    </div >
                  </div>

                  {/* chat Messages */}
                  <div className='flex-1 overflow-y-auto p-6 space-y-4'>
                    {messages.map((message) => (
                        <div 
                            key={message.id}
                            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-md ${message.sender === "me" ? 'order-2' : 'order-1'}`}>
                                <div
                                    className={`rounded-2xl px-4 py-2 ${
                                        message.sender === 'me'
                                            ? 'bg-emerald-500 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                    }`}
                                >
                                    <p className='text-sm'>{message.text}</p>
                                </div>
                                <p className={`text-xs text-gray-500 mt-1 ${
                                    message.sender === 'me' ? 'text-right' : 'text-left'
                                }`}>
                                    {message.time}
                                </p>
                            </div>
                        </div>
                    ))}
                  </div>

                  {/* Message Input  */}
                  <div className='bg-white border-t border-gray-200 px-6 py-4'>
                    <div className='flex items-center gap-3'>
                        <button className='p-2 hover:bg-gray-100 rounded-full transition'>
                            <Smile className='w-5 h-5 text-gray-600' />
                        </button>
                        <button className='p-2 hover:bg-gray-100 rounded-full transition'>
                            <Paperclip className='w-5 h-5 text-gray-600' />
                        </button>
                        <input 
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type a Message"
                            className='flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:emerald-500'
                        />
                        <button className='p-2 hover:bg-gray-100 rounded-full transition'>
                            <Send className='w-5 h-5 text-gray-600' />
                        </button>
                    </div>
                </div> 
                </>
            ): (
                // empty state
                <div className='flex-1 flex flex-col items-center justify-center text-gray-500'>
                    <div className='w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4'>
                        <Send  className='w-10 h-10 text-emerald-600'/>
                    </div>
                    <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
                        Welcome to Messages
                    </h2>
                    <p className='text-gray-500'>
                        Select a conversation to start chatting.
                    </p>
                </div> 
            )}
        </div>
    </div>
  )
}

export default ChatScreen;