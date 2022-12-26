const ChatBox = {
    // name: 交由 default resolver 處理
    messages: (parent) => (parent.messages),
}

export default ChatBox;