// Format price in Indian Rupees
export const formatINR = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format large numbers in Indian style (Lakhs/Crores)
export const formatIndianNumber = (num) => {
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  } else if (num >= 1000) {
    return `₹${(num / 1000).toFixed(2)} K`;
  }
  return formatINR(num);
};

// Payment methods available in India
export const PAYMENT_METHODS = [
  { value: "UPI", label: "UPI (GPay, PhonePe, Paytm)" },
  { value: "Net Banking", label: "Net Banking" },
  { value: "Credit Card", label: "Credit Card" },
  { value: "Debit Card", label: "Debit Card" },
  { value: "Wallet", label: "Wallet (Paytm, PhonePe)" },
];
