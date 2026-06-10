
export function formatQuoteNumber(number : number){
    return number.toString().padStart(4, '0')
}

export function formatInvoiceNumber(number : number){
    return number.toString().padStart(4, '0')
}