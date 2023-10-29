import FormORBuffer from "../components/FormORBuffer";
import Button from "../components/Button";
import LoginForm from "../features/auth/LoginForm";

function Login() {
  return (
    <div className="flex h-[100vh] w-full items-center justify-center">
      <div className="flex w-[23rem] min-w-[23rem] flex-col items-center justify-center gap-3">
        <div className="flex w-full flex-col items-center border">
          <h1 className="font-logo my-12 text-5xl">Instagram</h1>
          {/* Form section */}
          <LoginForm />
          {/* OR section */}
          <FormORBuffer />
          {/* Facebook button */}
          <div className="flex w-full items-center justify-center">
            <Button className="bg-transparent text-sky-900">
              Log in with Facebook
            </Button>
          </div>
          {/* Forgot password section */}
          <div className="flex w-full items-center justify-center ">
            <div className="px-14 py-4 text-sm">
              <span>Forgot password?</span>{" "}
            </div>
          </div>
        </div>
        {/* Dont have an account section */}
        <div className="flex w-full items-center justify-center border">
          <div className="px-14 py-6 text-sm">
            <span>Dont have an account?</span>{" "}
            <span className=" font-semibold text-sky-600">Sign up</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
