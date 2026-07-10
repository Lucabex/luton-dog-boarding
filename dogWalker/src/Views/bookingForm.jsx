import { useState, useContext } from "react"
import { createPortal } from "react-dom"

function BookingForm({ onSubmit, dogs = [], meetingDone }) {

    const [selectedDogId, setSelectedDogId] = useState(null)
    const [service, setService] = useState('')
    const [timeWalk, setTimeWalk] = useState('')

    const [startDay, setStartDay] = useState('')
    const [startMonth, setStartMonth] = useState('')
    const [startYear, setStartYear] = useState('')

    const [endDay, setEndDay] = useState('')
    const [endMonth, setEndMonth] = useState('')
    const [endYear, setEndYear] = useState('')
    const [confirmBook ,setConfirmBook] = useState(false)

    const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

    function handleSubmit() {
        const startDate = startDay && startMonth !== '' && startYear
            ? new Date(Date.UTC(startYear, startMonth, startDay)).toISOString()
            : null

        const endDate = endDay && endMonth !== '' && endYear
            ? new Date(Date.UTC(endYear, endMonth, endDay)).toISOString()
            : null

        const walkSlot = service === 'walk'
            ? timeWalk === '9-10' ? 1 : timeWalk === '11-12' ? 2 : 3
            : null

        onSubmit({ service, startDate, endDate, walkSlot, dogId: selectedDogId })
    }

    
    return (
















        <div className="userBookingBox">
      
            <div className="selectOne">
                <h2>Select a service</h2>
            </div>
            <div className="topSelection">
                <button className={service === 'boarding' ? 'bfServiceBtn bfActive' : 'bfServiceBtn'} onClick={() => setService('boarding')}>Boarding</button>
                <button className={service === 'walk' ? 'bfServiceBtn bfActive' : 'bfServiceBtn'} onClick={() => setService('walk')}>Walk</button>
                <button className={service === 'day care' ? 'bfServiceBtn bfActive' : 'bfServiceBtn'} onClick={() => setService('day care')}>Day care</button>
            </div>
            <div className="selectOne">
                <h2>Select a date</h2>
            </div>
            {service === 'boarding' && (
                <div className="bfDateSelectorBoarding">
                    <div className="bfStart">
                        <select onChange={(e) => setStartDay(e.target.value)}>
                            <option value="">Drop off day</option>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        <select value={startMonth} onChange={(e) => setStartMonth(e.target.value)}>
                            <option value="">Month</option>
                            {months.map((m, index) => (
                                <option key={index} value={index}>{m}</option>
                            ))}
                        </select>
                        <select value={startYear} onChange={(e) => setStartYear(e.target.value)}>
                            <option value="">Year</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                        </select>
                    </div>
                    <div className="bfEnd">
                        <select onChange={(e) => setEndDay(e.target.value)}>
                            <option value="">Pick up day</option>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
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
            )}

            {service === 'walk' && (
                <>
                    <div className="bfDateSelector">
                        <select onChange={(e) => setStartDay(e.target.value)}>
                            <option value="">Day</option>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        <select value={startMonth} onChange={(e) => setStartMonth(e.target.value)}>
                            <option value="">Month</option>
                            {months.map((m, index) => (
                                <option key={index} value={index}>{m}</option>
                            ))}
                        </select>
                        <select value={startYear} onChange={(e) => setStartYear(e.target.value)}>
                            <option value="">Year</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                        </select>
                    </div>
                    <div className="bfServices" id="bfServicesSon">
                        <button className={timeWalk === '9-10' ? 'bfServiceBtn bfActive' : 'bfServiceBtn'} onClick={() => setTimeWalk('9-10')}>9:00-10:00</button>
                        <button className={timeWalk === '11-12' ? 'bfServiceBtn bfActive' : 'bfServiceBtn'} onClick={() => setTimeWalk('11-12')}>11:00-12:00</button>
                        <button className={timeWalk === '13-14' ? 'bfServiceBtn bfActive' : 'bfServiceBtn'} onClick={() => setTimeWalk('13-14')}>13:00-14:00</button>
                    </div>
                    {timeWalk ? <>
                        <div className="priceWalk">
                        <p>Price : £15 </p>
                        </div>
                    </>:
                    <></>}
                
                    </>
            )}

            {service === 'day care' && (
                <div className="bfDateSelector" id="forPrice">
                    <div className="forPriceBox">
                        <select onChange={(e) => setStartDay(e.target.value)}>
                            <option value="">Day</option>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        <select value={startMonth} onChange={(e) => setStartMonth(e.target.value)}>
                            <option value="">Month</option>
                            {months.map((m, index) => (
                                <option key={index} value={index}>{m}</option>
                            ))}
                        </select>
                        <select value={startYear} onChange={(e) => setStartYear(e.target.value)}>
                            <option value="">Year</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                        </select>
                    </div>
                    <div>
                         <p>Price : £35 </p>
                    </div>
                     
                </div>
                
            )}

            <div className="bfCreateBtn" id="bfBookingBtn">
                {dogs.length > 0 && (
                    <select id="bfChooseADog" onChange={(e) => setSelectedDogId(Number(e.target.value))}>
                        <option value="">Select a dog</option>
                        {dogs.map(dog => (
                            <option key={dog.id} value={dog.id}>{dog.name}</option>
                        ))}
                    </select>
                )}
                {service === 'boarding' && startDay && startMonth !== '' && startYear && endDay && endMonth !== '' && endYear && (
    <div className="costEstimate">
        {(() => {
            const start = new Date(Date.UTC(startYear, startMonth, startDay))
            const end = new Date(Date.UTC(endYear, endMonth, endDay))
            const nights = Math.round((end - start) / (1000 * 60 * 60 * 24))
            return nights > 0 ? <p>Boarding price: £{nights * 40} ({nights} night{nights > 1 ? 's' : ''})</p> : null
        })()}
    </div>
)}
           <button onClick={() => setConfirmBook(true)}>Confirm Booking</button>
          


            </div>
          {confirmBook && createPortal(
    <div className="stage" onClick={() => setConfirmBook(false)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modalTitle">Confirm your booking</h3>

            {service === '' && (
                <p className="confirmEmpty">Please select a service and date first.</p>
            )}

            {service === 'walk' && (
                <div className="confirmBox">
                    <div className="confirmRow">
                        <span className="confirmLabel">Service</span>
                        <span>Dog Walk</span>
                    </div>
                    <div className="confirmRow">
                        <span className="confirmLabel">Date</span>
                        <span>{startDay && months[startMonth] ? `${startDay} ${months[startMonth]} ${startYear}` : 'Not selected'}</span>
                    </div>
                    <div className="confirmRow">
                        <span className="confirmLabel">Time slot</span>
                        <span>{timeWalk || 'Not selected'}</span>
                    </div>
                    <div className="confirmRow">
                        <span className="confirmLabel">Dog</span>
                        <span>{dogs.find(d => d.id === selectedDogId)?.name || 'Not selected'}</span>
                    </div>
                    <div className="confirmRow confirmPrice">
                        <span className="confirmLabel">Price</span>
                        <span>£15</span>
                    </div>
                </div>
            )}

            {service === 'boarding' && (
                <div className="confirmBox">
                    <div className="confirmRow">
                        <span className="confirmLabel">Service</span>
                        <span>Boarding</span>
                    </div>
                    <div className="confirmRow">
                        <span className="confirmLabel">Drop off</span>
                        <span>{startDay && months[startMonth] ? `${startDay} ${months[startMonth]} ${startYear}` : 'Not selected'}</span>
                    </div>
                    <div className="confirmRow">
                        <span className="confirmLabel">Pick up</span>
                        <span>{endDay && months[endMonth] ? `${endDay} ${months[endMonth]} ${endYear}` : 'Not selected'}</span>
                    </div>
                    <div className="confirmRow">
                        <span className="confirmLabel">Dog</span>
                        <span>{dogs.find(d => d.id === selectedDogId)?.name || 'Not selected'}</span>
                    </div>
                    {startDay && startMonth !== '' && startYear && endDay && endMonth !== '' && endYear && (
                        <div className="confirmRow confirmPrice">
                            <span className="confirmLabel">Price</span>
                            <span>
                                {(() => {
                                    const start = new Date(Date.UTC(startYear, startMonth, startDay))
                                    const end = new Date(Date.UTC(endYear, endMonth, endDay))
                                    const nights = Math.round((end - start) / (1000 * 60 * 60 * 24))
                                    return `£${nights * 40} (${nights} night${nights > 1 ? 's' : ''})`
                                })()}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {service === 'day care' && (
                <div className="confirmBox">
                    <div className="confirmRow">
                        <span className="confirmLabel">Service</span>
                        <span>Day Care</span>
                    </div>
                    <div className="confirmRow">
                        <span className="confirmLabel">Date</span>
                        <span>{startDay && months[startMonth] ? `${startDay} ${months[startMonth]} ${startYear}` : 'Not selected'}</span>
                    </div>
                    <div className="confirmRow">
                        <span className="confirmLabel">Dog</span>
                        <span>{dogs.find(d => d.id === selectedDogId)?.name || 'Not selected'}</span>
                    </div>
                    <div className="confirmRow confirmPrice">
                        <span className="confirmLabel">Price</span>
                        <span>£35</span>
                    </div>
                </div>
            )}

            <div className="confirmActions">
                <button className="backBtn" onClick={() => setConfirmBook(false)}>Back</button>
                {service !== '' && (
                    <button className="saveBtn" onClick={() => { handleSubmit(); setConfirmBook(false) }}>Book</button>
                )}
            </div>
            <div className="paymentInstructions">
    <h4 className="paymentTitle">Payment details</h4>
    <p className="paymentText">If you prefer card payment, please transfer the amount to:</p>
    <div className="paymentDetails">
        <div className="confirmRow">
            <span className="confirmLabel">Account name</span>
            <span>Luca Bercioux</span>
        </div>
        <div className="confirmRow">
            <span className="confirmLabel">Sort code</span>
            <span>20-74-63</span>
        </div>
        <div className="confirmRow">
            <span className="confirmLabel">Account number</span>
            <span id="accNumb">53186814</span>
        </div>
    </div>
    <p className="paymentNote">Payment must be completed before the booking start date. Cash payment has to be made at the beginning of the booking.</p>
</div>
        </div>
    </div>,
    document.body
)}
        </div>
    )
}

export default BookingForm