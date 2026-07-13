import { useContext, useEffect, useState } from "react"
import { Context } from '../context'
import { API_URL } from '../apiConfig'

function SlotPopup({ slots }) {
    if (!slots) return null

    const labels = {
        walk1: "Walk 9:00-10:00",
        walk2: "Walk 11:00-12:00",
        walk3: "Walk 13:00-14:00",
        boarding: "Boarding",
        daycare: "Daycare"
    }

    return (
        <div className="slot-popup">
            {Object.entries(slots).map(([key, value]) => (
                <div key={key} className="slot-popup__row">
                    <span
                        className="slot-popup__dot"
                        style={{ background: value === "available" ? "#22c55e" : "#ef4444" }}
                    />
                    <span>{labels[key]}</span>
                </div>
            ))}
        </div>
    )
}

function Calendar2() {
    const { month, year, MoveBack, MoveForward, refreshKey } = useContext(Context)
    const [availability, setAvailability] = useState({})
    const [hoveredDay, setHoveredDay] = useState(null)
    const weekDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    useEffect(() => {
        async function fetchAvailability() {
            const leftRes = await fetch(`${API_URL}/api/availability/month?year=${year}&month=${month + 1}`)
            const leftData = await leftRes.json()

            const rightMonth = month === 11 ? 1 : month + 2
            const rightYear = month === 11 ? year + 1 : year
            const rightRes = await fetch(`${API_URL}/api/availability/month?year=${rightYear}&month=${rightMonth}`)
            const rightData = await rightRes.json()

            const lookup = {}
            for (const day of [...leftData, ...rightData]) {
                lookup[day.date] = {
                    status: day.status,
                    slots: day.slots
                }
            }
            setAvailability(lookup)
        }

        fetchAvailability()
    }, [month, year, refreshKey])  

    function dateKey(y, m, d) {
        const mm = String(m + 1).padStart(2, '0')
        const dd = String(d).padStart(2, '0')
        return `${y}-${mm}-${dd}`
    }

    function buildMonth(year, month) {
        const howManyD = new Date(year, month + 1, 0).getDate()
        const firstDay = new Date(year, month, 1).getDay()
        const startingDay = firstDay === 0 ? 6 : firstDay - 1
        const calendarArray = []
        for (let i = 0; i < startingDay; i++) {
            calendarArray.push(null)
        }
        for (let d = 1; d <= howManyD; d++) {
            calendarArray.push(d)
        }
        return calendarArray
    }

    function renderDay(number, index, y, m) {
        const key = number ? dateKey(y, m, number) : null
        const dayData = key ? availability[key] : null
        const uniqueKey = `${y}-${m}-${index}`

        return (
            <div
                className={`dayCard ${dayData ? `dayCard--${dayData.status}` : ''}`}
                key={index}
                onMouseEnter={() => number && setHoveredDay(uniqueKey)}
                onMouseLeave={() => setHoveredDay(null)}
            >
                {number}
                {hoveredDay === uniqueKey && <SlotPopup slots={dayData?.slots} />}
            </div>
        )
    }

    const leftArray = buildMonth(year, month)
    const rightArray = buildMonth(year, month + 1)

    return (
        <div className="mainCalendar">
            <div className="titleBox">

                <h1 className="av1">My availability</h1>
            </div>
            
            <div className="calendarBox">

                <div className="leftBox">
                    <h3>{monthName[month]} {year}</h3>
                    <div className="leftCalendar">
                        <div className="calDays">
                            {weekDay.map((day) => <div key={day}>{day}</div>)}
                        </div>
                        <div className="calDate">
                            {leftArray.map((number, index) => renderDay(number, index, year, month))}
                        </div>
                    </div>
                </div>

                <div className="rightBox">
                    <h3>{month === 11 ? monthName[0] : monthName[month + 1]} {month === 11 ? year + 1 : year}</h3>
                    <div className="rightCalendar">
                        <div className="calDays">
                            {weekDay.map((day) => <div key={day}>{day}</div>)}
                        </div>
                        <div className="calDate">
                            {rightArray.map((number, index) =>
                                renderDay(number, index, month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1)
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="buttonBox">
                <button className="buttonLeft" onClick={MoveBack}>Prev</button>
                <button className="buttonRight" onClick={() => MoveForward(year, month)}>Next</button>
            </div>
           
        </div>
    )
}

export default Calendar2