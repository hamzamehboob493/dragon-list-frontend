"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import Loader from "@/components/common/Loader";
import Link from "next/link";
import { getAction } from "@/lib/actions/crudActions";
import { routes } from "@/lib/routes";
import { Meeting, Team, User } from "@/lib/types/dashboard/types";
import { useParams } from "next/navigation";

const MeetingShow: React.FC = () => {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [organizer, setOrganizer] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        setLoading(true);
        const response = await getAction(`${routes.api.meetings.index}/${id}`);
        if (response?.status === 200 && response.data) {
          setMeeting(response.data);
          // Fetch team and organizer details
          if (response.data.teamId) {
            const teamResponse = await getAction(
                `${routes.api.teams.index}/${response.data.teamId}`,
            );
            if (teamResponse?.status === 200) {
                setTeam(teamResponse.data);
            }
          }
          if (response.data.organizerId) {
            const userResponse = await getAction(
              `${routes.api.users.index}/${response.data.organizerId}`,
            );
            if (userResponse?.status === 200) {
              setOrganizer(userResponse.data);
            }
          }
        } else {
          setError("Failed to load meeting data");
        }
      } catch (err) {
        setError("An error occurred while fetching meeting data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeeting();
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300";
      case "completed":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Meeting Details
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Detailed information about the meeting
            </p>
          </div>
          <Link
            href={routes.ui.dashboard.meetings}
            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Meetings
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader color="#fc8b28" />
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 p-4 rounded-lg shadow-sm">
            {error}
          </div>
        )}

        {meeting && !loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Meeting Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 transform hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <i className="fas fa-calendar mr-2 text-orange-500"></i>
                Meeting Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title
                  </div>
                  <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                    {meeting.title}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </div>
                  <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                    {meeting.description}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Google Meet ID
                  </div>
                  <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                    {meeting.googleMeetId}
                  </div>
                </div>
                {meeting.googleDocId && (
                  <div className="flex items-center">
                    <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Google Doc ID
                    </div>
                    <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                      {meeting.googleDocId}
                    </div>
                  </div>
                )}
                {meeting.googleDriveFolderId && (
                  <div className="flex items-center">
                    <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Google Drive Folder ID
                    </div>
                    <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                      {meeting.googleDriveFolderId}
                    </div>
                  </div>
                )}
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Start Time
                  </div>
                  <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                    {new Date(meeting.startTime).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    End Time
                  </div>
                  <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                    {new Date(meeting.endTime).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </div>
                  <div className="w-2/3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(meeting.status)}`}
                    >
                      {meeting.status.charAt(0).toUpperCase() +
                        meeting.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Meeting Type
                  </div>
                  <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                    {meeting.meetingType === "one_time"
                      ? "One-Time"
                      : "Recurring"}
                  </div>
                </div>
                {meeting.recordingUrl && (
                  <div className="flex items-center">
                    <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Recording URL
                    </div>
                    <div className="w-2/3 text-sm">
                      <a
                        href={meeting.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View Recording
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recurrence and Team Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 transform hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <i className="fas fa-info-circle mr-2 text-orange-500"></i>
                Additional Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Team
                  </div>
                  <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                    {meeting.team ? <Link href={`${routes.ui.dashboard.teams}/${meeting.team?.id}`} className="text-orange-500" >{`${meeting.team?.name} (${meeting.team?.code})`}</Link> : <Loader color="#fc8b28" customClass="w-5" />}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Organizer
                  </div>
                  <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                    {meeting.organizer
                      ? <Link href={`${routes.ui.dashboard.users}/${meeting.organizer?.id}`} className="text-orange-500" >{`${meeting.organizer.firstName} ${meeting.organizer.lastName} (${meeting.organizer.email})`}</Link>
                      : <Loader color="#fc8b28" customClass="w-5" />}
                  </div>
                </div>
                {meeting.meetingType === "recurring" && (
                  <>
                    {meeting.recurrencePattern && (
                      <div className="flex items-center">
                        <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Recurrence Pattern
                        </div>
                        <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                          {meeting.recurrencePattern.charAt(0).toUpperCase() +
                            meeting.recurrencePattern.slice(1)}
                        </div>
                      </div>
                    )}
                    {meeting.recurrenceRule && (
                      <div className="flex items-center">
                        <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Recurrence Rule
                        </div>
                        <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                          {meeting.recurrenceRule}
                        </div>
                      </div>
                    )}
                    {meeting.seriesId && (
                      <div className="flex items-center">
                        <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Series ID
                        </div>
                        <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                          {meeting.seriesId}
                        </div>
                      </div>
                    )}
                    {meeting.recurrenceEndDate && (
                      <div className="flex items-center">
                        <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Recurrence End Date
                        </div>
                        <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                          {new Date(meeting.recurrenceEndDate).toLocaleString()}
                        </div>
                      </div>
                    )}
                    {meeting.maxOccurrences && (
                      <div className="flex items-center">
                        <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Max Occurrences
                        </div>
                        <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                          {meeting.maxOccurrences}
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Participant Count
                  </div>
                  <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                    {meeting.participantCount}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Is Exception
                  </div>
                  <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                    {meeting.isException ? "Yes" : "No"}
                  </div>
                </div>
                {meeting.originalStartTime && (
                  <div className="flex items-center">
                    <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Original Start Time
                    </div>
                    <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                      {new Date(meeting.originalStartTime).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MeetingShow;
