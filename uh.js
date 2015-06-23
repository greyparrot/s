//var app = require("express")();
//var mysql = require("mysql");

/*global console*/
//var yetify = require('yetify'),
//        config = require('getconfig'),
//        uuid = require('node-uuid'),
//        crypto = require('crypto'),
//        fs = require('fs'),
//        port = parseInt(process.env.PORT || config.server.port, 10),
        server_handler = function(req, res) {
            // res.writeHead(404);
            //res.end();
        };
        var http = require("http").Server(server_handler);
        
http.listen(8832, function () {
    console.log("QtAlk on: 8832");
});

var io = require("socket.io")(http);
var async = require("async");
        server = null;

// Create an http(s) server instance to that socket.io can listen to
//if (config.server.secure) {
//    server = require('https').Server({
//        key: fs.readFileSync(config.server.key),
//        cert: fs.readFileSync(config.server.cert),
//        passphrase: config.server.password
//    }, server_handler);
//} else {
//    server = require('http').Server(server_handler);
//}
//server.listen(8832, function() {
//    console.log("QtAlk on: 8832");
//});

//var io = require('socket.io').listen(server);

//if (config.logLevel) {
//    // https://github.com/Automattic/socket.io/wiki/Configuring-Socket.IO
//    io.set('log level', config.logLevel);
//}

var allusers = {};
var cons = [];
var allUsersId = [];
var newUserNotify = [];


//app.get("/", function (req, res) {
//    res.sendFile(__dirname + '/mainmessage.html');
//});

io.on('connection', function(socket) {
    var uid;
//    cons.push(socket);
    console.log("user connected");

    socket.on('login', function(cred) {
        mi = JSON.parse(cred);
        session_name = mi.name;
        console.log("new user id =     " + mi.name);
//        var person = {username:username,interface:socket};
        allusers[session_name] = socket;
        userList = Object.keys(allusers);
        console.log(userList);
        allUsersId = userList;
//        cons.forEach(function(user) {
////            console.log(user);
////            mySock = allusers[user];
//            newUserNotify.push(function() {
//                setTimeout(function() {
//          
//                },1000);
//
////                console.log(mySock .Properties+" for User id "+user);
//            });
//        });
        async.each(cons, function(user) {
            user.emit("user_in", allUsersId);
//            console.log("Update Sent to ");
        }, function(err) {
        });
//        lenUsr = Object.keys(allusers).length;
//        console.log("all Users " + lenUsr);
    });

    socket.on("videoRequest", function(data) {
        console.log(data);
        from = data.from;
        to = data.to;
        msg = data.msg;
//        console.log(data);
        if (getMap(to) == -1) {
            console.log("user not online");
            socket.emit("videoRequestFailed", "failed");
//            
            return;
        } else {
            console.log("trying to send video request from " + from)
            getMap(to).emit("videoRequest", from);
        }
    });

    socket.on("note", function(note) {
        console.log(note);
    });

    socket.on("vid_accepted", function(data) {
        from = data.from;
        to = data.to;
        msg = data.msg;
//        console.log(data);
        if (getMap(to) == -1) {
            console.log("user not online");
            return;
        } else {
            getMap(to).emit("vid_accepted", msg);
        }
    });


    socket.on("vid_rejected", function(data) {
        console.log("video call rejected");
        console.log("here" + data);
        getMap(data).emit("video_rej", data);
    });

    //    vid_accepted
    socket.on('pm', function(info) {
//        sender = info.sender;
//        reciever = info.reciever;
//        message = info.message;
//        
//        $.post("http://192.168.1.2/dash/uname2id")



//    console.log(sender + reciever + message);
        // allusers[reciever].emit("pm", info);

        add_status(info, function(res) {
            if (res) {


                console.log("sending message to " + info.user2id);
//            console.log(status);
                if (getMap(info.user2id) == -1) {
                    console.log("user not online");
                    if (getMap(info.user1id) == -1) {
                        console.log("u self no dey  online");
                    } else {
                        getMap(info.user1id).emit("status_sent", info);
//                        return;
                    }
                }
                else {
                    getMap(info.user2id).emit("message", info);
                    if (getMap(info.user1id) == -1) {
                        console.log("u self no dey  online");
                    } else {
                        getMap(info.user1id).emit("status_sent", info);
//                    return;
                    }
//                    getMap(info.user1id).emit("status_sent", info);
//                    getMap(info.user2id).emit("status_added", info);
//                    getMap(info.user2id).emit("pm", info);
                }

//                console.log("info    " +info);
//                io.emit('status_added', info);

//                if (getMap(info.user2id) == -1) {
//                    console.log("user not online");
//                    return;
//
//                } else {
//                    getMap(info.user2id).emit("status_added", info);
//                    getMap(info.user2id).emit("pm", info);
//                }
// getMap(info.user1id).emit("status_sent", info);
            } else {
                io.emit('error');
            }
        });
    });

    socket.on('disconnect', function() {
        console.log('user disconnected id' + uid);
        delete allusers[uid];
        allUsersId.splice(allUsersId.indexOf(uid), 1);
//       delete allUsersId[];
        console.log("some one went off " + allUsersId);
        userList = Object.keys(allusers);
        async.each(cons, function(user) {
            user.emit("users_update", allUsersId);
//            console.log("Update Sent to ");
        }, function(err) {
        });
    });

    socket.on("video", function(data) {
//        console.log(data);
        from = data.from;
        to = data.to;
        msg = data.msg;
//        console.log(data);
        if (getMap(to) == -1) {
            console.log("user not online!!!! " + to + "!!! from " + from);
            return;
        } else {
            console.log("emiting video " + from);
            getMap(to).emit("video", msg);
        }

// getMap(info.user2id).emit("pm", info);

    });










    socket.on('refer', function(referal) {


        add_ref(referal, function(res) {
            if (res) {


                if (getMap(referal.lab) == -1) {
                    console.log("lab not online");
//                    getMap(referal.lab).emit("incoming_ref", referal);
                    return;
                }
                else {

//                     getMap(referal.lab).emit("incoming_ref", referal);

                }

            } else {
                io.emit('error');
            }
        });
    });














});

// to check of a user is in the userlist (returns a value)
function getMap(k) {
//    console.log(allusers[k]);
//allusers[k];
    if (!allusers[k]) {
        console.log("map not found");
        return -1;
    } else {
        return allusers[k];
    }

}

//http.listen(8832, function () {
//    console.log("QtAlk on: 8832");
//});