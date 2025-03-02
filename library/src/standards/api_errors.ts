// This allows me to have a shared standard, 
// so in the frontend i can just check
// the code rather than compare string our output it
// to the user directly

export enum StdAPIErrors
{
    GENERIC = 1,
    USERNAME_ALREADY_EXISTS,
    EMAIL_ALREADY_EXISTS,
    UNKNOWN,
    BAD_PARAMS,
    INVALID_LOGIN_CREDENTIALS,
    UNAUTHORIZED,
    NOT_FOUND
}