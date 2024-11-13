"use client"

import styles from '@/styles/modules/User.module.scss'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/useUserStore'
import { EyeIcon } from '@/assets/EyeIcon'
import { SlashEyeIcon } from '@/assets/SlashEyeIcon'
import axios from 'axios'

const baseFormData = {
    name: '',
    email: '',
    password: ''
}

export default function Settings() {
    const [ formData, setFormData ] = useState(baseFormData)
    const [ showDeleteModal, setShowDeleteModal ] = useState(false)
    const router = useRouter()
    const user = useUserStore(state => state.user)
    const logoutUser = useUserStore(state => state.logoutUser)
    const [ inputType, setInputType ] = useState('password')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prevFormData => ({ ...prevFormData, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if(!user) return 
        if(formData.name === '' && formData.email === '' && formData.password === '') return 
        await axios.put('/api/user', { ...formData, id: user.id })
    }

    const handleDeleteAccount = async () => {
        if(!user) return
        await axios.delete('api/user', { data: { userId: user.id } })
        logoutUser()
        router.push('/')
    }

    return <>
        <div className={styles.content}>
            <h2>Settings</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.wrapper}>
                    <label htmlFor="name">Change name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className={formData.name.length > 0 ? styles.filled : ''}/>
                </div>
                <div className={styles.wrapper}>
                    <label htmlFor="email">Change email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={formData.email.length > 0 ? styles.filled : ''}/>
                </div>
                <div className={styles.wrapper}>
                    <label htmlFor="password">Change password</label>
                    <input type={inputType} id="password" name="password" value={formData.password} onChange={handleInputChange} className={formData.password.length > 0 ? styles.filled : ''}/>
                    {inputType === 'password' ? <span onClick={() => setInputType('text')}><EyeIcon /></span> : <span onClick={() => setInputType('password')}><SlashEyeIcon /></span>}
                </div>
                <button type="submit">Save</button>
            </form>
            <button className={styles.delAcc} onClick={() => setShowDeleteModal(true)}>Delete Account</button>
            {showDeleteModal && <div className={styles.backdrop} onClick={() => setShowDeleteModal(false)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <p>Are you sure you want to delete your account?</p>   
                    <div>
                        <button onClick={() => setShowDeleteModal(false)}>Cancel</button>    
                        <button onClick={handleDeleteAccount}>Delete</button>    
                    </div> 
                </div>
            </div>}
        </div>
    </>
}