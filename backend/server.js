const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

dotenv.config();

const app = express();
connectDB();

app.use(express.json()); // to accept the json data

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// -----------------------Deployment-----------------------//

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname1, "/frontend/build")));

//     app.get("*", (req, res) =>
//         res.sendFile(
//             path.resolve(__dirname1, "frontend", "build", "index.html")
//         )
//     );
// } else {
//     app.get("/", (req, res) => {
//         res.send("API is running..");
//     });
// }

// -----------------------Deployment-----------------------//

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4142;
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

const io = require("socket.io")(server, {
    pingTimeOut: 60000,
    cors: {
        // origin: "http://localhost:3000",
        origin: "https://alsotalkative.vercel.app",
    },
});

io.on("connection", (socket) => {
    // console.log("connected to socket.io");

    socket.on("setup", (userData) => {
        // console.log(userData._id);
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        // console.log("User joined Room : " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;
        if (!chat.users) return console.log("chat.users not defined");
        chat.users.forEach((user) => {
            if (user._id !== newMessageRecieved.sender._id) {
                socket
                    .in(user._id)
                    .emit("message recieved", newMessageRecieved);
            }
        });
    });

    // socket.off("setup", () => {
    // 	console.log("User Disconnected");
    // 	socket.leave(userData._id);
    // });

    socket.on("disconnect", function () {
        // console.log("user disconnected");
    });
});
