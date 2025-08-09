"use client";

import { useState } from "react";
import { WhatsappMessagesPageProps } from "@/lib/types/dashboard/types";
import { motion, AnimatePresence } from "framer-motion";

export const ShowMessage: React.FC<{
  message: WhatsappMessagesPageProps | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ message, isOpen, onClose }) => {
  const [showToast, setShowToast] = useState(false);

  if (!isOpen || !message) return null;

  const getStatusBadge = (status: string) => {
    return status === "read"
      ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300"
      : "bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300";
  };

  const getMessageTypeBadge = (type: string) => {
    switch (type) {
      case "system":
        return "bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300";
      case "text":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-black/60 to-black/40 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  Message Details
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Message Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                        Sender
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {message.fromName} ({message.fromNumber})
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                        Recipient
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {message.toNumber}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                        Group
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {message.groupName || "N/A"} {message.isGroupMessage && message.groupId ? `(${message.groupId})` : ""}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                        Status
                      </label>
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(message.status)} transition-all`}
                      >
                        {message.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                        Message Type
                      </label>
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getMessageTypeBadge(message.messageType)} transition-all`}
                      >
                        {message.messageType}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                        Timestamp
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {new Date(message.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Message Content
                  </h3>
                  <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap text-base leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  {message.mediaUrl && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                        Media
                      </label>
                      {message.mediaType?.startsWith("image") ? (
                        <img
                          src={message.mediaUrl}
                          alt={message.mediaCaption || "Media"}
                          className="mt-2 max-w-full h-auto rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        />
                      ) : message.mediaType?.startsWith("video") ? (
                        <video
                          src={message.mediaUrl}
                          controls
                          className="mt-2 max-w-full h-auto rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        />
                      ) : (
                        <a
                          href={message.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                          {message.mediaCaption || "View Media"}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Additional Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                      Content Category
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {message.contentCategory}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                      Context Category
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {message.contextCategory}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                      Contains Action Items
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {message.containsActionItems ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                      Contains Questions
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {message.containsQuestions ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                      Contains Decisions
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {message.containsDecisions ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                      WhatsApp Message ID
                    </label>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">
                        {message.whatsappMessageId}
                      </p>
                      <button
                        onClick={() => copyToClipboard(message.whatsappMessageId)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        title="Copy to clipboard"
                      >
                        <i className="fas fa-copy text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg"
            >
              Copied to clipboard!
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
