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

    const get = () => followed;

    const update_followed = useRef(debounce(() =>
    {
        api("/users/" + target + "/follow", get() ? Method.DELETE : Method.POST, { token }).then(console.log).catch(console.log)
    }, 2000));

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
