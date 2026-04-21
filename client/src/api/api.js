import axios from 'axios'
// export const URI = window.localStorage.getItem('demo') ? 'https://demoapi.radava.co/api/': 'https://api.radava.co/api/'
// export const URI2 = window.localStorage.getItem('demo') ? 'https://demoapi.radava.co' : 'https://api.radava.co'
// export const URI3 = window.localStorage.getItem('demo') ? 'https://demoapi.radava.co/admin/' : 'https://api.radava.co/admin/'
const apiOrigin =
  process.env.REACT_APP_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`

export const URI = `${apiOrigin}/api/`
export const URI2 = apiOrigin
export const URI3 = `${apiOrigin}/admin/`

const config = ()=>{
    return {
            authorization: 'Bearer '+window.localStorage.getItem('token')
        }
    
}

export const postData = (end,data={},conf={})=> (axios.post(URI+end,data,{headers:{...config(),...conf}}))
export const getData = (end)=> (axios.get(URI+end,{headers:config()}))
export const getDataAdmin = (end)=> (axios.get(URI3+end,{headers:config()}))
export const getAdmin = (end)=>(axios.get(URI3+end))
