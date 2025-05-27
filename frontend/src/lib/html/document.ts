import * as cheerio from "cheerio"

// Ensures a snippet is a valid html document, and inserts css or js if provided
export const html_convert_to_document = (p_html: string, p_css?: string, p_js?: string) =>
{
    // I was gonna manually create the document, but this automatically builds it, similar to browser. Yay
    const doc = cheerio.load(p_html);

    // Add js and styling
    if (p_css) doc("head").append(`<style>${p_css}</style>`)

    // Cant use defer, and i need the script to run once everything else has loaded
    // This forces that, it is temporary as im running out of time.

    // Something with srcdoc, I think it is a little unstable.
    // My fix here just waits 1s for everything to load.
    // Another solution (but dont have time rn), is to add a little more wrapper code around this,
    // To either constantly check until it has loaded, then run, or to listen to a post message sent by the site
    // which triggers it to load
    if (p_js) doc("body").append(`<script>
setTimeout(() =>
{
${p_js}
}, 700); 
</script>`)

    // Return valid doc
    return doc.html();
}