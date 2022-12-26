import mongoose, { Schema } from "mongoose";

// /******* User Schema *******/
// const UserSchema = new Schema({
//     name: {
//         type: String, 
//         required: [true, 'Name field is required.'],
//     },
//     chatBoxes: [
//         {
//             type: mongoose.Types.ObjectId,
//             ref: "ChatBox",
//         }
//     ]
// });

// const UserModel = mongoose.model('User', UserSchema);

// /******* Message Schema *******/
// const MessageSchema = new Schema({
//     chatBox: {
//         type: mongoose.Types.ObjectId,
//         ref: "ChatBox",
//     },
//     sender: {
//         type: mongoose.Types.ObjectId,
//         ref: "User",
//     },
//     body: {
//         type: String,
//         required: [true, "Body field is required."],
//     }
// })

// const MessageModel = mongoose.model('Message', MessageSchema);

// /******* ChatBox Schema *******/
// const ChatBoxSchema = new Schema({
//     name: {
//         type: String,
//         required: [true, 'Name field is required.'],
//     },
//     users: [
//         { 
//             type: mongoose.Types.ObjectId, 
//             ref: 'User' 
//         }
//     ],
//     messages: [
//         {
//             type: mongoose.Types.ObjectId, 
//             ref: 'Message' 
//         }
//     ],
// })

const ChatBoxSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Name field is required.'],
    },

    messages: [
        {
            sender: {
                type: String,
                required: [true, 'Sender field is required.'],
            },
            body: {
                type: String,
                // required: [true, 'Body field is required.'],
            }
        }
    ],
})

const ChatBoxModel = mongoose.model('ChatBox', ChatBoxSchema);

// export { UserModel, MessageModel, ChatBoxModel }; // 輸出多個就使用 export {...}
export { ChatBoxModel }; // 輸出多個就使用 export {...}


