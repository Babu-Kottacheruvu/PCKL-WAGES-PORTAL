import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dummyUsers } from '../data/dummyUsers';
import { ChevronRight } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedUserId, setSelectedUserId] = useState<string>(dummyUsers[0].id);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userToLogin = dummyUsers.find(u => u.id === selectedUserId);
    if (userToLogin) {
      login(userToLogin);
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img
            src="/pck-logo.png"
            alt="Plantation Corporation of Kerala logo"
            className="h-24 w-24 rounded-full object-contain shadow-lg"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Select a role below to simulate login
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Select Role to Login As
              </label>
              <div className="mt-2 relative">
                <select
                  id="role"
                  name="role"
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#20B2AA] focus:border-[#20B2AA] sm:text-sm bg-white"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  {dummyUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.role} ({user.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#20B2AA] hover:bg-[#1a9d96] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#20B2AA] transition-colors"
              >
                Sign in <ChevronRight className="w-4 h-4 ml-2 mt-0.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
