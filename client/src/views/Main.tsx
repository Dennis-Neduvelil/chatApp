import React, { useEffect, useState } from 'react'
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import Badge from 'react-bootstrap/Badge';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { AllUsersQuery } from '../api/userListQuery';
import { SendRequestsQuery } from '../api/sendRequestsQuery';
import { ReceivedRequestsQuery } from '../api/receivedRequestsQuery';
import { useNavigate } from 'react-router-dom';
import ToastBox from '../components/toast';
import { SendRequestMutation } from '../api/sendRequestMutation';
import { AcceptRequestMutation } from '../api/acceptRequestMutate';
import { GetConnectionsQuery } from '../api/getConncetionsQuery';
import useSelectedUser from '../hooks/useSelectedUserContext';


const Main = () => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>('Add Friends');
    const [modalType, setModalType] = useState<'add-friends' | 'requests-send' | 'requests-received' | 'create-group' | 'groups'>('add-friends');
    const [userData, setUserData] = useState<any[]>([]);
    const [connectionData, setConnectionData] = useState<any[]>([]);
    const [modalButtonText, setModalButtonText] = useState<string>('');
    const [showToast, setShowToast] = useState<boolean>(false);
    const [ToastMessage, setToastMessage] = useState<string>('');
    const [ToastStatus, setToastStatus] = useState<boolean>(false);

    const navigate = useNavigate();
    const { selectedUser, setSelectedUser } = useSelectedUser()

    let { data: allUsersData, refetch: allUsersRefetch, isSuccess: allUsersIsSuccess, isError: allUsersIsError } = AllUsersQuery()
    let { data: sendRequestsData, refetch: sendRequestsRefetch, isSuccess: sendRequestsIsSuccess, isError: sendRequestsIsError } = SendRequestsQuery()
    let { data: receivedRequestData, refetch: receivedRequestRefetch, isSuccess: receivedRequestIsSuccess, isError: receivedRequestIsError } = ReceivedRequestsQuery()
    let { data: getConnectionsData, refetch: getConnectionsRefetch, isSuccess: getConnectionsIsSuccess, isError: getConnectionsIsError } = GetConnectionsQuery()

    const { mutate: sendRequestMutate, error: sendRequestMutateError, isSuccess: sendRequestMutateIsSuccess, isError: sendRequestMutateIsError } = SendRequestMutation()
    const { mutate: acceptRequestMutate, error: acceptRequestMutateError, isSuccess: acceptRequestMutateIsSuccess, isError: acceptRequestMutateIsError } = AcceptRequestMutation()



    const handleOnModalClose = () => {
        setShowModal((prev) => !prev)
    }

    useEffect(() => {
        if (getConnectionsIsSuccess) {
            setConnectionData(getConnectionsData?.data.data)
        }
    }, [getConnectionsIsSuccess, getConnectionsData])


    useEffect(() => {
        if (allUsersIsSuccess) {
            setUserData(allUsersData?.data?.data);
            setModalTitle("Add Friends");
            setModalType("add-friends");
            setModalButtonText('Send Request')
            setShowModal(true);
        }
        if (allUsersIsError) {
            setToastMessage("No new users ☹️");
            setToastStatus(false);
            setShowToast(true)
            setTimeout(() => {
                setShowToast(false);
            }, 4000);
        }

    }, [allUsersIsSuccess, allUsersIsError, allUsersData])

    useEffect(() => {
        if (sendRequestsIsSuccess) {
            setUserData(sendRequestsData?.data?.data);
            setModalTitle("Requests Sended");
            setModalType("requests-send");
            setModalButtonText('')
            setShowModal(true);
        }
        if (sendRequestsIsError) {
            setToastMessage("You haven't sent any requests 🤦🏻‍♀️");
            setToastStatus(false);
            setShowToast(true)
            setTimeout(() => {
                setShowToast(false);
            }, 4000);
        }

    }, [sendRequestsData, sendRequestsIsError, sendRequestsIsSuccess])

    useEffect(() => {
        if (receivedRequestIsSuccess) {
            setUserData(receivedRequestData?.data?.data);
            setModalTitle("Requests Received");
            setModalType("requests-received");
            setModalButtonText('Accept Request')
            setShowModal(true);
        }
        if (receivedRequestIsError) {
            setToastMessage("No new requests 😅");
            setToastStatus(false);
            setShowToast(true)
            setTimeout(() => {
                setShowToast(false);
            }, 4000);
        }

    }, [receivedRequestData, receivedRequestIsError, receivedRequestIsSuccess])


    const addFriendsModalHandler = async () => {
        allUsersRefetch();
    }
    const requestSendModalHandler = () => {
        sendRequestsRefetch()
    }

    const requestReceivedModalHandler = () => {
        receivedRequestRefetch()
    }


    const logOffHandler = () => {
        localStorage.setItem("token", '');
        localStorage.setItem("userId", '');
        navigate('/login')
    }

    const handleModalButtonClick = (item: any) => {
        if (modalType === 'add-friends') {
            console.log("send-request-clicked")
            sendRequestMutate({ connectionId: item.id })
        }
        if (modalType === 'requests-received') {
            acceptRequestMutate({ connectionId: item.id })
        }
    }

    useEffect(() => {
        if (sendRequestMutateIsSuccess) {
            setToastMessage("Request Send Successfully 🍾");
            setToastStatus(true);
            setShowToast(true)
            allUsersRefetch();
            setTimeout(() => {
                setShowToast(false);
            }, 4000);
        }
        if (sendRequestMutateIsError) {
            setToastMessage("Request Send Failed 🚶🏻‍♀️");
            setToastStatus(false);
            setShowToast(true)
            setTimeout(() => {
                setShowToast(false);
            }, 4000);
        }
    }, [sendRequestMutateIsSuccess, sendRequestMutateIsError])


    useEffect(() => {
        if (acceptRequestMutateIsSuccess) {
            setToastMessage("Request accepted Successfully 🍾");
            setToastStatus(true);
            setShowToast(true)
            receivedRequestRefetch();
            getConnectionsRefetch();
            setTimeout(() => {
                setShowToast(false);
            }, 4000);
        }
        if (acceptRequestMutateIsError) {
            setToastMessage("Request accepted Failed 🚶🏻‍♀️");
            setToastStatus(false);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 4000);
        }
    }, [acceptRequestMutateIsSuccess, acceptRequestMutateIsError])

    const ChatBubbleClickHandler = (item: any) => {
        console.log(item)
        setSelectedUser(item)
        localStorage.setItem("selectedUser", JSON.stringify(item))
        navigate('/chat');
    }
    return (

        <div className='app-container'>
            {
                showModal && (
                    <div
                        className="modal show"
                        style={{ display: 'block', position: 'initial' }}
                    >
                        <Modal.Dialog>
                            <Modal.Header closeButton onHide={() => { handleOnModalClose() }}>
                                <Modal.Title>{modalTitle}</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <Stack gap={2} style={{ maxHeight: "80vh", overflowX: "scroll" }} >
                                    {modalType !== 'create-group' &&
                                        userData.map((item, key) => {
                                            return (<div className="d-flex justify-content-between align-items-center" style={{ backgroundColor: "whitesmoke", padding: "5px", borderRadius: "10px" }}>
                                                <div key={key} className="d-flex align-items-center gap-2">
                                                    <Image src={`profile-pics/${Math.floor(Math.random() * 9) + 1}.avif`} roundedCircle width={40} height={40} />
                                                    {
                                                        modalType === 'requests-send' && (
                                                            <div>
                                                                <h6 className='mb-0'>{item.receiver.fullName}</h6>
                                                                <p className='mb-0'>{item.receiver.email}</p>
                                                            </div>
                                                        )
                                                    }
                                                    {
                                                        modalType === 'requests-received' && (
                                                            <div>
                                                                <h6 className='mb-0'>{item.sender.fullName}</h6>
                                                                <p className='mb-0'>{item.sender.email}</p>
                                                            </div>
                                                        )
                                                    }
                                                    {
                                                        modalType === 'add-friends' && (
                                                            <div>
                                                                <h6 className='mb-0'>{item.fullName}</h6>
                                                                <p className='mb-0'>{item.email}</p>
                                                            </div>
                                                        )
                                                    }

                                                </div>
                                                <Badge bg="primary p-2" onClick={() => { handleModalButtonClick(item) }} >{modalButtonText}</Badge>
                                            </div>)
                                        })
                                    }
                                </Stack>
                            </Modal.Body>
                        </Modal.Dialog>
                    </div>
                )
            }
            {
                !showModal && (<Stack gap={3}>
                    <div className='d-flex p-2 bg-white rounded justify-content-between'>
                        <h3>🗨️ ChatsApp!</h3>
                        <Dropdown>
                            <Dropdown.Toggle style={{ fontSize: "20px" }} variant="" id="dropdown-basic">
                                🍔
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => { addFriendsModalHandler() }}>Add Friends</Dropdown.Item>
                                <Dropdown.Item onClick={() => { requestSendModalHandler() }}>Requests Send</Dropdown.Item>
                                <Dropdown.Item onClick={() => { requestReceivedModalHandler() }}>Requests Received</Dropdown.Item>
                                <Dropdown.Item onClick={() => { logOffHandler() }}>Log off</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                    </div>
                    <Card style={{ height: "88vh", overflowY: "scroll" }}>
                        <Card.Body>
                            <Stack gap={2} >
                                {
                                    getConnectionsIsError && (<div>
                                        <p>Something went wrong</p>
                                    </div>)
                                }
                                {
                                    getConnectionsIsSuccess && (<>
                                        {connectionData.map((item) => {
                                            return (<div key={item.id} className="d-flex justify-content-between align-items-center" style={{ backgroundColor: "whitesmoke", padding: "5px", borderRadius: "10px" }} onClick={() => { ChatBubbleClickHandler(item) }}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <Image src={`profile-pics/${Math.floor(Math.random() * 9) + 1}.avif`} roundedCircle width={40} height={40} />
                                                    <div>
                                                        <h6 className='mb-0'>{item.fullName}</h6>
                                                        <p className='mb-0'>last message</p>
                                                    </div>
                                                </div>
                                                <Badge bg="secondary" >1</Badge>

                                            </div>)
                                        })}
                                    </>)
                                }

                            </Stack>
                        </Card.Body>
                    </Card>
                </Stack>)
            }{
                showToast && (<ToastBox message={ToastMessage} success={ToastStatus} />)
            }

        </div>


    )
}

export default Main