import React from "react";

function Notification({message}) {
    if(!message) return null;
    return ( 
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: 'green',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            zIndex: 1000,
        }}>
            {message}
        </div>
     );
}

export default Notification;