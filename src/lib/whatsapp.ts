export function formatPakistaniNumber(rawNumber: string): string {
  const digitsOnly = rawNumber.replace(/\D/g, "");

  if (digitsOnly.startsWith("92")) {
    return digitsOnly;
  }

  if (digitsOnly.startsWith("0")) {
    return `92${digitsOnly.slice(1)}`;
  }

  return `92${digitsOnly}`;
}

export function generateComplaintNumber(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `CMP-${random}`;
}

interface ComplaintMessageData {
  complaintNumber: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  issueDetails: string;
  priority: string;
}

export function buildCustomerMessage(data: ComplaintMessageData): string {
  return `Assalam-o-Alaikum ${data.customerName},

Aap ki complaint regarding "${data.productName}" hum ne receive kar li hai.

Complaint Details: ${data.issueDetails}

Aap ka complaint number: ${data.complaintNumber}

Aap ki complaint 24 se 48 hours mein hal ho jayegi.

Hum jald hi is par action lenge. Shukriya.`;
}

export function buildShopMessage(data: ComplaintMessageData): string {
  return `Naya Complaint Forward Ho Raha Hai:

Customer Name: ${data.customerName}
Contact Number: ${data.customerPhone}
Product: ${data.productName}
Priority: ${data.priority}

Complaint Details:
${data.issueDetails}

Baraye meherbani is masle ko resolve karein.`;
}

export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  const formattedNumber = formatPakistaniNumber(phoneNumber);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
}