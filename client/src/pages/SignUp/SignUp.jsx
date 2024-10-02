import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";

const schema = z.object({
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters" }),
  email: z.string().email({ message: "Email must be example@example.com" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

function SignUp() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData) => {
    try {
      setError(null);

      const res = await axios.post("/api/auth/signup", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const data = res.data;

      reset();

      Toast.fire({
        icon: "success",
        title: data.message,
      });

      navigate("/");
    } catch (error) {
      setError("root", {
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-start",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  return (
    <div className="h-screen w-full flex">
      {/* Left */}
      <main className="w-1/2 flex justify-center items-center">
        <section className="w-3/5">
          <form onSubmit={handleSubmit(onSubmit)} className="p-10">
            <div>
              <h1 className="text-5xl font-bold mb-4">Register</h1>
              <p className="text-gray-500 font-semibold">
                How do i got started lorem ipsum clear at?{" "}
              </p>
            </div>
            <div className="mt-10">
              <div className="flex flex-col">
                <label htmlFor="" className="text-xl font-semibold">
                  Username
                </label>
                <input
                  {...register("username")}
                  type="text"
                  className="border border-gray-300 w-full h-10 rounded-full mt-4 py-2 px-6"
                />
                {errors.username && (
                  <div className="text-red-500 text-sm">
                    {errors.username.message}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="text-xl font-semibold mt-4">
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
                <label htmlFor="" className="text-xl font-semibold mt-4">
                  Password
                </label>
                <input
                  {...register("password")}
                  type="text"
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
                {isSubmitting ? "Loading..." : "Sign Up"}
              </button>
              <div className="mt-4 text-right font-semibold">
                <p>
                  Are You Have any Account ?{" "}
                  <span className="text-blue-700">
                    <Link to={`/`}>Log In</Link>
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
          </form>
        </section>
      </main>
      {/* Right */}
      <section className="w-1/2">
        <img
          src="https://wallup.net/wp-content/uploads/2019/09/317501-nissan-skyline-r34-gt-r-car-hd-wallpaper-1920x1080-8791.jpg"
          alt=""
          className="w-full h-screen object-cover object-left"
        />
      </section>
    </div>
  );
}

export default SignUp;
