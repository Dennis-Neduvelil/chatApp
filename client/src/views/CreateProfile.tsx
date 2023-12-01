import React, { useEffect, useState } from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { useSignUpMutation } from '../api/signUpMutation';
import { Link, useNavigate } from 'react-router-dom';
import ToastBox from '../components/toast';

const CreateProfile: React.FC = () => {
    const [userName, SetUserName] = useState('');
    const [password, SetPassword] = useState('');
    const [fullName, SetFullName] = useState('');
    const [showToast, setShowToast] = useState<boolean>(false);
    const [ToastMessage, setToastMessage] = useState<string>('');
    const [ToastStatus, setToastStatus] = useState<boolean>(false);

    const navigate = useNavigate()

    const { mutate: signUpMutate, error, isSuccess } = useSignUpMutation();

    useEffect(() => {
        if (error) {
            let errorBody = JSON.parse(error.message)
            if (Array.isArray(errorBody.message)) {
                console.log(errorBody.message[0]);
                setToastMessage(errorBody.message[0]);
                setToastStatus(false);
                setShowToast(true)
                setTimeout(() => {
                    setShowToast(false);
                }, 4000);
            } else {
                console.log(errorBody.message);
                setToastMessage(errorBody.message);
                setToastStatus(false);
                setShowToast(true)
                setTimeout(() => {
                    setShowToast(false);
                }, 4000);
            }
        }
    }, [error])

    useEffect(() => {
        if (isSuccess) {
            setToastMessage("User created successfully! 🎊🎉 Please Login");
            setToastStatus(true);
            setShowToast(true)
            setTimeout(() => {
                setShowToast(false);
                navigate('/login')
            }, 4000);
        }
    }, [isSuccess,navigate])


    const handleSignUp = () => {
        signUpMutate({ email: userName, password: password, fullName: fullName });
    }
    return (
        <div className='app-container'>
            <Card style={{ width: "100%", backgroundColor: "" }}>
                <Card.Body>
                    <Card.Title>Create Profile 💬</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">ChatsApp!!!</Card.Subtitle>
                    <Card.Text>
                        <div className='m-3 d-flex align-items-center justify-content-center'>
                            <Image src={`profile-pics/${Math.floor(Math.random() * 9) + 1}.avif`} roundedCircle width={150} height={150} />
                        </div>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Full Name"
                            className="mb-3"
                        >
                            <Form.Control type="text" placeholder="name" value={fullName} onChange={(e) => { SetFullName(e.target.value) }} />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Email address"
                            className="mb-3"
                        >
                            <Form.Control type="email" placeholder="name@example.com" value={userName} onChange={(e) => { SetUserName(e.target.value) }} />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingPassword" label="Password">
                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => { SetPassword(e.target.value) }} />
                        </FloatingLabel>
                        <Button className='mt-3' variant="dark" onClick={() => { handleSignUp() }}>Next</Button>
                    </Card.Text>
                    <div className='d-flex'>
                        <p className='mb-0'>Already have account ?</p>
                        <Link to={'/login'} style={{ fontWeight: "bold", marginLeft: "5px" }} >Login</Link>
                    </div>
                </Card.Body>
            </Card>
            {
                showToast && (<ToastBox message={ToastMessage} success={ToastStatus} />)
            }

        </div>
    )
}

export default CreateProfile