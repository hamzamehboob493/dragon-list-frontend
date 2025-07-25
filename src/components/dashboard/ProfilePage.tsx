"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminLayout from "@/layouts/AdminLayout";
import Button from "../common/Button";
import { useAppContext } from "@/contexts/AppContext";
import { profileTabs } from "@/lib/constants/constants";
import { profileData as staticProfileData } from "@/lib/constants/staticData";

const ProfilePage = () => {
  const { currentUser, updateUser, isLoading } = useAppContext();
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(staticProfileData);

  useEffect(() => {
    if (currentUser) {
      const [firstName, ...lastNameParts] = currentUser.name?.split(" ") || ["", ""];
      const lastName = lastNameParts.join(" ");
      
      setProfileData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          firstName: firstName || "",
          lastName: lastName || "",
          email: currentUser.email || "",
          website: `https://${currentUser.username || "user"}.dev`
        }
      }));
    }
  }, [currentUser]);

  const handleInputChange = (category: string, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSaveChanges = () => {
    updateUser({
      name: `${profileData.personal.firstName} ${profileData.personal.lastName}`,
      email: profileData.personal.email,
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
          </div>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <Button
                  onClick={() => setIsEditing(false)}
                  customClass="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  customClass="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                customClass="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <i className="fas fa-edit mr-2"></i>
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={
                      currentUser?.image ||
                      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
                    }
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto"
                    width={96}
                    height={96}
                  />
                  {isEditing && (
                    <Button
                      onClick={() => {/* open image upload modal */}}
                      customClass="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
                    >
                      <i className="fas fa-camera text-sm"></i>
                    </Button>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {profileData.personal.firstName} {profileData.personal.lastName}
                </h3>
                <p className="text-gray-600">{profileData.professional.jobTitle}</p>
                <p className="text-sm text-gray-500">{profileData.personal.location}</p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-envelope w-4 mr-3"></i>
                  <span className="truncate">{profileData.personal.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-phone w-4 mr-3"></i>
                  <span>{profileData.personal.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-building w-4 mr-3"></i>
                  <span>{profileData.professional.company}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-globe w-4 mr-3"></i>
                  <a href={profileData.personal.website} className="text-orange-600 hover:text-orange-700">
                    Portfolio
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4 mt-6">
              <nav className="space-y-2">
                {profileTabs.map((tab, i) => (
                  <Button
                    key={i}
                    onClick={() => setActiveTab(tab.id)}
                    customClass={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-orange-100 text-orange-700 border border-orange-200"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <i className={tab.icon}></i>
                    <span>{tab.label}</span>
                  </Button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileData.personal.firstName}
                        onChange={(e) => handleInputChange("personal", "firstName", e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileData.personal.lastName}
                        onChange={(e) => handleInputChange("personal", "lastName", e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.personal.email}
                        onChange={(e) => handleInputChange("personal", "email", e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profileData.personal.phone}
                        onChange={(e) => handleInputChange("personal", "phone", e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.personal.bio}
                      onChange={(e) => handleInputChange("personal", "bio", e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              )}

              {activeTab === "professional" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={profileData.professional.jobTitle}
                        onChange={(e) => handleInputChange("professional", "jobTitle", e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={profileData.professional.company}
                        onChange={(e) => handleInputChange("professional", "company", e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {profileData.professional.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                        >
                          {skill}
                          {isEditing && (
                            <Button
                              onClick={() => {/* abc */}}
                              customClass="ml-2 text-orange-600 hover:text-orange-800"
                            >
                              <i className="fas fa-times text-xs"></i>
                            </Button>
                          )}
                        </span>
                      ))}
                      {isEditing && (
                        <Button
                          onClick={() => {/* abc */}}
                          customClass="inline-flex items-center px-3 py-1 rounded-full text-sm border-2 border-dashed border-gray-300 text-gray-600 hover:border-orange-300 hover:text-orange-600"
                        >
                          <i className="fas fa-plus mr-1"></i>
                          Add Skill
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "preferences" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        value={profileData.preferences.language}
                        onChange={(e) => handleInputChange("preferences", "language", e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={profileData.preferences.timezone}
                        onChange={(e) => handleInputChange("preferences", "timezone", e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
                      >
                        <option value="Pacific Time (PT)">Pacific Time (PT)</option>
                        <option value="Mountain Time (MT)">Mountain Time (MT)</option>
                        <option value="Central Time (CT)">Central Time (CT)</option>
                        <option value="Eastern Time (ET)">Eastern Time (ET)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex">
                      <i className="fas fa-exclamation-triangle text-yellow-600 mt-1 mr-3"></i>
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Password Security</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Your password was last changed 45 days ago. Consider updating it regularly.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Change Password</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="Enter current password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="Enter new password"
                          />
                        </div>
                        <Button
                          onClick={() => {/* handle password update */}}
                          customClass="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          Update Password
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProfilePage;
