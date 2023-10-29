import { useForm } from "react-hook-form";
import useAuth from "../auth/useAuth";

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const { signupUser, isLoading: isRegistering } = useAuth();

  const onSubmit = async (data) => {
    try {
      await signupUser(data);
      // Handle successful registration if needed
    } catch (error) {
      const { keyValue } = error?.error || {};
      if (keyValue) {
        if (keyValue.email) {
          setError("email", {
            type: "manual",
            message: "Email already exists",
          });
        } else if (keyValue.username) {
          setError("username", {
            type: "manual",
            message: "Username already exists",
          });
        }
      }
    }
  };

  // reminder to use isLoading and error
  return (
    <form
      id="signup-form"
      onSubmit={handleSubmit(onSubmit)}
      className="mb-3 flex w-full flex-col gap-3"
    >
      {isRegistering && <p>Loading...</p>}
      <div className="flex flex-col gap-2">
        <input
          placeholder="Mobile Number or Email"
          className={`w-full border bg-gray-50  p-2 outline-1 outline-gray-400 placeholder:text-[0.8rem] placeholder:text-zinc-500 ${
            errors.email ? "border-red-500" : ""
          }`}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}
        <input
          placeholder="Full Name"
          className={`w-full border bg-gray-50  p-2 outline-1 outline-gray-400 placeholder:text-[0.8rem] placeholder:text-zinc-500 ${
            errors.name ? "border-red-500" : ""
          }`}
          {...register("name", {
            required: "Full name is required",
            minLength: {
              value: 8,
              message: "Full name must be at least 8 characters",
            },
          })}
        />
        {errors.name && (
          <span className="text-sm text-red-500">{errors.name.message}</span>
        )}
        <input
          placeholder="Username"
          className={`w-full border bg-gray-50  p-2 outline-1 outline-gray-400 placeholder:text-[0.8rem] placeholder:text-zinc-500 ${
            errors.username ? "border-red-500" : ""
          }`}
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 6,
              message: "Username must be at least 6 characters",
            },
          })}
        />
        {errors.username && (
          <span className="text-sm text-red-500">
            {errors.username.message}
          </span>
        )}
        <input
          placeholder="Password"
          className={`w-full border bg-gray-50  p-2 outline-1 outline-gray-400 placeholder:text-[0.8rem] placeholder:text-zinc-500 ${
            errors.password ? "border-red-500" : ""
          }`}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
              message:
                "Password must contain at least one letter and one number",
            },
          })}
        />
        {errors.password && (
          <span className="text-sm text-red-500">
            {errors.password.message}
          </span>
        )}
      </div>
    </form>
  );
}

export default SignupForm;
