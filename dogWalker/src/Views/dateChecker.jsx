import { useState } from "react"

function DateChecker(){
    const [service, setService]= useState('')
    const [bookingDay,setBookingDay] = useState('')
    const [bookingMonth, setBookingMonth] = useState('')
    const [bookingYear,setBookinkYear]= useState('')
    const [timeSlot,setTimeSlot]= useState('')
    const [dropOff,setDropOff] = useState('')
    const [pickUp, setPickUp] = useState('')
    const [numberNight,setNumberNight]= useState('')
    const timeOptions = ['9:45-10:45','11:45-12:45','13:15-14:15']

     
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    
    function buildTimeSlots(){
    const slots = []
    for(let h = 7; h <= 22; h++){
        for(let m = 0; m < 60; m += 15){
            if(h === 22 && m > 0) break
            const hour = String(h).padStart(2, '0')
            const minute = String(m).padStart(2, '0')
            slots.push(`${hour}:${minute}`)
        }
    }
    return slots
}
function buildNightOption(){
    const options = []
    for (let i=1; i<= 31; i++){
        options.push(i)
    }
    return options
}
const nightOptions = buildNightOption()
const timeSlots = buildTimeSlots()
    return(
        <>
        <div className="checkBox">

                {/* Block1 */}

            <div className="check1">
                <h1>Check availability</h1>
            </div>
                {/* Block2  choose walk or boarding*/}
            <div className="check2">

                <div className="lefty">

                    <h4>Service Type</h4>

                </div>

               

                <div className="dateDropdowns">
                    <button className={service === 'boarding' ? 'serviceBtn active' : 'serviceBtn'} onClick={()=>setService('boarding')}>Boarding</button>
                    <button className={service === 'walk' ? 'serviceBtn active' : 'serviceBtn'} onClick={()=>setService('walk')}>Walk</button>
               </div>
             
            </div>
                {/* Block3 if boarding */}
            {service === 'boarding' &&(
                <>
                <div className="check3">

                        <div className="lefty">
                            <h4>Select date</h4>
                        </div>

                        <div className="dateDropdowns">

                            <select value={bookingDay} onChange={(e) => setBookingDay(e.target.value)}>
                                <option value="">Day</option>
                                    {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                                <option key={d} value={d}>{d}</option>
                                ))}
                            </select>

                            <select value={bookingMonth} onChange={(e) => setBookingMonth(e.target.value)}>
                                <option value="">Month</option>
                                    {months.map((m, index) => (
                                <option key={index} value={index}>{m}</option>
                                ))}
                            </select>

                            <select value={bookingYear} onChange={(e) => setBookinkYear(e.target.value)}>
                                <option value="">Year</option>
                                <option value="2026">2026</option>
                                <option value="2027">2027</option>
                            </select>
                        </div>
             
                </div>
                {/* Block 4 if boarding drop-off pick-up */}
                <div className="check4B">

                        <div className="lefty1">
                            <h4>Drop-off</h4>
                        </div>

                        <div className="dropff">
                            <select value={dropOff} onChange={(e) => setDropOff(e.target.value)}>
                                <option value="" className="opt">Select</option>
                                {timeSlots.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>

                        <div className="lefty2">
                            <h4>Pick-Up</h4>
                        </div>

                        <div className="pickUp">
                            <select value={pickUp} onChange={(e) => setPickUp(e.target.value)}>
                                <option value="" className="opt">Select</option>
                                {timeSlots.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>

                        <div className="lefty2">
                            <h4>Nights</h4>
                        </div>

                        <div className="pickUp">
                            <select size={1} value={numberNight} onChange={(e) => setNumberNight(e.target.value)}>
                                <option value="" className="opt">Select</option>
                                {nightOptions.map(night => (
                                    <option key={night} value={night}>{night}</option>
                                ))}
                            </select>
                        </div>

                        


                        
             
                </div>
</>
            )}
            
                {/* Block3 if walk */}
            
           {service === 'walk' && (
            <>
            <div className="check3">
                 <div className="lefty">
                 <h4>Select date</h4>
                 </div>
                    <div className="dateDropdowns">
                        <select value={bookingDay} onChange={(e) => setBookingDay(e.target.value)}>
                            <option value="">Day</option>
                                {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                            <option key={d} value={d}>{d}</option>
                                ))}
                        </select>

                <select value={bookingMonth} onChange={(e) => setBookingMonth(e.target.value)}>
                    <option value="">Month</option>
                        {months.map((m, index) => (
                    <option key={index} value={index}>{m}</option>
                    ))}
                </select>

                <select value={bookingYear} onChange={(e) => setBookinkYear(e.target.value)}>
                    <option value="">Year</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                </select>
            </div>
             
            </div>
            <div className="check4w">
                 <div className="lefty">
                <h4>Time Slot</h4>
                </div>

                <div className="dateDropdowns">
                    <button className={timeSlot === '9:45-10:45' ? 'timeBtn active':'timeBtn'} 
                    onClick={()=>setTimeSlot('9:45-10:45')}>9:45-10:45</button>
                    <button className={timeSlot === '11:45-12:45' ? 'timeBtn active':'timeBtn'} 
                    onClick={()=>setTimeSlot('11:45-12:45')}>11:45-12:45</button>
                    <button className={timeSlot === '13:15-14:15' ? 'timeBtn active':'timeBtn'}
                    onClick={()=>setTimeSlot('13:15-14:15')}>13:15-14:15</button>
                </div>
            </div>
            </>
             
            
           )}
                        <div className="btnCk">
                            <button>Check</button>
                        </div>
        </div>
        </>
    )
}
export default DateChecker