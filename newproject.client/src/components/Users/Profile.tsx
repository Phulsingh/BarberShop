import { useEffect, useState } from 'react';
import { useAuthService } from '../../services/authService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CalendarIcon, MapPinIcon, MailIcon, PhoneIcon, PenSquareIcon, PencilIcon } from 'lucide-react';

interface ProfileData {
  id: number;
  fullName: string;
  username?: string;
  email: string;
  contactNumber: string;
  age?: number;
  dateOfBirth?: string;
  bio?: string;
  location?: string;
  state?: string;
  pinCode?: string;
  gender?: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

const Profile = () => {
  const { getProfile, getCurrentUser, updateProfile } = useAuthService();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editedProfile, setEditedProfile] = useState<ProfileData | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const handleImageUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editedProfile) return;

    try {
      setImageLoading(true);
      // TODO: Implement image upload to your backend service
      const formData = new FormData();
      formData.append('avatar', file);
      
      // Update this with your actual image upload API endpoint
      const response = await fetch(`/api/Users/update-profile/${editedProfile.id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const data = await response.json();
      setEditedProfile(prev => prev ? { ...prev, avatar: data.avatarUrl } : prev);
      setProfile(prev => prev ? { ...prev, avatar: data.avatarUrl } : prev);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
          console.warn("No user found in localStorage. Please log in again.");
          return;
        }
        const profileData = await getProfile(currentUser.id);
        setProfile(profileData);
        setEditedProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedProfile) return;

    try {
      setLoading(true);
      await updateProfile(editedProfile.id, editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="mt-16 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-500 relative">
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="relative w-45 h-45">
            <div className="rounded-full border-4 border-white overflow-hidden bg-white">
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Avatar';
                }}
              />
            </div>
            <label 
              htmlFor="avatar-upload" 
              className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <PencilIcon className="w-4 h-4 text-black" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpdate}
                disabled={imageLoading}
              />
            </label>
            {imageLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 pt-20">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
          <p className="text-gray-500 mt-1">@{profile.username}</p>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <MapPinIcon className="w-4 h-4" />
              {profile.location}, {profile.state}
            </span>
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              Joined {profile.createdAt ? new Date(profile.createdAt).getFullYear() : 'N/A'}
            </span>
          </div>
          <p className="mt-4 text-gray-700 max-w-lg mx-auto">{profile.bio}</p>
          
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="mt-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
            size="sm"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
            <PenSquareIcon className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Profile Form */}
        {isEditing && (
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <Input
                    name="fullName"
                    value={editedProfile?.fullName}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <Input
                    name="username"
                    value={editedProfile?.username}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="flex items-center">
                    <MailIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <Input
                      type="email"
                      name="email"
                      value={editedProfile?.email}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                  <div className="flex items-center">
                    <PhoneIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <Input
                      name="contactNumber"
                      value={editedProfile?.contactNumber}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <Input
                      type="date"
                      name="dateOfBirth"
                      value={editedProfile?.dateOfBirth ? editedProfile.dateOfBirth.split('T')[0] : ''}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Gender</label>
                  <Select
                    name="gender"
                    value={editedProfile?.gender}
                    onValueChange={(value) => 
                      setEditedProfile(prev => prev ? { ...prev, gender: value } : prev)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <Input
                      name="location"
                      value={editedProfile?.location}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <Input
                    name="state"
                    value={editedProfile?.state}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Pin Code</label>
                  <Input
                    name="pinCode"
                    value={editedProfile?.pinCode}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Bio</label>
                  <Textarea
                    name="bio"
                    value={editedProfile?.bio}
                    onChange={handleInputChange}
                    className="w-full h-24"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Quick Info Cards */}
        {!isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900">Contact</h3>
              <div className="mt-2 space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <MailIcon className="w-4 h-4" />
                  {profile.email}
                </p>
                <p className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4" />
                  {profile.contactNumber}
                </p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900">Location</h3>
              <div className="mt-2 space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  {profile.location}, {profile.state}
                </p>
                <p>Pin: {profile.pinCode}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900">Personal</h3>
              <div className="mt-2 space-y-2 text-sm text-gray-600">
                <p>Gender: {profile.gender}</p>
                <p>Age: {profile.age} years</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
