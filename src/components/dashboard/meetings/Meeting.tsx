"use client";

import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import Loader from "@/components/common/Loader";
import Link from "next/link";
import { createAction, getAction } from "@/lib/actions/crudActions";
import { routes } from "@/lib/routes";
import { Meeting, Team, User, DragonsList, Task } from "@/lib/types/dashboard/types";
import { useParams } from "next/navigation";
import ToastMessages, {
  showSuccessToast,
  showErrorToast,
  showParsingToast,
} from "@/components/common/ToastMessages";

interface ParseJob {
  id: string;
  meetingId: number;
  status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';
}

const MeetingShow: React.FC = () => {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [organizer, setOrganizer] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [parseJob, setParseJob] = useState<ParseJob | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [dragonsLists, setDragonsLists] = useState<DragonsList[]>([]);
  const [tasksLoading, setTasksLoading] = useState<boolean>(false);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const { id } = useParams();

  const jobPollingRef = useRef<NodeJS.Timeout | null>(null);

  // Persistence key
  const MEETING_PARSE_JOB_KEY = `meetingParseJob_${id}`;

  // Persistence helpers
  const saveParseJob = (job: ParseJob | null) => {
    try {
      if (job) {
        localStorage.setItem(MEETING_PARSE_JOB_KEY, JSON.stringify(job));
      } else {
        localStorage.removeItem(MEETING_PARSE_JOB_KEY);
      }
    } catch (error) {
      console.error('Error saving parse job:', error);
    }
  };

  const fetchDragonsLists = async () => {
    if (!id) return;

    try {
      setTasksLoading(true);
      setTasksError(null);
      const response = await getAction(`${routes.api.meetings.lists}/${id}/lists`);
      if (response?.status === 200 && response.data) {
        setDragonsLists(response.data);
      } else {
        setTasksError("Failed to load tasks");
      }
    } catch (err) {
      setTasksError("An error occurred while fetching tasks");
      console.error("Error fetching dragons lists:", err);
    } finally {
      setTasksLoading(false);
    }
  };

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
    fetchDragonsLists();

    // Load persisted parsing state
    const loadPersistedParseJob = () => {
      try {
        const savedJob = localStorage.getItem(MEETING_PARSE_JOB_KEY);
        if (savedJob) {
          const job: ParseJob = JSON.parse(savedJob);
          setParseJob(job);

          // Restart polling if job is active
          if (job.status === 'active' || job.status === 'waiting') {
            setIsParsing(true);
            startJobPolling(job.id, job.meetingId);
          }
        }
      } catch (error) {
        console.error('Error loading persisted parse job:', error);
        localStorage.removeItem(MEETING_PARSE_JOB_KEY);
      }
    };

    loadPersistedParseJob();

    // Cleanup polling interval on unmount
    return () => {
      if (jobPollingRef.current) {
        clearInterval(jobPollingRef.current);
      }
    };
  }, [id]);

  const startJobPolling = (jobId: string, meetingId: number) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await getAction(`${routes.api.jobs.status}/${jobId}/status`);
        const jobStatus = response?.data?.status;

        // Update job in state
        setParseJob(prev => {
          const updatedJob = prev ? { ...prev, status: jobStatus } : null;
          saveParseJob(updatedJob);
          return updatedJob;
        });

        if (jobStatus === 'completed') {
          // Job completed successfully
          setIsParsing(false);
          showSuccessToast("Meeting parsing completed! You can now view the transcript tasks.");

          // Clear the polling interval
          if (jobPollingRef.current) {
            clearInterval(jobPollingRef.current);
            jobPollingRef.current = null;
          }

          // Remove job from state
          setParseJob(null);
          saveParseJob(null);
        } else if (jobStatus === 'failed') {
          // Job failed - fetch failure details
          try {
            const resultResponse = await getAction(`${routes.api.jobs.result}/${jobId}/result`);
            const errorMessage = resultResponse?.data?.message || "Meeting parsing failed. Please try again.";
            showErrorToast(errorMessage);
          } catch (resultError) {
            console.error("Error fetching job result:", resultError);
            showErrorToast("Meeting parsing failed. Please try again.");
          }

          setIsParsing(false);

          // Clear the polling interval
          if (jobPollingRef.current) {
            clearInterval(jobPollingRef.current);
            jobPollingRef.current = null;
          }

          // Remove job from state
          setParseJob(null);
          saveParseJob(null);
        }
        // If status is 'pending' or 'processing', continue polling
      } catch (error) {
        console.error("Error polling job status:", error);
        showErrorToast("Error checking job status.");

        // Clear the polling interval on error
        if (jobPollingRef.current) {
          clearInterval(jobPollingRef.current);
          jobPollingRef.current = null;
        }

        setIsParsing(false);
        setParseJob(null);
        saveParseJob(null);
      }
    }, 3000); // Poll every 3 seconds

    // Store the interval reference
    jobPollingRef.current = pollInterval;
  };

  const handleParseMeeting = async () => {
    if (!meeting?.id) return;

    try {
      setIsParsing(true);

      const response = await createAction(`${routes.api.meetings.parse}/${meeting.id}`, {});
      const jobId = response?.data?.jobId || response?.data?.id;

      if (!jobId) {
        throw new Error("No job ID returned from API");
      }

      // Add job to state
      const newJob: ParseJob = {
        id: jobId,
        meetingId: meeting.id,
        status: 'active'
      };
      setParseJob(newJob);
      saveParseJob(newJob);

      showSuccessToast(`Meeting parsing started! This may take several minutes. Feel free to continue using the app - you'll be notified when it's ready. Job ID: ${jobId}`);

      // Start polling for job status
      startJobPolling(jobId, meeting.id);

    } catch (error) {
      console.error("Error parsing meeting:", error);
      showErrorToast("Failed to start meeting parsing. Please try again.");
      setIsParsing(false);
    }
  };

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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300";
      case "low":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300";
      case "completed":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
            {isParsing && (
              <div className="text-sm text-orange-500 mt-2 flex items-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Parsing meeting... {parseJob && `(${parseJob.status})`}
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            {meeting && (
              <button
                onClick={handleParseMeeting}
                className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${isParsing
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-purple-500 text-white hover:bg-purple-600"
                  }`}
                disabled={loading || isParsing}
                title={isParsing ? "Parsing in progress..." : "Parse Meeting"}
              >
                <i className={`fas ${isParsing ? "fa-spinner fa-spin" : "fa-cogs"} mr-2`}></i>
                {isParsing ? "Parsing..." : "Parse Meeting"}
              </button>
            )}
            <Link
              href={routes.ui.dashboard.meetings}
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Meetings
            </Link>
          </div>
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
          <div className="space-y-6">
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

            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <i className="fas fa-tasks mr-2 text-orange-500"></i>
                Dragons List Tasks
              </h2>

              {tasksLoading && (
                <div className="flex justify-center items-center h-32">
                  <Loader color="#fc8b28" />
                </div>
              )}

              {tasksError && (
                <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 p-4 rounded-lg">
                  {tasksError}
                </div>
              )}

              {!tasksLoading && !tasksError && dragonsLists.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No Dragons Lists found for this meeting.
                </div>
              )}

              {!tasksLoading && !tasksError && dragonsLists.length > 0 && (
                <div className="space-y-6">
                  {dragonsLists.map((list) => (
                    <div key={list.id} className="border dark:border-gray-600 rounded-lg p-4">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {list.title}
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Created: {formatDate(list.listDate)} | Version: {list.version}
                        </div>
                        {list.notes && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            {list.notes}
                          </p>
                        )}
                        {list.operatingRhythm && list.operatingRhythm.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Operating Rhythm:
                            </h4>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                              {list.operatingRhythm.map((rhythm, index) => (
                                <li key={index}>{rhythm}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {list.tasks && list.tasks.length > 0 && (
                        <div>
                          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                            Tasks ({list.tasks.length})
                          </h4>
                          <div className="space-y-3">
                            {list.tasks.map((task) => (
                              <div key={task.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <h5 className="text-sm font-medium text-gray-900 dark:text-white flex-1">
                                    {task.title}
                                  </h5>
                                  <div className="flex space-x-2 ml-3">
                                    <span
                                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(task.priority)}`}
                                    >
                                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                    </span>
                                    <span
                                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTaskStatusBadge(task.status)}`}
                                    >
                                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                    </span>
                                  </div>
                                </div>

                                {task.outcome && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    <strong>Outcome:</strong> {task.outcome}
                                  </p>
                                )}

                                <div className="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
                                  <div className="flex items-center">
                                    <i className="fas fa-user mr-1"></i>
                                    <span>{task.ownerHandle}</span>
                                  </div>

                                  {task.targetDate && (
                                    <div className="flex items-center">
                                      <i className="fas fa-calendar mr-1"></i>
                                      <span>Target: {formatDate(task.targetDate)}</span>
                                    </div>
                                  )}

                                  {task.collaborators && task.collaborators.length > 0 && (
                                    <div className="flex items-center">
                                      <i className="fas fa-users mr-1"></i>
                                      <span>{task.collaborators.join(", ")}</span>
                                    </div>
                                  )}

                                  {task.extractedFromTranscript && (
                                    <div className="flex items-center">
                                      <i className="fas fa-microphone mr-1"></i>
                                      <span>AI Confidence: {Math.round(task.aiConfidence * 100)}%</span>
                                    </div>
                                  )}
                                </div>

                                {task.blockers && (
                                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                                    <div className="flex items-center text-red-800 dark:text-red-300">
                                      <i className="fas fa-exclamation-triangle mr-2"></i>
                                      <span className="text-xs font-medium">Blockers: {task.blockers}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <ToastMessages />
      </div>
    </AdminLayout>
  );
};

export default MeetingShow;
