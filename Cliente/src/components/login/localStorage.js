export const loadState = () => {
    try{
        const serializerdState = localStorage.getItem('sessionState')
        if(serializerdState===null){
            return {}
        }
        return JSON.parse(serializerdState);
    }catch(error){return {}}
}

export const saveState = (state) =>{
    try{
        const serializerdState = JSON.stringify(state)
        localStorage.setItem('sessionState',serializerdState)
    }catch(error){}
}

export const removeState = () =>{
    localStorage.removeItem('sessionState');
}