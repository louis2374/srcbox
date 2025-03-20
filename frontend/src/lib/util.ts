const num_formatter = new Intl.NumberFormat('en', { notation: 'compact', compactDisplay: 'short' });

export const readable_i = (p_num: number) =>
{
    return num_formatter.format(p_num);
}