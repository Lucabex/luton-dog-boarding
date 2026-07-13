import { useContext, useState } from 'react'
import { Context } from '../context'
import { API_URL } from '../apiConfig'

function AddPet({ token }) {
    const { setAddPet } = useContext(Context)

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
    const [petPreview, setPetPreview] = useState(null)
    const [petFile, setPetFile] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    function handlePetImage(e) {
        const file = e.target.files[0]
        if (file) {
            setPetFile(file)
            setPetPreview(URL.createObjectURL(file))
        }
    }

    async function handleSubmit() {
    setError('')
    try {
        const res = await fetch(`${API_URL}/api/dog/addpet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name: dogName,
                breed,
                age: parseInt(age),
                size,
                sex,
                neutered: neutered === 'Yes',
                vaccinated: vaccinated === 'Yes',
                allergies,
                behaviourNotes,
                emergencyContactName,
                emergencyContactPhone
            })
        })

        if (!res.ok) {
            setError('Something went wrong, try again')
            return
        }

        const { dogId } = await res.json()

        if (petFile) {
            const formData = new FormData()
            formData.append('file', petFile)
            await fetch(`${API_URL}/api/dog/${dogId}/photo`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            })
        }

        setSuccess(true)
        setTimeout(() => setAddPet(false), 1500)

    } catch (err) {
        setError('Something went wrong, try again')
    }
}

    return (
        <div className="addPetBox">
            <div className="addPetHeader">
                <button className="regBackBtn" onClick={() => setAddPet(false)}>← Back</button>
                <h2>Add a new pet</h2>
            </div>

            <div className="regBody">
                <div className="regSection">
                    <h3 className="regSectionTitle">Dog info</h3>
                    <div className="petTopRow">
                        <div className="petImgUpload">
                            <label className="petImgLabel" htmlFor="addPetImg">
                                {petPreview
                                    ? <img src={petPreview} alt="pet" className="petImgPreview" />
                                    : <span>📷<br />+Add photo</span>
                                }
                            </label>
                            <input id="addPetImg" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePetImage} />
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

                {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
                {success && <p style={{ color: 'green', fontSize: '12px' }}>Pet added successfully!</p>}

                <button className="regSubmitBtn" onClick={handleSubmit}>Add Pet</button>
            </div>
        </div>
    )
}

export default AddPet