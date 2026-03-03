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

  const buttonHtml = button ? `
    <center>
      <table border="0" cellpadding="0" cellspacing="0" style="margin-top: 32px; margin-bottom: 32px;">
        <tr>
          <td align="center" bgcolor="#39cc89" style="border-radius: 12px; background-color: #39cc89 !important;">
            <a href="${button.url}" target="_blank" style="display: inline-block; padding: 18px 36px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #001311 !important; text-decoration: none; border-radius: 12px; background-color: #39cc89 !important;">
              <font color="#001311" style="color: #001311 !important;">${button.text}</font>
            </a>
          </td>
        </tr>
      </table>
    </center>
  ` : '';

  const uniqueId = Math.random().toString(36).substring(2, 10);
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="color-scheme" content="dark only">
  <meta name="supported-color-schemes" content="dark only">
  <style type="text/css">
    /* General styles */
    body { width: 100% !important; margin: 0; padding: 0; background-color: #001311 !important; color: #ffffff !important; }
    img { outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; }
    table { border-collapse: collapse; }
    
    /* Gmail hack to prevent forced light mode */
    u + .body .gmail-blend-screen { background:#001311; mix-blend-mode:screen; }
    u + .body .gmail-blend-difference { background:#001311; mix-blend-mode:difference; }

    @media only screen and (max-width: 600px) {
      .main-card { width: 100% !important; border-radius: 0 !important; border: none !important; }
      .content-padding { padding: 40px 20px !important; }
    }
  </style>
</head>
<body class="body" bgcolor="#001311" style="margin: 0; padding: 0; min-width: 100%; background-color: #001311 !important; color: #ffffff !important;">
  <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; color: #001311; line-height: 1px;">
    ${previewText || title}
  </div>

  <!-- Main Background Wrapper -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#001311" style="background-color: #001311 !important; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 0;" bgcolor="#001311">
        
        <!-- The Card -->
        <table class="main-card" border="0" cellpadding="0" cellspacing="0" width="600" bgcolor="#0c1e1c" style="background-color: #0c1e1c !important; border: 1px solid #1a3a36; border-radius: 24px; overflow: hidden; table-layout: fixed;">
          
          <!-- Top Accent -->
          <tr>
            <td height="4" bgcolor="#39cc89" style="height: 4px; background-color: #39cc89 !important; font-size: 1px; line-height: 1px;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding: 50px 20px 30px;" bgcolor="#0c1e1c">
              <a href="https://kfupm-venturecraft.org" target="_blank" style="text-decoration: none;">
                <img src="https://kfupm-venturecraft.org/logo.png" alt="Venture Craft" width="200" style="display: block; width: 200px; height: auto;">
              </a>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td align="center" style="padding: 0 40px 35px;" bgcolor="#0c1e1c">
              <h1 style="color: #39cc89 !important; font-family: Arial, sans-serif; font-size: 28px; font-weight: 900; margin: 0; line-height: 1.2;">
                <font color="#39cc89" style="color: #39cc89 !important;">${title}</font>
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="content-padding" align="center" style="padding: 0 50px 40px; color: #e2e8f0 !important; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.7;" bgcolor="#0c1e1c">
              <div style="text-align: left; color: #e2e8f0 !important;">
                <font color="#e2e8f0" style="color: #e2e8f0 !important;">
                  ${content}
                </font>
              </div>
              ${buttonHtml}
            </td>
          </tr>

          <!-- Socials -->
          <tr>
            <td align="center" style="padding: 35px 40px 10px; border-top: 1px solid #1a3a36;" bgcolor="#0c1e1c">
              <p style="color: #39cc89 !important; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 20px;">
                <font color="#39cc89" style="color: #39cc89 !important;">FOLLOW OUR JOURNEY</font>
              </p>
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 0 12px;" bgcolor="#0c1e1c">
                    <a href="https://x.com/venturecraft_sa?s=21" target="_blank">
                      <img src="https://img.icons8.com/ios-filled/50/39cc89/x.png" alt="X" width="24" height="24" style="display: block; width: 24px; height: 24px;">
                    </a>
                  </td>
                  <td style="padding: 0 12px;" bgcolor="#0c1e1c">
                    <a href="https://www.linkedin.com/company/venturecraftsa/" target="_blank">
                      <img src="https://img.icons8.com/ios-filled/50/39cc89/linkedin.png" alt="LinkedIn" width="24" height="24" style="display: block; width: 24px; height: 24px;">
                    </a>
                  </td>
                  <td style="padding: 0 12px;" bgcolor="#0c1e1c">
                    <a href="https://www.instagram.com/venturecraft.sa?igsh=bHJmMjF6dGM2MXU1" target="_blank">
                      <img src="https://img.icons8.com/ios-filled/50/39cc89/instagram-new.png" alt="Instagram" width="24" height="24" style="display: block; width: 24px; height: 24px;">
                    </a>
                  </td>
                  <td style="padding: 0 12px;" bgcolor="#0c1e1c">
                    <a href="https://www.tiktok.com/@venturecraft_sa?_r=1&_t=ZS-93h9rM2RRDu" target="_blank">
                      <img src="https://img.icons8.com/ios-filled/50/39cc89/tiktok.png" alt="TikTok" width="24" height="24" style="display: block; width: 24px; height: 24px;">
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Area -->
          <tr>
            <td align="center" bgcolor="#081514" style="padding: 40px 40px; background-color: #081514 !important; border-top: 1px solid #1a3a36;">
              <p style="color: #4b6b66 !important; font-family: Arial, sans-serif; font-size: 11px; line-height: 1.5; margin: 0 0 12px;">
                <font color="#4b6b66" style="color: #4b6b66 !important;">${footerMessage || 'This is an automated notification. Please do not reply.'}</font>
              </p>
              <p style="color: #39cc89 !important; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; margin: 0 0 10px; letter-spacing: 1px;">
                <font color="#39cc89" style="color: #39cc89 !important;">VENTURE CRAFT</font>
              </p>
              <p style="color: #2c4a45 !important; font-family: Arial, sans-serif; font-size: 11px; margin: 0; font-weight: 700; text-transform: uppercase;">
                <font color="#2c4a45" style="color: #2c4a45 !important;">Shape the Future of Tech</font>
              </p>
              <!-- Hidden Identifier -->
              <p style="color: #081514 !important; font-size: 5px; margin: 15px 0 0; opacity: 0.1;">Ref: ${uniqueId} | ${timestamp}</p>
            </td>
          </tr>

        </table>

        <!-- Anti-Gap Spacer -->
        <div style="height: 40px; line-height: 40px; font-size: 1px;">&nbsp;</div>

      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
