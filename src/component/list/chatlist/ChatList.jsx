import React, { useEffect, useState } from "react";
import "./ChatList.css";
import AddUser from "./adduser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

const ChatList = () => {
    const [Addmode, setAddmode] = useState(false);
    const [chats, setChats] = useState([]);
    const [input, setInput] = useState("");

    const { currentUser } = useUserStore();
    const { changeChat, chatId } = useChatStore();
    console.log(chatId);

    useEffect(() => {
        if (!currentUser?.id) return;

        const unSub = onSnapshot(
            doc(db, "userchats", currentUser.id),
            async (res) => {
                const data = res.data();
                if (!data || !data.chats) return;

                const items = data.chats;

                const promises = items.map(async (item) => {
                    try {
                        const userDocRef = doc(db, "users", item.receiverId);
                        const userDocSnap = await getDoc(userDocRef);
                        const user = userDocSnap.data();
                        return { ...item, user };
                    } catch (error) {
                        console.error("Error fetching user data:", error);
                        return null;
                    }
                });

                const chatData = await Promise.all(promises);
                const validChatData = chatData.filter(chat => chat !== null);

                const chatsWithIsSeen = validChatData.map(chat => ({
                    ...chat,
                    isSeen: chat.isSeen || false
                }));

                setChats(chatsWithIsSeen.sort((a, b) => b.updatedAt - a.updatedAt));
            }
        );

        return () => {
            unSub();
        };
    }, [currentUser?.id]);

    const handleSelect = async (chat) => {
        if (!chat) return;

        const userChats = chats.map((item) => {
            const { user, ...rest } = item;
            return rest;
        });

        const chatIndex = userChats.findIndex(
            (item) => item.chatId === chat.chatId
        );

        if (chatIndex === -1) return;

        userChats[chatIndex].isSeen = true;

        const userChatsRef = doc(db, "userchats", currentUser.id);

        try {
            await updateDoc(userChatsRef, {
                chats: userChats,
            });
            changeChat(chat.chatId, chat.user);
        } catch (err) {
            console.error("Error updating chat data:", err);
        }
    };

    const filteredChats = chats.filter((c) =>
        c?.user?.username?.toLowerCase()?.includes(input.toLowerCase())
    );

    return (
        <div className="ChatList">
            <div className="Search">
                <div className="SearchBar">
                    <img src="./search.png" alt="" />
                    <input
                        type="text"
                        placeholder="search here"
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
                <img
                    src={Addmode ? "./minus.png" : "./plus.png"}
                    alt=""
                    className="Add"
                    onClick={() => setAddmode((prev) => !prev)}
                />
            </div>
            {filteredChats.map((chat) => (
                <div
                    className="Item"
                    key={chat.chatId}
                    onClick={() => handleSelect(chat)}
                    style={{
                        backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
                        cursor: "pointer" // Make it clear it's clickable
                    }}
                >
                    <img src={
                        chat.user.blocked.includes(currentUser.id) ?
                            "./avatar.png" :

                            chat?.user?.avatar} alt="" />
                    <div className="Texts">
                        <span>{chat.user.blocked.includes(currentUser.id) ?
                            "Blocked User" :
                            chat?.user?.username}</span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}

            {Addmode && <AddUser />}
        </div>
    );
};

export default ChatList;