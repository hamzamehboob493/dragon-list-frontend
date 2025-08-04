import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Team,
  UserModalProps,
  UserFormValues,
} from "@/lib/types/dashboard/types";
import { getAction } from "@/lib/actions/crudActions";
import { routes } from "@/lib/routes";
import { userSchema } from "@/lib/schemas";
import InputField from "@/components/common/InputField";

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user = null,
  loading = false,
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);

  const statuses = [
    {id: 1, name: "active"},
    {id: 2, name: "inactive"},
  ]

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormValues>({
    resolver: yupResolver(userSchema),
    defaultValues: user || {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      team: { id: "" },
      status: { id: "" },
    },
  });

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
    getTeamsData();
  }, []);

  useEffect(() => {
    if (user) {
      reset(user);
    } else {
      reset({
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        team: { id: "" },
      });
    }
  }, [user, reset]);

  const handleFormSubmit = (data: UserFormValues) => {
    const submitData = {
      ...data,
      team: { id: data.team.id },
      role: { id: data.role?.id == '1' ? '1' : '2' }, // only non-admin users can be created from portal
    };
    onSubmit(submitData as UserFormValues);
    onClose();
    if (!user) reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {user ? "Edit User" : "Add New User"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
            disabled={loading || teamsLoading}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <InputField
            type="email"
            placeholder="Enter Email"
            label="Email"
            register={register("email")}
            errorMessage={errors.email?.message}
            disabled={loading || teamsLoading}
          />

          {
            !user && (
              <InputField
                type="password"
                placeholder="Enter Password"
                label="Password"
                register={register("password")}
                errorMessage={errors.password?.message}
                disabled={loading || teamsLoading}
              />
            )
          }

          <InputField
            type="text"
            placeholder="Enter First Name"
            label="First Name"
            register={register("firstName")}
            errorMessage={errors.firstName?.message}
            disabled={loading || teamsLoading}
          />

          <InputField
            type="text"
            placeholder="Enter Last Name"
            label="Last Name"
            register={register("lastName")}
            errorMessage={errors.lastName?.message}
            disabled={loading || teamsLoading}
          />

          <InputField
            type="text"
            placeholder="Enter Phone Number"
            label="Phone Number"
            register={register("phoneNumber")}
            errorMessage={errors.phoneNumber?.message}
            disabled={loading || teamsLoading}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              {...register("status.id")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select Status</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
            {errors.status?.id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.id.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team
            </label>
            <select
              {...register("team.id")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              disabled={loading || teamsLoading}
            >
              <option value="">Select Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {`${team.name} (${team.code})`}
                </option>
              ))}
            </select>
            {errors.team?.id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.team.id.message}
              </p>
            )}
            {teamsLoading && (
              <p className="text-gray-500 text-sm mt-1">Loading teams...</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || teamsLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || teamsLoading}
            >
              {user ? "Update User" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
