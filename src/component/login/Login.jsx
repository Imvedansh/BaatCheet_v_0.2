import React from 'react'
import './Login.css'
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../lib/firebase'
import { doc, setDoc } from "firebase/firestore";
import upload from '../../lib/upload'


const Login = () => {
    const [avatar, setAvatar] = React.useState(
        {
            file: null,
            url: ""
        });

    const [loading, setLoading] = React.useState(false)

    const handleAvatar = (e) => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target)

        const { username, email, password } = Object.fromEntries(formData);


        try {

            const res = await createUserWithEmailAndPassword(auth, email, password)

            const imgURL = await upload(avatar.file)




            await setDoc(doc(db, "users", res.user.uid), {
                username,
                avatar: imgURL,
                email,
                id: res.user.uid,
                blocked: [],
            });

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: [],
            });

            toast.success("User created successfully, Login now!!")
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
        finally {
            setLoading(false);
        }
    }
    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.target)

        const { email, password } = Object.fromEntries(formData);


        try {
            await signInWithEmailAndPassword(auth, email, password);

        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }
        finally {
            setLoading(false);
        }
    };


    return (
        <div className='Login'>
            <div className="Item">
                <h2>Welcome,back </h2>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder='Email enter here' name="email" id="email" />
                    <input type="password" name="password" placeholder='Enter passcode here' id="password " />
                    <button disabled={loading}>{loading ? "loading" : "Sign In "}</button>
                </form>
            </div>
            <div className="Separator"></div>
            <div className="Item">

                <h2> Create an Account</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={avatar.url || "./avatar.png"} alt="" />
                        Upload an Image</label>
                    <input type="file" name="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
                    <input type="text" placeholder='Enter your name' name="username" id="username" />
                    <input type="email" placeholder='Email enter here' name="email" id="email" />
                    <input type="password" name="password" placeholder='Enter passcode here' id="password" />
                    <button disabled={loading}>{loading ? "loading" : "Sign Up"}</button>
                </form>
            </div>
        </div>
    )
}

export default Login