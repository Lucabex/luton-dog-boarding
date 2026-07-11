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
import { createPortal } from "react-dom"
 import { useState } from "react"
function ClassicPublic(){
   


const [activeService, setActiveService] = useState(null)
const [showPrivacy, setShowPrivacy] = useState(false)
const [showTerms, setShowTerms] = useState(false)

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
            { label: 'Per night', price: '£40' },
         
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
            { label: 'Full day (up to 8h)', price: '£35' },
         
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
                 <div className="siteFooter">
        <div className="footerTop">
            <div className="footerCol">
                <h4 className="footerHeading">Luton Dog Boarding</h4>
                <p className="footerText">Personal dog walking, boarding and day care in Luton.</p>
            </div>

            <div className="footerCol">
                <h4 className="footerHeading">Contact</h4>
                <a href="mailto:lucabex@gmail.com" className="footerLink">lucabex@gmail.com</a>
                <a href="tel:07585626737" className="footerLink">07585 626 737</a>
            </div>

            <div className="footerCol">
                <h4 className="footerHeading">Legal</h4>
                <span className="footerLink" onClick={() => setShowPrivacy(true)}>Privacy Policy</span>
                <span className="footerLink" onClick={() => setShowTerms(true)}>Terms of Service</span>
            </div>
        </div>

    <div className="footerBottom">
        <p className="footerCopyright">© {new Date().getFullYear()} Luton Dog Boarding. All rights reserved.</p>
        <p className="footerCredit">Site by Koudelka Web Design</p>
    </div>
    {showPrivacy && createPortal(
    <div className="stage" onClick={() => setShowPrivacy(false)}>
        <div className="modal legalModal" onClick={e => e.stopPropagation()}>
            <h2 className="modalTitle">Privacy Policy</h2>
            
                <div className="legalContent">
    <p>Last updated: July 2026</p>

    <h3>Who we are</h3>
    <p>Luton Dog Boarding is a small, independently run dog walking, boarding and day care service based in Luton. This policy explains what personal information we collect, how we use it, and your rights regarding that information.</p>

    <h3>What we collect</h3>
    <p>When you register an account we collect your name, email address, phone number, home address, and username. We also collect information about your dog, including breed, age, size, sex, medical and behavioural notes, and emergency contact details, so we can care for your dog safely.</p>
    <p>When you make a booking we store the service type, dates, and payment status. If you upload a profile photo or a photo of your dog, this is stored securely and used only within the app.</p>

    <h3>How we use your information</h3>
    <p>Your information is used to manage your account, process bookings, communicate with you about your booking (including confirmation emails), and to ensure the safety and wellbeing of your dog while in our care. We do not sell or share your information with third parties for marketing purposes.</p>

    <h3>Email communication</h3>
    <p>We use a third-party email service to send booking confirmations and account-related messages. Your email address is used solely for this purpose.</p>

    <h3>Data storage and security</h3>
    <p>Your data is stored securely and access is limited to what is necessary to operate the service. Passwords are encrypted and never stored in plain text.</p>

    <h3>How long we keep your data</h3>
    <p>We retain your account and booking information for as long as your account remains active, or as required to meet legal and accounting obligations. You can request deletion of your account and associated data at any time.</p>

    <h3>Your rights</h3>
    <p>Under UK data protection law you have the right to access the personal data we hold about you, request corrections, request deletion, and object to how your data is processed. To exercise any of these rights, please contact us directly.</p>

    <h3>Contact</h3>
    <p>If you have any questions about this policy or how your data is handled, please get in touch at lucabex@gmail.com.</p>
</div>
            
            <button className="backBtn" onClick={() => setShowPrivacy(false)}>Close</button>
        </div>
    </div>,
    document.body
)}

{showTerms && createPortal(
    <div className="stage" onClick={() => setShowTerms(false)}>
        <div className="modal legalModal" onClick={e => e.stopPropagation()}>
            <h2 className="modalTitle">Terms of Service</h2>
            <div className="legalContent">
    <p>Last updated: July 2026</p>

    <h3>About this service</h3>
    <p>Luton Dog Boarding provides dog walking, home boarding, and day care services in and around Luton. By registering an account and making a booking, you agree to the terms outlined below.</p>

    <h3>Registration and meet & greet</h3>
    <p>All new accounts require an initial meet and greet before bookings can be made. This allows us to meet you and your dog, discuss any specific needs, and confirm suitability before any service begins.</p>

    <h3>Bookings</h3>
    <p>Bookings are made directly through the app once your account has been approved. All bookings are subject to availability. We reserve the right to decline or cancel a booking at our discretion, including where information provided about a dog's behaviour or health is found to be inaccurate or incomplete.</p>

    <h3>Payment</h3>
    <p>Payment can be made by bank transfer or cash. Bank transfer details are provided upon booking confirmation. Cash payments must be made in full before the booking begins. Prices are agreed at the time of booking and are subject to change for future bookings.</p>

    <h3>Cancellations</h3>
    <p>If you need to cancel or amend a booking, please contact us as soon as possible. We ask for reasonable notice where possible so the slot can be made available to others.</p>

    <h3>Your dog's welfare</h3>
    <p>You confirm that all information provided about your dog, including vaccination status, behaviour, and medical needs, is accurate and complete. We take reasonable care of your dog at all times but cannot be held responsible for illness, injury, or incidents arising from undisclosed medical or behavioural conditions.</p>

    <h3>Liability</h3>
    <p>While every care is taken, we cannot accept liability for loss, damage, illness or injury arising from circumstances outside of our reasonable control. Owners are responsible for ensuring their dog is fit to attend the booked service.</p>

    <h3>Changes to these terms</h3>
    <p>These terms may be updated from time to time. Continued use of the service after changes are made constitutes acceptance of the updated terms.</p>

    <h3>Contact</h3>
    <p>For any questions regarding these terms, please get in touch at lucabex@gmail.com.</p>
</div>
            <button className="backBtn" onClick={() => setShowTerms(false)}>Close</button>
        </div>
    </div>,
    document.body
)}
</div>
                    
                </div>

        </div>
    </>
    )
}

export default ClassicPublic