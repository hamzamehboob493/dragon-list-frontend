import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { meetingSchema } from "@/lib/schemas";
import { getAction } from "@/lib/actions/crudActions";
import { routes } from "@/lib/routes";
import {
  Meeting,
  MeetingModalProps,
  Team,
  User,
} from "@/lib/types/dashboard/types";

const MeetingModal: React.FC<MeetingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  meeting = null,
  loading = false,
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<Meeting>({
    resolver: yupResolver(meetingSchema) as Resolver<Meeting>,
    defaultValues: meeting || {
      title: "",
      description: "",
      googleMeetId: "",
      googleDocId: "",
      googleDriveFolderId: "",
      startTime: "",
      endTime: "",
      teamId: undefined,
      organizerId: undefined,
      status: "scheduled",
      meetingType: "one_time",
      recurrencePattern: "",
      recurrenceRule: "",
      seriesId: "",
      originalStartTime: "",
      recurrenceEndDate: "",
      maxOccurrences: 1,
      isException: false,
      participantCount: 1,
      recordingUrl: "",
    },
  });

  const meetingType = watch("meetingType");

  useEffect(() => {
    const getTeamsData = async () => {
      setTeamsLoading(true);
      try {
        const response = await getAction(routes.api.teams.index);
        if (response?.status === 200) {
          setTeams(response?.data.data || []);
        } else {
          console.error("Failed to fetch teams");
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setTeamsLoading(false);
      }
    };

    const getUsersData = async () => {
      setUsersLoading(true);
      try {
        const response = await getAction(routes.api.users.index);
        if (response?.status === 200) {
          setUsers(response?.data.data || []);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setUsersLoading(false);
      }
    };

    getTeamsData();
    getUsersData();
  }, []);

  useEffect(() => {
    if (meeting) {
      setValue("title", meeting.title);
      setValue("description", meeting.description);
      setValue("googleMeetId", meeting.googleMeetId);
      setValue("googleDocId", meeting.googleDocId || "");
      setValue("googleDriveFolderId", meeting.googleDriveFolderId || "");
      setValue("teamId", meeting.teamId);
      setValue("organizerId", meeting.organizerId);
      setValue(
        "startTime",
        meeting.startTime
          ? new Date(meeting.startTime).toISOString().slice(0, 16)
          : "",
      );
      setValue(
        "endTime",
        meeting.endTime
          ? new Date(meeting.endTime).toISOString().slice(0, 16)
          : "",
      );
      setValue("status", meeting.status);
      setValue("meetingType", meeting.meetingType);
      setValue("recurrencePattern", meeting.recurrencePattern || "");
      setValue("recurrenceRule", meeting.recurrenceRule || "");
      setValue("seriesId", meeting.seriesId || "");
      setValue(
        "originalStartTime",
        meeting.originalStartTime
          ? new Date(meeting.originalStartTime).toISOString().slice(0, 16)
          : "",
      );
      setValue(
        "recurrenceEndDate",
        meeting.recurrenceEndDate
          ? new Date(meeting.recurrenceEndDate).toISOString().slice(0, 16)
          : "",
      );
      setValue("maxOccurrences", meeting.maxOccurrences || 1);
      setValue("isException", meeting.isException);
      setValue("participantCount", meeting.participantCount);
      setValue("recordingUrl", meeting.recordingUrl || "");
    } else {
      reset({
        title: "",
        description: "",
        googleMeetId: "",
        googleDocId: "",
        googleDriveFolderId: "",
        teamId: undefined,
        organizerId: undefined,
        startTime: "",
        endTime: "",
        status: "scheduled",
        meetingType: "one_time",
        recurrencePattern: "",
        recurrenceRule: "",
        seriesId: "",
        originalStartTime: "",
        recurrenceEndDate: "",
        maxOccurrences: 1,
        isException: false,
        participantCount: 1,
        recordingUrl: "",
      });
    }
  }, [meeting, reset, setValue]);

  const handleFormSubmit: SubmitHandler<Meeting> = (data) => {
    onSubmit({
      ...data,
      startTime: data.startTime ? new Date(data.startTime).toISOString() : "",
      endTime: data.endTime ? new Date(data.endTime).toISOString() : "",
      originalStartTime: data.originalStartTime
        ? new Date(data.originalStartTime).toISOString()
        : "",
      recurrenceEndDate: data.recurrenceEndDate
        ? new Date(data.recurrenceEndDate).toISOString()
        : "",
    });
    onClose();
    if (!meeting) reset();
  };

  if (!isOpen) return null;

  console.error("Form Errors", errors);

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {meeting ? "Edit Meeting" : "Add New Meeting"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            disabled={loading || teamsLoading || usersLoading}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                {...register("title")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={loading || teamsLoading || usersLoading}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Google Meet ID
              </label>
              <input
                type="text"
                {...register("googleMeetId")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={loading || teamsLoading || usersLoading}
              />
              {errors.googleMeetId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.googleMeetId.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              rows={4}
              disabled={loading || teamsLoading || usersLoading}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Google Doc ID
              </label>
              <input
                type="text"
                {...register("googleDocId")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={loading || teamsLoading || usersLoading}
              />
              {errors.googleDocId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.googleDocId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Google Drive Folder ID
              </label>
              <input
                type="text"
                {...register("googleDriveFolderId")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={loading || teamsLoading || usersLoading}
              />
              {errors.googleDriveFolderId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.googleDriveFolderId.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Team
              </label>
              <select
                {...register("teamId")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={loading || teamsLoading || usersLoading}
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {`${team.name} (${team.code})`}
                  </option>
                ))}
              </select>
              {errors.teamId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.teamId.message}
                </p>
              )}
              {teamsLoading && (
                <p className="text-gray-500 text-sm mt-1">Loading teams...</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Organizer
              </label>
              <select
                {...register("organizerId")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={loading || teamsLoading || usersLoading}
              >
                <option value="">Select Organizer</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {`${user.firstName} ${user.lastName} (${user.email})`}
                  </option>
                ))}
              </select>
              {errors.organizerId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.organizerId.message}
                </p>
              )}
              {usersLoading && (
                <p className="text-gray-500 text-sm mt-1">Loading users...</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Time
              </label>
              <input
                type="datetime-local"
                {...register("startTime")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={loading || teamsLoading || usersLoading}
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.startTime.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Time
              </label>
              <input
                type="datetime-local"
                {...register("endTime")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={loading || teamsLoading || usersLoading}
              />
              {errors.endTime && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Original Start Time
              </label>
              <input
                type="datetime-local"
                {...register("originalStartTime")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={loading || teamsLoading || usersLoading}
              />
              {errors.originalStartTime && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.originalStartTime.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recurrence End Date
              </label>
              <input
                type="datetime-local"
                {...register("recurrenceEndDate")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={loading || teamsLoading || usersLoading}
              />
              {errors.recurrenceEndDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.recurrenceEndDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={loading || teamsLoading || usersLoading}
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meeting Type
              </label>
              <select
                {...register("meetingType")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={loading || teamsLoading || usersLoading}
              >
                <option value="one_time">One-Time</option>
                <option value="recurring">Recurring</option>
              </select>
              {errors.meetingType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.meetingType.message}
                </p>
              )}
            </div>
          </div>

          {meetingType === "recurring" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recurrence Pattern
                  </label>
                  <select
                    {...register("recurrencePattern")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    disabled={loading || teamsLoading || usersLoading}
                  >
                    <option value="">Select Pattern</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  {errors.recurrencePattern && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.recurrencePattern.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recurrence Rule
                  </label>
                  <input
                    type="text"
                    {...register("recurrenceRule")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    disabled={loading || teamsLoading || usersLoading}
                  />
                  {errors.recurrenceRule && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.recurrenceRule.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Occurrences
                  </label>
                  <input
                    type="number"
                    {...register("maxOccurrences")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    disabled={loading || teamsLoading || usersLoading}
                  />
                  {errors.maxOccurrences && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.maxOccurrences.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Participant Count
              </label>
              <input
                type="number"
                {...register("participantCount")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={loading || teamsLoading || usersLoading}
              />
              {errors.participantCount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.participantCount.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recording URL
              </label>
              <input
                type="text"
                {...register("recordingUrl")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={loading || teamsLoading || usersLoading}
              />
              {errors.recordingUrl && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.recordingUrl.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Is Exception
              </label>
              <input
                type="checkbox"
                {...register("isException")}
                className="h-5 w-5 text-orange-500 border-gray-300 dark:border-gray-600 rounded focus:ring-orange-500"
                disabled={loading || teamsLoading || usersLoading}
              />
              {errors.isException && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.isException.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Series ID
              </label>
              <input
                type="text"
                {...register("seriesId")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={loading || teamsLoading || usersLoading}
              />
              {errors.seriesId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.seriesId.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || teamsLoading || usersLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || teamsLoading || usersLoading}
            >
              {meeting ? "Update Meeting" : "Add Meeting"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingModal;
