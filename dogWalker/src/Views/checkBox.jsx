import { useState, useEffect, useContext } from "react"
import { Context } from '../context'
import BookingForm from "./bookingForm";
import Calendar from './calendar2'
import { API_URL } from '../apiConfig'

function CheckBox(){
   
    const [hideService, setHideService] = useState('');
    const { month, year, MoveBack, MoveForward, triggerRefresh } = useContext(Context);
    
    const weekDay = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
    const monthName = ['January','February','March','April','May','June','July','August','September','October','November','December']
    const [dogs, setDogs] = useState([])
    const [bookingSuccess, setBookingSuccess] = useState(false)
    const [bookingError, setBookingError] = useState('')
    const [isApproved, setIsApproved] = useState(false)
    const leftArray = buildMonth(year, month)
    const rightArray = buildMonth(year, month + 1)
    
    function buildMonth(year, month){
        const howManyD = new Date(year, month+1, 0).getDate()
        const firstDay = new Date(year, month, 1).getDay()
        const startingDay = firstDay === 0 ? 6 : firstDay - 1
        const calendarArray = []
        for (let i = 0; i < startingDay; i++){
            calendarArray.push(null)
        }
        for (let d = 1; d <= howManyD; d++){
            calendarArray.push(d)
        }
        return calendarArray
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return
        fetch(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(data => setIsApproved(data))
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return
        fetch(`${API_URL}/api/dog/mine`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(data => setDogs(data))
    }, [])

    async function handleSubmit(data) {
        setBookingError('')
        setBookingSuccess(false)

        if (!data.dogId) {
            setBookingError('Please select a dog before creating a booking.')
            return
        }

        if (!data.startDate) {
            setBookingError('Please select a date for your booking.')
            return
        }

        if (data.service === 'boarding' && !data.endDate) {
            setBookingError('Please select a pick up date.')
            return
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const selectedStart = new Date(data.startDate)

        if (selectedStart < today) {
            setBookingError('Please select a future date — past dates cannot be booked.')
            return
        }

        if (data.service === 'boarding' && data.endDate) {
            const selectedEnd = new Date(data.endDate)
            if (selectedEnd <= selectedStart) {
                setBookingError('Pick up date must be after the drop off date.')
                return
            }
        }

        const endpoint = data.service === 'walk'
            ? `${API_URL}/api/booking/walk`
            : data.service === 'boarding'
            ? `${API_URL}/api/booking/boarding`
            : `${API_URL}/api/booking/daycare`

        const body = data.service === 'walk'
            ? { dogId: data.dogId, walkDate: data.startDate, walkSlot: data.walkSlot }
            : data.service === 'boarding'
            ? { dogId: data.dogId, startDate: data.startDate, endDate: data.endDate, numberOfNights: data.numberOfNights }
            : { dogId: data.dogId, daycareDate: data.startDate }

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(body)
        })

        if (res.ok) {
            setBookingSuccess(true)
            triggerRefresh()
        } else {
            const msg = await res.text()
            setBookingError(msg || 'Something went wrong — please try again.')
        }
    }
        
    return(
        <>
        <div className="checkBox3">

            {!isApproved ? (
                <div className="setMeetingbox">
                    <div className="meetingTitle">
                        <h2>Welcome to Luton Dog Boarding</h2>
                    </div>
                    <div className="meetingContent">
                        <div className="meetingIconCircle">✓</div>
                        <h3 className="meetingSubtitle">Account created successfully</h3>
                        <p className="meetingText">
                            Before your first booking we need to arrange a short meet and greet — a chance for us to meet you and your dog in person.
                        </p>
                        <div className="meetingNotice">
                            <p>Someone will be in touch within a few hours. Keep an eye on your email or WhatsApp.</p>
                        </div>
                        <p className="meetingFooter">In the meantime feel free to explore the site and check availability on the calendar below.</p>
                    </div>
                </div>
            ) : (
                <>
                    <h2 id="topCreate">Create a new booking</h2>
                    <BookingForm dogs={dogs} onSubmit={handleSubmit} />
                    {bookingError && (
                        <div className="bookingErrorBox">
                            <span className="bookingErrorIcon">!</span>
                            <p>{bookingError}</p>
                            <button onClick={() => setBookingError('')}>Dismiss</button>
                        </div>
                    )}
                    {bookingSuccess && (
                        <div className="bookingConfirmBox">
                            <span className="bookingConfirmIcon">✓</span>
                            <h3>Booking received!</h3>
                            <p>Thank you — we'll be in touch shortly to confirm your slot.</p>
                            <button onClick={() => setBookingSuccess(false)}>Close</button>
                        </div>
                    )}
                </>
            )}
                  
            <div className="copyCBox">
                <Calendar />
                <div className="calendarNote">
                    <p>Can't find a free slot? Reach out and I'll do my best to accommodate you.</p>
                </div>
            </div>
                    
        </div>
        </>
    )
}
export default CheckBox