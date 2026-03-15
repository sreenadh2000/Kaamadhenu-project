import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/auth/useAuthStore";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  //////////////////////////////////////////////////////
  // REGISTER SUBMIT
  //////////////////////////////////////////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    await register(form);

    navigate("/products"); // auto redirect after success
  };

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PERSONAL INFO */}
          <input
            type="text"
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, firstName: e.target.value }))
            }
            className="w-full border rounded-lg p-3 border-emerald-200 focus:border-emerald-400"
          />

          <input
            type="text"
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, lastName: e.target.value }))
            }
            className="w-full border rounded-lg p-3 border-emerald-200 focus:border-emerald-400"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full border rounded-lg p-3 border-emerald-200 focus:border-emerald-400"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, phone: e.target.value }))
            }
            className="w-full border rounded-lg p-3 border-emerald-200 focus:border-emerald-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full border rounded-lg p-3 border-emerald-200 focus:border-emerald-400"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            className="w-full border rounded-lg p-3 border-emerald-200 focus:border-emerald-400"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <span
            className="text-emerald-600 cursor-pointer"
            onClick={() => navigate("/auth/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
