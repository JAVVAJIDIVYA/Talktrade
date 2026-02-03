import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiMessageCircle, FiCheck } from "react-icons/fi";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { conversationAPI } from "../utils/api";

const Messages = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await conversationAPI.getConversations();
      return res.data;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => conversationAPI.updateConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-500 mt-1">
            Communicate with {currentUser?.isSeller ? "buyers" : "sellers"}
          </p>
        </div>

        {/* Conversations List */}
        {conversations && conversations.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {conversations.map((conversation) => {
              const otherUser = currentUser?.isSeller
                ? conversation.buyerId
                : conversation.sellerId;
              const isUnread = currentUser?.isSeller
                ? !conversation.readBySeller
                : !conversation.readByBuyer;

              return (
                <Link
                  key={conversation._id}
                  to={`/message/${conversation.id}`}
                  onClick={() => {
                    if (isUnread) {
                      markReadMutation.mutate(conversation.id);
                    }
                  }}
                  className={`flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                    isUnread ? "bg-green-50" : ""
                  }`}
                >
                  <div className="relative">
                    <img
                      src={
                        otherUser?.img ||
                        `https://ui-avatars.com/api/?name=${otherUser?.username}&background=1dbf73&color=fff`
                      }
                      alt={otherUser?.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {isUnread && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white"></span>
                    )}
                  </div>

                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`font-medium ${
                          isUnread ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {otherUser?.username}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {formatTime(conversation.updatedAt)}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        isUnread ? "text-gray-800 font-medium" : "text-gray-500"
                      }`}
                    >
                      {conversation.lastMessage || "No messages yet"}
                    </p>
                  </div>

                  {!isUnread && conversation.lastMessage && (
                    <FiCheck className="w-4 h-4 text-gray-400 ml-2" />
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No messages yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start a conversation by contacting a{" "}
              {currentUser?.isSeller ? "buyer" : "seller"}
            </p>
            <Link
              to="/gigs"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              Browse Services
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
