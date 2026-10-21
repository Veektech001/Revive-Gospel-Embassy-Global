import { config } from "./config.js";

const site = () => config.frontendUrls[0];

// Escape text placed inside the HTML email
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** Email sent automatically when someone creates a member account. */
export function welcomeEmail(user) {
  const first = user.name.split(" ")[0];
  const sermonsUrl = `${site()}/sermons`;
  const firstTimeUrl = `${site()}/first-time`;

  const text = `Hello ${first},

Welcome to Revive Gospel Embassy! Your member account is ready.

You can now listen to and download sermons here:
${sermonsUrl}

Log in any time with this email address: ${user.email}

Join us in person:
  Sunday Service, 8:00 AM
  Friday Service, 4:30 PM
  SUG Complex, behind ESUT Senior Staff Club, Agbani, Enugu State

Planning your first visit? Let us know you're coming: ${firstTimeUrl}

God bless you,
Revive Gospel Embassy

You received this email because an account was created on our website with this address. If that wasn't you, simply ignore this email.`;

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#E7E0D6;font-family:Arial,Helvetica,sans-serif;color:#171416">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#E7E0D6;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:4px;overflow:hidden">
  <tr><td style="background:#171416;padding:28px 32px">
    <p style="margin:0;font-size:26px;line-height:1.1;font-weight:bold;letter-spacing:0.5px;color:#E7E0D6;text-transform:uppercase">Revive Gospel Embassy</p>
  </td></tr>
  <tr><td style="padding:32px">
    <p style="margin:0 0 16px;font-size:22px;font-weight:bold">Welcome, ${esc(first)}!</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6">Your member account is ready. You can now listen to and download sermons on our website.</p>
    <p style="margin:0 0 28px">
      <a href="${esc(sermonsUrl)}" style="display:inline-block;background:#F2A93B;color:#171416;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:999px">Go to sermons</a>
    </p>
    <p style="margin:0 0 6px;font-size:14px;color:#5b5356">Log in any time with</p>
    <p style="margin:0 0 28px;font-size:16px;font-weight:bold">${esc(user.email)}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E7E0D6">
      <tr><td style="padding-top:20px;font-size:15px;line-height:1.7">
        <strong>Join us in person</strong><br>
        Sunday Arise Service, 8:00 AM<br>
        Friday Revival Atmosphere, 5:00 PM<br>
        Thursday Prayer Uproar, 5:00 PM<br>
        SUG Complex, behind ESUT Senior Staff Club, Agbani, Enugu State<br><br>
        Planning your first visit? <a href="${esc(firstTimeUrl)}" style="color:#171416">Let us know you're coming</a>.
      </td></tr>
    </table>
    <p style="margin:28px 0 0;font-size:15px">God bless you,<br>Revive Gospel Embassy</p>
  </td></tr>
  <tr><td style="background:#f6f2ec;padding:16px 32px;font-size:12px;line-height:1.5;color:#7a7175">
    You received this email because an account was created on our website with this address. If that wasn't you, simply ignore this email.
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

  return { subject: "Welcome to Revive Gospel Embassy", text, html };
}