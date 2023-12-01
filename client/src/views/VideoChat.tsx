import React, { useEffect, useRef, useState } from 'react';
import { Card, Stack, Image, Button } from 'react-bootstrap';
import useSelectedUser from '../hooks/useSelectedUserContext';
import useWebSocket from '../hooks/useWebSocketContext';
import useAuth from '../hooks/useAuthContext';
import useCallInit from '../hooks/useCallInit';
import { useNavigate } from 'react-router-dom';

const VideoChat: React.FC = () => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const { userId } = useAuth();
    const { selectedUser } = useSelectedUser();
    const { callerId } = useCallInit()
    const socket = useWebSocket();
    const navigate = useNavigate();

    let peerConnection: RTCPeerConnection;

    const RTCpeerConfig = {
        iceServers: [
            {
                urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
            }
        ]

    }

    useEffect(() => {
        try {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((videoStream) => {
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = videoStream;
                }
                peerConnection = new RTCPeerConnection(RTCpeerConfig)

                let remoteVideoStream = new MediaStream()

                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteVideoStream;
                }

                videoStream.getTracks().forEach((track) => {
                    peerConnection.addTrack(track, videoStream)
                })

                peerConnection.onicecandidate = async (event) => {
                    if (event.candidate) {
                       
                        socket.emit('ice-candidate-webRtc', {
                            sender: userId,
                            receiver: selectedUser.id,
                            data: event.candidate,
                        });
                    }
                }

                socket.on(`ice-candidate-received-from-${selectedUser.id}-to-${userId}`, (iceCandidate) => {
                    console.log("ice-candidate-received 📃");

                    if (peerConnection) {
                        peerConnection.addIceCandidate(iceCandidate).catch(e => {
                            console.error("Error adding ICE candidate: ", e);
                        });
                    }
                });

                const createOffer = async () => {
                    let offer = await peerConnection.createOffer()
                    peerConnection.setLocalDescription(offer).then(() => {
                        console.log("offer-created 📃")
                        socket.emit('offer-created', {
                            sender: userId,
                            receiver: selectedUser.id,
                            data: offer,
                        });
                    }).catch((error) => {
                        console.log("error in adding local description : offer -> ", error)
                    });

                }

                if (callerId === userId) {
                    createOffer();
                }

                socket.on(`offer-received-from-${selectedUser.id}-to-${userId}`, (offer) => {
                    console.log("offer-received 📃")
                    createAnswer(offer);
                })

                const createAnswer = async (offer: RTCSessionDescriptionInit) => {
                    await peerConnection.setRemoteDescription(offer);
                    let answer = await peerConnection.createAnswer();

                    peerConnection.setLocalDescription(answer).then(() => {
                        socket.emit('answer-created', {
                            sender: userId,
                            receiver: selectedUser.id,
                            data: answer,
                        });

                    }).catch((error) => {
                        console.log("error in adding local description : answer ->", error)
                    });
                    console.log("answer-created 📃")
                }

                socket.on(`answer-received-from-${selectedUser.id}-to-${userId}`, (answer) => {
                    console.log("answer-received 📃")
                    addAnswer(answer);
                })

                const addAnswer = (answer: RTCSessionDescription) => {
                    if (!peerConnection.currentRemoteDescription) {
                        peerConnection.setRemoteDescription(answer).catch((error) => {
                            console.log("error in adding remote description : answer ->", error)
                        });
                    }
                }
                peerConnection.ontrack = (event) => {
                    event.streams[0].getTracks().forEach((track) => {
                        remoteVideoStream.addTrack(track)
                    })
                }

                socket.on(`call-end-by-${selectedUser.id}-to-${userId}`, () => {
                    if (peerConnection) {
                        peerConnection.close();
                    }
                    videoStream.getTracks().forEach((track)=>{
                        track.stop()
                    })

                    remoteVideoStream.getTracks().forEach((track)=>{
                        track.stop()
                    })
                    navigate('/chat');
                })
            })

        } catch (error) {
            console.log(error)
        }
        return () => {
            if (peerConnection) {
                peerConnection.close();
            }
            if (localVideoRef.current?.srcObject instanceof MediaStream) {
                localVideoRef.current.srcObject.getTracks().forEach(track => {
                    track.stop();
                });
                localVideoRef.current.srcObject = null;
            }

            if (remoteVideoRef.current?.srcObject instanceof MediaStream) {
                remoteVideoRef.current.srcObject = null;
            }

            socket.off(`ice-candidate-received-from-${selectedUser.id}-to-${userId}`);
            socket.off(`offer-received-from-${selectedUser.id}-to-${userId}`);
            socket.off(`answer-received-from-${selectedUser.id}-to-${userId}`);
        };
    }, [])

    const handleOnCallEnd = async () => {
        peerConnection.close();
        socket.emit('call-ended', {
            sender: userId,
            receiver: selectedUser.id,
        });
    }



    return (
        <div className='app-container'>
            <Stack gap={3}>
                <Card style={{ height: '60px' }}>
                    <div className='d-flex p-2 bg-white rounded justify-content-between'>
                        <div className='d-flex align-items-center gap-2'>
                            <div>
                                <Image
                                    src={`profile-pics/${Math.floor(Math.random() * 9) + 1}.avif`}
                                    roundedCircle
                                    width={40}
                                    height={40}
                                />
                            </div>
                            <div>
                                <h5 className='mb-0'>{selectedUser.fullName}</h5>
                                <p className='mb-0'>video call</p>
                            </div>
                        </div>
                        <Button variant='' style={{ fontSize: "20px" }} onClick={() => { handleOnCallEnd() }}>📞</Button>
                    </div>
                </Card>
                <Card style={{ height: '43vh', overflow: 'hidden' }}>
                    <video ref={localVideoRef} style={{ objectFit: 'cover', width: '100%', height: '100%' }} autoPlay playsInline muted />
                </Card>
                <Card style={{ height: '43vh' }}>
                    <video ref={remoteVideoRef} style={{ objectFit: 'cover', width: '100%', height: '100%' }} autoPlay playsInline />
                </Card>
            </Stack>
        </div>
    );
};

export default VideoChat;

