import crypto from "crypto"

const PASSWORD_LENGTH = 64;
const HASH_LENGTH = 32;

// Hashes the password, generates its own salt and appends it to the password if
// no salt is provided
// format is password_hash[64]salt[32]
export const password_hash = async (p_password: string, p_salt?: string) =>
{
    // Generate a random salt, to ensure that the same password will
    // not hash into the same value
    // Hash length halfed as i convert to hex which doubles str length
    const salt = p_salt || crypto.randomBytes(HASH_LENGTH / 2).toString("hex");

    // I have to wrap it in a promise, as this lib uses callbacks
    return new Promise<string>((res, rej) =>
    {
        // Hash it, the final output once converted to hex will be 64 chars long
        // Halfed for same reason as above
        crypto.scrypt(p_password, salt, PASSWORD_LENGTH / 2, (error, hash) =>
        {
            if (error) rej(error);

            // Return the password adjacent to the salt
            else res(hash.toString("hex") + salt);
        });
    })
}

export const password_check = (p_hash: string, p_password: string) =>
{
    return new Promise<boolean>((res, rej) =>
    {
        // Using the format defined above to extract the hash and salt
        const salt = p_hash.slice(PASSWORD_LENGTH);

        password_hash(p_password, salt).then(hashed_input =>
        {
            // Check if the existing password matches the new hashed password
            res(hashed_input === p_hash);
        })
            .catch(rej);
    })
}