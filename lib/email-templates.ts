export interface EmailTemplateOptions {
  title: string;
  previewText?: string;
  content: string;
  footerMessage?: string;
  button?: {
    text: string;
    url: string;
  };
}

export const getEmailHtml = (options: EmailTemplateOptions) => {
  const { title, previewText, content, footerMessage, button } = options;
  const currentYear = new Date().getFullYear();

  const buttonHtml = button ? `
    <center>
      <table border="0" cellpadding="0" cellspacing="0" style="margin-top: 32px; margin-bottom: 32px;">
        <tr>
          <td align="center" bgcolor="#39cc89" style="border-radius: 14px;">
            <a href="${button.url}" target="_blank" style="display: inline-block; padding: 18px 36px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #001311; text-decoration: none;">${button.text}</a>
          </td>
        </tr>
      </table>
    </center>
  ` : '';

  // Every email needs a unique content block to prevent Gmail from "trimming" (the three dots)
  const uniqueId = Math.random().toString(36).substring(2, 10);
  const timestamp = new Date().toLocaleTimeString();

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style type="text/css">
    body { width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0; padding: 0; background-color: #001311; }
    .ExternalClass { width: 100%; }
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
    img { outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; }
    table { border-collapse: collapse; mso-table-lspace: 10pt; mso-table-rspace: 10pt; }
    
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-cell { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body bgcolor="#001311" style="margin: 0; padding: 0; min-width: 100%; background-color: #001311;">
  <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; color: #001311;">
    ${previewText || title}
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#001311" style="background-color: #001311;">
    <tr>
      <td align="center" valign="top" style="padding: 40px 10px;">
        
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        
        <table class="main-table" border="0" cellpadding="0" cellspacing="0" width="600" bgcolor="#0c1e1c" style="background-color: #0c1e1c; border: 1px solid #1a3a36; border-radius: 24px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 50px 20px 30px;">
              <img src="https://kfupm-venturecraft.org/logo.png" alt="Venture Craft" width="200" style="display: block; width: 200px; height: auto;">
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td align="center" style="padding: 0 40px 30px;">
              <h1 style="color: #39cc89; font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; margin: 0; line-height: 1.3;">${title}</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content-cell" align="center" style="padding: 0 40px 40px; color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;">
              <div style="text-align: left; color: #e2e8f0;">
                ${content}
              </div>
              ${buttonHtml}
            </td>
          </tr>

          <!-- Socials -->
          <tr>
            <td align="center" style="padding: 30px 40px 10px; border-top: 1px solid #1a3a36;">
              <p style="color: #39cc89; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 20px;">Follow Our Journey</p>
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 0 10px;">
                    <a href="https://x.com/venturecraft_sa?s=21" target="_blank"><img src="https://cdn.simpleicons.org/x/39cc89" alt="X" width="24" height="24"></a>
                  </td>
                  <td style="padding: 0 10px;">
                    <a href="https://www.linkedin.com/company/venturecraftsa/" target="_blank"><img src="https://cdn.simpleicons.org/linkedin/39cc89" alt="LinkedIn" width="24" height="24"></a>
                  </td>
                  <td style="padding: 0 10px;">
                    <a href="https://www.instagram.com/venturecraft.sa?igsh=bHJmMjF6dGM2MXU1" target="_blank"><img src="https://cdn.simpleicons.org/instagram/39cc89" alt="Instagram" width="24" height="24"></a>
                  </td>
                  <td style="padding: 0 10px;">
                    <a href="https://www.tiktok.com/@venturecraft_sa?_r=1&_t=ZS-93h9rM2RRDu" target="_blank"><img src="https://cdn.simpleicons.org/tiktok/39cc89" alt="TikTok" width="24" height="24"></a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="#081514" style="padding: 30px 40px; background-color: #081514; border-top: 1px solid #1a3a36;">
              <p style="color: #4b6b66; font-family: Arial, sans-serif; font-size: 11px; line-height: 1.5; margin: 0 0 10px;">
                ${footerMessage || 'This is an automated notification. Please do not reply.'}
              </p>
              <p style="color: #39cc89; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; margin: 0 0 15px; letter-spacing: 1px;">VENTURE CRAFT</p>
              <p style="color: #2c4a45; font-family: Arial, sans-serif; font-size: 11px; margin: 0; font-weight: bold;">
                Shape the Future of Tech
              </p>
              <!-- Dynamic unique hidden text to prevent Gmail grouping/trimming -->
              <p style="color: #081514; font-size: 5px; margin: 0;">Ref: ${uniqueId} | Sent at ${timestamp}</p>
            </td>
          </tr>

        </table>

        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->

      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
