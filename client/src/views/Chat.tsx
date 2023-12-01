import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import { Form, Modal } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { useNavigate } from 'react-router-dom';
import useSelectedUser from '../hooks/useSelectedUserContext';
import { useEffect, useState, useRef } from 'react';
import useWebSocket from '../hooks/useWebSocketContext';
import useAuth from '../hooks/useAuthContext';
import { ringing, ringTone } from '../audioFiles';
import useCallInit from '../hooks/useCallInit';

const sendMessageBubble = (message: string, key: number) => {
    return (
        <div key={key} style={{ display: "flex", width: "100%", justifyContent: "end" }}>
            <div style={{ backgroundColor: "aquamarine", maxWidth: "80%", padding: "10px", borderRadius: "10px" }}>
                {message}
            </div>
        </div>
    )
}

const receivedMessageBubble = (message: string, key: number) => {
    return (
        <div key={key} style={{ display: "flex", width: "100%", justifyContent: "start" }}>
            <div style={{ backgroundColor: "#fecfef", maxWidth: "80%", padding: "10px", borderRadius: "10px" }}>
                {message}
            </div>
        </div>
    )
}



const Chat = () => {
    interface IMessage {
        senderId: string,
        receiverId: string,
        message: string;
    }
    const navigate = useNavigate()
    const { selectedUser } = useSelectedUser()
    const { userId } = useAuth()
    const { setCalledId } = useCallInit()
    const socket = useWebSocket();
    const [inputMessage, setInputMessage] = useState('');
    const [messageArray, setMessageArray] = useState<IMessage[]>([]);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<'call-requested' | 'call-received'>('call-requested');

    const cardRef = useRef<HTMLDivElement | null>(null);

    let ringTimeout: ReturnType<typeof setTimeout>;

    useEffect(() => {
        const handleMessageHistory = (data: any) => {
            console.log("message-history-received");
            setMessageArray(data)
        };
        socket.emit('fetchMessage', {
            sender: userId,
            receiver: selectedUser.id,
        })
        socket.on(`message-history-from-${userId}-to-${selectedUser.id}`, handleMessageHistory);
        return () => {
            socket.off(`message-history-from-${userId}-to-${selectedUser.id}`, handleMessageHistory);
        };

    }, [])


    useEffect(() => {
        const handleConnect = () => {
            console.log("connected");
        };

        const handleMessage = (data: any) => {
            console.log("message-received");
            setMessageArray((prev) => [...prev, { senderId: selectedUser.id, receiverId: userId, message: data }]);
        };

        const handleCallRequest = () => {
            setModalType('call-received')
            setShowModal(true)
            ringTone.play()
            ringTimeout = setTimeout(() => {
                ringTone.pause();
                ringTone.currentTime = 0;
                setShowModal(false);
            }, 25000);
        }

        const handleCallAccept = () => {
            clearTimeout(ringTimeout);
            ringing.pause();
            ringing.currentTime = 0
            ringTone.pause();
            ringTone.currentTime = 0
            setShowModal(false);
            navigate('/video-call')
        }

        const handleCallReject = () => {
            clearTimeout(ringTimeout);
            ringing.pause();
            ringing.currentTime = 0
            ringTone.pause();
            ringTone.currentTime = 0
            setShowModal(false)
        }

        socket.on('connect', handleConnect);
        socket.on(`message-from-${selectedUser.id}-to-${userId}`, handleMessage);
        socket.on(`video-call-from-${selectedUser.id}-to-${userId}`, handleCallRequest);
        socket.on(`video-call-accepted-by-${selectedUser.id}-to-${userId}`, handleCallAccept);
        socket.on(`video-call-rejected-by-${selectedUser.id}-to-${userId}`, handleCallReject);

        return () => {
            socket.off('connect', handleConnect);
            socket.off(`message-from-${selectedUser.id}-to-${userId}`, handleMessage);
            socket.off(`video-call-from-${selectedUser.id}-to-${userId}`, handleCallRequest);
            socket.off(`video-call-accepted-by-${selectedUser.id}-to-${userId}`, handleCallAccept);
            socket.off(`video-call-rejected-by-${selectedUser.id}-to-${userId}`, handleCallReject);
        };
    }, [selectedUser.id, userId]);


    useEffect(() => {
        if (cardRef.current) {
            cardRef.current.scrollTop = cardRef.current.scrollHeight;
        }
    }, [cardRef.current?.scrollHeight, inputMessage]);

    const OnCallRequest = () => {
        setCalledId(userId);
        setShowModal(true);
        ringing.play()
        socket.emit("newVideoCall", {
            sender: userId,
            receiver: selectedUser.id,
        })
        ringTimeout = setTimeout(() => {
            ringing.pause()
            ringing.currentTime = 0
            setShowModal(false);
        }, 25000);
    }

    const OnCallAccept = () => {
        clearTimeout(ringTimeout);
        socket.emit("videoCallAccepted", {
            sender: userId,
            receiver: selectedUser.id,
        })
        ringTone.pause()
        ringing.currentTime = 0
        setShowModal(false)
        navigate('/video-call')
    }

    const OnCallReject = () => {
        clearTimeout(ringTimeout);
        if (modalType === 'call-requested') {
            ringing.pause()
            ringing.currentTime = 0
        } else {
            ringTone.pause()
            ringTone.currentTime = 0
        }
        socket.emit("videoCallRejected", {
            sender: userId,
            receiver: selectedUser.id,
        })
        setShowModal(false)
    }



    const handleMessgeSubmit = (e: any) => {
        if (e.key === 'Enter') {
            console.log("userID from socket", userId)
            socket.emit('newMessage', {
                sender: userId,
                receiver: selectedUser.id,
                message: inputMessage
            })
            setMessageArray((prev) => { return [...prev, { senderId: userId, receiverId: selectedUser.id, message: inputMessage }] })
            setInputMessage('')
        }
    }

    return (
        <div className='app-container'>
            {
                !showModal && (
                    <Stack gap={3}>
                        <div className='d-flex p-2 bg-white rounded justify-content-between'>
                            <div className='d-flex align-items-center gap-2'>
                                <div style={{ fontSize: "20px" }} onClick={() => { navigate('/') }}>
                                    👈🏻
                                </div>
                                <div>
                                    <Image src={`profile-pics/${Math.floor(Math.random() * 9) + 1}.avif`} roundedCircle width={40} height={40} />
                                </div>
                                <div>
                                    <h5 className='mb-0'>{selectedUser.fullName}</h5>
                                    <p className='mb-0'>Online</p>
                                </div>
                            </div>
                            <Dropdown>
                                <Dropdown.Toggle style={{ fontSize: "20px" }} variant="" id="dropdown-basic">
                                    ⚙️
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => { OnCallRequest() }}>Video Call</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                        </div>
                        <Card style={{ height: "88vh", overflowY: "scroll" }} >
                            <Card.Body>
                                <Stack gap={2} style={{ height: "80vh", overflowY: "scroll" }} ref={cardRef}>
                                    {messageArray.length !== 0 && messageArray.map((item, key) => {
                                        return (
                                            <>
                                                {
                                                    item.senderId === userId ? sendMessageBubble(item.message, key)
                                                        : receivedMessageBubble(item.message, key)
                                                }
                                            </>
                                        )
                                    })}
                                    {
                                        messageArray.length === 0 && (
                                            <p>Start a new conversation...</p>
                                        )
                                    }
                                </Stack>
                                <Form.Control style={{ marginTop: "10px", marginBottom: "10px" }} type="text" placeholder="type something" value={inputMessage} onChange={(e) => { setInputMessage(e.target.value) }} onKeyDown={(e) => { handleMessgeSubmit(e) }} />
                            </Card.Body>
                        </Card>
                    </Stack>
                )
            }
            {
                showModal && (<div
                    className="modal show"
                    style={{ display: 'block', position: 'initial' }}
                >
                    <Modal.Dialog>
                        <Modal.Body>
                            <div style={{ display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                                <Image src={`profile-pics/${Math.floor(Math.random() * 9) + 1}.avif`} roundedCircle width={250} height={250} />
                                <h5 className='text-muted'>{modalType === 'call-requested' ? 'Ringing' : 'Call From'}</h5>
                                <h3>{selectedUser.fullName}</h3>
                                <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                    <div style={{ display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: "center" }} onClick={() => { OnCallReject() }}>
                                        <h4>❌</h4>
                                        <h6>Reject</h6>
                                    </div>
                                    {
                                        modalType === 'call-received' && (<div style={{ display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: "center" }} onClick={() => { OnCallAccept() }}>
                                            <h4>✔️</h4>
                                            <h6>Accept</h6>
                                        </div>)
                                    }
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </div>)
            }
        </div>
    )
}

export default Chat