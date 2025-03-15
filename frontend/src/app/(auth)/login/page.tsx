import { NextRequest } from 'next/server'
import React from 'react'

const page = async (p_req: NextRequest) =>
{
    return (
        <div>
            <button>Click</button>
            LOGIN
        </div>
    )
}

export default page
