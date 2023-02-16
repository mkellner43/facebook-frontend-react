export const getFriends = (setToken, setFriends) => {
  return fetch('http://localhost:3000/api/v1/friend_requests/friends', {
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
    console.log(data)
    setFriends(data)
  })
  .catch((error) => {
    console.log(error)
  })
};

export const getSuggestions = (setToken, setSuggestions) => {
  return fetch('http://localhost:3000/api/v1/friend_requests/suggestions', {
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
    console.log(data)
    setSuggestions(data)
  })
  .catch((error) => {
    console.log(error)
  })
}

export const getPendingRequests = (setToken, setPending) => {
  return fetch('http://localhost:3000/api/v1/friend_requests/pending', {
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
    console.log(data)
    setPending(data)
  })
  .catch((error) => {
    console.log(error)
  })
}

export const sendFriendRequest = (id, setToken, setPending, setSuggestions) => {
  return fetch(`http://localhost:3000/api/v1/friend_requests/${id}`, {
    method: 'post',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  .then((response) => {
    if(!response.ok) {
      document.cookie = 'access_token= ; max-age=0'
      sessionStorage.clear()
      setToken()
      console.log(response)
      return
    }
    else return response.json()
  })
  .then(data => {
    console.log(data)
    setPending(prevState => [data, ...prevState])
    setSuggestions(prevState => prevState.filter(friend => friend._id !== id))
  })
  .catch((error) => {
    console.log(error)
  })
}

export const acceptFriend = (id, setToken, setPending, setSuggestions) => {
  return fetch(`http://localhost:3000/api/v1/friend_requests/accept/${id}`, {
    method: 'post',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  .then((response) => {
    if(!response.ok) {
      document.cookie = 'access_token= ; max-age=0'
      sessionStorage.clear()
      setToken()
      console.log(response)
      return
    }
    else return response.json()
  })
  .then(data => {
    console.log(data)
    setPending(prevState => prevState.filter(friend => friend._id !== id))
    setSuggestions(prevState => prevState.filter(friend => friend._id !== id))
  })
  .catch((error) => {
    console.log(error)
  })
}

export const declineFriend = (id, setToken, setPending, setSuggestions) => {
  return fetch(`http://localhost:3000/api/v1/friend_requests/${id}`, {
    method: 'delete',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  .then((response) => {
    if(!response.ok) {
      document.cookie = 'access_token= ; max-age=0'
      sessionStorage.clear()
      setToken()
      console.log(response)
      return
    }
    else return response.json()
  })
  .then(data => {
    console.log(data)
    setPending(prevState => prevState.filter(friend => friend.request_id !== id))
    getSuggestions(setToken, setSuggestions)
  })
  .catch((error) => {
    console.log(error)
  })
}