import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { fireToast } from "../../components/Toast";

const age = [];

for (let i = 18; i <= 100; i++) {
  age.push({ label: `${i}`, value: i });
}

const jobOptions = [
  { label: "Blue Collar", value: "blue-collar" },
  { label: "Services", value: "services" },
  { label: "Technician", value: "technician" },
  { label: "Self-employed", value: "self-employed" },
  { label: "Student", value: "student" },
  { label: "Unemployed", value: "unemployed" },
  { label: "Retired", value: "retired" },
  { label: "Housemaid", value: "housemaid" },
  { label: "Admin", value: "admin." },
  { label: "Management", value: "management" },
  { label: "Entrepreneur", value: "entrepreneur" },
];

const schema = z.object({
  firstname: z.string().min(1, { message: "Firstname is required" }),
  lastname: z.string().min(1, { message: "Lastname is required" }),
  email: z.string().email({ message: "Email must be example@example.com" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  age: z.preprocess(
    (val) => Number(val),
    z.number().positive({ message: "Please select your age" })
  ),
  job: z.string().min(1, { message: "Please select your job" }),
  marital: z.string().min(1, { message: "Marital status is required" }),
  education: z.string().min(1, { message: "Please select your education" }),
  balance: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ message: "Balance is required" })
  ),
  housing: z.enum(["true", "false"], {
    errorMap: () => ({ message: "Housing is required" }),
  }),
  loan: z.enum(["true", "false"], {
    errorMap: () => ({ message: "Loan is required" }),
  }),
  defaultCredit: z.enum(["true", "false"], {
    errorMap: () => ({ message: "credit is required" }),
  }),
  pdays: z.preprocess(
    (val) => Number(val),
    z.number().positive({ message: "pdays must be greater than 0" })
  ),
  contact_type: z.string().min(1, { message: "Select Contact Type" }),
  duration: z.preprocess(
    (val) => Number(val),
    z.number().positive({ message: "Duration must be greater than 0" })
  ),
  campaign: z.preprocess((val) => Number(val), z.number().nonnegative()),
  pcontact: z.preprocess((val) => Number(val), z.number().nonnegative()),
  poutcome: z.preprocess((val) => Number(val), z.number().nonnegative()),
  deposit: z.enum(["true", "false"], {
    errorMap: () => ({ message: "Deposit is required" }),
  }),
  //other job
  otherJob: z.string().min(1, { message: "Please specific your other job" }),
});
function Create() {
  const [job, setJob] = useState("");
  const navigate = useNavigate();
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      gender: "",
      marital: "",
      otherJob: "",
      campaign: 0,
      pcontact: 0,
      poutcome: 0,
    },
    resolver: zodResolver(schema),
  });

  const handleJobChange = (e) => {
    const selectedJob = e.target.value;
    setJob(selectedJob);
    setValue("job", selectedJob);

    if (selectedJob !== "other") {
      setValue("otherJob", "-");
    }
    if (selectedJob === "other") {
      setError("job", "");
      setValue("otherJob", "");
    }
  };

  const onSubmit = async (formData) => {
    try {
      console.log("Form submitted", formData); // ตรวจสอบข้อมูล

      const res = await axios.post("/api/bank/createData", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const data = res.data;
      if (res.status >= 200 && res.status < 300) {
        fireToast("success", data.message);
        navigate("/Dashboard?tab=dashboard");
      }
      reset();
    } catch (error) {
      console.log(error);
      setError("submit", {
        type: "manual",
        message: "Failed to submit form",
      });
    }
  };
  return (
    <main className="w-full h-[90%]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col h-full relative"
      >
        <h1 className="text-5xl font-bold font-serif text-center mt-10">
          Add Infomation
        </h1>
        <div className="w-full">
          <hr className="my-10 w-2/3 mx-auto" />
        </div>
        <div className="flex gap-10 h-4/5 w-2/3  mx-auto  font-semibold">
          <section className="flex flex-1 flex-col gap-5 ">
            <div>
              <label htmlFor="">
                <p>Customer FirstName</p>
              </label>
              <input
                {...register("firstname")}
                type="text"
                className="border w-full py-2 px-4 rounded-xl"
              />
              {errors.firstname && (
                <p className="text-xs text-red-500">
                  {errors.firstname.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="">
                <p>Customer LastName</p>
              </label>
              <input
                {...register("lastname")}
                type="text"
                className="border w-full py-2 px-4 rounded-xl"
              />
              {errors.lastname && (
                <p className="text-xs text-red-500">
                  {errors.lastname.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="">
                <p>Customer Email</p>
              </label>
              <input
                {...register("email")}
                type="text"
                className="border w-full py-2 px-4 rounded-xl"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <p>Balance</p>
              <input
                {...register("balance")}
                type="number"
                className="border w-full py-2 px-4 rounded-xl"
              />
              {errors.balance && (
                <p className="text-xs text-red-500">{errors.balance.message}</p>
              )}
            </div>
            <section className="flex">
              <div className="">
                <label htmlFor="">
                  <p>Gender</p>
                </label>
                <input
                  {...register("gender")}
                  type="radio"
                  name="gender"
                  value="Male"
                  className="mr-1"
                />
                Male
                <input
                  {...register("gender")}
                  type="radio"
                  name="gender"
                  value="Female"
                  className="ml-4 mr-1"
                />
                Female
                {errors.gender && (
                  <p className="text-xs text-red-500">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div>
                <hr className="border-r h-full mx-10" />
              </div>

              <div className="flex-1">
                <label htmlFor="">
                  <p>Marital Status</p>
                </label>
                <input
                  {...register("marital")}
                  type="radio"
                  name="marital"
                  value="married"
                  className="mr-1"
                />
                Married
                <input
                  {...register("marital")}
                  type="radio"
                  name="marital"
                  value="single"
                  className="ml-2 mr-1"
                />
                Single
                <input
                  {...register("marital")}
                  type="radio"
                  name="marital"
                  value="disvorced"
                  className="ml-2 mr-1"
                />
                Divorced
                {errors.marital && (
                  <p className="text-xs text-red-500">
                    {errors.marital.message}
                  </p>
                )}
              </div>
            </section>
            <div>
              <div className="flex">
                <label htmlFor="age">
                  <p className="w-40">Customer Age</p>
                </label>
                <select
                  {...register("age")}
                  className="border w-40 p-1"
                  defaultValue={""}
                >
                  <option value="" disabled>
                    select age
                  </option>
                  {age.map((ageLabel, index) => (
                    <option key={index} value={ageLabel.value}>
                      {ageLabel.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.age && (
                <p className="text-xs text-red-500">{errors.age.message}</p>
              )}
            </div>
            <div>
              <div className="flex">
                <label htmlFor="job">
                  <p className="w-40">Customer Job</p>
                </label>
                <select
                  {...register("job")}
                  name="job"
                  id="job"
                  className="border p-1 w-40"
                  value={job}
                  onChange={handleJobChange}
                >
                  <option value="" disabled>
                    Select Job
                  </option>
                  {jobOptions.map((job) => (
                    <option key={job.value} value={job.value}>
                      {job.label}
                    </option>
                  ))}
                  <option value="other">Other</option>
                </select>

                {job === "other" && (
                  <>
                    <input
                      {...register("otherJob")}
                      type="text"
                      name="otherJob"
                      id="otherJob"
                      className="border p-1 w-52 ml-2"
                      placeholder="Please specify your job"
                    />
                  </>
                )}
              </div>

              {errors.job && (
                <p className="text-xs text-red-500">{errors.job.message}</p>
              )}

              {errors.otherJob && job === "other" && (
                <p className="text-xs text-red-500">
                  {errors.otherJob.message}
                </p>
              )}
            </div>
            <div>
              <div className="flex">
                <label htmlFor="education">
                  <p className="w-40">Education Level</p>
                </label>
                <select
                  {...register("education")}
                  id="education"
                  className="border w-40 p-1"
                  defaultValue=""
                >
                  <option value="" disabled>
                    select education
                  </option>
                  <option value="tertiary">Tertiary</option>
                  <option value="secondary">Secondary</option>
                  <option value="primary">Primary</option>
                  <option value="unknown">Other</option>
                </select>
              </div>

              {errors.education && (
                <p className="text-xs text-red-500">
                  {errors.education.message}
                </p>
              )}
            </div>
          </section>
          <div>
            <hr className="border-r h-full" />
          </div>
          <section className="flex flex-col flex-1">
            <div className="flex flex-col gap-5">
              <section>
                <section className="flex">
                  <div className="my-3 flex-1">
                    <label htmlFor="">
                      <p>
                        Housing ?{" "}
                        <span className="text-xs text-gray-500">
                          has housing loan?
                        </span>
                      </p>
                    </label>
                    <input
                      {...register("housing")}
                      type="radio"
                      name="housing"
                      value={true}
                      className="mr-2"
                    />
                    yes
                    <input
                      {...register("housing")}
                      type="radio"
                      name="housing"
                      value={false}
                      className="mx-2"
                    />
                    no
                    {errors.housing && (
                      <p className="text-xs text-red-500">
                        {errors.housing.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <hr className="border-r h-4/5 mt-2 mr-4" />
                  </div>
                  <div className="my-3 flex-1">
                    <label htmlFor="">
                      <p>
                        Loan ?
                        <span className="text-xs text-gray-500">
                          {" "}
                          has personal loan?
                        </span>
                      </p>
                    </label>
                    <input
                      {...register("loan")}
                      type="radio"
                      name="loan"
                      value={true}
                      className="mr-2"
                    />
                    yes
                    <input
                      {...register("loan")}
                      type="radio"
                      name="loan"
                      value={false}
                      className="mx-2"
                    />
                    no
                    {errors.loan && (
                      <p className="text-xs text-red-500">
                        {errors.loan.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <hr className="border-r h-4/5 mt-2 mr-4" />
                  </div>
                  <div className="my-3">
                    <label htmlFor="">
                      <p>Has Creadit in default?</p>
                    </label>
                    <input
                      {...register("defaultCredit")}
                      type="radio"
                      name="defaultCredit"
                      value={true}
                      className="mr-2"
                    />
                    yes
                    <input
                      {...register("defaultCredit")}
                      type="radio"
                      name="defaultCredit"
                      value={false}
                      className="mx-2"
                    />
                    no
                    {errors.defaultCredit && (
                      <p className="text-xs text-red-500">
                        {errors.defaultCredit.message}
                      </p>
                    )}
                  </div>
                </section>
              </section>
              {/* section1 */}
              <section className="flex">
                <div className="flex-1">
                  <label htmlFor="">
                    <p>Contact Type</p>
                  </label>
                  <select
                    id="contact_type"
                    {...register("contact_type")}
                    className="border w-full py-2 px-4"
                    defaultValue={""}
                  >
                    <option value="" disabled>
                      select
                    </option>
                    <option value="cellular">Cellular</option>
                    <option value="telephone">Telephone</option>
                    <option value="unknown">Other</option>
                  </select>
                  {errors.contact_type && (
                    <p className="text-xs text-red-500">
                      {errors.contact_type.message}
                    </p>
                  )}
                </div>
              </section>

              <section>
                <div>
                  <div className="mb-4">
                    <label htmlFor="">
                      <p>Last Contact Days</p>
                    </label>
                    <p className="text-xs">วันที่การติดต่อครั้งล่าสุด</p>
                  </div>
                  <input
                    {...register("pdays")}
                    type="number"
                    className="border px-4 py-2 w-full"
                  />
                  {errors.pdays && (
                    <p className="text-xs text-red-500">
                      {errors.pdays.message}
                    </p>
                  )}
                </div>
              </section>
              {/* section2 */}
              <div className="flex">
                <section className="flex flex-col flex-1 gap-5">
                  <div>
                    <div className="mb-4">
                      <label htmlFor="">
                        <p>Last Contact Duration</p>
                      </label>
                      <p className="text-xs">
                        ระยะเวลาการติดต่อครั้งล่าสุด (เป็นวินาที)
                      </p>
                    </div>
                    <input
                      {...register("duration")}
                      type="number"
                      className="border px-4 py-2"
                    />
                    {errors.duration && (
                      <p className="text-xs text-red-500">
                        {errors.duration.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="">Previous Contacts</label>
                    <p className="text-xs">จำนวนการติดต่อที่ทำก่อนแคมเปญนี้</p>
                    <input
                      {...register("pcontact")}
                      type="number"
                      className="border px-4 py-2"
                    />
                    {errors.pcontact && (
                      <p className="text-xs text-red-500">
                        {errors.pcontact.message}
                      </p>
                    )}
                  </div>
                </section>
                <div>
                  <hr className="border-r h-full mt-2 mx-2" />
                </div>
                {/* section3 */}
                <section className="flex flex-col flex-1 gap-3">
                  <div>
                    <label htmlFor="">
                      <p>Campaign Contacts</p>
                    </label>
                    <p className="text-xs mb-4">
                      จำนวนการติดต่อที่ทำในระหว่างแคมเปญนี้
                    </p>
                    <input
                      {...register("campaign")}
                      type="number"
                      className="border px-4 py-2"
                    />
                    {errors.campaign && (
                      <p className="text-xs text-red-500">
                        {errors.campaign.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="">Previous Campaign Outcome</label>
                    <p className="text-xs">ผลลัพธ์จากแคมเปญการตลาดก่อนหน้า</p>
                    <input
                      {...register("poutcome")}
                      type="number"
                      className="border px-4 py-2"
                    />
                    {errors.poutcome && (
                      <p className="text-xs text-red-500">
                        {errors.poutcome.message}
                      </p>
                    )}
                  </div>
                </section>
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="">Term Deposit Subscription</label>
              <p>ลูกค้าได้สมัครฝากเงินประจำหรือไม่?</p>
              <input
                {...register("deposit")}
                type="radio"
                name="deposit"
                value={true}
                className="mr-2"
              />
              yes
              <input
                {...register("deposit")}
                type="radio"
                name="deposit"
                value={false}
                className="mx-2"
              />
              no
              {errors.deposit && (
                <p className="text-xs text-red-500">{errors.deposit.message}</p>
              )}
            </div>
          </section>
        </div>
        <div className="absolute bottom-0 right-20">
          <button className="py-2 px-4 bg-gray-500 text-white font-bold rounded-md text-xl">
            <Link to="/Dashboard?tab=dashboard">Cancel</Link>
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-4 py-2 px-4 bg-blue-500 text-white font-bold rounded-md text-xl"
          >
            {isSubmitting ? "Loading..." : "Create"}
          </button>
        </div>
        {errors && console.log("Validation Errors:", errors)}
      </form>
    </main>
  );
}

export default Create;
