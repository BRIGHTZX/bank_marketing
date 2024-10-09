import { useState } from "react";

const age = [];

for (let i = 18; i <= 100; i++) {
  age.push({ label: `${i}`, value: i });
}
function Create() {
  const [job, setJob] = useState("");
  const [otherJob, setOtherJob] = useState("");
  const [lastConact, setLastContact] = useState(false);

  const handleJobChange = (e) => {
    setJob(e.target.value);
  };

  const toggleLastContact = () => {
    setLastContact(!lastConact);
  };
  return (
    <main className="w-full h-5/6">
      <form action="" className="w-full flex flex-col h-full">
        <h1 className="text-5xl font-bold font-serif text-center mt-10">
          Add Infomation
        </h1>
        <div className="w-full">
          <hr className="my-10 w-2/3 mx-auto" />
        </div>
        <div className="flex h-4/5 border shadow-xl mx-auto p-10 font-semibold w-2/3">
          <section className="flex flex-1 flex-col gap-5">
            <div>
              <label htmlFor="">
                <p>Customer FirstName</p>
              </label>
              <input type="text" className="border" />
            </div>
            <div>
              <label htmlFor="">
                <p>Customer LastName</p>
              </label>
              <input type="text" className="border" />
            </div>
            <div>
              <label htmlFor="">
                <p>Customer Email</p>
              </label>
              <input type="text" className="border" />
            </div>
            <div className="space-x-5">
              <label htmlFor="">Customer Gender</label>
              <input type="radio" name="gender" value="option1" />
              Male
              <input type="radio" name="gender" value="option2" />
              Female
            </div>
            <div className="space-x-5">
              <label htmlFor="age">Customer Age</label>
              <select name="age" id="age">
                {age.map((ageLabel, index) => (
                  <option key={index} value={ageLabel.value}>
                    {ageLabel.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="">
              <label htmlFor="job">
                <p>Job</p>
              </label>
              <select
                name="job"
                id="job"
                className="border"
                value={job}
                onChange={handleJobChange}
              >
                <option value="">Select Job</option>
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
                    type="text"
                    name="otherJob"
                    id="otherJob"
                    className="border"
                    value={otherJob}
                    onChange={(e) => setOtherJob(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div>
              <label htmlFor="">
                <p>Marital Status</p>
              </label>
              <input type="radio" name="marital" value="option1" />
              Married
              <input type="radio" name="marital" value="option2" />
              Single
              <input type="radio" name="marital" value="option2" />
              Divorced
            </div>
            <div>
              <label htmlFor="">Education Level</label>
              <select name="" id="">
                <option value="" disabled>
                  select
                </option>
                <option value="">Tertiary</option>
                <option value="">Secondary</option>
                <option value="">Primary</option>
                <option value="">Other</option>
              </select>
            </div>
          </section>
          <section className="relative flex flex-col flex-1">
            <div className="flex gap-5">
              <h3>Have Last Contact ?</h3>
              <input type="checkbox" onClick={toggleLastContact} />
            </div>
            {lastConact && (
              <div className="mt-4 flex flex-col gap-5">
                {/* section1 */}
                <section className="flex gap-3">
                  <div>
                    <label htmlFor="">
                      <p>Contact Type</p>
                    </label>
                    <select name="" id="">
                      <option value="" disabled>
                        select
                      </option>
                      <option value="">Cellular</option>
                      <option value="">Telephone</option>
                      <option value="">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="">
                      <p>Last Contact</p>
                    </label>
                    <input type="date" className="border" id="date" />
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
                      <input type="number" className="border" />
                    </div>

                    <div>
                      <label htmlFor="">Previous Contacts</label>
                      <p className="text-xs">
                        จำนวนการติดต่อที่ทำก่อนแคมเปญนี้สำหรับลูกค้ารายนี้
                      </p>
                      <input type="number" className="border" />
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
                      <input type="number" className="border" />
                    </div>
                    <div>
                      <label htmlFor="">Previous Campaign Outcome</label>
                      <p className="text-xs">
                        {" "}
                        ผลลัพธ์จากแคมเปญการตลาดก่อนหน้า
                      </p>
                      <input type="number" className="border" />
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
            </div>
            <div className="absolute bottom-0 right-0 w-1/2">
              <button className="bg-blue-500 w-full py-2 px-4 rounded-xl shadow-md">
                Submit
              </button>
            </div>
          </section>
        </div>
      </form>
    </main>
  );
}

export default Create;
