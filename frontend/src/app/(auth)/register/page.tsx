"use client"
import FormInput from '@/components/FormInput'
import SButton from '@/components/SButton'
import { join } from '@/lib/css'
import { capitalise, is_sufficient_password, is_valid_email, StdAPIErrors } from '@srcbox/library'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from 'postcss'
import React, { ChangeEvent, FormEvent, useRef, useState } from 'react'

const page = () =>
{
    const email = useRef("");
    const password = useRef("");
    const confirm_password = useRef("");
    const username = useRef("");

    // Current error
    const [error, set_error] = useState("");

    // The names of elements which should be highlighted as erroring
    const [error_locations, set_error_locations] = useState<Array<string>>([])

    const router = useRouter();
    const params = useSearchParams();

    // Error highlighting
    const validate_inputs = () =>
    {
        // If this email is valid, and the last error related to the email
        if (!is_valid_email(email.current))
        {
            set_error_locations(o => [...o, "email"])
        }
        else if (error_locations.includes("email"))
        {
            set_error_locations(o => [...o.filter(l => l != "email")])
        }

        // If this password is valid, and the last error related to the password
        if (!is_sufficient_password(password.current))
        {
            set_error_locations(o => [...o, "password"])
        }
        else if (error_locations.includes("password"))
        {
            set_error_locations(o => [...o.filter(l => l != "password")])
        }

        if (!username.current || username.current.length == 0)
        {
            set_error_locations(o => [...o, "username"])
        }
        else if (error_locations.includes("username"))
        {
            set_error_locations(o => [...o.filter(l => l != "username")])
        }

        if (password.current != confirm_password.current)
        {
            set_error_locations(o => [...o, "confirm_password"])
        }
        else if (error_locations.includes("confirm_password"))
        {
            set_error_locations(o => [...o.filter(l => l != "confirm_password")])
        }
    }

    // Handles error highlight triggering and saving the value
    const email_update = (e: ChangeEvent<HTMLInputElement>) =>
    {
        email.current = e.target.value;
        validate_inputs();
    }

    const password_update = (e: ChangeEvent<HTMLInputElement>) =>
    {
        password.current = e.target.value;
        validate_inputs();
    }

    const username_update = (e: ChangeEvent<HTMLInputElement>) =>
    {
        username.current = e.target.value;
        validate_inputs();
    }

    const confirm_password_update = (e: ChangeEvent<HTMLInputElement>) =>
    {
        confirm_password.current = e.target.value;
        validate_inputs();
    }

    const register = async (p_email: string, p_password: string, p_username: string): Promise<boolean> =>
    {
        try
        {
            const response = await fetch("/api/register", {
                body: JSON.stringify({ email: p_email, password: p_password, username: p_username }),
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            })

            const out = await response.json();

            if (out.error)
            {
                handle_register_error(out.error, out.code);
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
    }

    const handle_register_error = (p_error_msg: string, p_error_code: StdAPIErrors) =>
    {
        switch (p_error_code)
        {
            case StdAPIErrors.USERNAME_ALREADY_EXISTS:
                set_error(p_error_msg);
                set_error_locations(["username"]);
                break;
            case StdAPIErrors.EMAIL_ALREADY_EXISTS:
                set_error(p_error_msg);
                set_error_locations(["email"]);
                break;
            case StdAPIErrors.ACCOUNT_CREATED_DIDNT_LOGIN:
                router.push("/login");
                break;
            default:
                set_error(p_error_msg);
                set_error_locations([]);;
        }
    }

    const submit = async (e: FormEvent) =>
    {
        e.preventDefault();

        // Check email is valid
        if (!is_valid_email(email.current))
        {
            set_error("invalid email");
            set_error_locations(["email"])
            return;
        }

        // Rough point at which a password is not valid
        if (!is_sufficient_password(password.current))
        {
            set_error("password requires at least 8 chars, one number and one letter");
            set_error_locations(["password"])
            return;
        }

        if (password.current != confirm_password.current)
        {
            set_error("passwords do not match");
            set_error_locations(["confirm_password"])
            return;
        }

        if (username.current.length == 0)
        {

            set_error("username is empty");
            set_error_locations(["username"])
            return;
        }

        const success = await register(email.current, password.current, username.current);
    }

    return (
        <div className='align-middle justify-center flex flex-col gap-5 w-64'>
            <div className='text-center flex flex-col gap-1 pb-5'>
                <h1 className='text-4xl'>Welcome</h1>
                <span>Have an account? Login <Link className='text-accent hover:underline' href={"/login"}>here</Link></span>
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
                className='flex flex-col gap-6 justify-center align-middle text-xl'>
                <FormInput
                    name='username'
                    type='text'
                    placeholder='Username'
                    update={username_update}
                    status_color={join(error_locations.includes("username") && "#f00")}
                />
                <FormInput
                    name='email'
                    placeholder='Email'
                    type='email'
                    update={email_update}
                    status_color={join(error_locations.includes("email") && "#f00")}
                />
                <FormInput
                    name='password'
                    type='password'
                    placeholder='Password'
                    update={password_update}
                    status_color={join(error_locations.includes("password") && "#f00")}
                />
                <FormInput
                    name='confirm_password'
                    type='password'
                    placeholder='Confirm password'
                    update={confirm_password_update}
                    status_color={join(error_locations.includes("confirm_password") && "#f00")}
                />
                <SButton
                    type='submit'
                    className='hover:text-accent mx-auto px-5 py-1'
                >Register</SButton>
            </form>
        </div>
    )
}

export default page;
