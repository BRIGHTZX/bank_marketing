import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";
import { fireToast } from "../../components/Toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../../redux/user/userSlice";

const schema = z.object({
  email: z.string().email({ message: "Email must be example@example.com" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData) => {
    try {
      setError(null);

      const res = await axios.post("/api/auth/signin", formData, {
        headers: { "Content-Type": "application/json" },
      });

      reset();

      const data = res.data;
      if (res.status >= 200 && res.status < 300) {
        dispatch(signInSuccess(data.user));
        fireToast("success", data.message);
        navigate("/Dashboard?tab=dashboard");
      }
    } catch (error) {
      setError("root", {
        message: error.response?.data?.message || "Something went Wrong",
      });
    }
  };

  return (
    <div className="h-screen w-full flex">
      {/* Left */}
      <main className="w-1/2 flex justify-center items-center">
        <section className="w-3/5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-10">
              <div>
                <h1 className="text-5xl font-bold mb-4">Log In</h1>
                <p className="text-gray-500 font-semibold">
                  How do i got started lorem ipsum clear at?{" "}
                </p>
              </div>
              <div className="mt-10">
                <div className="flex flex-col">
                  <label htmlFor="" className="text-xl font-semibold">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="text"
                    className="border border-gray-300 w-full h-10 rounded-full mt-4 py-2 px-6"
                  />
                  {errors.email && (
                    <div className="text-red-500 text-sm">
                      {errors.email.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col mt-1">
                  <label htmlFor="" className="text-xl font-smibold">
                    Password
                  </label>
                  <input
                    {...register("password")}
                    type="password"
                    className="border border-gray-300 w-full h-10 rounded-full mt-4 py-2 px-6"
                  />
                  {errors.password && (
                    <div className="text-red-500 text-sm">
                      {errors.password.message}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-700 py-2 text-center rounded-full mt-10 w-full text-white font-bold text-xl"
                >
                  {isSubmitting ? "Loading..." : "Sign In"}
                </button>
                <div className="mt-4 text-right font-semibold">
                  <p>
                    Don&apos;t have an account?{" "}
                    <span className="text-blue-700">
                      <Link to={`/signup`}>Register here.</Link>
                    </span>
                  </p>
                </div>
                <div>
                  {errors.root && (
                    <div className="text-red-500 text-sm">
                      {errors.root.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </section>
      </main>
      {/* Right */}
      <section className="w-1/2">
        <img
          src="https://www.confiz.com/wp-content/uploads/2023/10/64c0cf00f6acd33ef5140738_BG.jpg-1.webp"
          alt=""
          className="w-full h-screen object-cover"
        />
      </section>
    </div>
  );
}

export default SignIn;
