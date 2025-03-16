import React from 'react'

const MiniProfileBox = () =>
{
    return (
        <div className='bg-amber-500 flex flex-row align-middle justify-center p-2'>
            <img className='rounded-[50%]' src='pfp.webp'></img>
            <p className='text-center'>@Bingle</p>
        </div>
    )
}

export default MiniProfileBox;