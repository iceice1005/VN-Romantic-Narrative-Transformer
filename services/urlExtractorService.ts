
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- Start of SHA-256 implementation (adapted from user's node.js signFunc) ---

let sha256_node_h_values: number[] = [];
let sha256_node_k_values: number[] = [];
let sha256_node_constants_initialized = false;

function initializeSha256NodeConstants_ts() {
    if (sha256_node_constants_initialized) return;

    const S = Math.pow;
    const R = S(2, 32);
    const J: { [key: number]: number | undefined } = {}; 

    for (let I = 2; sha256_node_k_values.length < 64; I++) {
        if (!J[I]) { 
            for (let U = 0; U < 313; U += I) { 
                 J[U] = I;
            }
            if (sha256_node_h_values.length < 8) {
                sha256_node_h_values.push(S(I, 0.5) * R | 0);
            }
            sha256_node_k_values.push(S(I, 1 / 3) * R | 0);
        }
    }
    sha256_node_constants_initialized = true;
}

function ROTR_ts(d: number, c: number): number {
    return (d >>> c) | (d << (32 - c));
}

function signFunc_nodeJsStyle_ts(W_param: string): string {
    initializeSha256NodeConstants_ts();

    let U_loopVar: number, T_charCode: number;
    const S_mathPow = Math.pow;
    const R_pow32 = S_mathPow(2, 32);
    let P_hex_output = "";
    const O_message_words: number[] = [];
    
    const N_original_msg_bits = 8 * W_param.length; 
    
    let current_h_state = sha256_node_h_values.slice(0, 8); 
    const K_round_constants = sha256_node_k_values; 

    let W_padded_string = W_param; 

    W_padded_string += "\x80"; 
    while (W_padded_string.length % 64 !== 56) {
        W_padded_string += "\x00";
    }

    for (U_loopVar = 0; U_loopVar < W_padded_string.length; U_loopVar++) {
        T_charCode = W_padded_string.charCodeAt(U_loopVar);
        if (T_charCode >> 8) { 
            throw new Error("Character code > 255 found in string. This SHA-256 version cannot process this.");
        }
        O_message_words[U_loopVar >> 2] = (O_message_words[U_loopVar >> 2] || 0) | (T_charCode << ((3 - U_loopVar % 4) * 8));
    }
    
    O_message_words[O_message_words.length] = (N_original_msg_bits / R_pow32) | 0; 
    O_message_words[O_message_words.length] = N_original_msg_bits; 

    for (let T_chunk_start_idx = 0; T_chunk_start_idx < O_message_words.length;) {
        const H_chunk_schedule_words = O_message_words.slice(T_chunk_start_idx, T_chunk_start_idx += 16); 
        const G_prev_h_state_for_chunk = current_h_state.slice(0); 

        let a = current_h_state[0];
        let b = current_h_state[1];
        let c = current_h_state[2];
        let d = current_h_state[3];
        let e = current_h_state[4];
        let f = current_h_state[5];
        let g = current_h_state[6];
        let h_var = current_h_state[7]; 

        for (U_loopVar = 0; U_loopVar < 64; U_loopVar++) {
            const F_word_m15 = H_chunk_schedule_words[U_loopVar - 15]; 
            const E_word_m2 = H_chunk_schedule_words[U_loopVar - 2];  
            
            if (U_loopVar >= 16) {
                 const s0_val = ROTR_ts(F_word_m15, 7) ^ ROTR_ts(F_word_m15, 18) ^ (F_word_m15 >>> 3);
                 const s1_val = ROTR_ts(E_word_m2, 17) ^ ROTR_ts(E_word_m2, 19) ^ (E_word_m2 >>> 10);
                 H_chunk_schedule_words[U_loopVar] = (H_chunk_schedule_words[U_loopVar - 16] + s0_val + H_chunk_schedule_words[U_loopVar - 7] + s1_val) | 0;
            }
            
            const S1 = ROTR_ts(e, 6) ^ ROTR_ts(e, 11) ^ ROTR_ts(e, 25);
            const ch = (e & f) ^ (~e & g);
            const temp1 = (h_var + S1 + ch + K_round_constants[U_loopVar] + H_chunk_schedule_words[U_loopVar]) | 0;
            
            const S0 = ROTR_ts(a, 2) ^ ROTR_ts(a, 13) ^ ROTR_ts(a, 22);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (S0 + maj) | 0;

            h_var = g;
            g = f;
            f = e;
            e = (d + temp1) | 0;
            d = c;
            c = b;
            b = a;
            a = (temp1 + temp2) | 0;
        }

        current_h_state[0] = (current_h_state[0] + a) | 0;
        current_h_state[1] = (current_h_state[1] + b) | 0;
        current_h_state[2] = (current_h_state[2] + c) | 0;
        current_h_state[3] = (current_h_state[3] + d) | 0;
        current_h_state[4] = (current_h_state[4] + e) | 0;
        current_h_state[5] = (current_h_state[5] + f) | 0;
        current_h_state[6] = (current_h_state[6] + g) | 0;
        current_h_state[7] = (current_h_state[7] + h_var) | 0;
    }

    for (U_loopVar = 0; U_loopVar < 8; U_loopVar++) {
        for (T_charCode = 3; T_charCode + 1; T_charCode--) { 
            const z_byte_val = (current_h_state[U_loopVar] >> (8 * T_charCode)) & 255;
            P_hex_output += (16 > z_byte_val ? "0" : "") + z_byte_val.toString(16);
        }
    }
    return P_hex_output;
}
// --- End of SHA-256 implementation ---


function fuzzySign_ts(text: string, substringNum: number): string {
    if (substringNum < 0 || substringNum > text.length) {
        console.warn(`Invalid substringNumber ${substringNum} for text of length ${text.length}. Using original text for fuzzing.`);
        return text; 
    }
    const num = Math.floor(substringNum);
    // If num is 0 or text.length, it effectively returns the original text.
    // The original logic in url_extractor.tsx had `text.substring(0) + ""` for num <= 0
    // and `"" + text.substring(0,text.length)` for num >= text.length.
    // Both simplify to `text`.
    // The core logic is for 0 < num < text.length.
    if (num <= 0 || num >= text.length) {
        return text;
    }
    return text.substring(num) + text.substring(0, num);
}


export async function extractTruyenWikiDichNetBookIndexUrl(originalUrl: string): Promise<string> {
    let parsedUrl;
    try {
        parsedUrl = new URL(originalUrl);
    } catch (e) {
        throw new Error('Invalid URL format provided. Please ensure it is a complete and valid URL.');
    }

    if (parsedUrl.hostname !== 'truyenwikidich.net' || !parsedUrl.pathname.startsWith('/truyen/')) {
        throw new Error('URL must be from truyenwikidich.net and start with /truyen/ (e.g., https://truyenwikidich.net/truyen/...).');
    }

    const response = await fetch(originalUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch URL content: ${response.status} ${response.statusText}. This could be due to network issues, the URL being incorrect, or the site blocking requests (CORS policy).`);
    }
    const htmlContent = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const scripts = Array.from(doc.querySelectorAll('script'));
    let relevantScriptContent: string | null = null;

    for (const script of scripts) {
        if (script.textContent && 
            script.textContent.includes('var bookId =') &&
            script.textContent.includes('var signKey =') &&
            script.textContent.includes('function fuzzySign') &&
            script.textContent.includes('loadBookIndex(')
            ) {
            // Further refine checks if necessary
            if (script.textContent.match(/var\s+bookId\s*=\s*["']/) &&
                script.textContent.match(/var\s+signKey\s*=\s*["']/) &&
                script.textContent.match(/function\s+fuzzySign\s*\([^)]*\)\s*\{/) && // Check for function definition
                script.textContent.match(/loadBookIndex\s*\(\s*\d+\s*,\s*\d+\s*,/)
                ) {
                relevantScriptContent = script.textContent;
                break;
            }
        }
    }

    if (!relevantScriptContent) {
        throw new Error('Could not find the required script tag containing "bookId", "signKey", "fuzzySign" function, and "loadBookIndex()" call in the page content. The website structure might have changed.');
    }
    
    const bookIdRegex = /var\s+bookId\s*=\s*["']([^"']+)["']/;
    const bookIdMatch = relevantScriptContent.match(bookIdRegex);
    if (!bookIdMatch || !bookIdMatch[1]) {
        throw new Error('Could not extract Book ID (bookId) from the script.');
    }
    const bookId = bookIdMatch[1];
    
    const signKeyRegex = /var\s+signKey\s*=\s*["']([^"']+)["']/;
    const signKeyMatch = relevantScriptContent.match(signKeyRegex);
    if (!signKeyMatch || !signKeyMatch[1]) {
        throw new Error('Could not extract Sign Key (signKey) from the script.');
    }
    const signKey = signKeyMatch[1];

    const fuzzySignFunctionBodyRegex = /function\s+fuzzySign\s*\(([^)]*)\)\s*\{([\s\S]*?)\}/;
    const fuzzySignFuncMatch = relevantScriptContent.match(fuzzySignFunctionBodyRegex);
    if (!fuzzySignFuncMatch || !fuzzySignFuncMatch[2]) {
        throw new Error('Could not find the body of the "fuzzySign" function in the script.');
    }
    const fuzzySignBodyContent = fuzzySignFuncMatch[2];

    // This regex looks for `text.substring(NUMBER)` or `e.substring(NUMBER)` etc.
    // It assumes the number is passed to substring, as seen in the original url_extractor.tsx example.
    const substringNumRegex = /\.substring\s*\(\s*(\d+)\s*\)/; 
    const substringNumMatch = fuzzySignBodyContent.match(substringNumRegex);
    if (!substringNumMatch || !substringNumMatch[1]) {
        throw new Error('Could not extract the Substring Number from the "fuzzySign" function\'s body (e.g., from a .substring(X) call).');
    }
    const substringNumberStr = substringNumMatch[1];
    const substringNumber = parseInt(substringNumberStr, 10);
    if (isNaN(substringNumber)) {
        throw new Error(`Extracted Substring Number "${substringNumberStr}" is not a valid number.`);
    }

    const loadBookIndexRegex = /loadBookIndex\s*\(\s*(\d+)\s*,\s*(\d+)\s*,[^)]*\)/;
    const loadBookIndexMatch = relevantScriptContent.match(loadBookIndexRegex);
    if (!loadBookIndexMatch || !loadBookIndexMatch[1] || !loadBookIndexMatch[2]) {
        throw new Error('Could not extract Start and Size parameters from the "loadBookIndex()" call in the script.');
    }
    const startStr = loadBookIndexMatch[1];
    const sizeStr = loadBookIndexMatch[2];

    const start = parseInt(startStr, 10);
    const size = parseInt(sizeStr, 10);

    if (isNaN(start)) {
        throw new Error(`Extracted Start value "${startStr}" is not a valid number.`);
    }
    if (isNaN(size)) {
        throw new Error(`Extracted Size value "${sizeStr}" is not a valid number.`);
    }
            
    const stringToSign = signKey + start.toString() + size.toString();
    const fuzziedString = fuzzySign_ts(stringToSign, substringNumber);
    
    let signature;
    try {
        signature = signFunc_nodeJsStyle_ts(fuzziedString);
    } catch (shaError) {
        throw new Error(`Signature calculation failed: ${shaError instanceof Error ? shaError.message : String(shaError)}`);
    }

    return `https://truyenwikidich.net/book/index?bookId=${bookId}&start=${startStr}&size=${sizeStr}&signKey=${signKey}&sign=${signature}`;
}
