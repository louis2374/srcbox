import * as cheerio from "cheerio"

// Ensures a snippet is a valid html document, and inserts css or js if provided
export const html_convert_to_document = (p_html: string, p_css?: string, p_js?: string) =>
{
    // I was gonna manually create the document, but this automatically builds it, similar to browser. Yay
    const doc = cheerio.load(p_html);

    // Add js and styling
    if (p_css) doc("head").append(`<style>${p_css}</style>`)

    // Cant use defer, and i need the script to run once everything else has loaded
    // This forces that
    if (p_js) doc("body").append(`<script>${p_js}</script>`)

    // Return valid doc
    return doc.html();
}