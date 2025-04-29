export default async function sendEmail(
  to: string,
  subject: string,
  body: string
) {
  console.log("[MOCK SEND]");
  console.log(`   To: ${to}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Body: ${body}`);
}
