export const sendMessage = (message, to_id, setToken) => {
  const formatedMessage = JSON.stringify({message: message, to_id: to_id})
  return fetch(`http://localhost:3000/api/v1/messages`, {
    method: 'post',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: formatedMessage,
    credentials: 'include'
  })
  .then((response) => {
    if(!response.ok) {
      document.cookie = 'access_token= ; max-age=0'
      sessionStorage.clear()
      return
    }
    else return response.json()
  })
  .then(data => {
    return data
  })
  .catch((error) => {
    console.log(error)
    return error
  })
}

export const getMessages = (setToken) => {
  return fetch('http://localhost:3000/api/v1/messages', {
    method: 'get',
    mode: 'cors',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  })
  .then((response) => {
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
    return error
  })
}

export const getThread = (friend_id, setToken) => {
  return fetch(`http://localhost:3000/api/v1/messages/${friend_id}`, {
    method: 'get',
    mode: 'cors',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  })
  .then((response) => {
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
    return error
  })
}