import logo from '../assets/logo.png'
import Calendar2 from './calendar2'
import LogInBox from './loginBox'
import UserHome from './userHome'
import CheckBox from './checkBox'
import Admin from './admin'
import AdminDash from './adminDash'
import Dash from './dash'
import Review from './reviewBox'
import ClassicPublic from './public2'
import AddPet from './addPet'

import { useState, useContext } from 'react'
import { Context } from '../context'

function Home() {
    const [logged, setLogged] = useState(false)
    const [admin, setAdmin] = useState(false)
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const { addPet } = useContext(Context)
    const [logInSmall, setLoginSmall]=useState()

    function renderLeft() {
        if (admin) return <AdminDash user={user} token={token} />
        if (logged) {
    if (addPet) return <AddPet token={token} />
    return <UserHome user={user} token={token} onLogout={() => {
        setLogged(false)
        setAdmin(false)
        setUser(null)
        setToken(null)
    }} />
}
        return <ClassicPublic />
    }

    function renderCenter() {
        if (admin) return 
        if (logged) return <Dash user={user} token={token} />
        return (
            <div className="leftMain">
               
                    <Calendar2 />
                
               
               
                    <Review />
            
            </div>
        )
    }

    function renderRight() {
        if (admin) return <div className="rightMain" />
        if (logged) return (
            <div className="rightMain">
                <CheckBox />
               
            </div>
        )
        return (
            <div className="rightMain">
                <LogInBox onLogin={(data) => {
                    setLogged(true)
                    setAdmin(data.isAdmin)
                    setUser(data)
                    setToken(data.token)
                     window.scrollTo(0, 0)
                }} />
            </div>
        )
    }

    return (
        <div className="homePage">
            <div className="topArea">
                <div className="topLeft">
                    <img src={logo} alt="Dog Walker Logo" className="logo" />
                </div>
                <div className="businessName">
                    <h1 className="brandName">Luton Dog Boarding</h1>
                </div>
              <div className="contactInfo">
    <div className="contactCard">
        <a className="contactRow" href="mailto:Lucabex@gmail.com">
            <span className="contactIcon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-10 5L2 7"/>
                </svg>
            </span>
            <span className="contactText">Lucabex@gmail.com</span>
        </a>

        <a className="contactRow" href="tel:07585626737">
            <span className="contactIcon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
            </span>
            <span className="contactText">07585 626737</span>
        </a>

        <div className="contactRow contactRow--static">
            <span className="contactIcon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                </svg>
            </span>
            <span className="contactText">Office:9am–5pm</span>
        </div>

        <a className="contactRow" href="https://www.facebook.com/profile.php?id=61585849967450" target="_blank" rel="noopener noreferrer">
            <span className="contactIcon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/>
                </svg>
            </span>
            <span className="contactText">Facebook</span>
        </a>
    </div>
</div>

               
            </div>

            <div className="main">
                <div className={`mainLeft ${logged ? 'mainLeft--logged' : ''}`}>
                    {renderLeft()}
                </div>
                <div className="mainActionArea">
                    {renderCenter()}
                </div>
                <div className="mainRight">
                    {renderRight()}
                </div>
            </div>
        </div>
    )
}

export default Home










