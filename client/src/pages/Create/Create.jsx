import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const age = [];

for (let i = 18; i <= 100; i++) {
  age.push({ label: `${i}`, value: i });
}

const schema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email({ message: "Email must be example@example.com" }),
  gender: z.string(),
  age: z.number(),
  job: z.string(),
  marital: z.string(),
  education: z.string(),
  contact_type: z.string().optional(),
  last_contact: z.preprocess(
    (val) => {
      // ถ้าค่าที่กรอกเป็นค่าว่าง จะส่งกลับ undefined
      if (val === "") {
        return undefined; // อนุญาตให้เป็นค่าว่าง
      }
      return new Date(val);
    },
    z.date().optional() // ให้สามารถเป็นวันที่หรือเป็น null ได้
  ),
  duration: z.number().optional(),
  campaign: z.number().optional(),
  pcontact: z.number().optional(),
  poutcome: z.number().optional(),
  deposit: z.string().optional(),
});

function Create() {
  const [job, setJob] = useState("");
  const [lastContact, setLastContact] = useState(false);
  // const [formData, setFormData] = useState({});
  // console.log(formData);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      age: 18,
      contact_type: "",
      last_contact: "",
      duration: 0,
      campaign: 0,
      pcontact: 0,
      poutcome: 0,
      deposit: "no",
    },
    resolver: zodResolver(schema),
  });

  const handleJobChange = (e) => {
    setJob(e.target.value);
  };

  const toggleLastContact = () => {
    setLastContact(!lastContact);
  };

  // const handleChange = (e) => {
  //   const { id, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [id]: value,
  //   });
  // };

  const onSubmit = async (formData) => {
    console.log("Form submitted", formData); // ตรวจสอบข้อมูล
    try {
      const res = await axios.post("/api/bank/createData", formData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Form submission successful:", res);
      reset(); // reset form หลังจาก submit สำเร็จ
    } catch (error) {
      console.log("Form submission failed:", error);
      setError("submit", {
        type: "manual",
        message: "Failed to submit form", // ตั้งค่าข้อความ error
      });
    }
  };
  return (
    <main className="w-full h-5/6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col h-full"
      >
        <h1 className="text-5xl font-bold font-serif text-center mt-10">
          Add Infomation
        </h1>
        <div className="w-full">
          <hr className="my-10 w-2/3 mx-auto" />
        </div>
        <div className="flex gap-5 h-4/5 w-2/3  mx-auto  font-semibold">
          <section className="flex flex-1 flex-col gap-5">
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
            <div className="space-x-5">
              <label htmlFor="">Customer Gender</label>
              <input
                {...register("gender")}
                type="radio"
                name="gender"
                value="Male"
              />
              Male
              <input
                {...register("gender")}
                type="radio"
                name="gender"
                value="Female"
              />
              Female
              {errors.gender && (
                <p className="text-xs text-red-500">{errors.gender.message}</p>
              )}
            </div>
            <div className="space-x-5">
              <label htmlFor="age">Customer Age</label>
              <select
                {...register("age", { valueAsNumber: true })}
                className="border w-40 text-center p-1"
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
              {errors.age && (
                <p className="text-xs text-red-500">{errors.age.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="job">Job</label>
              <select
                {...register("job")}
                name="job"
                id="job"
                className="border ml-4 p-1 w-40"
                value={job}
                onChange={handleJobChange}
              >
                <option value="" disabled>
                  Select Job
                </option>
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="manager">Manager</option>
                <option value="other">Other</option>
              </select>

              {job === "other" && (
                <div>
                  <label htmlFor="otherJob">
                    <p>Please specify:</p>
                  </label>
                  <input
                    {...register("otherJob")}
                    type="text"
                    name="otherJob"
                    id="otherJob"
                    className="border"
                  />
                </div>
              )}

              {errors.job && (
                <p className="text-xs text-red-500">{errors.job.message}</p>
              )}
            </div>
            <div className="space-x-5">
              <label htmlFor="">Marital Status</label>
              <input
                {...register("marital")}
                type="radio"
                name="marital"
                value="option1"
              />
              Married
              <input
                {...register("marital")}
                type="radio"
                name="marital"
                value="option2"
              />
              Single
              <input
                {...register("marital")}
                type="radio"
                name="marital"
                value="option2"
              />
              Divorced
              {errors.marital && (
                <p className="text-xs text-red-500">{errors.marital.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="">Education Level</label>
              <select
                {...register("education")}
                id="education"
                className="border w-40 p-1 ml-5"
              >
                <option value="" disabled>
                  select education
                </option>
                <option value="tertiary">Tertiary</option>
                <option value="secondary">Secondary</option>
                <option value="primary">Primary</option>
                <option value="other">Other</option>
              </select>
              {errors.education && (
                <p className="text-xs text-red-500">
                  {errors.education.message}
                </p>
              )}
            </div>
          </section>
          <section className="flex flex-col flex-1">
            <div className="flex gap-5">
              <h3>Have Last Contact ?</h3>
              <input type="checkbox" onClick={toggleLastContact} />
            </div>
            {lastContact && (
              <div className="mt-4 flex flex-col gap-5">
                {/* section1 */}
                <section className="flex gap-3">
                  <div>
                    <label htmlFor="">
                      <p>Contact Type</p>
                    </label>
                    <select id="contact_type" {...register("contact_type")}>
                      <option value="" disabled>
                        select
                      </option>
                      <option value="">Cellular</option>
                      <option value="">Telephone</option>
                      <option value="">Other</option>
                    </select>
                    {errors.contact_type && (
                      <p className="text-xs text-red-500">
                        {errors.contact_type.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="">
                      <p>Last Contact</p>
                    </label>
                    <input
                      {...register("last_contact")}
                      type="date"
                      className="border"
                      id="date"
                    />
                    {errors.last_contact && (
                      <p className="text-xs text-red-500">
                        {errors.last_contact.message}
                      </p>
                    )}
                  </div>
                </section>
                <div className="flex">
                  {/* section2 */}

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
                        className="border"
                      />
                      {errors.duration && (
                        <p className="text-xs text-red-500">
                          {errors.duration.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="">Previous Contacts</label>
                      <p className="text-xs">
                        จำนวนการติดต่อที่ทำก่อนแคมเปญนี้สำหรับลูกค้ารายนี้
                      </p>
                      <input
                        {...register("pcontact")}
                        type="number"
                        className="border"
                      />
                      {errors.pcontact && (
                        <p className="text-xs text-red-500">
                          {errors.pcontact.message}
                        </p>
                      )}
                    </div>
                  </section>
                  {/* section3 */}
                  <section className="flex flex-col flex-1 gap-3">
                    <div>
                      <label htmlFor="">
                        <p>Campaign Contacts</p>
                      </label>
                      <p className="text-xs mb-4">
                        จำนวนการติดต่อที่ทำในระหว่างแคมเปญนี้สำหรับลูกค้ารายนี้
                      </p>
                      <input
                        {...register("campaign")}
                        type="number"
                        className="border"
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
                        className="border"
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
            )}
            <div className="mt-4">
              <label htmlFor="">Term Deposit Subscription</label>
              <p>ลูกค้าได้สมัครฝากเงินประจำหรือไม่?</p>
              <input type="radio" name="deposit" value="option1" />
              yes
              <input type="radio" name="deposit" value="option2" />
              no
              {errors.deposit && (
                <p className="text-xs text-red-500">{errors.deposit.message}</p>
              )}
            </div>
          </section>
        </div>
        <div className="w-1/4 mx-auto mt-10">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 w-full py-3 px-4 rounded-xl shadow-xl border font-bold text-xl text-white"
          >
            {isSubmitting ? "Loading..." : "create"}
          </button>
        </div>
        {errors && console.log("Validation Errors:", errors)}
      </form>
    </main>
  );
}

export default Create;
