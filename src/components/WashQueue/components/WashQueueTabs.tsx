import React from "react";

export type WashQueueTab = "add" | "queue";

interface WashQueueTabsProps {
  activeTab: WashQueueTab;
  onTabChange: (tab: WashQueueTab) => void;
}

export const WashQueueTabs: React.FC<WashQueueTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="mb-6">
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "add"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => onTabChange("add")}
        >
          Add Car
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "queue"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => onTabChange("queue")}
        >
          Queue
        </button>
      </div>
    </div>
  );
};
