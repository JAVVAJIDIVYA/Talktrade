import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiSend, FiArrowLeft } from "react-icons/fi";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { messageAPI, conversationAPI } from "../utils/api";

const Message = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch conversation details
  const { data: conversation } = useQuery({
    queryKey: ["conversation", id],
    queryFn: async () => {
      const res = await conversationAPI.getSingleConversation(id);
      return res.data;
    },
  });

  // Fetch messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages", id],
    queryFn: async () => {
      const res = await messageAPI.getMessages(id);
      return res.data;
    },
    refetchInterval: 3000, // Refetch every 3 seconds
  });

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: (data) => messageAPI.createMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", id]);
      setNewMessage("");
    },
  });

  // Mark as read
  useEffect(() => {
    conversationAPI.updateConversation(id);
  }, [id]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMutation.mutate({
        conversationId: id,
        desc: newMessage.trim(),
      });
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }
  };

  const otherUser = currentUser?.isSeller
    ? conversation?.buyerId
    : conversation?.sellerId;

  // Group messages by date
  const groupedMessages = messages?.reduce((groups, message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center">
            <Link
              to="/messages"
              className="p-2 hover:bg-gray-100 rounded-lg transition mr-2"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            {otherUser && (
              <div className="flex items-center">
                <img
                  src={
                    otherUser.img ||
                    `https://ui-avatars.com/api/?name=${otherUser.username}&background=1dbf73&color=fff`
                  }
                  alt={otherUser.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h2 className="font-semibold text-gray-900">
                    {otherUser.username}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {currentUser?.isSeller ? "Buyer" : "Seller"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading ? (
              <Loading text="Loading messages..." />
            ) : messages && messages.length > 0 ? (
              Object.entries(groupedMessages || {}).map(([date, dateMessages]) => (
                <div key={date}>
                  {/* Date Separator */}
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600">
                      {formatDate(dateMessages[0].createdAt)}
                    </div>
                  </div>

                  {/* Messages for this date */}
                  {dateMessages.map((message) => {
                    const isOwn = message.userId?._id === currentUser?._id;
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}
                      >
                        <div
                          className={`flex items-end max-w-[70%] ${
                            isOwn ? "flex-row-reverse" : ""
                          }`}
                        >
                          {!isOwn && (
                            <img
                              src={
                                message.userId?.img ||
                                `https://ui-avatars.com/api/?name=${message.userId?.username}&background=1dbf73&color=fff`
                              }
                              alt={message.userId?.username}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                          )}
                          <div
                            className={`mx-2 ${
                              isOwn
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-800"
                            } rounded-2xl px-4 py-2`}
                          >
                            <p className="break-words">{message.desc}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwn ? "text-green-100" : "text-gray-500"
                              }`}
                            >
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <p className="text-gray-500">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form
            onSubmit={handleSend}
            className="px-6 py-4 border-t border-gray-200 bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sendMutation.isPending}
                className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Message;
