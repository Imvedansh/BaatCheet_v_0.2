import React from 'react'
import "./List.css"
import UserInfo from './userInfo/UserInfo'
import ChatList from './chatlist/ChatList'

const List = () => {
  return (
    <div className='List'>
      <UserInfo />
      <ChatList />
    </div>
  )
}

export default List