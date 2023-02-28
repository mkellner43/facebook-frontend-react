export const getPosts = () => {
  return fetch('http://localhost:3000/api/v1/posts', {
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
      return
    }
    else return response.json()
  })
  .then(data => {
    if(data.length > 0){
      return data
    }
  })
  .catch((error) => {
    console.log(error)
    return error
  })
}

export const sendPost = (object, setToken) => {
  return fetch('http://localhost:3000/api/v1/posts', {
    method: 'post',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(object)
  })
  .then((response) => {
    if(!response.ok) {
      document.cookie = 'access_token= ; max-age=0'
      sessionStorage.clear()
      setToken()
    }
    return response.json()})
  .then((data) => {
    return data
  })
  .catch((error) => {
    console.log(error)
  })
}

export const deletePost = (object, setToken, setStale) => {
  return fetch(`http://localhost:3000/api/v1/posts/${object._id}`, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
  })
    .then(res => {
      if(!res.ok) {
        document.cookie = 'access_token= ; max-age=0'
        sessionStorage.clear()
        setToken()
      } 
      else {
        setStale(prevState => !prevState)
        return res.json()
      }
    })
    .catch(err => {
      console.error(err)
    })
}

export const postLike = (object, setToken) => {
  return fetch(`http://localhost:3000/api/v1/posts/like/${object._id}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
  })
  .then(res => {
    if(!res.ok) {
      document.cookie = 'access_token= ; max-age=0'
      sessionStorage.clear()
      setToken()
    } 
    else return res.json()
  })
  .catch(err => {
    console.error(err)
  })
};

export const postComment = (object, setToken, setStale, comment) => {
  return fetch(`http://localhost:3000/api/v1/comments/${object._id}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({comment_body: comment})
  })
    .then(res => {
      if(!res.ok) {
        document.cookie = 'access_token= ; max-age=0'
        sessionStorage.clear()
        setToken()
      } 
      else {
        setStale(prevState => !prevState)
        return res.json()
      }
    })
    .catch(err => {
      console.error(err)
    })
}

