import Button from "../../components/Button";

function SignupSection() {
  return (
    <section className=" flex flex-col items-center gap-4 pb-10">
      <p className="w-[90%] text-center text-xs text-gray-500">
        People who use our service may have uploaded your contact information to
        Instagram. Learn More
      </p>
      <p className="w-[90%] text-center text-xs text-gray-500">
        By signing up, you agree to our Terms , Data Policy and Cookies Policy .
      </p>
      <Button type="submit" form="signup-form" className="bg-sky-400">
        Sign up
      </Button>
    </section>
  );
}

export default SignupSection;
