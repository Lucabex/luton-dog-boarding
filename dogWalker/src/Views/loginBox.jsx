import { useState } from "react"
import { API_URL } from '../apiConfig'

function LogInBox({ onLogin }) {
    const [iAmRegistering, setIAmregistering] = useState(true)
    const [petPreview, setPetPreview] = useState(null)
    const [step, setStep] = useState(1)
    // password reset state
const [showReset, setShowReset] = useState(false)
const [resetEmail, setResetEmail] = useState('')
const [resetCode, setResetCode] = useState('')
const [resetNewPassword, setResetNewPassword] = useState('')
const [resetStage, setResetStage] = useState(1) // 1 = enter email, 2 = enter code + new pw
const [resetMessage, setResetMessage] = useState('')
    // login state
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loginError, setLoginError] = useState('')

    // registration state - step 1
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [streetAddress, setStreetAddress] = useState('')
    const [city, setCity] = useState('')
    const [postcode, setPostcode] = useState('')
    const [regUsername, setRegUsername] = useState('')
    const [regPassword, setRegPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // registration state - step 2
    const [dogName, setDogName] = useState('')
    const [breed, setBreed] = useState('')
    const [age, setAge] = useState('')
    const [size, setSize] = useState('')
    const [sex, setSex] = useState('')
    const [neutered, setNeutered] = useState('')
    const [vaccinated, setVaccinated] = useState('')
    const [allergies, setAllergies] = useState('')
    const [behaviourNotes, setBehaviourNotes] = useState('')
    const [emergencyContactName, setEmergencyContactName] = useState('')
    const [emergencyContactPhone, setEmergencyContactPhone] = useState('')

    const [regError, setRegError] = useState('')
    const [regSuccess, setRegSuccess] = useState(false)
async function handleRequestCode() {
    setResetMessage('')
    try {
        const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: resetEmail })
        })
   
        if (res.ok) {
            setResetStage(2)
            setResetMessage('If that email exists, a code has been sent.')
        }
    } catch (err) {
        setResetMessage('Something went wrong, try again')
    }
}

async function handleResetPassword() {
    setResetMessage('')
    try {
        const res = await fetch(`${API_URL}/api/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: resetEmail,
                code: resetCode,
                newPassword: resetNewPassword
            })
        })
        const data = await res.json()
        if (res.ok) {
            setResetMessage('Password updated — you can now log in.')
    
            setShowReset(false)
            setResetStage(1)
            setResetEmail('')
            setResetCode('')
            setResetNewPassword('')
        } else {
            setResetMessage(data.message || 'Invalid or expired code.')
        }
    } catch (err) {
        setResetMessage('Something went wrong, try again')
    }
}
    async function handleLogin() {
        setLoginError('')
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            if (!res.ok) {
                setLoginError('Invalid username or password')
                return
            }
            const data = await res.json()
            localStorage.setItem('token', data.token)
            onLogin(data)
        } catch (err) {
            setLoginError('Something went wrong, try again')
        }
    }

    async function handleRegister() {
    setRegError('')

    if (regPassword !== confirmPassword) {
        setRegError('Passwords do not match')
        return
    }

    try {

        const res = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName, lastName, email, phone,
                streetAddress, city, postcode,
                username: regUsername, password: regPassword,
                dogName, breed, age: parseInt(age), size, sex,
                neutered: neutered === 'Yes',
                vaccinated: vaccinated === 'Yes',
                allergies, behaviourNotes,
                emergencyContactName, emergencyContactPhone
            })
        })

        if (!res.ok) {
            const msg = await res.text()
            setRegError(msg)
            return
        }

        const { dogId } = await res.json()

   
        const loginRes = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: regUsername, password: regPassword })
        })

        const loginData = await loginRes.json()
        const token = loginData.token
        localStorage.setItem('token', token)


        if (petFile) {
            const formData = new FormData()
            formData.append('file', petFile)

            await fetch(`${API_URL}/api/dog/${dogId}/photo`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            })
        }

      
        onLogin(loginData)

    } catch (err) {
        setRegError('Something went wrong, try again')
    }
}
const [petFile, setPetFile] = useState(null)

function handlePetImage(e) {
    const file = e.target.files[0]
    if (file) {
        setPetFile(file)
        setPetPreview(URL.createObjectURL(file))
    }
}
    return (
        <>
            {iAmRegistering ? (
                showReset ? (
                    <div className="log-in">
                        <h1>Reset password</h1>

                        {resetStage === 1 && (
                            <>
                                <label>Enter your email</label>
                                <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                                <div className="buttonBoxX">
                                    <button onClick={handleRequestCode}>Send code</button>
                                    <button onClick={() => { setShowReset(false); setResetMessage('') }}>Cancel</button>
                                </div>
                            </>
                        )}

                        {resetStage === 2 && (
                            <>
                                <label>Code from email</label>
                                <input type="text" value={resetCode} onChange={(e) => setResetCode(e.target.value)} />
                                <label>New password</label>
                                <input type="password" value={resetNewPassword} onChange={(e) => setResetNewPassword(e.target.value)} />
                                <div className="buttonBoxX">
                                    <button onClick={handleResetPassword}>Update password</button>
                                    <button onClick={() => { setShowReset(false); setResetStage(1) }}>Cancel</button>
                                </div>
                            </>
                        )}

                        {resetMessage && <p style={{ color: '#555', fontSize: '12px' }}>{resetMessage}</p>}
                    </div>
                ) : (
                <div className="log-in">
                    <h1>Log-in</h1>
                    {regSuccess && <p style={{ color: 'green', fontSize: '12px' }}>Account created — please log in</p>}
                    <label>Account name</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {loginError && <p style={{ color: 'red', fontSize: '12px' }}>{loginError}</p>}
                    <div className="buttonBoxX">
                        <button onClick={handleLogin}>Log-in</button>
                        <button onClick={() => setIAmregistering(false)}>Register</button>
                    </div>
                   <span id='forgot' onClick={() => setShowReset(true)} style={{ cursor: 'pointer' }}>Forgot your password?</span>
                </div>
                )
            ) : (
                <div className="newReg">
                    <div className="regHeader">
                        <button className="regBackBtn" onClick={() => { setIAmregistering(true); setStep(1) }}>← Back</button>
                        <h2 className="regTitle">Create your account</h2>
                        <div className="regSteps">
                            <div className={`regStep ${step >= 1 ? 'regStep--active' : ''}`}>1</div>
                            <div className="regStepLine" />
                            <div className={`regStep ${step >= 2 ? 'regStep--active' : ''}`}>2</div>
                        </div>
                    </div>

                    {step === 1 && (
                        <div className="regBody">
                           

                            <div className="regSection">
                                <h3 className="regSectionTitle">Personal info</h3>
                                <div className="regRow">
                                    <div className="regField">
                                        <label>First name</label>
                                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                    </div>
                                    <div className="regField">
                                        <label>Last name</label>
                                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                    </div>
                                </div>
                                <div className="regField">
                                    <label>Email</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="regField">
                                    <label>Phone number</label>
                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                            </div>

                            <div className="regSection">
                                <h3 className="regSectionTitle">Address</h3>
                                <div className="regField">
                                    <label>Street address</label>
                                    <input type="text" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} />
                                </div>
                                <div className="regRow">
                                    <div className="regField">
                                        <label>City</label>
                                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                                    </div>
                                    <div className="regField">
                                        <label>Postcode</label>
                                        <input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div className="regSection">
                                <h3 className="regSectionTitle">Account</h3>
                                <div className="regField">
                                    <label>Username</label>
                                    <input type="text" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} />
                                </div>
                                <div className="regRow">
                                    <div className="regField">
                                        <label>Password</label>
                                        <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
                                    </div>
                                    <div className="regField">
                                        <label>Confirm password</label>
                                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <button className="regNextBtn" onClick={() => setStep(2)}>
                                Next — Your dog →
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="regBody">
                        

                            <div className="regSection">
                                <h3 className="regSectionTitle">Dog info</h3>
                                <div className="petTopRow">
                                    <div className="petImgUpload">
                                        <label className="petImgLabel" htmlFor="petImg">
                                            {petPreview
                                                ? <img src={petPreview} alt="pet" className="petImgPreview" />
                                                : <span>📷<br />+Add photo</span>
                                            }
                                        </label>
                                        <input id="petImg" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePetImage} />
                                    </div>
                                    <div className="petFields">
                                        <div className="regField">
                                            <label>Dog's name</label>
                                            <input type="text" value={dogName} onChange={(e) => setDogName(e.target.value)} />
                                        </div>
                                        <div className="regRow">
                                            <div className="regField">
                                                <label>Breed</label>
                                                <input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} />
                                            </div>
                                            <div className="regField">
                                                <label>Age</label>
                                                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} min="0" max="20" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="regRow">
                                    <div className="regField">
                                        <label>Size</label>
                                        <select value={size} onChange={(e) => setSize(e.target.value)}>
                                            <option value="">Select</option>
                                            <option>1kg-10kg</option>
                                            <option>11kg–26kg</option>
                                            <option>27kg+</option>
                                        </select>
                                    </div>
                                    <div className="regField">
                                        <label>Sex</label>
                                        <select value={sex} onChange={(e) => setSex(e.target.value)}>
                                            <option value="">Select</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>
                                    </div>
                                    <div className="regField">
                                        <label>Neutered</label>
                                        <select value={neutered} onChange={(e) => setNeutered(e.target.value)}>
                                            <option value="">Select</option>
                                            <option>Yes</option>
                                            <option>No</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="regSection">
                                <h3 className="regSectionTitle">Health & behaviour</h3>
                                <div className="regField">
                                    <label>Vaccinations up to date?</label>
                                    <select value={vaccinated} onChange={(e) => setVaccinated(e.target.value)}>
                                        <option value="">Select</option>
                                        <option>Yes</option>
                                        <option>No</option>
                                    </select>
                                </div>
                                <div className="regField">
                                    <label>Any allergies or medical conditions</label>
                                    <textarea rows={2} value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g. allergic to certain foods, on medication..." />
                                </div>
                                <div className="regField">
                                    <label>Behaviour notes</label>
                                    <textarea rows={2} value={behaviourNotes} onChange={(e) => setBehaviourNotes(e.target.value)} placeholder="e.g. nervous around other dogs, pulls on lead..." />
                                </div>
                            </div>

                            <div className="regSection">
                                <h3 className="regSectionTitle">Emergency contact</h3>
                                <div className="regRow">
                                    <div className="regField">
                                        <label>Name</label>
                                        <input type="text" value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} />
                                    </div>
                                    <div className="regField">
                                        <label>Phone</label>
                                        <input type="tel" value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            {regError && <p style={{ color: 'red', fontSize: '12px' }}>{regError}</p>}

                            <div className="regActions">
                                <button className="regBackStepBtn" onClick={() => setStep(1)}>← Back</button>
                                <button className="regSubmitBtn" onClick={handleRegister}>Create account</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default LogInBox
