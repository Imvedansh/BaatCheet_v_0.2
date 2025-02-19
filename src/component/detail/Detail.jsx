import React, { useState } from 'react'
import "./Detail.css"
import { auth, db } from '../../lib/firebase'
import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore'
import { useChatStore } from '../../lib/chatStore'
import { useUserStore } from '../../lib/userStore'



const Detail = () => {

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();

  const { currentUser } = useUserStore();
  const handleBlock = async () => {
    if (!user) return;


    const userDocRef = doc(db, 'users', currentUser.id)
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
      });
      changeBlock();

    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className='Detail'>
      <div className="User">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit amet</p>
      </div>
      <div className="Info">
        <div className="Option">
          <div className="Title">
            <span>Chat settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <div className="Option">
          <div className="Title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <div className="Option">
          <div className="Title">
            <span>Shared Photo</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="Photos">
            <div className="PhotoItem">
              <div className="PhotoDetail">
                <img src="phone.png" alt="" />
                <span>Photo Item of photo container </span>
              </div>
              <img src="download.png" alt="" className='Icons' />
            </div>

            <div className="PhotoItem">
              <div className="PhotoDetail">
                <img src="phone.png" alt="" />
                <span>Photo Item of photo container </span>
              </div>
              <img src="download.png" alt="" className='Icons' />
            </div>

            <div className="PhotoItem">
              <div className="PhotoDetail">
                <img src="phone.png" alt="" />
                <span>Photo Item of photo container </span>
              </div>
              <img src="download.png" alt="" className='Icons' />
            </div>

            <div className="PhotoItem">
              <div className="PhotoDetail">
                <img src="phone.png" alt="" />
                <span>Photo Item of photo container </span>
              </div>
              <img src="download.png" alt="" className='Icons' />
            </div>
          </div>
        </div>

        <div className="Option">
          <div className="Title">
            <span>Shared files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>{
          isCurrentUserBlocked ? "You are Blocked" : isReceiverBlocked ? "User blocked" : "Block user"
        }
        </button>
        <button className='Logout' onClick={() => auth.signOut()}>Logout</button>


      </div>
    </div>
  )
}

export default Detail