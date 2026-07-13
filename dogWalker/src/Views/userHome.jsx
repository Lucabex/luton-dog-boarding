import { useState, useEffect,useContext } from "react"
import{Context} from '../context'
import { createPortal } from "react-dom"
import { API_URL } from '../apiConfig'

function UserHome({ user, token,onLogout }) {
    const [userPreview, setUserpreview] = useState(null)
    const [dogs, setDogs] = useState([])
    const[nameInput,setNameInput]=useState('')
    const[lastInput,setLastInput]=useState('')
    const [dogIdDelete,setDogIdDelete]=useState()
    //new input
    const [nameEdit,setnNameEdit]= useState(null)
    const [phoneEdit,setnPhoneEdit]= useState(null)
    const [emailEdit,setEmailEdit]= useState(null)
    const [addressEdit,setAddressEdit]= useState(null)
    //----to redesply new value just saved
    const [nameAfter,setNameAfter] = useState('')
    const [phoneAfter,setPhoneAfter] = useState('')
    const [emailAfter,setEmailAfter] = useState('')
    const [addressAfter,setAddressAfter] = useState('')
    //-- manage the edit-save button toggle
    const [e1,setE1]=useState(false)
    const [e2,setE2]=useState(false)
    const [e3,setE3]=useState(false)
    const [e4,setE4]=useState(false)

    //modal toggle
    const [editDogId,setEditDogId]= useState(null)

    const{addPet,setAddPet}=useContext(Context)
 
const [editForm, setEditForm] = useState({})

async function handleEditDog(id) {
    const res = await fetch(`${API_URL}/api/dog/${id}/editdog`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            name: editForm.name ?? dogs.find(d => d.id === id)?.name,
            breed: editForm.breed ?? dogs.find(d => d.id === id)?.breed,
            age: editForm.age ?? dogs.find(d => d.id === id)?.age,
            size: editForm.size ?? dogs.find(d => d.id === id)?.size,
            sex: editForm.sex ?? dogs.find(d => d.id === id)?.sex,
            neutered: editForm.neutered ?? dogs.find(d => d.id === id)?.neutered,
            vaccinated: editForm.vaccinated ?? dogs.find(d => d.id === id)?.vaccinated,
            allergies: editForm.allergies ?? dogs.find(d => d.id === id)?.allergies,
            behaviourNotes: editForm.behaviourNotes ?? dogs.find(d => d.id === id)?.behaviourNotes,
            emergencyContactName: editForm.emergencyContactName ?? dogs.find(d => d.id === id)?.emergencyContactName,
            emergencyContactPhone: editForm.emergencyContactPhone ?? dogs.find(d => d.id === id)?.emergencyContactPhone
        })
    })

    if (res.ok) {
         console.log('edit successful')
        setEditDogId(null)
        setEditForm({})
        // refresh dogs
        fetch(`${API_URL}/api/dog/mine`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(data => setDogs(data))
    }else {
    const msg = await res.text()
    console.log('edit failed', res.status, msg)
}
}

    


    useEffect(() => {
        if (!token) return
        fetch(`${API_URL}/api/dog/mine`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(data => {
      
        setDogs(data)
        setDogIdDelete()
    })
    }, [token])

    function isValidPhone(value) {
    const digits = value.replace(/\D/g, '')   
    return digits.length >= 10 && digits.length <= 13
}
function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
   async function HandleUserImg(e) {
    const file = e.target.files[0]
    if (!file) return

    setUserpreview(URL.createObjectURL(file))   

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`${API_URL}/api/auth/userphoto`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    })

    if (res.ok) {
        const data = await res.json()
        console.log('profile photo saved', data.photoUrl)
    }
}


async function saveField(field) {
      if (field === 'email' && !isValidEmail(emailEdit)) {
        alert('Please enter a valid email address')
        return
    }
    if (field === 'phone' && !isValidPhone(phoneEdit)) {
        alert('Please enter a valid phone number')
        return
    }
    const params = new URLSearchParams()
    if (field === 'name' && nameEdit) params.append('name', nameEdit)
    if (field === 'email' && emailEdit) params.append('email', emailEdit)
    if (field === 'phone' && phoneEdit) params.append('phone', phoneEdit)
    if (field === 'address' && addressEdit) params.append('address', addressEdit)

    const res = await fetch(`${API_URL}/api/auth/edituser?${params.toString()}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
})

if (res.ok) {
    console.log('updated', field)
} else {
    const errorText = await res.text()
    console.log('error', res.status, errorText)   
}

    if (field === 'name') {
        setE1(false)
        setNameAfter(nameEdit)
    }
    if (field === 'email') {
        setE2(false)
         setEmailAfter(emailEdit)
    }
    if (field === 'phone') {
        setE4(false)
        setPhoneAfter(phoneEdit)
    }
    if (field === 'address') {
        setE3(false)
        setAddressAfter(addressEdit)
    }

}

    return (
        <>
        <div className="userProfileBox">
            <div className="welcomeBack">
                <div className="topWelcomeBox">
                     <h2>Welcome back</h2>
                    <h2>{user?.firstName}</h2>
                </div>
               

                <div className="userPhoto">
                    <label htmlFor="userImg" className="userPicture">
                        {userPreview
                            ? <img src={userPreview} className="userImagePreview" />
                            : user?.photoUrl
                            ? <img src={user.photoUrl} className="userImagePreview" />
                            : <span>+ Add Photo</span>}
                    </label>
                        <input type="file" accept="image/*" id="userImg" className="profImg" onChange={HandleUserImg} hidden />
                </div>
                
                <span id="spanClick">click to add or change Image</span>
            </div>

            <div className="infoArea">
                <div className="userInfoHome">
                    
                    <div className="userInfoHome">
                        <div className="nameUserHome">
                            <h3>Name: </h3>
                        </div>
                        <div className="displayNameUserHome">
                            {e1
                                ? (<input
                                    value={nameEdit ?? user?.firstName ?? ''}
                                    onChange={(ev) => setnNameEdit(ev.target.value)}
                                    />)
                                : (nameAfter ? <h3>{nameAfter}</h3>:<h3 id="infoText">{user?.firstName}</h3>)
                            }
                        </div>
                        <div className="editSection">
                            <h3 id="edit" onClick={() => e1 ? saveField('name') : setE1(true)}>
                                {e1 ? 'Save' : 'Edit'}
                            </h3>
                    </div>
                </div>
                   
                </div>

                <div className="userInfoHome">
                    <div className="userInfoHome">
                        <div className="nameUserHome">
                            <h3 id="emailSize">Email: </h3>
                        </div>
                        <div className="displayNameUserHome">
                            {e2
                                ? (<input
                                value={emailEdit ?? user?.email ?? ''}
                                onChange={(ev) => setEmailEdit(ev.target.value)}
                                />)
                               : (emailAfter 
    ? <h3>{emailAfter}</h3>
    : <h3 id="infoText" style={{ fontSize: user?.email.length > 20 ? '12px' : '15px' }}>{user?.email}</h3>
)
                            }
                        </div>
                        <div className="editSection">
                            <h3 id="edit" onClick={() => e2 ? saveField('email') : setE2(true)}>
                                {e2 ? 'Save' : 'Edit'}
                            </h3>
                        </div>
                    </div>
                   
                </div>

                <div className="userInfoHome">
                    <div className="userInfoHome">
                        <div className="nameUserHome">
                            <h3>Address: </h3>
                        </div>
                        <div className="displayNameUserHome">
                            {e3
                                ? (<input
                                value={addressEdit ?? user?.streetAddress ?? ''}
                                onChange={(ev) => setAddressEdit(ev.target.value)}
                                />)
                            : (addressAfter ? <h3>{addressAfter}</h3>:<h3 id="infoText">{user?.streetAddress}</h3>)
                            }
                        </div>

                        <div className="editSection">
                            <h3 id="edit" onClick={() => e3 ? saveField('address') : setE3(true)}>
                            {e3 ? 'Save' : 'Edit'}
                            </h3>
                        </div>
                    </div>
                    
                </div>

                <div className="userInfoHome">
    <div className="userInfoHome">
        <div className="nameUserHome">
            <h3>Telephone: </h3>
        </div>
        <div className="displayNameUserHome">
            {e4
                ? (<input
                value={phoneEdit ?? user?.phone ?? ''}
                onChange={(ev) => setnPhoneEdit(ev.target.value)}
                />)
                : (phoneAfter ? <h3>{phoneAfter}</h3>:<h3 id="infoText">{user?.phone}</h3>)
            }
        </div>
        <div className="editSection">
            <h3 id="edit" onClick={() => e4 ? saveField('phone') : setE4(true)}>
                {e4 ? 'Save' : 'Edit'}
            </h3>
        </div>
    </div>
</div>
            </div>

            <div className="myPetAreaHome">

                <div className="myPet">
                    <div className="myPetTop">
                        <h2>My Pets</h2>
                    </div>
                    <div className="btnBox">
                        <button className="addPetBtn" onClick={()=> setAddPet(true)}>+ Add Pet</button>
                        <button className="logOutBtn" onClick={onLogout}>Log-out</button>
                    </div>
                   
                </div>


                <div className="myPetDisplay">
                    {dogs.map((dog, index) => (
                        <div className="petCard" key={dog.id}>
                            <div className="petPhotoSection">
                                <div className="petPhotoCircle">
                                {dog.photoUrl
                        ? <img src={dog.photoUrl} alt={dog.name} />
                        : <span>Photo</span>}
                                </div>
                                <span className="petNumber">PET {index + 1}</span>
                            </div>
                            <div className="petInfoSection">
                                <h3 className="petCardName">Pet Name: {dog.name}</h3>
                                <div className="petGrid">
                                    <div className="petGridItem">
                                        <span className="petGridLabel">Breed</span>
                                        <span className="petGridValue">{dog.breed}</span>
                                    </div>
                                    <div className="petGridItem">
                                        <span className="petGridLabel">Age</span>
                                        <span className="petGridValue">{dog.age} years</span>
                                    </div>
                                    <div className="petGridItem">
                                        <span className="petGridLabel">Sex</span>
                                        <span className="petGridValue">{dog.sex}</span>
                                    </div>
                                    <div className="petGridItem">
                                        <span className="petGridLabel">Size</span>
                                        <span className="petGridValue">{dog.size}</span>
                                    </div>
                                    <div className="petGridItem">
                                        <span className="petGridLabel">Neutered</span>
                                        <span className="petGridValue">{dog.neutered ? 'Yes' : 'No'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="petCardActions">
                                <button className="editPetBtn" onClick={()=>setEditDogId(dog.id)}>Edit</button>
                                {editDogId === dog.id && createPortal(
    <div className="stage" onClick={() => setEditDogId(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modalTitle">Edit {dog.name}</h3>

            <div className="editDogForm">
                <div className="editDogRow">
                    <div className="editDogField">
                        <label>Name</label>
                        <input type="text" defaultValue={dog.name} onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))} />
                    </div>
                    <div className="editDogField">
                        <label>Breed</label>
                        <input type="text" defaultValue={dog.breed} onChange={e => setEditForm(prev => ({ ...prev, breed: e.target.value }))} />
                    </div>
                </div>

                <div className="editDogRow">
                    <div className="editDogField">
                        <label>Age</label>
                        <input type="number" defaultValue={dog.age} onChange={e => setEditForm(prev => ({ ...prev, age: parseInt(e.target.value) }))} />
                    </div>
                    <div className="editDogField">
                        <label>Sex</label>
                        <select defaultValue={dog.sex} onChange={e => setEditForm(prev => ({ ...prev, sex: e.target.value }))}>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>
                    <div className="editDogField">
                        <label>Size</label>
                        <select defaultValue={dog.size} onChange={e => setEditForm(prev => ({ ...prev, size: e.target.value }))}>
                            <option>1kg-10kg</option>
                            <option>11kg–26kg</option>
                            <option>27kg+</option>
                        </select>
                    </div>
                </div>

                <div className="editDogRow">
                    <div className="editDogField">
                        <label>Neutered</label>
                        <select defaultValue={dog.neutered ? 'Yes' : 'No'} onChange={e => setEditForm(prev => ({ ...prev, neutered: e.target.value === 'Yes' }))}>
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                    </div>
                    <div className="editDogField">
                        <label>Vaccinated</label>
                        <select defaultValue={dog.vaccinated ? 'Yes' : 'No'} onChange={e => setEditForm(prev => ({ ...prev, vaccinated: e.target.value === 'Yes' }))}>
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                    </div>
                </div>

                <div className="editDogField">
                    <label>Allergies</label>
                    <textarea rows={2} defaultValue={dog.allergies} onChange={e => setEditForm(prev => ({ ...prev, allergies: e.target.value }))} />
                </div>

                <div className="editDogField">
                    <label>Behaviour notes</label>
                    <textarea rows={2} defaultValue={dog.behaviourNotes} onChange={e => setEditForm(prev => ({ ...prev, behaviourNotes: e.target.value }))} />
                </div>

                <div className="editDogRow">
                    <div className="editDogField">
                        <label>Emergency contact name</label>
                        <input type="text" defaultValue={dog.emergencyContactName} onChange={e => setEditForm(prev => ({ ...prev, emergencyContactName: e.target.value }))} />
                    </div>
                    <div className="editDogField">
                        <label>Emergency contact phone</label>
                        <input type="tel" defaultValue={dog.emergencyContactPhone} onChange={e => setEditForm(prev => ({ ...prev, emergencyContactPhone: e.target.value }))} />
                    </div>
                </div>
            </div>

            <div className="editDogActions">
                <button className="backBtn" onClick={() => setEditDogId(null)}>Cancel</button>
                <button className="saveBtn" onClick={() => handleEditDog(dog.id)}>Save</button>
            </div>
        </div>
    </div>,
    document.body
)}
                              
                            </div>
                        </div>
                    ))}
                </div>
            </div>

          
        </div>
        </>
    )
}

export default UserHome