import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdownId, setShowDropdownId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/user/getstudents",
        {
          withCredentials: true,
        }
      );
      setStudents(data.students);
      setLoading(false);
    } catch (error) {
      console.error(error.response.data.message);
      setLoading(false);
    }
  };

  const updatePlacementStatus = async (studentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/user/updatestatus/${studentId}`,
        { placementStatus: status },
        { withCredentials: true }
      );
      console.log(data.message);
      
      setShowDropdownId(null); // close dropdown after update
      fetchStudents(); // refresh list
      toast.success("Status updated successfully");
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Students from Your Branch</h1>

      {students.length === 0 ? (
        <p>No students found from your branch.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Branch</th>
                <th className="py-2 px-4 border-b">Placement Status</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="text-center">
                  <td className="py-2 px-4 border-b">{student.name}</td>
                  <td className="py-2 px-4 border-b">{student.email}</td>
                  <td className="py-2 px-4 border-b">{student.phone}</td>
                  <td className="py-2 px-4 border-b">{student.branch}</td>
                  <td className="py-2 px-4 border-b">
                    <select
                      value={
                        student.selectedStatus ||
                        student.placementStatus ||
                        "None"
                      }
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        setStudents((prev) =>
                          prev.map((s) =>
                            s._id === student._id
                              ? { ...s, selectedStatus: newStatus }
                              : s
                          )
                        );
                      }}
                      className="border rounded px-2 py-1"
                    >
                      <option value="None">None</option>
                      <option value="Normal">Normal</option>
                      <option value="Standard">Standard</option>
                      <option value="Dream">Dream</option>
                    </select>
                  </td>
                  <td className="py-2 px-4 border-b relative">
                    <button
                      className="hover:bg-blue-600 hover:text-white py-1 px-3 rounded"
                      onClick={() =>
                        updatePlacementStatus(
                            student._id,
                            student.selectedStatus || student.placementStatus
                          )
                      }
                    >
                      Update Status
                    </button>

            
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;
