import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function DashUser() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/user/getUsers");
        const data = res.data;

        if (res.status >= 200 && res.status < 300) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.isadmin) {
      fetchUsers();
    }
  }, [currentUser.id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return (
    <div className="w-full h-screen bg-gray-500">
      {currentUser.isadmin && users.length > 0 ? (
        <>
          <div className="w-80 h-40 rounded-xl bg-white ">
            count : {totalUsers}
          </div>
          <div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Status</th>
                  <th>Create At</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>{user.username}</td>
                    <td>{user.isadmin ? "True" : "False"}</td>
                    <td>{formatDate(user.create_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div>
          <p>Don&apos;t Have any users</p>
        </div>
      )}
    </div>
  );
}

export default DashUser;
