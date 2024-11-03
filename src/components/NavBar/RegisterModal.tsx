"use client"

import { EyeIcon } from '@/assets/EyeIcon'
import { SlashEyeIcon } from '@/assets/SlashEyeIcon'
import { useMainStore } from '@/store/useMainStore'
import styles from '@/styles/modules/NavBar.module.scss'
import axios, { AxiosError } from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Props = {
    showRegisterModal: boolean
    setShowRegisterModal: React.Dispatch<React.SetStateAction<boolean>>
}

const formDataBase = {
    name: '',
    email: '',
    password: '',
    repPassword: ''
}

export function RegisterModal({ showRegisterModal, setShowRegisterModal }: Props) {
    const [ formData, setFormData ] = useState(formDataBase)
    const [ passwordError, setPasswordError ] = useState('')
    const [ checkboxError, setCheckboxError ] = useState(false)
    const [ inputPassType, setInputPassType ] = useState('password')
    const [ inputRepPassType, setInputRepPassType ] = useState('password')
    const [ checkboxChecked, setCheckboxChecked ] = useState(false)
    const setShowPopup = useMainStore(state => state.setShowPopup)
    const setPopupMessage = useMainStore(state => state.setPopupMessage)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prevFormData => ({ ...prevFormData, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if(formData.password !== formData.repPassword) return
        if(!checkboxChecked) return setCheckboxError(true)
        try {
            await axios.post('/api/register', formData)
            setPopupMessage('Registered Succesfully')
        } catch(error) {
            let message = 'Unknown Error'
            if(error instanceof AxiosError && error.response) message = error.response.data.message
            setPopupMessage(message)
        }
        setShowRegisterModal(false)
        setFormData(formDataBase)
        setCheckboxChecked(false)
        setCheckboxError(false)
        setShowPopup(true)
        setTimeout(() => { setShowPopup(false)}, 6000)
    }

    useEffect(() => {
        if(formData.password !== formData.repPassword) {
            setPasswordError("Passwords do not match")
        } else {
            setPasswordError('')
        }
    }, [formData.password, formData.repPassword])

    if(!showRegisterModal) return null

    return <>
        <div className={styles.backdrop} onClick={() => {
            setShowRegisterModal(false)
            setFormData(formDataBase)
            setCheckboxChecked(false)
            setCheckboxError(false)
            }}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h2>Register</h2>
                    <div className={styles.wrapper}>
                        <label htmlFor="name">Full name</label>
                        <input autoFocus type="text" id='name' name='name' required value={formData.name} onChange={handleInputChange}/>
                    </div>
                    <div className={styles.wrapper}>
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id='email' name='email' required className={formData.email.length > 0 ? styles.filled : ''} value={formData.email} onChange={handleInputChange}/>
                    </div>
                    <div className={styles.wrapper}>
                        <label htmlFor="password">Password</label>
                        <input type={inputPassType} id='password' name='password' required value={formData.password} onChange={handleInputChange}/>
                        {inputPassType === 'password' ? 
                        <span 
                            className={styles.icon}
                            onClick={() => setInputPassType('text')} 
                            tabIndex={0} 
                            onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}><EyeIcon />
                        </span> : 
                        <span 
                            className={styles.icon}
                            onClick={() => setInputPassType('password')} 
                            tabIndex={0} 
                            onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}><SlashEyeIcon />
                        </span>}
                    </div>
                    <div className={styles.wrapper}>
                        <label htmlFor="repPassword">Repeat Password</label>
                        <input type={inputRepPassType} id='repPassword' name='repPassword' required value={formData.repPassword} onChange={handleInputChange} className={passwordError.length > 0 ? styles.error : ''}/>
                        {inputRepPassType === 'password' ? 
                        <span 
                            className={styles.icon}
                            onClick={() => setInputRepPassType('text')} 
                            tabIndex={0} 
                            onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}><EyeIcon />
                        </span> : 
                        <span 
                            className={styles.icon}
                            onClick={() => setInputRepPassType('password')} 
                            tabIndex={0} 
                            onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}><SlashEyeIcon />
                        </span>}
                        {passwordError.length > 0 && <p>{passwordError}</p>}
                    </div>
                    <div className={styles.policy}>
                        <input type="checkbox" id='policy' required checked={checkboxChecked} readOnly/>
                        <span 
                            className={`${styles.customCheckbox} ${checkboxChecked ? styles.checked : ''} ${checkboxError ? styles.error : ''}`} 
                            onClick={() => setCheckboxChecked(!checkboxChecked)} 
                            tabIndex={0} 
                            onKeyDown={(e) => { if(e.key === "Enter") (e.target as HTMLDivElement).click() }}>
                        </span>
                        <label htmlFor="policy">I have read and agree to the <Link href="/policy" target='_blank'>Terms and Conditions</Link> and <Link href="/policy" target='_blank'>Privacy Policy</Link></label>
                    </div>
                    <button type='submit'>Register</button>
                </form>
            </div>
        </div>
    </>
}