import { useState } from "react";

const useToken = () => {
  
  const getToken = () => {
    const token = document.cookie.split('=')[1]
    if(token) return token
  }
  
  const [token, setToken] = useState(getToken());
  const saveToken = () => {
    setToken(getToken())
  }

  return {
    setToken: saveToken,
    token
  }
}

export default useToken;