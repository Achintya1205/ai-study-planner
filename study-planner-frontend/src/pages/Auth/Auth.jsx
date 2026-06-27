import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, Sparkles } from "lucide-react"; 
import { register, login } from '../../api/auth.api.js';

function Auth({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username) => {
    return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateRegisterForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (!validateUsername(username)) {
      newErrors.username = "Username must be 3+ chars, alphanumeric only";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLoginForm = () => {
    const newErrors = {};
  
    if (!username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateRegisterForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await register({ username, email, password });

      if (data.success) {
        setSuccess("Account created successfully! Redirecting to login...");
        
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrors({});

        setTimeout(() => {
          setTab("login");
          setSuccess("");
        }, 2000);
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    if (!validateLoginForm()) {
      return;
    }
 
    setLoading(true);
    setError("");

    try {
      const data = await login({ username, password });

      if (data.success) {
        // Store token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setIsAuthenticated(true);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestDemo = async () => {
    setLoading(true);
    setError("");
    setErrors({});
    
    const guestUser = "Guest";
    const guestPass = "demopassword";

    setUsername(guestUser);
    setPassword(guestPass);

    try {
      const data = await login({ username: guestUser, password: guestPass });

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setIsAuthenticated(true);
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Guest account is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setError("");
    setSuccess("");
    setErrors({});
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-purple-500 to-emerald-400 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              📚 AI Study Planner
            </h1>
            <p className="text-emerald-50 text-sm font-medium">
              Your Personalized Learning Journey
            </p>
          </div>

          <div className="p-8">
            {/* Tabs */}
            <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleTabChange("login")}
                className={`flex-1 py-2.5 px-4 rounded-md font-semibold text-base transition-all ${
                  tab === "login"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                 Login
              </button>
              <button
                onClick={() => handleTabChange("register")}
                className={`flex-1 py-2.5 px-4 rounded-md font-semibold text-base transition-all ${
                  tab === "register"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                 Register
              </button>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
                {success}
              </div>
            )}

            {/* Login Form */}
            {tab === "login" && (
              <div className="space-y-5">
                <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
                  <input type="text" style={{ display: "none" }} readOnly onFocus={(e) => e.currentTarget.removeAttribute("readOnly")} />
                  <input type="password" style={{ display: "none" }} readOnly onFocus={(e) => e.currentTarget.removeAttribute("readOnly")} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="login_user_x7"
                        autoComplete="off"
                        readOnly
                        onFocus={(e) => e.currentTarget.removeAttribute("readOnly")}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                          errors.username ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div> 
                      <input
                        type={showPassword ? "text" : "password"}
                        name="login_pass_x7"
                        autoComplete="new-password"
                        readOnly
                        onFocus={(e) => e.currentTarget.removeAttribute("readOnly")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-600 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "⏳ Logging in..." : "🚀 Login"}
                  </button>
                </form>

                {/* Separator Divider line */}
                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-gray-200 w-full"></div>
                  <span className="absolute bg-white px-3 text-xs text-gray-400 uppercase tracking-wider font-semibold">Or</span>
                </div>

                {/* 🚀 New UI Button component for Guest Logins */}
                <button
                  type="button"
                  onClick={handleGuestDemo}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-purple-400 text-purple-600 py-3 rounded-lg font-bold hover:bg-purple-50 transition shadow-sm disabled:opacity-50"
                >
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  Explore with Guest Demo
                </button>
              </div>
            )}

            {/* Register Form */}
            {tab === "register" && (
              <form onSubmit={handleRegister} className="space-y-5" autoComplete="off">
                <input type="text" style={{ display: "none" }} readOnly onFocus={(e) => e.currentTarget.removeAttribute("readOnly")} />
                <input type="password" style={{ display: "none" }} readOnly onFocus={(e) => e.currentTarget.removeAttribute("readOnly")} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="reg_user_x7"
                      autoComplete="off"
                      readOnly
                      onFocus={(e) => e.currentTarget.removeAttribute("readOnly")}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition ${
                        errors.username ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.username ? (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">
                      Min 3 chars, alphanumeric only
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="reg_email_x7"
                      autoComplete="off"
                      readOnly
                      onFocus={(e) => e.currentTarget.removeAttribute("readOnly")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="reg_pass_x7"
                      autoComplete="new-password"
                      readOnly
                      onFocus={(e) => e.currentTarget.removeAttribute("readOnly")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password ? (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">Min 6 characters</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="reg_confirm_x7"
                      autoComplete="new-password"
                      readOnly
                      onFocus={(e) => e.currentTarget.removeAttribute("readOnly")}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-600 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "⏳ Creating account..." : "✨ Register"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white text-sm mt-6 opacity-90">
           Your data is secure and encrypted
        </p>
      </div>
    </div>
  );
}

export default Auth;