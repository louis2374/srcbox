"use client"
import FormInput from '@/components/FormInput'
import Loader from '@/components/Loader'
import SButton from '@/components/SButton'
import { join } from '@/lib/css'
import { capitalise, is_valid_email } from '@srcbox/library'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { FormEvent, useState } from 'react'

const page = () =>
{
    const [email, set_email] = useState("");
    const [password, set_password] = useState("");

    // Current error
    const [error, set_error] = useState("");

    // The names of elements which should be highlighted as erroring
    const [error_locations, set_error_locations] = useState<Array<string>>([])

    // Loading state, when logging in, ect ect
    const [loading, set_loading] = useState(false);


    const router = useRouter();
    const params = useSearchParams();

    const login = async (p_email: string, p_password: string): Promise<boolean> =>
    {
        set_loading(true)
        try
        {
            const response = await fetch("/api/login", {
                body: JSON.stringify({ email: p_email, password: p_password }),
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            })

            const out = await response.json();

            if (out.error)
            {
                set_error(out.error);
                set_error_locations(["email", "password"])
                return false;
            }
            else
            {
                // Check if there is a return_to query
                const return_to = params.get("return_to");

                if (return_to) router.push(return_to);
                else router.push("/explore");

                return true;
            }
        }
        catch (e)
        {
            set_error("Failed to login, try again later")
            set_error_locations([]);
            return false;
        }
        finally
        {
            set_loading(false)
        }
    }

    const submit = async (e: FormEvent) =>
    {
        e.preventDefault();

        // Check email is valid
        if (!is_valid_email(email))
        {
            set_error("invalid email");
            set_error_locations(["email"])
            return;
        }

        // Rough point at which a password is not valid
        if (password.length < 3)
        {
            set_error("invalid password");
            set_error_locations(["password"])
            return;
        }

        login(email, password);
    }

    return (
        <div className='align-middle justify-center flex flex-col gap-5 m-auto'>
            <div className='text-center flex flex-col gap-1 pb-5'>
                <h1 className='text-4xl'>Welcome Back</h1>
                <span>New? Register <Link className={join('text-accent hover:underline', loading && "pointer-events-none")} href={"/register"}>here</Link></span>
            </div>

            {
                error &&
                <span
                    className='bg-red-950 text-red-300 text-base p-2 text-center'>
                    {capitalise(error)}
                </span>
            }
            <form
                noValidate={true}
                onSubmit={submit}
                className='flex flex-col gap-10 justify-center align-middle text-xl relative'>
                <FormInput
                    disabled={loading}
                    name='email'
                    placeholder='Email'
                    type='email'
                    value={email}
                    update={(e) => set_email(e.target.value)}
                    className={join(error_locations.includes("email") && "border-b-red-500")} />
                <FormInput
                    disabled={loading}
                    name='password'
                    type='password'
                    placeholder='Password'
                    value={password}
                    update={(e) => set_password(e.target.value)}
                    className={join(error_locations.includes("email") && "border-b-red-500")} />
                <SButton
                    disabled={loading}
                    type='submit'
                    className='hover:text-accent mx-auto px-5 py-1 relative h-4'
                >
                    {loading ? <Loader /> : "Login"}</SButton>
            </form>
        </div>
    )
}

export default page;
