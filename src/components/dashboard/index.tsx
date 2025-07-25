"use client";

import React, { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { barChartData, lineChartData, stats } from "@/lib/constants/staticData";
import { dashboardTabs } from "@/lib/constants/constants";
import Button from "@/components/common/Button";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-transform hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <i className={`${stat.icon} text-xl`}></i>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">{stat.label}</p>
                  <p className="text-2xl font-semibold dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="border-b dark:border-gray-700 mb-6">
            <div className="flex space-x-4">
              {dashboardTabs.map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  customClass={`pb-4 px-4 text-sm font-medium bg-transparent shadow-none hover:shadow-none ${
                    activeTab === tab.id
                      ? "border-b-2 border-orange-500 text-orange-500"
                      : "text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">User Growth</h3>
                  <Line
                    data={lineChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Weekly Posts</h3>
                  <Bar
                    data={barChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Role
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {[1, 2, 3, 4, 5].map((user) => (
                        <tr key={user} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">User {user}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">user{user}@example.com</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            Member
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Traffic Sources</h3>
                  <div className="space-y-4">
                    {["Direct", "Social", "Referral", "Organic"].map((source) => (
                      <div key={source} className="flex items-center">
                        <div className="w-32 text-sm text-gray-600 dark:text-gray-300">{source}</div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500"
                              style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-16 text-right text-sm text-gray-600 dark:text-gray-300">
                          {Math.floor(Math.random() * 100)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity</h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((activity) => (
                      <div key={activity} className="flex items-start space-x-4">
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                          <i className="fas fa-bell"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-800 dark:text-white">
                            New user registration: User {activity}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
