import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Chat() {
  const { swapId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [swap, setSwap] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (swapId) {
      fetchMessages();
      fetchSwapDetails();
    }
  }, [swapId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    const res = await fetch(`http://localhost:3001/api/messages/swap/${swapId}`);
    const data = await res.json();
    setMessages(data);
  };

  const fetchSwapDetails = async () => {
    const res = await fetch(`http://localhost:3001/api/swaps/user/${user.id}`);
    const data = await res.json();
    const currentSwap = data.find(s => s.id === parseInt(swapId));
    setSwap(currentSwap);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const res = await fetch('http://localhost:3001/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        swapId: parseInt(swapId),
        senderId: user.id,
        senderName: user.name,
        content: newMessage
      })
    });

    if (res.ok) {
      setNewMessage('');
      fetchMessages();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-purple-600 text-white p-4">
          <h1 className="text-2xl font-bold">Swap Chat</h1>
          {swap && (
            <p className="text-purple-100 text-sm mt-1">
              {swap.fromListingTitle} ↔ {swap.toListingTitle}
            </p>
          )}
        </div>

        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                    msg.senderId === user.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white border'
                  }`}>
                    {msg.senderId !== user.id && (
                      <p className="text-xs font-semibold mb-1 text-purple-600">{msg.senderName}</p>
                    )}
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.senderId === user.id ? 'text-purple-200' : 'text-gray-500'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <form onSubmit={sendMessage} className="border-t p-4 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button type="submit" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
