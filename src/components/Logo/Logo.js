import React from 'react'
import brain from './brain.png'
import './Logo.css';
const Logo = () => {
    return (
        <div class='ma4 mt0'>
            
                <div className='Tilt br2 shadow-2' style={{ height: '150px',width:'150px' }}>
                    <div className='Tilt pa3'>
                        <img alt='logo' src={brain} style={{ paddingTop: '5px' }} />

                    </div>
                </div>
            
        </div>
    )
}

export default Logo;