export const getFriends = (setToken) => {
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
    return data
  })
  .catch((error) => {
    console.log(error)
  })
};

export const getSuggestions = (setToken) => {
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
    return data
  })
  .catch((error) => {
    console.log(error)
  })
}

export const getPendingRequests = (setToken) => {
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
    return data
  })
  .catch((error) => {
    console.log(error)
  })
}

export const sendFriendRequest = (id, currentUserID, setToken, socket=false) => {
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
    socket.emit('sendNotification', {senderID: currentUserID, receiverID: id, type: 'Friend Request'})
    return data
  })
  .catch((error) => {
    console.log(error)
  })
}

export const acceptFriend = (id, setToken) => {
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
    return data
  })
  .catch((error) => {
    console.log(error)
  })
}

export const declineFriend = (id, setToken) => {
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
    return data
  }
  )
  .catch((error) => {
    console.log(error)
  })
}