/**
 * Formats a price in Indian Rupees to Cr/Lac notation
 * - ≥ 1 Cr: ₹{cr}.{lac} Cr (e.g., ₹1.29 Cr)
 * - Also show: ₹{total_lac} Lac (e.g., ₹129.86 Lac)
 * - < 1 Cr: ₹{lac}.{thousand} Lac (e.g., ₹85.50 Lac)
 */

export interface FormattedIndianPrice {
  cr: string;        // e.g., "1.29 Cr"
  lac: string;       // e.g., "129.86 Lac"
  full: string;      // e.g., "₹1.29 Cr (₹129.86 Lac)"
  rawCr: number;     // numeric crores
  rawLac: number;    // numeric lacs
}

export function formatIndianCurrency(price: number): FormattedIndianPrice {
  const cr = price / 1e7;
  const lac = price / 1e5;

  if (cr >= 1) {
    const crStr = cr.toFixed(2);
    const lacStr = lac.toFixed(2);
    return {
      cr: `₹${crStr} Cr`,
      lac: `₹${lacStr} Lac`,
      full: `₹${crStr} Cr (₹${lacStr} Lac)`,
      rawCr: cr,
      rawLac: lac,
    };
  } else {
    const lacStr = lac.toFixed(2);
    return {
      cr: '',
      lac: `₹${lacStr} Lac`,
      full: `₹${lacStr} Lac`,
      rawCr: 0,
      rawLac: lac,
    };
  }
}

/**
 * Formats a number with Indian number system (commas for thousands, lakhs, crores)
 */
export function formatIndianNumber(num: number): string {
  return num.toLocaleString('en-IN');
}

/**
 * Formats price for screen readers (spoken format)
 */
export function formatPriceForScreenReader(price: number): string {
  const formatted = formatIndianCurrency(price);
  if (formatted.rawCr >= 1) {
    const crores = Math.floor(formatted.rawCr);
    const lacs = Math.round((formatted.rawCr - crores) * 100);
    if (lacs > 0) {
      return `${crores} crore ${lacs} lakh rupees`;
    }
    return `${crores} crore rupees`;
  } else {
    const lacs = Math.floor(formatted.rawLac);
    const thousands = Math.round((formatted.rawLac - lacs) * 100);
    if (thousands > 0) {
      return `${lacs} lakh ${thousands} thousand rupees`;
    }
    return `${lacs} lakh rupees`;
  }
}