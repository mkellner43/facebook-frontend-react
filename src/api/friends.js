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
    setPending(data)
  })
  .catch((error) => {
    console.log(error)
  })
}

export const sendFriendRequest = (id, currentUserID, setToken, setPending, setSuggestions, socket=false) => {
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
      return
    }
    else return response.json()
  })
  .then(data => {
    console.log(data)
    setPending(prevState => [data, ...prevState])
    setSuggestions(prevState => prevState.filter(friend => friend._id !== id))
    socket.emit('sendNotification', {senderID: currentUserID, receiverID: id, type: 'Friend Request'})
  })
  .catch((error) => {
    console.log(error)
  })
}

export const acceptFriend = (id, setToken, setPending, setFriends) => {
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
      return
    }
    else return response.json()
  })
  .then(data => {
    setPending(prevState => prevState.filter(friend => friend.request_id !== id))
    setFriends(prevState => [data, ...prevState])
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
      return
    }
    else return response.json()
  })
  .then(data => {
    setPending(prevState => prevState.filter(friend => friend.request_id !== id))
    getSuggestions(setToken, setSuggestions)
    return 
  }
  )
  .catch((error) => {
    console.log(error)
  })

}

//friending seems to work well. You're dope and kick ass daily. Keep at it. Work on notifications! This may need socket io to work nicely. Learn socket IO and TanStack Query.