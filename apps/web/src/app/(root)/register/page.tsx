import UserForm from '@/components/UserForm'
import React from 'react'

export default function page() {
    return (
        <>
            <section className=' py-5 md:py-10'>
                <h3 className='wrapper h3-bold text-center'>Register</h3>
            </section>

            <div className='wrapper my-8'>
                <UserForm type="Register"/>
            </div>
        </>
    )
}
