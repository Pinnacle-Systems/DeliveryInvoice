import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PRODUCT_ADMIN_HOME_PATH } from "../../../Route/urlPaths";
import { LOGIN_API } from "../../../Api";
import Loader from "../../components/Loader";
import { generateSessionId } from "../../../Utils/helper";
import secureLocalStorage from "react-secure-storage";
import Modal from "../../../UiComponents/Modal";
import { BranchAndFinyearForm } from "../../components";
const BASE_URL = process.env.REACT_APP_SERVER_URL;

const Login = () => {
  const [isGlobalOpen, setIsGlobalOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [planExpirationDate, setPlanExpirationDate] = useState("");
  const navigate = useNavigate();

  const data = { username, password };

  const loginUser = (e) => {
    e.preventDefault();
    axios({
      method: "post",
      url: BASE_URL + LOGIN_API,
      data: data,
    }).then(
      (result) => {
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
              const currentPlanActive =
                result.data.userInfo.role.company.Subscription.some(
                  (sub) => sub.planStatus
                );
              if (currentPlanActive) {
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
              } else {
                const expireDate = new Date(
                  result.data.userInfo.role.company.Subscription[0].expireAt
                );
                setPlanExpirationDate(expireDate.toDateString());
              }
            }
          } else {
            toast.warning(result.data.message);
            setLoading(false);
          }
        }
        console.log("result", result.data.data);
      },
      (error) => {
        console.log(error);
        toast.error("Server Down", { autoClose: 5000 });
        setLoading(false);
      }
    );
  };

  return (
    <>
      <Modal
        isOpen={isGlobalOpen}
        onClose={() => {
          setIsGlobalOpen(false);
        }}
        widthClass={""}
      >
        <BranchAndFinyearForm setIsGlobalOpen={setIsGlobalOpen} />
      </Modal>

      <div className="flex justify-start items-center bg-gray-200 flex-col h-screen">
        <img className="absolute w-full h-full" src="https://static.vecteezy.com/system/resources/previews/033/648/498/non_2x/perspective-view-of-customer-shopping-consumer-good-on-shelves-between-corridor-with-clear-light-in-convenience-supermarket-and-minimart-photo.jpg" />
        <div className="relative w-full h-full">
          <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
            {loading ? (
              <Loader />
            ) : (
              <>
                <div className="relative w-full max-w-xs">
                  <div
                    className={
                      planExpirationDate ? "text-center" : "text-center hidden"
                    }
                  >
                    <p className="bg-red-500 text-black">
                      {" "}
                      Your Subscription Plan has been Expired on{" "}
                      {planExpirationDate}
                    </p>
                    <p className="bg-blue-500 text-black">
                      {" "}
                      Contact Email for Subscription: admin@pinnacle.com{" "}
                    </p>
                  </div>
                  <form
                    className="bg-gray-200 rounded p-6 mb-4"
                    onSubmit={loginUser}
                  >
                    <div className="mb-4">
                      <label
                        className="block text-blue-500 text-md font-bold mb-2"
                        htmfor="username"
                      >
                        Username
                      </label>
                      <input
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        className="shadow bg-white appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        type="text"
                        placeholder="Username"
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-blue-500 text-md font-bold mb-2"
                        htmfor="password"
                      >
                        Password
                      </label>
                      <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className="shadow bg-white appearance-none border rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="******************"
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                      >
                        Sign In
                      </button>
                      <p className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-gray-700 ">
                        Forgot Password?
                      </p>
                    </div>
                    <p className="mt-6 text-center text-blue-500 text-xs">
                      &copy;{new Date().getFullYear()} Pinnale Systems All rights reserved.
                    </p>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
