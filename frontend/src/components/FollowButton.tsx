"use client"
import React, { useCallback, useMemo, useRef, useState } from 'react'
import SButton from './SButton';
import { debounce } from '@/lib/util';
import { api, useToken } from '@/lib/api/api';
import { Method } from '@srcbox/library';



interface Props
{
    target: number,
    starting_followed: boolean,

}

const FollowButton: React.FC<Props> = ({ starting_followed, target }) =>
{
    const token = useToken();
    const [followed, set_followed] = useState(starting_followed);
    const current_followed = useRef(starting_followed);

    // This waas kinda annoying, updating every frame like this allows update_followed to use the most
    // recent version when it fires
    current_followed.current = followed;

    const update_followed = useRef(debounce(() =>
    {
        api("/users/" + target + "/follow", current_followed.current ? Method.POST : Method.DELETE, { token }).catch(console.log)
    }, 500));

    return (
        <SButton
            onClick={() =>
            {
                set_followed(!followed);
                // Force onto next frame
                setTimeout(update_followed.current, 0);
            }}
            className='p-2 px-3 bg-accent col-start-2 md:col-start-3 overflow-hidden disabled:text-neutral-400 disabled:bg-neutral-800'>
            {followed ? "Unfollow" : "Follow"}
        </SButton>
    )
}

export default FollowButton;
