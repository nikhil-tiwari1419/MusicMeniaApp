import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * Sends a transactional email using Brevo HTTP API
 * @param {string} toEmail - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 * @returns {Promise<Object>} - Brevo API response
 */
export const sendEmail = async (toEmail, subject, htmlContent) => {
  if (process.env.NODE_ENV === "test" || process.env.DISABLE_EMAIL_SENDING === "true") {
    return { skipped: true };
  }

  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.BREVO_EMAIL;

  if (!apiKey || !senderEmail) {
    console.error("[EmailService] Missing Brevo configuration");
    return;
  }

  try {
    const data = {
      sender: { email: senderEmail, name: "MusicMenia" },
      to: [{ email: toEmail }],
      subject: subject,
      htmlContent: htmlContent,
    };

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      data,
      {
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log(`[EmailService] Email sent to ${toEmail}: ${response.data.messageId}`);
    return response.data;
  } catch (error) {
    console.error("[EmailService] Error sending email:", error.response?.data || error.message);
    throw new Error("Failed to send email via Brevo");
  }
};
