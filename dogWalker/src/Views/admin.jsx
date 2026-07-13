import { useState,useEffect } from "react"
import DogCard from './dogCard'
import { API_URL } from '../apiConfig'

function Admin(){
    const[adminDay,setAdminDay]=useState('');
    const[adminMonth,setAdminMonth]=useState('');
    const[adminYear,setadminYear]=useState('');
    const [service, setService]= useState('');
    const [dogs, setDogs] = useState([]);
    const[timeWalk,setTimeWalk] = useState('')
    const [selectedDogId, setSelectedDogId] = useState(null);
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
   const [endDay, setEndDay] = useState('');
const [endMonth, setEndMonth] = useState('');
const [endYear, setEndYear] = useState('');
    useEffect(() => {
        fetch(`${API_URL}/api/dog`)
            .then(r => r.json())
            .then(data => setDogs(data))
    }, [])

    async function handleAdminBooking() {
    if (!selectedDogId || !service) {
        console.log('select a service and a dog')
        return
    }
    

    const token = localStorage.getItem('token')

    const startDate = adminDay && adminMonth !== '' && adminYear
    ? new Date(Date.UTC(adminYear, adminMonth, adminDay)).toISOString()
    : null

const endDate = endDay && endMonth !== '' && endYear
    ? new Date(Date.UTC(endYear, endMonth, endDay)).toISOString()
    : null
    const walkSlot = service === 'walk'
        ? timeWalk === '9-10' ? 1 : timeWalk === '11-12' ? 2 : 3
        : null

    const endpoint = service === 'walk'
        ? `${API_URL}/api/booking/walk`
        : service === 'boarding'
        ? `${API_URL}/api/booking/boarding`
        : `${API_URL}/api/booking/daycare`

    const nights = startDate && endDate
        ? Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
        : null

    const body = service === 'walk'
        ? { dogId: selectedDogId, walkDate: startDate, walkSlot }
        : service === 'boarding'
        ? { dogId: selectedDogId, startDate, endDate, numberOfNights: nights }
        : { dogId: selectedDogId, daycareDate: startDate }

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })

    if (res.ok) {
        console.log('booking created')
    } else {
        const msg = await res.text()
        console.log('booking failed:', msg)
    }
}

    return(
        <>
        <div className="adminBox">
            
            <div className="topAdmin">
                <h2>Welcome back Luca</h2>
            </div>
            <div className="adminBookingBox">
                <div className="createBookingBox">
                    <h5>Add a new booking</h5>
                    <div className="adminServices">
                            <button className={service === 'boarding' ? 'serviceBtn active' : 'serviceBtn'} onClick={()=>setService('boarding')}>Boarding</button>
                            <button className={service === 'walk' ? 'serviceBtn active' : 'serviceBtn'} onClick={()=>setService('walk')}>Walk</button>
                            <button className={service === 'day care' ? 'serviceBtn active' : 'serviceBtn'} onClick={()=>setService('day care')}>Day care</button>
                    </div>

                       { service=== 'boarding' ? (<div className="AdminDateSelector">

                            <div className="start">
                                <select name="adminDay" onChange={(e)=>setAdminDay(e.target.value)}>
                                    <option value="">Drop off day</option>
                                        {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                                    <option key={d} value={d}>{d}</option>
                                        ))}
                                </select>

                                <select value={adminMonth} onChange={(e) => setAdminMonth(e.target.value)}>
                                    <option value="">Month</option>
                                        {months.map((m, index) => (
                                    <option key={index} value={index}>{m}</option>
                                    ))}
                                </select>

                                <select value={adminYear} onChange={(e) => setadminYear(e.target.value)}>
                                    <option value="">Year</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                </select>
                            </div>


                            <div className="end">
                                <select onChange={(e) => setEndDay(e.target.value)}>
                                    <option value="">Pick up day</option>
                                        {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                                    <option key={d} value={d}>{d}</option>
                                        ))}
                                </select>

                                <select value={endMonth} onChange={(e) => setEndMonth(e.target.value)}>
                                    <option value="">Month</option>
                                        {months.map((m, index) => (
                                    <option key={index} value={index}>{m}</option>
                                        ))}
                                </select>

                                <select value={endYear} onChange={(e) => setEndYear(e.target.value)}>
                                    <option value="">Year</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                </select>
                            </div>

                          </div>
                       ):
                        
                         service=== 'walk' ? (<>
                                <div className="AdminDateSelector">
                                    <select name="adminDay" onChange={(e)=>setAdminDay(e.target.value)}>
                                        <option value="">Day</option>
                                            {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                                        <option key={d} value={d}>{d}</option>
                                            ))}
                                    </select>

                                    <select value={adminMonth} onChange={(e) => setAdminMonth(e.target.value)}>
                                        <option value="">Month</option>
                                            {months.map((m, index) => (
                                        <option key={index} value={index}>{m}</option>
                                            ))}
                                    </select>

                                    <select value={adminYear} onChange={(e) => setadminYear(e.target.value)}>
                                        <option value="">Year</option>
                                        <option value="2026">2026</option>
                                        <option value="2027">2027</option>
                                    </select>
                                </div>
                                <div className="adminServices" id='adminServicesSon'>
                                    <button className={timeWalk === '9-10' ? 'serviceBtn active' : 'serviceBtn'} onClick={()=>setTimeWalk('9-10')}>9:00-10:00</button>
                                    <button className={timeWalk === '11-12' ? 'serviceBtn active' : 'serviceBtn'} onClick={()=>setTimeWalk('11-12')}>11:00-12:00</button>
                                    <button className={timeWalk === '13-14' ? 'serviceBtn active' : 'serviceBtn'} onClick={()=>setTimeWalk('13-14')}>13:00-14:00</button>
                                </div>
                                </>
                                ):
                                (
                                <div className="AdminDateSelector">
                                    <select name="adminDay" onChange={(e)=>setAdminDay(e.target.value)}>
                                        <option value="">Day</option>
                                            {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                                        <option key={d} value={d}>{d}</option>
                                            ))}
                                    </select>

                                    <select value={adminMonth} onChange={(e) => setAdminMonth(e.target.value)}>
                                        <option value="">Month</option>
                                            {months.map((m, index) => (
                                        <option key={index} value={index}>{m}</option>
                                            ))}
                                    </select>

                                    <select value={adminYear} onChange={(e) => setadminYear(e.target.value)}>
                                        <option value="">Year</option>
                                        <option value="2026">2026</option>
                                        <option value="2027">2027</option>
                                    </select>
                                </div>)
                                }
                        
                            <h5>Select a dog</h5>
                            <div className="displayDogContainer">

                                <div className="displaydogCardBox">
                                    {dogs.map(dog => (
                                        <DogCard
                                        key={dog.id}
                                        dog={dog}
                                        selected={selectedDogId === dog.id}
                                        onSelect={setSelectedDogId}
                                    />
                                    ))}
                                </div>
                            </div>
                            <div className="creteBookingBtn">
                                <button onClick={handleAdminBooking}>Create Booking</button>
                            </div>
                        
                    
                    
                </div>
            </div>
            
        </div>
        </>)
}
export default Admin