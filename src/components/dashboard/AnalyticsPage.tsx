"use client";

import React, { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { analyticsData } from "@/lib/constants/staticData";
import Button from "../common/Button";
import InputField from "../common/InputField";

const AnalyticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");

  const getSourceColor = (index: number) => {
    const colors = [
      "bg-orange-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor your website performance and user behavior
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <InputField
              type="select"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              customClass="!mb-0"
            />
            <Button customClass="bg-orange-500 px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
              <i className="fas fa-download mr-2"></i>
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Visitors
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.overview.totalVisitors.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  <i className="fas fa-arrow-up mr-1"></i>+12.5% from last
                  period
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <i className="fas fa-users text-blue-600 dark:text-blue-300 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Page Views
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.overview.pageViews.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  <i className="fas fa-arrow-up mr-1"></i>+8.2% from last period
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <i className="fas fa-eye text-green-600 dark:text-green-300 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bounce Rate
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.overview.bounceRate}%
                </p>
                <p className="text-sm text-red-600 mt-1">
                  <i className="fas fa-arrow-down mr-1"></i>-2.1% from last
                  period
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <i className="fas fa-chart-line text-red-600 dark:text-red-300 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Avg. Session
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.overview.avgSessionDuration}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  <i className="fas fa-arrow-up mr-1"></i>+5.3% from last period
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <i className="fas fa-clock text-purple-600 dark:text-purple-300 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Sources */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Traffic Sources
            </h3>
            <div className="space-y-4">
              {analyticsData.trafficSources.map((source, index) => (
                <div
                  key={source.source}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${getSourceColor(index)}`}
                    ></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {source.source}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {source.visitors.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {source.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Pages
            </h3>
            <div className="space-y-4">
              {analyticsData.topPages.map((page, index) => (
                <div
                  key={page.page}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {page.page}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {page.views.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {page.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Device Types
            </h3>
            <div className="space-y-4">
              {analyticsData.deviceTypes.map((device, index) => (
                <div key={device.device} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {device.device}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {device.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getSourceColor(index)}`}
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {device.teams.toLocaleString()} teams
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {analyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {activity.user}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 mt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Visitor Trends
            </h3>
            <div className="flex space-x-2">
              <Button customClass="px-3 py-1 text-sm bg-orange-100 text-orange-600 rounded-md dark:bg-orange-200">
                Visitors
              </Button>
              <Button customClass="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                Page Views
              </Button>
              <Button customClass="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                Sessions
              </Button>
            </div>
          </div>

          <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <i className="fas fa-chart-area text-4xl text-gray-400 dark:text-gray-500 mb-4"></i>
              <p className="text-gray-500 dark:text-gray-300">
                Interactive chart would be displayed here
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Integration with Chart.js or similar library
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
