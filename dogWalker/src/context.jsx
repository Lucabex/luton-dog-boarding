import { createContext,useState } from "react";
const Context = createContext()

function Provider({children}){

    const [month,setMonth] = useState(5)
    const [year,setYear] = useState(2026)
    const [userName,setUserName] = useState()
    const [petName,setPetName] = useState()
    const [refreshKey, setRefreshKey] = useState(0)   
    const [addPet,setAddPet]= useState(false)
    
    function triggerAddPet(){
        setAddPet(true)
    }

    function triggerRefresh() {                           
        setRefreshKey(k => k + 1)
    }

    


    function MoveForward(){
        if (month === 11){
            setMonth(0)
            setYear(year + 1)
        } else {
            setMonth(month + 1)
        }
    }

    function MoveBack(){
        if (month === 0){
            setMonth(11)
            setYear(year - 1)
        } else {
            setMonth(month - 1)
        }
    }
    return(
        <Context.Provider value={{month,setMonth,
            year,setYear,
            MoveForward,MoveBack,
            userName,setUserName,
            petName,setPetName,
              refreshKey, triggerRefresh,
              addPet,setAddPet,triggerAddPet
            }}>{children}</Context.Provider>
    )
}
export {Context,Provider}