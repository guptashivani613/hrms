import React from 'react'
import Education from '../../profile/Education'
import EmergencyContact from '../../profile/EmergencyContact'
import Experience from '../../profile/Experience'
import PersonalInformation from '../../profile/PersonalInformation'

const Profile = () => {
  return (
    <div className='space-y-8 p-6'>
      <PersonalInformation />
      <EmergencyContact />
      <div className='grid grid-cols-2 gap-4'>
        <Education />
        <Experience />
      </div>
    </div>
  )
}

export default Profile