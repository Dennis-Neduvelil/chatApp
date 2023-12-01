import React from 'react';
import Toast from 'react-bootstrap/Toast';
interface IToast {
    message:string;
    success: boolean;
}
const ToastBox : React.FC<IToast> = ({message,success}) => {
    return (
        <Toast style={{width:"350px", position:"fixed", bottom:"5vh"}}>
            <Toast.Header>
                <img src={ success ? 'success.png' : 'failed.png'} className="rounded me-2" width={15} alt={'img'} />
                <strong className="me-auto">{message}</strong>
                <small>Now</small>
            </Toast.Header>
        </Toast>
    )
}

export default ToastBox