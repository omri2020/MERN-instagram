import { useForm } from "react-hook-form";
import useAuth from "../auth/useAuth";
import Button from "../../components/Button";
import { determineInputType } from "../../utils/determineInputType";
import PageLoader from "../../ui/PageLoader";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { loginUser, isLoginLoading, loginError, authCheckLoading } = useAuth();

  const onSubmit = (data) => {
    const inputType = determineInputType(data.email);

    let finalData = { ...data };

    if (inputType !== "email") {
      finalData[inputType] = finalData.email;
      delete finalData.email;
    }
    loginUser(finalData);
    navigate("/");
  };

  if (isLoginLoading || authCheckLoading) return <PageLoader />;

  return (
    <form
      className="mb-3 flex w-full flex-col gap-3 px-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <input
          placeholder="Phone number, username, or email"
          className={`w-full border p-2 outline-1 ${
            errors.username ? "border-red-500" : "border-gray-400"
          } placeholder:text-[0.6rem] ${
            errors.username ? "placeholder-red-500" : "placeholder-zinc-500"
          }`}
          {...register("email", { required: true })}
        />
        {errors.username && (
          <span className="text-red-500">This field is required</span>
        )}
        <input
          placeholder="Password"
          type="password"
          className={`w-full border p-2 outline-1 ${
            errors.password ? "border-red-500" : "border-gray-400"
          } placeholder:text-[0.6rem] ${
            errors.password ? "placeholder-red-500" : "placeholder-zinc-500"
          }`}
          {...register("password", { required: true })}
        />
        {errors.password && (
          <span className="text-red-500">This field is required</span>
        )}
      </div>
      {loginError && (
        <span className="text-center text-red-500">{loginError.message}</span>
      )}
      <Button type="submit" className="bg-sky-500">
        Log in
      </Button>
    </form>
  );
}

export default LoginForm;
