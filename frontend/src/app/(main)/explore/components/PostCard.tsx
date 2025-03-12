import React from 'react'

const PostCard = () =>
{
    return (
        <div className='flex flex-col w-full hover:bg-backgrounddarker p-4 rounded-lg'>
            <div className='w-full h-96 bg-neutral-700'>
                <iframe src="https://player.smashy.stream/tv/1405?s=6&amp;e=6" className='w-full h-full'></iframe>
            </div>
            <div className='pt-3'>
                Title
            </div>
        </div>
    )
}

export default PostCard
