
// At the moment, these errors can only be invalid / missing params.

import { ValidationData } from "./route_params";
import { DocParam } from "./route_types";

// In the future this may change
export const generate_preprocess_error = (p_data: ValidationData): Record<string, unknown> =>
{
    // Format it cleanly
    // Ths actual code is ugly however
    let error: Record<string, unknown> = {};

    const missing: Record<string, Array<DocParam>> = {};
    const invalid: Record<string, Array<DocParam>> = {};

    // This basically just constructs a cleaner looking object for output to the user
    if (p_data.missing.body.length) missing.body = p_data.missing.body;
    if (p_data.missing.path.length) missing.path = p_data.missing.path;
    if (p_data.missing.url.length) missing.url = p_data.missing.url;

    if (p_data.invalid.body.length) invalid.body = p_data.invalid.body;
    if (p_data.invalid.path.length) invalid.path = p_data.invalid.path;
    if (p_data.invalid.url.length) invalid.url = p_data.invalid.url;

    if (Object.keys(missing).length) error.missing_params = missing;
    if (Object.keys(invalid).length) error.invalid_params = invalid;

    return error;
}