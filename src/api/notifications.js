export const getNotifications = (setToken, setNotifications) => {
  return fetch('http://localhost:3000/api/v1/users/notifications', {
    method: 'get',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  .then((response) => {
    if(!response.ok) {
      document.cookie = 'access_token= ; max-age=0'
      sessionStorage.clear()
      setToken()
    }
    return response.json()})
  .then((data) => {
    setNotifications(data)
    // setStale(prevState => !prevState)
    return
  })
  .catch((error) => {
    console.log(error)
  })
}

export const readAllNotifications = (notifications=[], setToken) => {
  if(notifications.length === 0) return
  return fetch('http://localhost:3000/api/v1/users/notifications/read', {
    method: 'post',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(notifications)
  })
  .then((response) => {
    if(!response.ok) {
      document.cookie = 'access_token= ; max-age=0'
      sessionStorage.clear()
      setToken()
    }
    return response.json()})
  .then((data) => {
    console.log(data)
    return
  })
  .catch((error) => {
    console.log(error)
  })
}

export const deleteNotification = (id, setToken, setNotifications) => {
  return fetch(`http://localhost:3000/api/v1/users/notifications/${id}`, {
    method: 'delete',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  .then((response) => {
    if(!response.ok) {
      document.cookie = 'access_token= ; max-age=0'
      sessionStorage.clear()
      setToken()
    }
    return response.json()})
  .then((data) => {
    console.log(data)
    getNotifications(setToken, setNotifications)
    return
  })
  .catch((error) => {
    console.log(error)
  })
}