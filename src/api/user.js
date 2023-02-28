export const login = (loginCredentials, setToken, navigate) => {
  fetch('http://localhost:3000/api/v1/users/login', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true'
    },
    credentials: 'include',
    body: loginCredentials
  })
  .then(res => res.json())
  .then(data => { 
    if(data) {
      sessionStorage.setItem('user', JSON.stringify(data))
      setToken()
      navigate('/')
    } 
  })
  .catch((err) => {
    console.error("Error:", err.message)
    return err
  })
}

export const profile = (id, setToken) => {
  return fetch(`http://localhost:3000/api/v1/posts/profile/${id}`, {
    method: 'get',
    mode: 'cors',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  })
  .then(response => {
    if(!response.ok) {
      document.cookie = 'access_token= ; max-age=0'
      sessionStorage.clear()
      setToken()
      return
    }
    else return response.json()
  })
  .then(data => {
    return data
  })
  .catch((error) => {
    console.log(error)
  })
}