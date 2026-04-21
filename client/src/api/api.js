import axios from 'axios'
// export const URI = window.localStorage.getItem('demo') ? 'https://demoapi.radava.co/api/': 'https://api.radava.co/api/'
// export const URI2 = window.localStorage.getItem('demo') ? 'https://demoapi.radava.co' : 'https://api.radava.co'
// export const URI3 = window.localStorage.getItem('demo') ? 'https://demoapi.radava.co/admin/' : 'https://api.radava.co/admin/'
export const URI = window.localStorage.getItem('demo') ? 'http://localhost:5001/api/': 'http://localhost:5001/api/'
export const URI2 = window.localStorage.getItem('demo') ? 'http://localhost:5001' : 'http://localhost:5001'
export const URI3 = window.localStorage.getItem('demo') ? 'http://localhost:5001/admin/' : 'http://localhost:5001/admin/'

const config = ()=>{
    return {
            authorization: 'Bearer '+window.localStorage.getItem('token')
        }
    
}

export const postData = (end,data={},conf={})=> (axios.post(URI+end,data,{headers:{...config(),...conf}}))
export const getData = (end)=> (axios.get(URI+end,{headers:config()}))
export const getDataAdmin = (end)=> (axios.get(URI3+end,{headers:config()}))
export const getAdmin = (end)=>(axios.get(URI3+end))
