import Button from "../components/Button";
import FormORBuffer from "../components/FormORBuffer";
import SignupForm from "../features/auth/SignupForm";
import SignupSection from "../features/auth/SignupSection";

function Signup() {
  return (
    <div className="flex h-[100vh] w-full items-center justify-center">
      <div className="flex w-[22rem] min-w-[22rem] flex-col items-center justify-center gap-3">
        {/* Logo section */}
        <div className="flex w-full flex-col items-center border px-10">
          <h1 className="font-logo my-8 text-5xl">Instagram</h1>
          <p className="mb-6 text-center text-base font-semibold text-gray-500">
            Sign up to see photos and videos from your friends.
          </p>
          {/* Facebook button */}
          <div className="flex w-full items-center justify-center">
            <Button>Log in with Facebook</Button>
          </div>
          {/* OR section */}
          <FormORBuffer />
          {/* Form section */}
          <SignupForm />
          {/* Signup section */}
          <SignupSection />
        </div>
        {/* Have an account section */}
        <div className="flex w-full items-center justify-center border">
          <div className="relative px-14 py-6 text-sm">
            <span>Have an account?</span>{" "}
            <span className="text-sky-400">Log in</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
