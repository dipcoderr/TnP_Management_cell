import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { Context } from "../../main";
import { LuLoader2 } from "react-icons/lu";

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [company, setCompany] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("default");
  // const [tier, setTier] = useState("");
  const [tier, setTier] = useState("default");
  const [allowedBranches, setAllowedBranches] = useState([]);

  const [open, setOpen] = useState(false);

  const { isAuthorized, user } = useContext(Context);

  const navigateTo = useNavigate();

  const handleJobPost = async (e) => {
    e.preventDefault();
    setOpen(true);

    const jobData = {
      title,
      description,
      category,
      country,
      city,
      company,
      tier,
      allowedBranches,
    };

    if (salaryType === "Fixed Salary") {
      jobData.fixedSalary = fixedSalary;
    } else if (salaryType === "Ranged Salary") {
      jobData.salaryFrom = salaryFrom;
      jobData.salaryTo = salaryTo;
    }

    await axios
      .post("http://localhost:4000/api/v1/job/post", jobData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        toast.success(res.data.message);
        setTitle("");
        setDescription("");
        setCategory("");
        setCountry("");
        setCity("");
        setCompany("");
        setSalaryFrom("");
        setSalaryTo("");
        setFixedSalary("");
        setSalaryType("default");
        setTier("default");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setOpen(false);
      });
  };

  if (!isAuthorized || (user && user.role !== "TNP")) {
    navigateTo("/");
  }

  if (user.status === "Approved") {
    return (
      <>
        <div className="job_post page">
          <div className="container">
            <h3>POST NEW JOB</h3>
            <form onSubmit={handleJobPost}>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company"
              />
              <div className="wrapper">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Job Title"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Mobile App Development">
                    Mobile App Development
                  </option>
                  <option value="Frontend Development">
                    Frontend Development
                  </option>
                  <option value="Web Development">Web Development</option>
                  <option value="Account & Finance">Account & Finance</option>
                  <option value="System Engineer">System Engineer</option>
                  <option value="Graduate Trainee">Graduate Trainee</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="BDA">Business Development Analyst</option>
                </select>
              </div>

              <div className="wrapper">
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                />
              </div>
              <div className="salary_wrapper">
                <select
                  value={salaryType}
                  onChange={(e) => setSalaryType(e.target.value)}
                >
                  <option value="default" disabled>
                    Select Salary Type
                  </option>
                  <option value="Fixed Salary">Fixed Salary</option>
                  <option value="Ranged Salary">Ranged Salary</option>
                </select>
                <div>
                  {salaryType === "default" ? (
                    <p>Please provide Salary Type *</p>
                  ) : salaryType === "Fixed Salary" ? (
                    <input
                      type="number"
                      placeholder="Enter Fixed Salary"
                      value={fixedSalary}
                      onChange={(e) => setFixedSalary(e.target.value)}
                    />
                  ) : (
                    <div className="ranged_salary">
                      <input
                        type="number"
                        placeholder="Fixed Salary"
                        value={salaryFrom}
                        onChange={(e) => setSalaryFrom(e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="CTC Salary"
                        value={salaryTo}
                        onChange={(e) => setSalaryTo(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              >
                <option value="default" disabled>
                  Select Tier
                </option>
                <option value="None">None</option>
                <option value="Normal">Normal</option>
                <option value="Standard">Standard</option>
                <option value="Dream">Dream</option>
              </select>

              <label className="block mt-4 mb-2 font-semibold text-lg">
                Allowed Branches
              </label>
              <select
                multiple
                value={allowedBranches}
                onChange={(e) => {
                  const options = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setAllowedBranches(options);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              >
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="EEE">EEE</option>
                <option value="IT">IT</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Hold Ctrl (or Cmd on Mac) to select multiple branches
              </p>

              <textarea
                rows="10"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Job Description"
              />
              <button type="submit">
                {open ? (
                  <LuLoader2 className="circular_loader" />
                ) : (
                  "Create Job"
                )}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  } else if (user.status === "Pending")
    return (
      <>
        <div className="job_post page">
          <div className="container">
            <h3>POST NEW JOB</h3>
            <div className="pending">
              <h4>Your account is pending for approval!</h4>
              <p>
                You will be able to post jobs once your account is approved by
                the Admin.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  else
    return (
      <>
        <div className="job_post page">
          <div className="container">
            <h3>POST NEW JOB</h3>
            <div className="pending">
              <h4>Your account has been declined!</h4>
              <p>
                You will not be able to post jobs as your account has been
                declined by the TPO.
              </p>
            </div>
          </div>
        </div>
      </>
    );
};

export default PostJob;
