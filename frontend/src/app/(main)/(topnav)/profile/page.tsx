import { getToken } from '@/lib/api/ssr'
import { local_user_id_get } from '@/lib/util';
import { permanentRedirect } from 'next/navigation'
import React from 'react'

// Gets logged in user profile and forwards to it
const page = async () =>
{
    const token = await getToken();
    const user = local_user_id_get(token);
    permanentRedirect("/profile/" + user)
}

export default page;
