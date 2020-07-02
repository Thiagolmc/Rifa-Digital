import {useState, useEffect} from 'react'
import api from '../../services/api'
import history from '../../history'

export default function useAuth() {
    const [authenticated, setAuthenticated] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)

    
    useEffect(
        () => {
            const token = localStorage.getItem('token')
            if (token) {
                api.defaults.headers.authorization =`Bearer ${token}`
                setAuthenticated(true)
            }
            setLoading(false)
        }, []//
        
    )
        
    async function handleCreateRifa (desc,premio,datasorteio,valor,maxNumeros) {
       
        setAuthenticated(true)
       
        try {
        const { data } = await api.post('http://localhost:3333/rifas', {
            description: desc,
            premio: premio,
            datasorteio: datasorteio,
            valor: valor,
            maxNumeros: maxNumeros
        })
        const { id } = data[0]
        localStorage.setItem('id', id)
        
        alert(`Rifa criada com sucesso`)
        history.push('/addimage')
    }catch(e) {
        alert('Erro ao criar rifa')
    }

    }
    


    async function handleLogin (email,password) {
      
        // e.preventDefault()

        try {
            const {data: {token,name}} = await api.post('http://localhost:3333/signin',{
            email: email,
            password: password
          })
         localStorage.setItem('name', name) 
         localStorage.setItem('token', JSON.stringify(token))
         api.defaults.headers.authorization = `Bearer ${token}`
          
         setAuthenticated(true)
        setIsLoggedIn(true)
         alert('Logado com sucesso!')
         history.push('/')
        }catch(err) {
            alert(err)
        }
    }

    function handleLogout() {
        setAuthenticated(false)
        localStorage.removeItem('token')
        api.defaults.headers.Authorization = undefined
        setIsLoggedIn(false)

      }

      async function register (name,email,password) {

        try {
            await api.post('http://localhost:3333/signup', {
            name:name,
            email:email,
            password:password
        })
        alert('Conta criada com sucesso!')
        history.push('/')
        }catch(err) {
            alert(err)
        }
         
       
      }


      async function getRifas () {
            const response = await api.get('http://localhost:3333/allrifas')
            return response
      }

      
      async function updatePass(newPass) {
        
            try {
                await api.put('http://localhost:3333/user/updatepass', {
                    "newPass": newPass
                })
                alert('Senha alterado com sucesso!')
            }catch(err) {
                console.log(err)
            }
      }

      return {handleLogin, handleCreateRifa, handleLogout, authenticated, loading, register,isLoggedIn, getRifas, updatePass}
}