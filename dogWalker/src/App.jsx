import Home from './Views/Home'
import './App.css'
import './Css/calendar2.css'
import './Css/registerForm.css'
import './Css/Home.css'
import './Css/dash.css'
import './Css/userHome.css'
import './Css/lb.css'
import './Css/dateChecker.css'
import './Css/public.css'
import './Css/checkBox.css'
import './Css/public2.css'
import './Css/admin.css'
import './Css/adminDash.css'
import './Css/dogCard.css'
import './Css/addPet.css'
import './Css/reviewBox.css'
import './Css/bookingForm.css'

import './Css/rules.css'

import { Provider } from './context'

function App(){
  return(
    <Provider>
    <Home/>
    </Provider>
  )
}

export default App