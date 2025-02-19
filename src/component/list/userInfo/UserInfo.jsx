import React from 'react'
import "./UserInfo.css"
import { useUserStore } from '../../../lib/userStore';

const UserInfo = () => {
    const { currentUser, isloading, fetchUserInfo } = useUserStore();
    return (
        <div className='UserInfo'>
            <div className="User">
                <img src={currentUser.avatar || "./avatar.png"} alt="" />
                <h4>{currentUser.username}</h4>
            </div>
            <div className="Icons">
                <img src="./more.png" alt="" />
                <img src="./video.png" alt="" />
                <img src="/edit.png" alt="" />
            </div>
        </div>
    )
}

export default UserInfo