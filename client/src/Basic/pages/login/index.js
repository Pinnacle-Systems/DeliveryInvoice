import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { PRODUCT_ADMIN_HOME_PATH } from "../../../Route/urlPaths";
import { LOGIN_API } from "../../../Api";
import Loader from "../../components/Loader";
import { generateSessionId } from "../../../Utils/helper";
import Modal from "../../../UiComponents/Modal";
import { BranchAndFinyearForm } from "../../components";
import logo from "../../../assets/pinnacle.jpg";
import top from "../../../assets/top1.png";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const Login = () => {
  const [isGlobalOpen, setIsGlobalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const data = { username, password };

  const loginUser = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(BASE_URL + LOGIN_API, data)
      .then((result) => {
        setLoading(false);
        if (result.status === 200) {
          if (result.data.statusCode === 0) {
            sessionStorage.setItem("sessionId", generateSessionId());
            if (!result.data.userInfo.roleId) {
              secureLocalStorage.setItem(
                sessionStorage.getItem("sessionId") + "userId",
                result.data.userInfo.id
              );
              secureLocalStorage.setItem(
                sessionStorage.getItem("sessionId") + "username",
                result.data.userInfo.username
              );
              secureLocalStorage.setItem(
                sessionStorage.getItem("sessionId") + "superAdmin",
                true
              );
              navigate(PRODUCT_ADMIN_HOME_PATH);
            } else {
              secureLocalStorage.setItem(
                sessionStorage.getItem("sessionId") + "employeeId",
                result.data.userInfo.employeeId
              );
              secureLocalStorage.setItem(
                sessionStorage.getItem("sessionId") + "userId",
                result.data.userInfo.id
              );
              secureLocalStorage.setItem(
                sessionStorage.getItem("sessionId") + "username",
                result.data.userInfo.username
              );
              secureLocalStorage.setItem(
                sessionStorage.getItem("sessionId") + "userEmail",
                result.data.userInfo.email
              );
              secureLocalStorage.setItem(
                sessionStorage.getItem("sessionId") + "userCompanyId",
                result.data.userInfo.role.companyId
              );
              secureLocalStorage.setItem(
                sessionStorage.getItem("sessionId") + "defaultAdmin",
                JSON.stringify(result.data.userInfo.role.defaultRole)
              );
              secureLocalStorage.setItem(
                sessionStorage.getItem("sessionId") + "userRoleId",
                result.data.userInfo.roleId
              );
              secureLocalStorage.setItem(
                sessionStorage.getItem("sessionId") +
                  "latestActivePlanExpireDate",
                new Date(
                  result.data.userInfo.role.company.Subscription[0].expireAt
                ).toDateString()
              );
              secureLocalStorage.setItem(
                sessionStorage.getItem("sessionId") + "userRole",
                result.data.userInfo.role.name
              );
              setIsGlobalOpen(true);
            }
          } else {
            toast.warning(result.data.message);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Server Down", { autoClose: 5000 });
        console.log(error);
      });
  };

  return (
    <>
      <Modal
        isOpen={isGlobalOpen}
        onClose={() => setIsGlobalOpen(false)}
        widthClass=""
      >
        <BranchAndFinyearForm setIsGlobalOpen={setIsGlobalOpen} />
      </Modal>

      <div className="flex justify-center items-center bg-transparent flex-col h-screen relative perspective-1000">
        <img
          className="absolute w-full h-full object-cover"
          src="https://t4.ftcdn.net/jpg/06/32/63/01/360_F_632630156_8zKtJvbvqqT7JENj6iBoKePuMi71fVOs.jpg"
          alt="Background"
        />
        <div className="relative w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center">
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="absolute top-4 right-4">
                <a href="https://pinnaclesystems.co.in/">
                  <img src={logo} alt="Logo" className="w-42 h-20 rounded-lg" />
                </a>
              </div>

              <div className="relative w-full max-w-sm p-6 bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-lg flex flex-col items-center transform transition-transform duration-500 hover:rotate-y-6 hover:rotate-x-6">
                <img
                  src={top}
                  alt="Top"
                  className="absolute -top-24 pb-3 w-32 h-32 object-cover"
                />

                <form onSubmit={loginUser} className="space-y-4 mt-12">
                  <div>
                    <label
                      className="block text-black text-md font-bold mb-2"
                      htmlFor="username"
                    >
                      Username
                    </label>
                    <input
                      onChange={(e) => setUsername(e.target.value)}
                      value={username}
                      className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                      id="username"
                      type="text"
                      placeholder="Username"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-black text-md font-bold mb-2"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                      id="password"
                      type="password"
                      placeholder="******************"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-blue-500 rounded hover:bg-blue-600 group transform transition-transform duration-500 hover:rotate-12">
                      <span className="absolute inset-0 w-full h-full transition duration-300 ease-in-out bg-blue-600 opacity-0 group-hover:opacity-100"></span>
                      <span className="relative text-white">Login</span>
                    </button>
                    <p className="inline-block align-baseline font-bold text-sm text-sky-800 hover:text-gray-700 cursor-pointer">
                      Forgot Password?
                    </p>
                  </div>
                  <p className="mt-6 text-center text-sky-800 text-xs">
                    &copy;2024 Pinnacle Software Solutions. All rights reserved.
                  </p>
                </form> 
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
