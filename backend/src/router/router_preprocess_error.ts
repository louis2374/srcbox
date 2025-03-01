
// At the moment, these errors can only be invalid / missing params.

import { ValidationData } from "./route_params";

// In the future this may change
export const generate_preprocess_error = (p_validation_data: ValidationData): Record<string, unknown> =>
{
    // JSON.stringify should remove any if there is no data, making these a clean response
    return {
        missing_params: p_validation_data.missing,
        invalid_params: p_validation_data.invalid
    };
}