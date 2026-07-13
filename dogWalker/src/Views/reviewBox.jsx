import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { API_URL } from '../apiConfig'

function ReviewBox(){
    const [revieList, setReviewList] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [sortBy, setSortBy] = useState('newest')
    const [selectedReview,setSelectedReview] =useState()
    const [expandRevModal,setExpandRevModal]= useState(false)

    useEffect(() => {
        fetch(`${API_URL}/api/Review`)
            .then(r => r.json())
            .then(data => {
                setReviewList(data)
                console.log("this are the rev info",data)
            })
    }, [])

   const sorted = [...revieList].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
    if (sortBy === 'highest') return b.rating - a.rating
    if (sortBy === 'lowest') return a.rating - b.rating
    return 0
})

    function next() {
        setCurrentIndex(prev => (prev + 1) % sorted.length)
    }

    function prev() {
        setCurrentIndex(prev => (prev - 1 + sorted.length) % sorted.length)
    }

    function handleSort(value) {
        setSortBy(value)
        setCurrentIndex(0)
    }

    if (sorted.length === 0) return <div className="reviewBox"><h1>Reviews</h1><p>No reviews yet</p></div>

    const rev = sorted[currentIndex]

    const bookingDate =
        rev.serviceType === "walk" ? rev.walkDate :
        rev.serviceType === "daycare" ? rev.daycareDate :
        rev.startDate

    return (
        <div className="reviewBox">
            <h1>Reviews</h1>
            <div className="revInfoBox">
                <div className="averageBox">
                    <h3>Total: {sorted.length}</h3>
                </div>
                <div className="numOfRev">
                    <h3>Avg: {(sorted.reduce((sum, r) => sum + r.rating, 0) / sorted.length).toFixed(1)} ⭐</h3>
                </div>
            </div>

            <div className="revSortBox">
    <button
        className={`sortBtn ${sortBy === 'newest' ? 'sortBtn--active' : ''}`}
        onClick={() => handleSort('newest')}
    >
        Newest
    </button>
    <button
        className={`sortBtn ${sortBy === 'oldest' ? 'sortBtn--active' : ''}`}
        onClick={() => handleSort('oldest')}
    >
        Oldest
    </button>
    <button
        className={`sortBtn ${sortBy === 'highest' ? 'sortBtn--active' : ''}`}
        onClick={() => handleSort('highest')}
    >
        Top rated
    </button>
    <button
        className={`sortBtn ${sortBy === 'lowest' ? 'sortBtn--active' : ''}`}
        onClick={() => handleSort('lowest')}
    >
        Lowest rated
    </button>
</div>
            <div className="revCard">
                <div className="topRevCard">
                    <div className="writerInfo">
                        <h4>User Name: {rev.userFirstName} {rev.userLastName}</h4>
                        <h5>Service: {rev.serviceType}</h5>
                        <h5>Pet name: {rev.dogName}</h5>
                        <h5>Date: {bookingDate ? new Date(bookingDate).toLocaleDateString('en-GB') : 'N/A'}</h5>
                    </div>
                    <div className="starBox">
                        <span>Rating: {rev.rating} ⭐</span>
                    </div>
                </div>
                <div className="revBody">
    <div className="revRow">
        <span className="revLabel">Posted:</span>
        <span>{new Date(rev.createdAt).toLocaleDateString('en-GB')}</span>
    </div>
    <div className="revCommentBox">
        <span className="revLabel">Comment:</span>
        <p className="revComment">{rev.comment}</p>
        {rev.comment && rev.comment.length > 30 && (
            <button className="readMoreBtn" onClick={() => {
                setSelectedReview(rev)
                setExpandRevModal(true)
              
            }}>Read more</button>
        )}
            {expandRevModal && createPortal(
                <div className="stage">
                    <div className="modal">
                        <div className="revModalInfoBox">
                            <div className="revModalInfoBlocks">
                                 <h4>User name:</h4>
                                <h5>{rev.userFirstName} {rev.userLastName}</h5>
                            </div>
                            <div className="revModalInfoBlocks">
                                 <h4>Service tpe:</h4>
                                <h5>{rev.serviceType}</h5>
                                
                            </div>
                            
                            <div className="revModalInfoBlocks">
                                 <h4>Booking date:</h4>
                                 <h5>Date: {bookingDate ? new Date(bookingDate).toLocaleDateString('en-GB') : 'N/A'}</h5>
                                
                            </div>
                            <div className="revModalInfoBlocks">
                                 <h4>rating:</h4>
                                 <h5>{rev.rating}⭐</h5>
                                
                            </div>
                            
                            <div className="revModalComment">
                                {rev.comment}
                            </div>
                            
                        </div>
                           
                            <button className="backBtn" onClick={() => {
                            setExpandRevModal(false)
                        }}>
                        back
                        </button>
                    </div>
                </div>,document.body

            )}
    </div>
</div>
            </div>

            <div className="revNav">
                <button onClick={prev}>← Prev</button>
                <span>{currentIndex + 1} / {sorted.length}</span>
                <button onClick={next}>Next →</button>
            </div>
        </div>
    )
}

export default ReviewBox