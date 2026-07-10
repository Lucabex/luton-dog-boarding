function DogCard({ dog, selected, onSelect }) {
    return (
        <div
            className={`dogCard ${selected ? 'dogCard--selected' : ''}`}
            onClick={() => onSelect(dog.id)}
        >
            <div className="dogCardTop">
                <div className="dogCardPhoto">
                    {dog.photoUrl
                        ? <img src={dog.photoUrl} alt={dog.name} />
                        : <div className="dogCardPhotoPlaceholder">🐶</div>
                    }
                </div>
                <div className="dogCardMainInfo">
                    <h4 className="dogCardName">Pet name:{dog.name}</h4>
                    <span className="dogCardBreed">Dog breed:{dog.breed}</span>
                    <div className="dogCardTags">
                        <span className="dogTag">{dog.age}y.o</span>
                        <span className="dogTag">{dog.size}</span>
                        <span className="dogTag">{dog.sex}</span>
                        <span className={`dogTag ${dog.neutered ? 'dogTag--green' : 'dogTag--red'}`}>
                            {dog.neutered ? 'Neutered' : 'Not neutered'}
                        </span>
                        <span className={`dogTag ${dog.vaccinated ? 'dogTag--green' : 'dogTag--red'}`}>
                            {dog.vaccinated ? 'Vaccinated' : 'Not vaccinated'}
                        </span>
                    </div>
                </div>
                <div className={`dogCardSelectToggle ${selected ? 'active' : 'plus'}`}>
                    {selected ? '✓' : '+'}
                </div>
            </div>

            {(dog.allergies || dog.behaviourNotes) && (
                <div className="dogCardNotes">
                    {dog.allergies && <p><strong>Allergies:</strong> {dog.allergies}</p>}
                    {dog.behaviourNotes && <p><strong>Behaviour:</strong> {dog.behaviourNotes}</p>}
                </div>
            )}

            <div className="dogCardOwner">
                <div className="topDogCard"> 

                    <div className="dogCardTitle">
                        <h5 id='title'>Owner name</h5>
                        <span className="ownerDetails" id='info'>{dog.owner.firstName} {dog.owner.lastName}</span>
                    </div>

                        <div className="dogCardTitle" id="telephone">
                            <h5 id='title'>Telephone</h5>
                            <span className="ownerDetail" id='info'> {dog.owner.phone}</span>
                        </div>

                </div>
                
                <div className="dogCardOwnerInfo">
                   
                    <div className="topDogCard"> 

                        <div className="dogCardTitle">
                            <h5 id='title'>email</h5>
                            <span className="ownerDetail" id='info'> {dog.owner.email}</span>
                        </div>

                        <div className="ownerTelephone">
                            <div className="dogCardTitle"><h5>Address</h5>
                            <span className="ownerDetail" id='info'> {dog.owner.streetAddress}, {dog.owner.city}, {dog.owner.postcode}</span>
                            </div>
                        
                    </div>

                </div>



            
                    
                     
                </div>
                <div className="dogCardOwnerEmergency">
                    <span className="emergencyLabel" id='title'>Emergency contact</span>
                    <span className="ownerDetail" id='info'> {dog.emergencyContactName}</span>
                    <span className="ownerDetail" id='info'> {dog.emergencyContactPhone}</span>
                </div>
            </div>
        </div>
    )
}

export default DogCard