import React, { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = React.createContext()

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({id, children}) {
  const [socket, setSocket] = useState()
  
  
  // useEffect(() => {
  //   const currentUser = JSON.parse(sessionStorage.getItem('user'))
  //   const newSocket = io('http://localhost:3000',
  //    { query: {id},
  //      auth: {
  //       sessionID: currentUser.token,
  //       userID: currentUser.id,
  //       username: currentUser.username
  //     }
  //   })
  //    setSocket(newSocket)
  // }, [id])

  //get socket io to work properly and set custom ID to user ID

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}