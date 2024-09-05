import './MessageBox.css';
import React, { Dispatch, FC, SetStateAction, useEffect } from 'react';

interface Props {
    message: string;
    title: string;
    status: string;
    setMessage: Dispatch<SetStateAction<string>>;
}

const MessageBox: FC<Props> = ({ message, title, status, setMessage }) => {

    useEffect(() => {
        if (message) {
            showMessage();
            const timer = setTimeout(() => {
                hideMessage();
                setMessage('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    function hideMessage() {
        const msgElement = document.getElementById("myMsg");
        if (msgElement) {
            msgElement.classList.add("hidden");
        }
    }

    function showMessage() {
        const msgElement = document.getElementById("myMsg");
        if (msgElement) {
            msgElement.classList.remove("hidden");
        }
    }

    return (
        <div>
            <div id="myMsg" className={`msg-request ${!message ? 'hidden' : ''}`} style={{ borderLeft: `4px solid ${status}` }}>
                <h4 className="msg-content">{message}</h4>
            </div>
        </div>
    );
};

export default MessageBox;
