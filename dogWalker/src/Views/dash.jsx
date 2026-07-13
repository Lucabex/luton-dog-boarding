import { useEffect, useState, useContext } from "react"
import { createPortal } from "react-dom"
import { Context } from "../context"
import { API_URL } from '../apiConfig'

function Dash({ user, token }) {

    const { refreshKey } = useContext(Context)
    const BASIC_URL = API_URL

    // --- Card expand toggles 
    const [activeExpanded, setActiveExpanded] = useState(false)
    const [nextExpanded, setNextExpanded] = useState(false)
    const [pastExpanded, setPastExpanded] = useState(false)
    const [historyExpanded, setHistoryExpanded] = useState(false)
    const [reviewExpanded, setReviewExpanded] = useState(false)

    // --- Modal toggles ---
    const [showActivityModal, setShowActivityModal] = useState(false)
    const [showPicturesModal, setShowPicturesModal] = useState(false)
    const [showWalkModal, setShowWalkModal] = useState(false)

    // --- Active booking
    const [hasActiveBooking, setHasActiveBooking] = useState(false)
    const [showActiveInfo, setShowActiveInfo] = useState(true)
    const [activeServiceType, setActiveServiceType] = useState('')
    const [activeIsWalk, setActiveIsWalk] = useState(false)
    const [activeIsDaycare, setActiveIsDaycare] = useState(false)
    const [activeBookingId,setBookingId] = useState()

    // --- Past Booking ---
    const [havePast, setHavePast] = useState(false)
    const [pastTotal, setPastTotal] = useState()
    const [pastBookList, setPastBookinkgList] = useState([])
    const [numOfNight, setNumOfNight] = useState('')

    // --- Active booking values
    const [activeEndValue, setActiveEndValue] = useState('')
    const [activeStartDate, setActiveStartDate] = useState('')
    const [activeNights, setActiveNights] = useState(0)
    const [activeStatus, setActiveStatus] = useState('')
    const [activeDaycareEnd, setActiveDaycareEnd] = useState('17-PM')
    const [isPaid, setIsPaid] = useState(true)

    // --- Next booking ---
    const [hasNextBooking, setHasNextBooking] = useState(false)
    const [nextBookingSerice, setNextBookingService] = useState("")
    const [nextBookingWalkEnd, setNextBookingWalkEnd] = useState("")
    const [NextBookDate, setNextBookDate] = useState("")
    const [nextBookingEnd, setNextBookingEnd] = useState("")
    const [isNextPayed, setIsNextPayed] = useState(false)
    const [nextBookId,setNextBookId]= useState()

    // --- Static lookup ---
    const walkSlotEndTimes = ["10:00", "12:00", "14:00"]
    const walkSlotStartTimes = ["9:00", "11:00", "13:00"]

    // --- Review ---
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [reviewBookingId, setReviewBookingId] = useState(null)
    const [reviewRating, setReviewRating] = useState(0)
    const [reviewComment, setReviewComment] = useState('')
    const [myRev, setMyRev] = useState([])
    const [myRat, setMyRat] = useState([])
    const [haveReview, sethaveReview] = useState(false)
    const [activeBookingIdForGallery, setActiveBookingIdForGallery] = useState(null)

    // --- Gallery ---
    const [galleryPhotos, setGalleryPhotos] = useState([])
    const [galleryIndex, setGalleryIndex] = useState(0)
    
    //booking id to fetch logs active booking
    const [logBookId,setLogBookId ]= useState(0)
    const [logs,setLogs]=useState([])

    // ============ DATA LOADERS ============

    function loadPastBookings() {
        if (!token) return
        fetch(`${API_URL}/api/Booking/past`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                if (data.length > 0) {
                    setHavePast(true)
                    setPastTotal(data.length)
                    setPastBookinkgList(data)
                }
            })
    }
      useEffect(()=>{
    if (!token || !activeBookingId) return
    fetch(`${BASIC_URL}/api/booking/${activeBookingId}/logs`,{
        headers:{Authorization:`Bearer ${token}`},
    })
    .then((res)=>res.json())
    .then((data)=>{
        console.log("logs fetched:", data)
        setLogs(Array.isArray(data) ? data : [])
    })
},[token, activeBookingId])

    function loadMyReviews() {
        if (!token) return
        fetch(`${API_URL}/api/Review/myreview`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                if (data.length > 0) {
                    const formatted = data.map(rev => ({
                        ...rev,
                        bookingDate: (() => {
                            const d = new Date(rev.bookingDate)
                            return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
                        })()
                    }))
                    sethaveReview(true)
                    setMyRev(formatted)
                    setMyRat(formatted.map(b => b.rating))
                }
            })
    }

    async function loadGallery(bookingId) {
        const res = await fetch(`${BASIC_URL}/api/gallery/${bookingId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setGalleryPhotos(data)
        setGalleryIndex(0)
    }

    // ============ EFFECTS ============

    useEffect(() => { loadPastBookings() }, [token, refreshKey])
    useEffect(() => { loadMyReviews() }, [token, refreshKey])

    useEffect(() => {
        if (!token) return
        fetch(`${API_URL}/api/Booking/next`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                if (data.length > 0) {
                    const booking = data[0]
                    if (booking.serviceType === 'boarding' && booking.endDate) {
                        const e = new Date(booking.endDate)
                        setNextBookingEnd(`${e.getDate()}/${e.getMonth() + 1}/${e.getFullYear()}`)
                    }
                    setHasNextBooking(true)
                    setNextBookingService(booking.serviceType)
                    setNextBookingWalkEnd(walkSlotEndTimes[booking.walkSlot - 1])
                    setIsNextPayed(booking.isPaid)
                    setNextBookId(booking.id)

                    const rawDate =
                        booking.serviceType === 'boarding' ? booking.startDate
                        : booking.serviceType === 'daycare' ? booking.daycareDate
                        : booking.walkDate

                    const d = new Date(rawDate)
                    setNextBookDate(`${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`)
                }
            })
    }, [token, refreshKey])

    useEffect(() => {
        if (!token) return
        fetch(`${API_URL}/api/Booking/mine`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                if (data.length > 0) {
                    const booking = data[0]
                    setHasActiveBooking(true)
                    setBookingId(booking.id)
                    setActiveBookingIdForGallery(booking.id)
                    setShowActiveInfo(true)
                    setActiveServiceType(booking.serviceType)
                    setIsPaid(booking.isPaid)

                    if (booking.serviceType === 'walk') {
                        setActiveIsWalk(true)
                        setActiveEndValue(walkSlotEndTimes[booking.walkSlot - 1])
                    } else if (booking.serviceType === 'boarding') {
                        setActiveIsWalk(false)
                        setActiveNights(booking.numberOfNights)

                        const now = new Date()
                        const start = new Date(booking.startDate)
                        const end = new Date(booking.endDate)
                        setActiveStatus(
                            now < start ? 'Upcoming' : now > end ? 'Completed' : 'In progress'
                        )
                        setActiveStartDate(
                            booking.startDate
                                ? new Date(booking.startDate).toLocaleDateString('en-GB')
                                : ''
                        )
                        setActiveEndValue(
                            booking.endDate
                                ? new Date(booking.endDate).toLocaleDateString('en-GB')
                                : ''
                        )
                        const beginning = new Date(booking.startDate)
                        const finish = new Date(booking.endDate)
                        setNumOfNight(Math.round((finish - beginning) / (1000 * 60 * 60 * 24)))
                    } else {
                        setActiveIsDaycare(true)
                        setActiveEndValue(
                            booking.daycareDate
                                ? new Date(booking.daycareDate).toLocaleDateString('en-GB')
                                : ''
                        )
                    }
                } else {
                    setHasActiveBooking(false)
                    setShowActiveInfo(false)
                }
            })
    }, [token, refreshKey])

    // ============ ACTIONS ============

    async function submitReview() {
        if (reviewRating === 0) return

        const res = await fetch(`${API_URL}/api/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                bookingId: reviewBookingId,
                rating: reviewRating,
                comment: reviewComment
            })
        })

        if (res.ok) {
            setShowReviewModal(false)
            setReviewRating(0)
            setReviewComment('')
            loadPastBookings()
            loadMyReviews()
        }
    }

    function Average() {
        if (myRat.length === 0) return 0
        return myRat.reduce((sum, r) => sum + r, 0) / myRat.length
    }

    return (
        <>
            <div className="dashBox">
                <div className="headerDash">
                    <h2>Booking dashboard</h2>
                </div>

                <div className="userDashList">

                    {/* ===== ACTIVE BOOKING CARD ===== */}
                    <div className="activeBooking" style={{ height: activeExpanded ? "220px" : "125px" }}>
                        <div className="topActivBooking" id="topColor1">
                            <div className="actBookBox">
                                <span id="s1">*</span>
                                <h3>Active booking</h3>
                            </div>
                           
                            { hasActiveBooking ? <div className="dispIdClass">
                                 <h6 id="dispId">Booking Id :</h6>
                            <h6>#{activeBookingId}</h6>
                            </div>:
                            <>
                            <div className="dispIdClassEmpty">
                              
                            </div>
                            </>}

                           

                        </div>

                        {!hasActiveBooking ? (
                            <div className="noActiveBooking">No Active service to display..</div>
                        ) : (
                            showActiveInfo &&
                            <div className="activeBookInfo">
                                <div className="activeDash">
                                    <div className="activeDisplay1">
                                        <h5>Service Type</h5>
                                        <h3>{activeServiceType}</h3>
                                    </div>
                                    <div className="activeDisplay1">
                                        {activeServiceType === 'boarding'
                                            ? <h5>Ending Date</h5>
                                            : <h5>{activeServiceType === 'walk' ? 'Ending Time' : 'Pick up Time'}</h5>
                                        }
                                        <h3>{activeEndValue}</h3>
                                    </div>
                                    <div className="activeDisplay1">
                                        <div className="activeRight">
                                            <button className="seeMoreBtn" onClick={() => setActiveExpanded(prev => !prev)}>
                                                {activeExpanded ? "See less" : "See more"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {activeExpanded && activeServiceType === 'boarding' && (
                                    <div className="activeExtraBox">
                                        <div className="activeContainer">
                                            <div className="box" id="boxId">
                                                <div className="activeLeft">
                                                    <h5 id="stDate">Starting date:</h5>
                                                </div>
                                                <div className="activeLeft">
                                                    <h5 id="stDateD">{activeStartDate}</h5>
                                                </div>
                                            </div>
                                            <div className="box" id="boxId">
                                                <div className="activeLeft">
                                                    <h5 id="stDate">Status:</h5>
                                                </div>
                                                <div className="activeLeft">
                                                    {isPaid ? <h5 style={{color:'green'}}>Paid</h5>:<h5 style={{color:'red'}}>Not Paid</h5>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="activeContainer">
                                            <div className="box" id="withBtn">
                                                <div className="activeLeft">
                                                    <h5 id="stDate">Daily activity</h5>
                                                </div>
                                                <div className="activeLeft">
                                                    <button id="checkActivity" onClick={() => setShowActivityModal(true)}>Check</button>
                                                </div>
                                            </div>
                                            <div className="box" id="withBtn">
                                                <div className="activeLeft">
                                                    <h5 id="stDate">Booking pictures</h5>
                                                </div>
                                                <div className="activeLeft">
                                                    <button id="showPicture" onClick={() => {
                                                        loadGallery(activeBookingIdForGallery)
                                                        setShowPicturesModal(true)
                                                    }}>
                                                        Show
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {showActivityModal && createPortal(
                                            <div className="stage">
                                                <div className="modal" onClick={(e) => e.stopPropagation()}>
                                                    <div className="whiteBordBox">
                                                        <div className="topWhiteBoard">
                                                            <p>Booking diary</p>
                                                        </div>

                                                        {Array.isArray(logs) && logs.map((log)=>(
                                                            <div key={log.logId}>
                                                                <div className="actionArea">
                                                                    <div className="actionCard">
                                                                        <div className="day">
                                                                            <h2>Day</h2>
                                                                            <h2>{log.day}</h2>
                                                                        </div>
                                                                        <div className="activityType">
                                                                            <div className="typeTop">
                                                                                <h5>Activity type</h5>
                                                                            </div>
                                                                            <div className="typeDown">
                                                                                <h5>{log.activityType}</h5>
                                                                            </div>
                                                                        </div>
                                                                        <div className="activityType">
                                                                            <div className="typeTop">
                                                                                <h5>Activity time</h5>
                                                                            </div>
                                                                            <div className="typeDown">
                                                                                <h5>{log.time}</h5>
                                                                            </div>
                                                                        </div>
                                                                        <div className="activityType">
                                                                            <div className="typeTop">
                                                                                <h5>Duration</h5>
                                                                            </div>
                                                                            <div className="typeDown">
                                                                                <h5>{log.duration}</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                    </div>
                                                   <button onClick={() => setShowActivityModal(false)}>close</button>
                                                </div>
                                                 
                                            </div>,
                                            document.body
                                        )}

                                        {showPicturesModal && createPortal(
                                            <div className="stage" onClick={() => setShowPicturesModal(false)}>
                                                <div className="modal" onClick={(e) => e.stopPropagation()}>
                                                    <div className="imgDisplayBox">
                                                        <div className="previus" onClick={() => setGalleryIndex(prev => (prev - 1 + galleryPhotos.length) % galleryPhotos.length)}>
                                                            <p>←</p>
                                                        </div>
                                                        <div className="imgStage">
                                                            {galleryPhotos.length > 0
                                                                ? <img
                                                                    src={galleryPhotos[galleryIndex].photoUrl}
                                                                    alt="booking"
                                                                    style={{ width: '100%', height: '380px', objectFit: 'cover' }}
                                                                />
                                                                : <p>No photos yet</p>
                                                            }
                                                        </div>
                                                        <div className="next" onClick={() => setGalleryIndex(prev => (prev + 1) % galleryPhotos.length)}>
                                                            <p>→</p>
                                                        </div>
                                                    </div>
                                                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888' }}>
                                                        {galleryPhotos.length > 0 ? `${galleryIndex + 1} / ${galleryPhotos.length}` : ''}
                                                    </p>
                                                    <button onClick={() => setShowPicturesModal(false)}>Close</button>
                                                </div>
                                            </div>,
                                            document.body
                                        )}
                                    </div>
                                )}

                                {activeExpanded && activeServiceType === 'walk' && (
    <div className="activeExtraBox">
        <div className="activeContainerWD">
            <div className="box" id="withBtn">
                <div className="activeLeft">
                    <h5 id="stDate">Booking pictures</h5>
                </div>
                <div className="activeLeft">
                    <button id="showPicture" onClick={() => {
                        loadGallery(activeBookingIdForGallery)
                        setShowPicturesModal(true)
                    }}>
                        Show
                    </button>
                </div>
            </div>
        </div>

        {showPicturesModal && createPortal(
            <div className="stage" onClick={() => setShowPicturesModal(false)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <div className="imgDisplayBox">
                        <div className="previus" onClick={() => setGalleryIndex(prev => (prev - 1 + galleryPhotos.length) % galleryPhotos.length)}>
                            <p>←</p>
                        </div>
                        <div className="imgStage">
                            {galleryPhotos.length > 0
                                ? <img
                                    src={galleryPhotos[galleryIndex].photoUrl}
                                    alt="booking"
                                    style={{ width: '100%', height: '380px', objectFit: 'cover' }}
                                />
                                : <p>No photos yet</p>
                            }
                        </div>
                        <div className="next" onClick={() => setGalleryIndex(prev => (prev + 1) % galleryPhotos.length)}>
                            <p>→</p>
                        </div>
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888' }}>
                        {galleryPhotos.length > 0 ? `${galleryIndex + 1} / ${galleryPhotos.length}` : ''}
                    </p>
                    <button onClick={() => setShowPicturesModal(false)}>Close</button>
                </div>
            </div>,
            document.body
        )}
    </div>
)}

{activeExpanded && activeServiceType === 'daycare' && (
    <div className="activeExtraBox">
        <div className="activeContainerWD">
            <div className="box" id="withBtn">
                <div className="activeLeft">
                    <h5 id="stDate">Booking pictures</h5>
                </div>
                <div className="activeLeft">
                    <button id="showPicture" onClick={() => {
                        loadGallery(activeBookingIdForGallery)
                        setShowPicturesModal(true)
                    }}>
                        Show
                    </button>
                </div>
            </div>
        </div>

        {showPicturesModal && createPortal(
            <div className="stage" onClick={() => setShowPicturesModal(false)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <div className="imgDisplayBox">
                        <div className="previus" onClick={() => setGalleryIndex(prev => (prev - 1 + galleryPhotos.length) % galleryPhotos.length)}>
                            <p>←</p>
                        </div>
                        <div className="imgStage">
                            {galleryPhotos.length > 0
                                ? <img
                                   src={galleryPhotos[galleryIndex].photoUrl}
                                    alt="booking"
                                    style={{ width: '100%', height: '380px', objectFit: 'cover' }}
                                />
                                : <p>No photos yet</p>
                            }
                        </div>
                        <div className="next" onClick={() => setGalleryIndex(prev => (prev + 1) % galleryPhotos.length)}>
                            <p>→</p>
                        </div>
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888' }}>
                        {galleryPhotos.length > 0 ? `${galleryIndex + 1} / ${galleryPhotos.length}` : ''}
                    </p>
                    <button onClick={() => setShowPicturesModal(false)}>Close</button>
                </div>
            </div>,
            document.body
        )}
    </div>
)}
                            </div>
                        )}
                    </div>

                    {/* ===== NEXT BOOKING CARD ===== */}
                    <div className="activeBooking" style={{ height: nextExpanded ? "300px" : "125px" }}>
                        <div className="topActivBooking" id="topColor2">
                           <div className="actBookBox">
                                <span id="s2">*</span>
                                <h3>Next booking</h3>
                            </div>
                           
                            { hasNextBooking ? <div className="dispIdClass1">
                                 <h6 id="dispIdNext">Booking Id:</h6>
                                    <h6>#{nextBookId}</h6>
                            </div>:
                            <>
                            <div className="dispIdClassEmpty">
                              
                            </div>
                            </>}
                        </div>
                        {hasNextBooking ? (
                            <div className="activeDash">
                                <div className="activeDisplay1">
                                    <h5>Service Type</h5>
                                    <h3>{nextBookingSerice}</h3>
                                </div>
                                <div className="activeDisplay1">
                                    <h5>Date</h5>
                                    <h3>{NextBookDate}</h3>
                                </div>
                                <div className="activeDisplay1">
                                    {nextBookingSerice === 'boarding'
                                        ? <h5>Ending Date</h5>
                                        : <h5>{nextBookingSerice === 'walk' ? 'Ending Time' : 'Pick up Time'}</h5>
                                    }
                                    <h3>{
                                        nextBookingSerice === 'boarding' ? nextBookingEnd
                                        : nextBookingSerice === 'walk' ? nextBookingWalkEnd
                                        : '5Pm'
                                    }</h3>
                                </div>
                                <div className="PayStatBox">
                                    <div className="PaymentStat">
                                        <h6>Status</h6>
                                        {isNextPayed
                                            ? <p style={{ color: 'green' }}>Paid</p>
                                            : <p style={{ color: 'red' }}>Not paid</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="noActiveBooking">No next booking available..</div>
                        )}
                    </div>

                    <div className={`activeBooking ${pastExpanded ? 'expanded' : ''}`} id="pastScroll" style={{ height: pastExpanded ? "300px" : "195px" }}>
    <div className="topActivBooking" id="topColor3">
        <span id="s3">*</span>
        <h3>Past booking</h3>
    </div>
    {havePast ?
        <>
            <div className="pastTop">
                <div className="pastTotal">
                    <h5>Total booking:</h5>
                    <h5>{pastTotal}</h5>
                </div>
                <div className="pastCost">
                    <h5>Total cost:</h5>
                    <h5>£{pastBookList.reduce((sum, b) => sum + (b.amountPaid || 0), 0)}</h5>
                </div>
                <div className="pastBtnExtraBox">
                    <button className="BtnPast" onClick={() => setPastExpanded(prev => !prev)}>
                        {pastExpanded ? "See less" : "See more"}
                    </button>
                </div>
            </div>

            <div className="pastListHeader">
                <div className="listBlock"><h5>Num.</h5></div>
                <div className="listBlock"><h5>Service</h5></div>
                <div className="listBlock"><h5>Name</h5></div>
                <div className="listBlock"><h5>Date</h5></div>
                <div className="listBlock"><h5>Cost</h5></div>
                <div className="listBlock"><h5>Rating</h5></div>
            </div>

                                <div className="pastRowsScroll">
                                    {pastBookList.map((booking, index) => (
                                        <div key={booking.id} className="pastRow">
                                            <div className="pastlistBlock"><h5>{index + 1}</h5></div>
                                            <div className="pastlistBlock"><h5>{booking.serviceType}</h5></div>
                                            <div className="pastlistBlock"><h5>{booking.dogName}</h5></div>
                                            <div className="pastlistBlock">
                                                <h5>{(() => {
                                                    const d = new Date(
                                                        booking.serviceType === 'boarding' ? booking.startDate
                                                        : booking.serviceType === 'daycare' ? booking.daycareDate
                                                        : booking.walkDate
                                                    )
                                                    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
                                                })()}</h5>
                                            </div>
                                            <div className="pastlistBlock"><h5>{booking.amountPaid}£</h5></div>
                                            <div className="pastlistBlock">
                                                {booking.hasReview
                                                    ? <h5>{booking.rating} ★</h5>
                                                    : <button
                                                        className="addRewBtn"
                                                        onClick={() => { setReviewBookingId(booking.id); setShowReviewModal(true) }}
                                                    >
                                                        Add
                                                    </button>
                                                }
                                                {showReviewModal && createPortal(
                                                    <div className="stage" onClick={() => setShowReviewModal(false)}>
                                                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                                                            <h4>Leave a review</h4>
                                                            <div className="reviewStars">
                                                                {[1, 2, 3, 4, 5].map(star => (
                                                                    <span
                                                                        key={star}
                                                                        className={star <= reviewRating ? 'star filled' : 'star'}
                                                                        onClick={() => setReviewRating(star)}
                                                                    >
                                                                        ★
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <textarea
                                                                className="reviewText"
                                                                placeholder="Tell us how it went..."
                                                                value={reviewComment}
                                                                onChange={(e) => setReviewComment(e.target.value)}
                                                            />
                                                            <div className="reviewActions">
                                                                <button onClick={() => setShowReviewModal(false)}>Cancel</button>
                                                                <button onClick={submitReview}>Submit</button>
                                                            </div>
                                                        </div>
                                                    </div>,
                                                    document.body
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </> : <div className="noActiveBooking">No Past Booking to display..</div>}
                    </div>

               
                    {/* ===== REVIEW CARD ===== */}
<div className={`activeBooking ${reviewExpanded ? 'expanded' : ''}`} id="reviewBoxSpecial" style={{ height: reviewExpanded ? "500px" : "195px" }}>
    <div className="topActivBooking" id="topColor4">
        <span id="s5">*</span>
        <h3>Your Review</h3>
    </div>

    {haveReview
        ? <div className="revHeader">
            <div className="revHeaderBox">
                <h5>Total review:</h5>
                <h5>{myRev.length}</h5>
            </div>
            <div className="revHeaderBox">
                <h5>AVG Rating</h5>
                <h5>{Average().toFixed(1)} ★</h5>
            </div>
            <div className="revHeaderBox">
                <button className="revExpandBtn" onClick={() => setReviewExpanded(prev => !prev)}>
                    {reviewExpanded ? "See less" : "See more"}
                </button>
            </div>
        </div>
        : <div className="noActiveBooking">No reviews to show..</div>
    }

    <div className="revRowsScroll">
        {myRev.map(rev => (
            <div key={rev.id} className="revCardBox">
                <div className="revBox">
                    <div className="topRev">
                        <div className="RevDate">
                            <h4>User name: </h4>
                            <h4>{rev.userName}</h4>
                        </div>
                        <div className="RevDate">
                            <h4>Date: </h4>
                            <h4>{rev.bookingDate}</h4>
                        </div>
                        <div className="RevDate">
                            <h4>Rating: </h4>
                            <h4>{rev.rating}*</h4>
                        </div>
                    </div>
                    <h5>Review</h5>
                    <h5>{rev.comment}</h5>
                </div>
            </div>
        ))}
    </div>
</div>

                </div>
            </div>
        </>
    )
}

export default Dash