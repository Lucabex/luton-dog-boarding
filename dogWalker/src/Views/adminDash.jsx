import { useState, useEffect } from "react";
import Admin from "./admin";


function AdminDash({ user, token }) {
  const [activeTab, setActiveTab] = useState("bookings");
  const [allBookingList, setAllBookingList] = useState([]);
const [amounts, setAmounts] = useState({})
const [inputKey, setInputKey] = useState(0)
const [refreshKey, setRefreshKey] = useState(0)
 const [allOwnersList, setAllOwnersList] = useState([]);
 const [addLog,setAddLog] = useState(true)
const [openLogId, setOpenLogId] = useState(null)
 const [bookIdXlogs,setBookingIdXLogs]=useState(0)
 const [allLogs,setAllLogs]=useState([])
 const [counterUpdateLog,setCounterUpdateLog]=useState(0)


 //Logs
 const [dayLog,setDayLog] = useState("");
 const [timeLog,setTimeLog] = useState("");
 const [durationLog,setDurationLog] = useState("");
 const [typeLog,setTypeLog] = useState("");
 const [logFialed,setLogFailed]=useState(false)


  const tabs = [
    { id: "create", label: "create Booking" },
    { id: "bookings", label: "All Bookings" },
    { id: "owners", label: "All Owners" }
    
    
  ];
const BASIC_URL = "http://192.168.0.209:5208"

const [galleryInputKey, setGalleryInputKey] = useState(0)

async function handleFalseShow(id){
   setOpenLogId(null)
  setBookingIdXLogs(id)

}
async function handleTrueShow(id){
 setOpenLogId(id)
  setBookingIdXLogs(id)
  if(counterUpdateLog ==10){
    setCounterUpdateLog(0)
  }
  setCounterUpdateLog(prev=> prev+1)

}
async function handleAddLog(bookId){
 if (!dayLog || !timeLog || !durationLog || !typeLog) {
        console.log("all fields are mandatory")
        setLogFailed(true)
        return
    }
      const res = await fetch(`${BASIC_URL}/api/booking/${bookId}/addlog`,{
        method:'POST',
        headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        body: JSON.stringify({
                Day: dayLog,
                ActivityType: typeLog,
                Time: timeLog,
                Duration: durationLog
                })
      })
      if (res.ok) {
            setLogFailed(false)
            console.log('log added')
            setDayLog('')
            setTimeLog('')
            setDurationLog('')
            setTypeLog('')
            if(counterUpdateLog ==10){
        setCounterUpdateLog(0)
        setCounterUpdateLog(prev=> prev+1)
      }
  
    } else {
        const msg = await res.text()
        console.log('add log failed', res.status, msg)
        
    }
}
async function uploadBookingPhoto(bookingId, file) {
  console.log("i m entering upload gallery")
    if (!file) return
    
    const formData = new FormData()
    formData.append('file', file)
    
    await fetch(`${BASIC_URL}/api/gallery/${bookingId}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    })
    
    setGalleryInputKey(prev => prev + 1)
    console.log("picture uploaded")
}

useEffect(()=>{
    if(!bookIdXlogs) return
    fetch(`${BASIC_URL}/api/booking/${bookIdXlogs}/logs`,{
        headers:{Authorization:`Bearer ${token}`},
    })
    .then((res)=>res.json())
    .then((data)=>{
        console.log("logs data:", data)
        setAllLogs(Array.isArray(data) ? data : [])
    })
},[bookIdXlogs, counterUpdateLog])

async function handleDelete(id){
  await fetch(`${BASIC_URL}/api/booking/${id}/deletebooking`,{
    method:"DELETE",
     headers: { Authorization: `Bearer ${token}` }
  })
  setRefreshKey(prev => prev+1);
}

  
  async function markAsUnPaid(id) {
    await fetch(`${BASIC_URL}/api/booking/${id}/unpay`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify()
    })
   setRefreshKey(prev => prev + 1)
  }
  async function handleMeeting(id) {
    console.log("this is the id ",id)
    await fetch(`${BASIC_URL}/api/auth/${id}/meeting`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify()
    })
   setRefreshKey(prev => prev + 1)
  }
  async function handleApprove(id) {
    console.log("this is the id ",id)
    await fetch(`${BASIC_URL}/api/auth/${id}/approve`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify()
    })
   setRefreshKey(prev => prev + 1)
  }

  async function markAsPaid(id, amount) {
    await fetch(`${BASIC_URL}/api/booking/${id}/pay`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: parseFloat(amount) })
    })

    const res = await fetch(`${BASIC_URL}/api/booking/getAll`, {
        headers: { Authorization: `Bearer ${token}` }
    })
   const data = await res.json()

   setAllBookingList(data)
    setAmounts({})
    setAllBookingList(data)
    setAmounts(prev => ({ ...prev, [id]: undefined }))
    setInputKey(prev => prev + 1)
}

useEffect(()=>{
    if (!token) return;
    fetch(`${BASIC_URL}/api/auth/owners`,{
      headers:{Authorization:`Bearer ${token}`},
    })
    .then((res)=>res.json())
    .then((data)=>{
      setAllOwnersList(data)
      console.log("this is all the user info",data)
     
    })
 .catch(err => console.error("Owners fetch failed:", err));
  },[token, refreshKey])

  useEffect(() => {
    if (!token) return;
    fetch(`${BASIC_URL}/api/booking/getAll`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) =>{ 
        setAllBookingList(data)
        console.log("data from all booking",data)
    });
  }, [token, refreshKey]);


    async function MarkAsDone(id) {
    await fetch(`${BASIC_URL}/api/booking/${id}/complete`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    setRefreshKey(prev => prev + 1)
}
    async function MarkAsPending(id) {
    await fetch(`${BASIC_URL}/api/booking/${id}/pend`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    setRefreshKey(prev => prev + 1)
}
  




  function getDate(booking) {
    if (booking.serviceType === "walk")
      return new Date(booking.walkDate).toLocaleDateString("en-GB");
    if (booking.serviceType === "daycare")
      return new Date(booking.daycareDate).toLocaleDateString("en-GB");
    if (booking.serviceType === "boarding")
      return `${new Date(booking.startDate).toLocaleDateString("en-GB")} → ${new Date(booking.endDate).toLocaleDateString("en-GB")}`;
    return "N/A";
  }

  function getSlot(slot) {
    if (slot === 1) return "Morning";
    if (slot === 2) return "Afternoon";
    if (slot === 3) return "Evening";
    return null;
  }

  return (
    <div className="adminDashBox">
      <div className="tabBar">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`folderTab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className="allBookingBox">
        {activeTab === "create" && <Admin />}
        {activeTab === "bookings" && (
            <div className="adminBookingList">
              {allBookingList.map((booking) => (
                <div key={booking.id} className="adminBookCard">
          
                  <div className="adminBookCardTop">
                      <span className={`serviceTag ${booking.serviceType}`}>
                        {booking.serviceType}
                      </span>
                      <span className={`statusTag ${booking.status}`}>
                        {booking.status}
                      </span>
                        {booking.hasReview && <span className="reviewTag">⭐ Review left</span>}
                        {booking.isPaid
                          ? <span className="paidTag">✓ Paid — £{booking.amountPaid}</span>
                          : <span className="unpaidTag">Unpaid</span>
                        }
                    </div>

                    <div className="adminBookCardBody">
                      <div className="adminBookSection">
                        <h4 className="adminBookSectionTitle">Booking</h4>
                          <div className="adminBookRow">
                            <span className="adminBookLabel">Dog</span>
                            <span>{booking.dogName}</span>
                          </div>
                          <div className="adminBookRow">
                            <span className="adminBookLabel">Date</span>
                            <span>{getDate(booking)}</span>
                          </div>
                          {booking.walkSlot && (
                              <div className="adminBookRow">
                                <span className="adminBookLabel">Slot</span>
                                <span>{getSlot(booking.walkSlot)}</span>
                              </div>
                          )}
                          {booking.numberOfNights > 0 && (
                              <div className="adminBookRow">
                                <span className="adminBookLabel">Nights</span>
                                <span>{booking.numberOfNights}</span>
                              </div>
                          )}
                              <div className="adminBookRow">
                                <span className="adminBookLabel">Booked on</span>
                                <span>{new Date(booking.createdAt).toLocaleDateString("en-GB")}</span>
                              </div>
                              <div className="adminBookRow">
                                <span className="adminBookLabel">Booking Id</span>
                                <span>{booking.id}</span>
                              </div>
                     </div>

                    <div className="adminBookSection">
                        <h4 className="adminBookSectionTitle">Owner</h4>
                        <div className="adminBookRow">
                            <span className="adminBookLabel">Name</span>
                            <span>{booking.ownerFirstName} {booking.ownerLastName}</span>
                        </div>
                        <div className="adminBookRow">
                            <span className="adminBookLabel">UserName</span>
                            <span>{booking.ownerUserName} </span>
                        </div>
                        <div className="adminBookRow">
                            <span className="adminBookLabel">Email</span>
                            <span>{booking.ownerEmail}</span>
                        </div>
                        <div className="adminBookRow">
                            <span className="adminBookLabel">Phone</span>
                            <span>{booking.ownerPhone}</span>
                        </div>
                        <div className="adminBookRow">
                            <span className="adminBookLabel">Address</span>
                            <span>{booking.ownerAddress}</span>
                        </div>
                    </div>

                    {addLog ? <>
                    <div className="adminBookSection">
                      <label htmlFor="bookingDay">Day</label>
                      <input type="text" placeholder="Day" value={dayLog} onChange={(e)=>setDayLog(e.target.value)}/>
                      <label htmlFor="bookingDay">Act Type</label>
                      <input type="text" placeholder="Type" value={typeLog} onChange={(e)=>setTypeLog(e.target.value)}/>
                      <label htmlFor="bookingDay">Time</label>
                      <input type="text" placeholder="Time"value={timeLog} onChange={(e)=>setTimeLog(e.target.value)}/>
                      <label htmlFor="bookingDay">Duration</label>
                      <input type="text" placeholder="Duration" value={durationLog} onChange={(e)=>setDurationLog(e.target.value)}/>
                     <div className="showLogBtn">
    {openLogId === booking.id
    ? <button onClick={handleFalseShow}>Hide Logs</button>
    : <button onClick={()=>handleTrueShow(booking.id)}>Show Logs</button>}
    {logFialed ? <div><h5 style={{color:'red'}}>All fields are mandatory</h5></div> : <div></div>}
</div>
                      </div>
                      </>:<><div></div></>}


                      {openLogId === booking.id ? (
    <div className="adminBookSection">
        {allLogs.map((log)=>(
            <div key={log.id}>
                <div className="lineLog">
                    <h5>Day:{log.day}</h5>
                    <h5>Activity type:{log.activityType}</h5>
                    <h5>Time:{log.time}</h5>
                    <h5>Duration:{log.duration}</h5>
                </div>
            </div>
        ))}
    </div>
) : <div></div>}

                  <div className="adminBookSection">
                      <h4 className="adminBookSectionTitle">Payment</h4>
                      <div className="adminBookRow">
                          <span className="adminBookLabel">Amount</span>
                            <input
                                key={`${booking.id}-${inputKey}`}
                                type="number"
                                placeholder="£ amount"
                                className="amountInput"
                                onChange={(e) => setAmounts(prev => ({ ...prev, [booking.id]: e.target.value }))}
                            />
                        </div>

                        <div className="buttonLine">
                          <button
                            className="markPaidBtn"
                            onClick={() => markAsPaid(booking.id, amounts[booking.id] || 0)}
                          >
                          Mark as paid
                          </button>
                          <button
                            className="markCompleteBtn"
                            onClick={()=> MarkAsDone(booking.id)}
                          >
                          Mark as completed
                          </button>
                          <button
                            className="markPendingBtn"
                            onClick={()=> MarkAsPending(booking.id)}
                          >
                          Mark as Pending
                          </button>
                        </div>
                        <div className="buttonLine" id="buttonLine">
                          <button
                            className="markPaidBtn"
                            onClick={() => markAsUnPaid(booking.id)}
                          >
                          Mark as unpaid
                          </button>
                          <label className="markPaidBtn">
                              Upload picture
                              <input
                                  key={`gallery-${booking.id}-${galleryInputKey}`}
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={(e) => uploadBookingPhoto(booking.id, e.target.files[0])}
                              />
                          </label>
                          <button
                            className="markPendingBtn"
                            onClick={()=>handleAddLog(booking.id,booking.dogId)}
                          >
                          Log activity
                          </button>
                         
                          
                        </div>
                        <div className="buttonLine">
                              <button
                              className="deleteBookBtnSP"
                              onClick={()=> handleDelete(booking.id)}
                            >
                            Delete booking
                            </button>
                          </div>
                      </div>
                  </div>
              </div>
))}
          </div>
        )}
        {activeTab === "owners" && 
        <>
        
        <div className="allOwnerBox">
          {allOwnersList.map((owner)=>(
            <div key={owner.id} className="allOwnerCard">
              
                <div className="topOwner">
                
                  <div className="topBlock">
                    {owner.meetingDone == false ? <> 
                      <div className="meetingTogNot">
                        <p>No Meeting</p>
                      </div>
                    </>:
                    <>
                     <div className="meetingTog">
                        <p>Meeting Done</p>
                      </div>
                    </>}
                  </div>

                   <div className="topBlock">
                    {owner.isApproved == true ? <> 
                       <div className="meetingTog">
                        <p>Approved</p>
                      </div>
                    </>:
                    <>
                    <div className="meetingTogNot">
                        <p>Not approved</p>
                      </div>
                    </>}
                  </div>
                   
                  <div className="topBlock">
                    <div className="totalB">
                     <p>Total Books: {owner.totalBookings}</p> 
                    </div>
                      
                  </div>
                  
                  <div className="topBlock">
                    <div className="totalC">
                     <p>Total: {owner.totalSpent}£</p> 
                    </div>
                      
                  </div>
                </div>

                <div className="OwnerInfo">
                    <p>Name: {owner.firstName.charAt(0).toUpperCase() + owner.firstName.slice(1)} {owner.lastName.charAt(0).toUpperCase() + owner.lastName.slice(1)}</p>
                    <p>Telephone: {owner.phone}</p>
                    <p>Email: {owner.email}</p>
                    <p>Address: {owner.streetAddress}</p>
                    <p>Post Code: {owner.postcode}</p>
                    <p>UserName: {owner.username}</p>
                    <p>Member since: {new Date(owner.createdAt).toLocaleDateString('en-GB')}</p>
                    <p>N. of dogs: {owner.dogs.length}</p>
                  <div className="ownerDogsBox">
                    {owner.dogs.map((dog) => (
                      <div key={dog.dogId} className="ownerDogCard">
                        <div className="ownerDogPhoto">
                          {dog.photoUrl
                            ? <img src={`${BASIC_URL}${dog.photoUrl}`} alt={dog.name} />
                            : <span>No photo</span>
                          }
                        </div>
                        <div className="ownerDogInfo">
                          <p>Name: {dog.name}</p>
                          <p>Breed: {dog.breed}</p>
                          <p>Age: {dog.age}</p>
                          <p>Size: {dog.size}</p>
                          <p>Sex: {dog.sex}</p>
                          <p>Neutered: {dog.neutered ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="togleBox">
                    <div>
                      <button onClick={()=> handleMeeting(owner.ownerId)} id="meeting">Set Meeting</button>

                    </div>
                    <div>
                      <button onClick={()=> handleApprove(owner.ownerId)} id="approved">Set Approved</button>

                    </div>
                    {owner.review.length > 0
                        ? <p id="ratingYes">Avg rating: {(owner.review.reduce((sum, r) => sum + r.rating, 0) / owner.review.length).toFixed(1)} ⭐</p>
                        : <p id="ratingYes">No reviews</p>
}
                    
                  
                  </div>
                </div>
            </div>
          ))}
        </div>
        </>}
      
        
      </div>
    </div>
  );
}

export default AdminDash;