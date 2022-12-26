import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Button, Input, Tag, Tabs } from 'antd';
import Title from "../Components/Title"
import Message from "../Components/Message";
import ChatModal from "../Components/ChatModal";
import { useChat } from "../Hooks/useChat";
import { CHATBOX_QUERY } from "../graphql/queries";
import { CREATE_CHATBOX_MUTATION, CREATE_MESSAGE_MUTATION } from "../graphql/mutations";
import { MESSAGE_SUBSCRIPTION } from "../graphql/subscriptions";
import { ApolloError, useMutation, useQuery } from "@apollo/client";

const Chatroom = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 500px;
    margin: auto;
`

const ChatBoxesWrapper = styled.div`
    width: 100%;
    height: 300px;
    background: #eeeeee52;
    border-radius: 10px;
    margin: 20px;
    padding: 20px;
    overflow: auto; 
`;

const FootRef = styled.div`
    height: 20px;
`

// Define WebSocket client side 
// const client = new WebSocket('ws://localhost:4000');

const ChatRoom = () => {

    // States
    const {status, me, friend, messages, currentBoxName, setStatus, setFriend, setMessages, setCurrentBoxName, clearMessages, displayStatus} = useChat();
    // const [username, setUsername] = useState('');
    const [body, setBody] = useState('');  // text body
    const bodyRef = useRef(null);
    // New States
    const [msgSent, setMsgSent] = useState(false);
    const [chatBoxes, setChatBoxes] = useState([]);
    const [activeKey, setActiveKey] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    // Show Messages in the chatbox
    // ***
    const displayMessages = (Chat) => { // [{name, body}, {}, ..., {}]
        return(
            (Chat.length === 0 ? 
            ([<p style={{ color: '#ccc' }}>No messages...</p>]) :
            ((Chat.map(({sender, body}, i) => (
                <Message isMe={me === sender} message={body} />)))
            )
            )
        );
    }

    const renderChat = (chat) => {
        return(displayMessages(chat));
    }

    const extractChat = (friend) => {
        console.log('Extract Messages:', messages);
        return renderChat(
            messages.filter((item) => ((item?.sender === friend) || (item?.sender === me)))
        );
    } 

    // Refs
    const msgFooter = useRef(null);

    const InitChatBox = (chatBoxName) => {
        const currentChatBox = chatBoxes.find(({key}) => key === activeKey);
        if(currentChatBox){

            console.log('Successfully find chatbox', currentChatBox);
    
            currentChatBox.children = [
                // ...renderChat(messages.filter(({name}) => (name === chatBoxName))),
                ...renderChat(messages), 
                <FootRef ref={msgFooter}></FootRef>
            ]
        }
    }

    // Scroll to bottom.
    const scrollToBottom = () => {
        msgFooter.current?.scrollIntoView({ behavior: 'smooth', block: "start" });
        console.log("Scroll!", msgFooter.current)
    }

    // GraphQL
    const { data, loading, subscribeToMore } 
    = useQuery(CHATBOX_QUERY, {variables: {name1: me, name2: friend}});
    console.log("Me & Friend:", me,friend);
    console.log("data from query:", data);
    // const error = ApolloError;
    // console.log(error);
    // if(data?.chatbox){
    //     setMessages(data.chatbox.messages);
    // }
    
    const [startChat] = useMutation(CREATE_CHATBOX_MUTATION);
    const [sendMessage] = useMutation(CREATE_MESSAGE_MUTATION);

    useEffect(() => {
        try{
            console.log("Try subcribe");
            subscribeToMore({
                document: MESSAGE_SUBSCRIPTION,
                variables: {from: me, to: friend},
                updateQuery: (prev, {subscriptionData}) => {
                    if(!subscriptionData){
                        console.log("Subscription failed");
                        return prev;
                    }
                    console.log("Sub Data!", subscriptionData);
                    // subscriptionData.data 在 mutation 的 publish 裡頭自行定義。
                    const newMessage = subscriptionData.data.message;
                    console.log("newMessage: ", newMessage)
                    return {
                        chatbox:{
                            // name:[me, friend].sort().join('_'),
                            name: prev.chatbox.name,
                            messages: [...prev.chatbox.messages, newMessage],
                        }
                    };
                },
                onError: err => console.log(err),
            });
        }catch(e){console.log("Error:", e)};
        
    }, [subscribeToMore, me, friend]);
    
    // if(loading){
    //     displayStatus({
    //         type: 'success',
    //         msg: 'Receive messages.'
    //     })
    // }
    
    if(data?.chatbox){
        setMessages(data.chatbox.messages);
        InitChatBox(currentBoxName);
        scrollToBottom();
    }

    // useEffect(() => {
    //     if(true){
    //         InitChatBox(currentBoxName);
    //     }
    // }, [messages]);


    
    // Functions
    
    // useEffect(() => {
    //     scrollToBottom();
    //     setMsgSent(false);
    // }, [msgSent]);


    // Tabs: addition and deletion
    const removeChatBox = (targetKey) => {
        const index = chatBoxes.findIndex(({key}) => key === activeKey);
        const newChatBoxes = chatBoxes.filter(({key}) => key !== targetKey);
        setChatBoxes(newChatBoxes);
        return(
            activeKey ?
                activeKey === targetKey ?
                    index === 0 ?
                        " " : chatBoxes[index - 1].key
                : activeKey
            : ""        
        )
    }
    // Create a chat box.
    const createChatBox = (friend) => {
        if(chatBoxes.some(({key}) => key === friend)){
            throw new Error(friend + " 's chat box has already opened.");
        }
        // 提取與該朋友的聊天記錄
        const chat = extractChat(friend);
        setChatBoxes([
            ...chatBoxes,
            {
                label: friend,
                // children: [chat, <FootRef ref={msgFooter}></FootRef>],
                children: chat,
                key: friend,
            }
        ])
        setMsgSent(true); // -> trigger scrollToBottom()
        return friend;
    }

    // WebSocket
    // const client = new WebSocket('ws://localhost:4000');
    // client.onopen = () => {
    //     console.log("WebSocket client side is connected.")
    // }
    // const sendData = async(data) => {
    //     await client.send(JSON.stringify(data));
    // }
    // client.onmessage = (byteString) => {
    //     const {data} = byteString; // 拿出資料裡面的data屬性。
    //     const [task, payload, chatBoxName] = JSON.parse(data); // ['', {}]
    //     // switch(task){
    //     //     case "Init":{
    //     //         setTimeout(() => {
    //     //             setMessages(payload);
    //     //         },100);
    //     //         setCurrentBoxName(chatBoxNa
    //     //             me);
    //     //         // InitChatBox(chatBoxName);
    //     //         console.log('Init payload:', payload);
    //     //         break;
    //     //     }

    //     //     case 'backToReceiver':{
    //     //         console.log('Receiver\'s Message  Content: ', payload);
    //     //         setMessages([...messages, payload]);
    //     //         setMsgSent(true);
    //     //         console.log(messages);
    //     //         break;
    //     //     }

    //     //     case "cleared":{
    //     //         setMessages([]);
    //     //         break;
    //     //     }
    //     //     case "status":{
    //     //         setStatus(payload);
    //     //         break;
    //     //     }
    //     //     default: break;    
    //     // }
    // }



    return(
        <Chatroom>
            <Title name={me}>
                <Button type="primary" danger onClick={clearMessages}>
                    Clear
                </Button>
            </Title>
            <ChatBoxesWrapper>
                <Tabs
                    type="editable-card"
                    onChange={async (key) => {
                        setActiveKey(key);
                        setFriend(key);
                        await startChat({variables: { name1: me, name2: key }}); // {name, friend}
                        // setMsgSent(true);
                    }}
                    onEdit={(targetKey, action) => {
                        if (action === 'add') {
                            setModalOpen(true);
                        }
                        else if (action === 'remove') {
                            setActiveKey(removeChatBox(targetKey, activeKey));
                        }
                    }}
                    items={chatBoxes} // Messages Content
                    >
                    {/* {displayMessages()} */}
                    {/* <FootRef ref={msgFooter}></FootRef> */}
                </Tabs>
            </ChatBoxesWrapper>
            <ChatModal
                open={modalOpen}
                onCreate={async({ name }) => {
                    // 按下 Create 後的動作
                    setFriend(name);
                    setActiveKey(createChatBox(name)); // create new Tab and return friend's name as ActiveKey
                    // extractChat(name);
                    await startChat( { variables: { name1: me, name2: name } } ); // Notice backend: {name, friend}
                    setModalOpen(false);
                }}
                onCancel={() => { setModalOpen(false);}}
            />
            {/* <Input
                placeholder="Username"
                style={{ marginBottom: 10 }}
                value={username}
                onChange={(e) => {setUsername(e.target.value)}}
                onKeyDown={(e) => {
                    if(e.key === 'Enter'){bodyRef.current.focus();}
                }}
            ></Input> */}
            <Input.Search
                ref={bodyRef}
                enterButton="Send"
                placeholder="Type a message here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onSearch={(msg) => {
                    // Make sure is not empty
                    if(!msg){
                        displayStatus({
                            type: 'error',
                            msg: 'Please enter a username and a message body.'
                        })
                        return;
                    }
                    sendMessage({ variables: {name: me, to: activeKey, body: msg} }); // {name, to, body}
                    setMsgSent(true);
                    setBody(''); // 清空Body內容
                    
                }}
            ></Input.Search>
        </Chatroom>
    )
}

// export default ChatRoom;
export { ChatRoom }