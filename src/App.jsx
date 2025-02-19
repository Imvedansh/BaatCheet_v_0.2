import Chat from "./component/chat/Chat"
import List from "./component/list/List"
import Detail from "./component/detail/Detail"
import Login from "./component/login/Login"
import Notification from "./component/notification/Notification"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/firebase"
import { useUserStore } from "./lib/userStore"
import { useChatStore } from "./lib/chatStore"



const App = () => {


  const { currentUser, isloading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {

    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user?.uid);
      }
      else { fetchUserInfo(null); }
    });

    return () => {
      unSub();
    };

  }, [fetchUserInfo]);

  console.log(currentUser)

  if (isloading) return <div className="Loading">Loading.....</div>

  return (
    <div className='Container'>
      {
        currentUser ? (
          <>
            <List />
            {chatId && <Chat />}
            {chatId && <Detail />}
          </>
        ) : (<Login />)
      }
      <Notification />
    </div>

  )
}

export default App;