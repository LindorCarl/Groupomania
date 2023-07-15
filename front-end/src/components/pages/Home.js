import { useState } from "react";
import MainHeader from "../Layout/MainHeader"
import Post from "../feed/Post";
import PostDisplay from "../feed/PostDisplay";

const Home = () => {

    const[message, setMessage] = useState(null);

    const onUpdate = (message) => {
        const messageUpdate = message;
        setMessage(messageUpdate);
    }

    return (
        <>
            <MainHeader />
            <Post onUpdate={onUpdate} />
            <PostDisplay onUpdate={message}/>
        </>
    )
}

export default Home;
