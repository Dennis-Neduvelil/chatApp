import React, { useEffect, useState } from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useLoginMutation } from '../api/loginMutation';
import { Link } from 'react-router-dom';
import ToastBox from '../components/toast';

const Login: React.FC = () => {
    const [userName, SetUserName] = useState('');
    const [password, SetPassword] = useState('');
    const [showToast, setShowToast] = useState<boolean>(false);
    const [ToastMessage, setToastMessage] = useState<string>('');
    const [ToastStatus, setToastStatus] = useState<boolean>(false);

    const { mutate: loginMutate, error } = useLoginMutation();

    useEffect(() => {
        if (error) {
            let errorBody = JSON.parse(error.message)
            if(Array.isArray(errorBody.message)){
                console.log(errorBody.message[0]);
                setToastMessage(errorBody.message[0]);
                setToastStatus(false);
                setShowToast(true)
                setTimeout(() => {
                    setShowToast(false);
                }, 4000);
            }else{
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


    const handleLogin = () => {
        loginMutate({ email: userName, password: password });
    }
    return (
        <div className='app-container'>
            <Card style={{ width: "100%", backgroundColor: "" }}>
                <Card.Body>
                    <Card.Title>💬 ChatsApp!!!</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">📱 tête-à-tête.</Card.Subtitle>
                    <Card.Text>
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
                        <Button className='mt-3' variant="dark" onClick={() => { handleLogin() }}>Login</Button>
                    </Card.Text>
                    <div className='d-flex'>
                    <p className='mb-0'>Dont have account ?</p>
                    <Link to={'/signUp'} style={{fontWeight:"bold",marginLeft:"5px"}} >Create Account</Link>
                    </div>
                </Card.Body>
            </Card>
            {
                showToast && (<ToastBox message={ToastMessage} success={ToastStatus} />)
            }
        </div>
    )
}

export default Login