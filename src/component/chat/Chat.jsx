import React, { useEffect, useState, useRef } from "react";
import "./Chat.css";
import EmojiPicker from "emoji-picker-react";
import { onSnapshot, doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";




const Chat = () => {
  const [open, setOpen] = useState();
  const [chat, setChat] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const { currentUser } = useUserStore();

  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    }
  }, [chatId]);



  console.log(chat);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };
  console.log(text);


  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      })
    }
  }


  const handleSend = async () => {
    if (text === "") return;

    let imgURL = null

    try {

      if (img.file) {
        imgURL = await upload(img.file)
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createAt: Date.now(),
          ...(imgURL && { img: imgURL }),

        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        ċ
      });




    } catch (err) {
      console.log(err);
    }

    setImg({
      file: null,
      url: ""
    })

    setText("");
  };

  return (
    <div className="Chat">
      <div className="Top">
        <div className="User">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="Texts">
            <span>{user?.username}</span>
            <p>hello ji</p>
          </div>
        </div>
        <div className="Icons">
          <img src="phone.png" alt="" />
          <img src=" ./video.png" alt="" />
          <img src="info.png" alt="" />
        </div>
      </div>


      <div className="Center">
        {chat?.messages?.map(message => (
          <div className={message.senderId === currentUser?.id ? "Message Own" : "Message"} key={message?.createAt}>

            <div className="Texts">
              {message.img && <img src={message.img} alt="" />}
              <p>{message.text}</p>
              {/* <span>1 Min Ago</span>  persistent error */}
            </div>
          </div>))}
        {img.url && (
          <div className="Message Own">
            <div className="Texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>


      <div className="Bottom">
        <div className="Icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" /></label>
          <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}

        />
        <div className="Emoji">
          <img
            src="emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="Picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="Send_Btn" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
      </div>
    </div>
  );
};

export default Chat;

