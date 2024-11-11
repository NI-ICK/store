"use client"

import { EyeIcon } from '@/assets/EyeIcon'
import { SlashEyeIcon } from '@/assets/SlashEyeIcon'
import { useUserStore } from '@/store/useUserStore'
import styles from '@/styles/modules/NavBar.module.scss'
import { fetchUser } from '@/utils/fetchData'
import axios, { AxiosError } from 'axios'
import { useState } from 'react'
import { useMainStore } from '@/store/useMainStore'

type Props = {
    showLoginModal: boolean
    setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>
    setShowRegisterModal: React.Dispatch<React.SetStateAction<boolean>>
}   

const formDataBase = {
    email: '',
    password: ''
}

export function LoginModal({ showLoginModal, setShowLoginModal, setShowRegisterModal }: Props) {
    const [ formData, setFormData ] = useState(formDataBase)
    const [ inputType, setInputType ] = useState('password')
    const setUser = useUserStore(state => state.setUser)
    const setShowPopup = useMainStore(state => state.setShowPopup)
    const setPopupMessage = useMainStore(state => state.setPopupMessage)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prevFormData => ({ ...prevFormData, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post('/api/login', formData)
            const user = await fetchUser()
            setUser(user)
        } catch(error) {
            console.log(error)
            let message = 'Unknown Error'
            if(error instanceof AxiosError && error.response) message = error.response.data.message
            setPopupMessage(message)
            setShowPopup(true)
            setTimeout(() => { setShowPopup(false)}, 6000)
        }
        setShowLoginModal(false)
        setFormData(formDataBase)
    }

    if(!showLoginModal) return null

    return <>
        <div className={styles.backdrop} onClick={() => { 
            setShowLoginModal(false) 
            setFormData(formDataBase)
            }}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <div className={styles.wrapper}>
                        <label htmlFor='email'>E-mail</label>
                        <input autoFocus type="email" id='email' name='email' required className={formData.email.length > 0 ? styles.filled : ''} value={formData.email} onChange={handleInputChange}/>
                    </div>
                    <div className={styles.wrapper}>
                        <label htmlFor='password'>Password</label>
                        <input type={inputType} id='password' name='password' required value={formData.password} onChange={handleInputChange}/>
                        {inputType === 'password' ? 
                        <span 
                            className={styles.icon}
                            onClick={() => setInputType('text')}
                            tabIndex={0} 
                            onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}><EyeIcon />
                        </span> : 
                        <span 
                            className={styles.icon}
                            onClick={() => setInputType('password')}
                            tabIndex={0} 
                            onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}><SlashEyeIcon />
                        </span>}
                    </div>
                    <button type='submit'>Login</button>
                </form>
                <p>Don't have an account?<span onClick={() => {
                    setShowRegisterModal(true)
                    setShowLoginModal(false)
                    }} tabIndex={0} 
                    onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}>Create it here.</span></p>
            </div>
        </div>
    </>
}