import { useOthers } from '@liveblocks/react/suspense'
import React from 'react'

const ActiveCollaboratorsList = () => {
    const others=useOthers();
    console.log(others)
  return (
    <div>
      
    </div>
  )
}

export default ActiveCollaboratorsList
