import HomeImg from'../assets/HomeImg.png'
import Dog1 from '../assets/dog1.png'
import Dog2 from '../assets/dog2.png'
import Dog3 from '../assets/dog3.png'
import Dog4 from '../assets/dog4.png'
import Dog5 from '../assets/dog5.png'
import Dog6 from '../assets/dog6.png'
import Dog7 from '../assets/dog7.png'
import Dog8 from '../assets/dog8.png'
import paws2 from '../assets/paws2.webp'
import foto from '../assets/foto.png'

 import { useState } from "react"
function ClassicPublic(){
   

// at the top of your component, before the return:
const [activeService, setActiveService] = useState(null)

const services = [
    {
        id: 'walk',
        icon: '',
        title: 'Dog Walking',
        tagline: 'Daily adventures, tail guaranteed',
        description: 'A one-hour walk tailored to your dog\'s pace and energy. We stick to familiar routes around Luton, keeping things safe and enjoyable.',
        prices: [
            { label: 'Morning slot (9:45)', price: '£15' },
            { label: 'Midday slot (11:45)', price: '£15' },
            { label: 'Afternoon slot (13:15)', price: '£15' },
        ],
        note: 'Group walks available — ask for details.'
    },
    {
        id: 'boarding',
        icon: '',
        title: 'Home Boarding',
        tagline: 'Your dog\'s home away from home',
        description: 'Your dog stays with us overnight in a proper home environment — not a kennel. They get company, comfort, and all the attention they\'re used to.',
        prices: [
            { label: 'Per night', price: '£35' },
            { label: '2–5 nights', price: '£30/night' },
            { label: '6+ nights', price: '£27/night' },
        ],
        note: 'Drop-off and pick-up times arranged around you.'
    },
    {
        id: 'daycare',
        icon: '',
        title: 'Day Care',
        tagline: 'Full day of fun while you work',
        description: 'Drop your dog off in the morning and collect them in the evening, happy and worn out. Great for dogs who struggle with long stretches alone.',
        prices: [
            { label: 'Full day (up to 8h)', price: '£25' },
            { label: 'Half day (up to 4h)', price: '£15' },
        ],
        note: 'Regular weekly slots can be reserved in advance.'
    },
]
    return(
    <>
        <div className="publicV">
            <div className="topLineP">
                <div className="picture1">
                    <img className="homeImg" src={HomeImg} alt="" />
                </div>
                <div className="textArea">
                            <h4>ᖴOᖇ TᕼE ᒪOᐯE Oᖴ ᖴᑌᖇ</h4>
                            
                          
                </div>

            </div>

            <div className="banner1">
                <h4>𝔸𝕓𝕠𝕦𝕥 𝕦𝕤</h4>
               
                <p className="text1">    
                   Luton Dog Walker is a small, personal service, not an agency, not a 
                   platform. When you book with us, your dog is looked after by the same 
                   family every time. We keep group sizes small
                   and we treat every dog like it's ours.
                   Dogs settle faster and enjoy themselves more 
                   when they know who they're with.
                   We offer three services: dog walking, 
                   home boarding for when you're away overnight, and day care for dogs 
                   who struggle with long stretches alone.
                </p>
                
            </div>

                        <div className="photoGrid">
                <div className="photoGridMain">
                    <img src={Dog4} alt="dog" className="photoGridImg" />
                </div>
                <div className="photoGridSide">
                    <img src={Dog2} alt="dog" className="photoGridImg" />
                    <img src={Dog3} alt="dog" className="photoGridImg" />
                    <img src={Dog1} alt="dog" className="photoGridImg" />
                    <img src={Dog5} alt="dog" className="photoGridImg" />
                    <img src={Dog6} alt="dog" className="photoGridImg" />
                    <img src={Dog7} alt="dog" className="photoGridImg" />
                </div>
            </div>

            

                <div className="servicesList">
                        <h3 className="servicesTitle">Our Services</h3>
                    <div className="servicesGrid">
                        {services.map(s => (
                                    <div
                                        key={s.id}
                                        className={`serviceCard ${activeService === s.id ? 'serviceCard--open' : ''}`}
                                        onClick={() => setActiveService(activeService === s.id ? null : s.id)}>
                                        <div className="serviceHeader">
                                            <span className="serviceIcon">{s.icon}</span>
                                                <div className="serviceMeta">
                                                    <span className="serviceName">{s.title}</span>
                                                    <span className="serviceTagline">{s.tagline}</span>
                                                </div>
                                            <span className="serviceToggle">{activeService === s.id ? '−' : '+'}</span>
                                        </div>

                                        {activeService === s.id && (
                                        <div className="serviceBody">
                                                <p className="serviceDesc">{s.description}</p>
                                                <div className="servicePricing">
                                                    {s.prices.map((p, i) => (
                                                    <div className="priceRow" key={i}>
                                                        <span className="priceLabel">{p.label}</span>
                                                        <span className="priceValue">{p.price}</span>
                                                    </div>
                                                    ))}
                                                </div>
                                            {s.note && <p className="serviceNote"><span className='infoDot'>i</span> {s.note}</p>}
                                        </div>
                                        )}
                                    </div>
                        ))}
                    </div>
                </div>
                
                <div className="contactBox">
                    <h3 className="servicesTitle">How to make a booking</h3>
                    <div className="howToSteps">
                        <div className="howToStep">
                            <div className="stepNumCol">
                                <div className="stepNum">1</div>

                                    <div className="stepLine" />
                                    </div>

                                    <div className="stepContent">
                                        <p className="stepTitle">Create an account</p>
                                        <p className="stepDesc">Register your account. We'll need your details and a bit of info about your dog.</p>
                                    </div>
                                </div>

                                <div className="howToStep">
                                    <div className="stepNumCol">
                                        <div className="stepNum">2</div>
                                        <div className="stepLine" />
                                    </div>

                                            <div className="stepContent">
                                                <p className="stepTitle">Book a meet & greet</p>
                                                <p className="stepDesc">Every new registered user starts with a short first appointment, a chance for us to meet you and your dog before anything is booked.</p>
                                            </div>
                                </div>

                                <div className="howToStep">
                                    <div className="stepNumCol">
                                        <div className="stepNum">3</div>
                                        <div className="stepLine" />
                                    </div>
        <div className="stepContent">
            <p className="stepTitle">We confirm your place</p>
            <p className="stepDesc">After the meeting your account gets full access to the booking system from that point on.</p>
        </div>
    </div>

    <div className="howToStep">
        <div className="stepNumCol">
            <div className="stepNumFinal">4</div>
        </div>
        <div className="stepContent">
            <p className="stepTitle">Book whenever you need</p>
            <p className="stepDesc">Log in, pick your service, choose a date and time, and you're done. Walking, boarding, day care — all bookable directly through the app.</p>
        </div>
    </div>

    <div className="howToNote">
        Not sure yet? Feel free to get in touch before registering i am happy to answer any questions first.
    </div>

</div>
                    
                </div>
               
                <div className="contactBox">
                    <h3 className="contactTitle">𝔾𝕖𝕥 𝕚𝕟 𝕥𝕠𝕦𝕔𝕙</h3>
                    <div className="contactDetails">
                        <div className="contactRow">
                         
                            <a href="mailto:lucabex@gmail.com" className="contactLink">Email: lucabex@gmail.com</a>
                        </div>
                        <div className="contactRow">
                            <span id='tW'>Telephone\WhatsApp:</span>
                            <a href="tel:07585626737" className="contactLink">07585 626 737</a>
                        </div>
                    </div>
                </div>
               <div className="contactBox" id='paymentBox'>
    <h6 className="servicesTitle" id='how'>How To Make a Payment</h6>
    
    <div className="paymentGrid">
        <div className="paymentOption">
            <h4 className="paymentOptionTitle">Bank Transfer</h4>
            <p className="paymentOptionDesc">Once your booking is confirmed you will receive an email with bank details. Transfer can be made any time before the booking starts.</p>
        </div>
        <div className="paymentOption">
            <h4 className="paymentOptionTitle">Cash</h4>
            <p className="paymentOptionDesc">Cash is always welcome. All cash payments must be made in full before the booking begins — no exceptions.</p>
        </div>
    </div>

    <div className="paymentNote">
        <span className="infoDot">i</span>
        <p>All pricing is agreed before confirmation. If you have any questions about costs feel free to get in touch before booking.</p>
    </div>
</div>
                <div className="contactBox">
                    <h3>Koudelka Web Design</h3>
                </div>

        </div>
    </>
    )
}

export default ClassicPublic