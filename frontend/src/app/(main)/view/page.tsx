import { permanentRedirect } from 'next/navigation'
import React from 'react'

const page = () =>
{

    permanentRedirect("/explore")
}

export default page;
