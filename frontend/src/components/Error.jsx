import React from "react";

function Error({message}) {
    if(!message) return null;
    return ( 
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: 'red',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            zIndex: 1000,
        }}>
            {message}
        </div>
     );
}

export default Error;