import { createContext,useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext()

export const GithubProvider =({children})=>{
    const initialState = {
        users:[],
        repos:[],
        user:{},
        loading:false
    }
    const [state,dispatch] = useReducer(githubReducer,initialState)

 

    const SearchUser = async (text)=>{
        setLoading()
        const params = new URLSearchParams({
            q:text
        })

        const response = await fetch(`${process.env.REACT_APP_GITHUB_URL}/search/users?${params}`,{
            headers:{
                Authorization:`token ${process.env.REACT_APP_GITHUB_TOKEN}`,
            },
        })

        const {items} = await response.json()

        dispatch({
            type:"GET_USERS",
            payload:items,
        })
    }

    const getUser = async (login)=>{
        setLoading()

        const response = await fetch(`${process.env.REACT_APP_GITHUB_URL}/users/${login}`,{
            headers:{
                Authorization:`token ${process.env.REACT_APP_GITHUB_TOKEN}`,
            },
        })

        

        if (response.status===404){
            window.location('/notfound')
        }else{
            const data = await response.json()

            dispatch({
                type:"GET_USER",
                payload:data,
            })
        }

        

        
    }
    const getUserRepos = async (login)=>{
        setLoading()

        const params = new URLSearchParams({
            sort:'created',
            per_page:10
        })

        const response = await fetch(`${process.env.REACT_APP_GITHUB_URL}/users/${login}/repos?${params}`,{
            headers:{
                Authorization:`token ${process.env.REACT_APP_GITHUB_TOKEN}`,
            },
        })

            const data = await response.json()

            dispatch({
                type:"GET_USER_REPOS",
                payload:data,
            })
        

        

        
    }
    const clearUsers = ()=>dispatch({type:"CLEAR_USERS"})

    const setLoading = ()=> dispatch({type:"SET_LOADING"})

    return <GithubContext.Provider value={{
        ...state,
        dispatch,
        SearchUser,
        clearUsers,
        getUser,
        getUserRepos
    }}>
        {children}
    </GithubContext.Provider>

}

export default GithubContext