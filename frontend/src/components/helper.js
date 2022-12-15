import Axios from "axios";
import { logout, tokenName } from "./authController";
import { ME_URL } from "./utils/urls";

export const LastUserChat = "lastUserChat";


export const axiosHandler = ({
    method = "",
    url = "",
    token = null,
    data = {},
    extra = null,
  }) => {
    let methodType = method.toUpperCase();
    if (
      ["GET", "POST", "PATCH", "PUT", "DELETE"].includes(methodType) ||
      {}.toString(data) !== "[object Object]"
    ) {
      let axiosProps = { method: methodType, url, data };
  
      if (token) {
        axiosProps.headers = { Authorization: `Token ${token}` };
      }
      if (extra) {
        axiosProps.headers = { ...axiosProps.headers, ...extra };
      }
      return Axios(axiosProps);
    } else {
      alert(`method ${methodType} is not accepted or data is not an object`);
    }
  };

  export const getToken = async (props) => {
    let token = localStorage.getItem(tokenName);
    if (!token) logout(props);
    token = JSON.parse(token);
    const userProfile = await axiosHandler({
      method: "get",
      url: ME_URL,
      token: token.access,
    }).catch((e) => null);
    if (userProfile) {
      return token.access;
    } else {
      console.log("error");
    }
  };