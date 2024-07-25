'use client'
import { Button } from '@/components/ui/button'
import { AlignLeft, ArrowBigLeft, ArrowLeft, ArrowLeftCircle, ArrowLeftCircleIcon, ArrowLeftFromLine, MoveLeft, MoveLeftIcon } from 'lucide-react'
import { redirect, useRouter } from 'next/navigation'
import React from 'react'

const NotFound = () => {
    const router =useRouter()
  return (
    <main className='flex justify-center items-center h-[100vh] w-full'>
        <div className='flex flex-col'>

      <p className="text-xl font-light text-blue-100"> This Document No Longer Exists..</p>
      <Button className='gradient-blue gap  shadow-md flex gap-x-1 2xl:w-[3%] md:w-[8%] absolute w-[15%] top-8 md:left-8 left-4' onClick={()=>{
        router.push('/')
      }} >
        <ArrowLeftFromLine />
        </Button>
        </div>
    </main>
  )
}

export default NotFound
