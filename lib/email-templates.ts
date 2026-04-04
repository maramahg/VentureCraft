export interface EmailTemplateOptions {
  title: string;
  previewText?: string;
  content: string;
  footerMessage?: string;
  templateType?: 'default' | 'announcement';
  button?: {
    text: string;
    url: string;
  };
}

export const getEmailHtml = (options: EmailTemplateOptions) => {
  const { title, previewText, content, footerMessage, button, templateType = 'default' } = options;
  const isAnnouncement = templateType === 'announcement';

  const buttonHtml = button ? `
    <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
      <a href="${button.url}" target="_blank" style="display: inline-block; background-color: #39cc89; padding: 18px 36px; border-radius: 14px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #001311; text-decoration: none;">${button.text}</a>
    </div>
  ` : '';

  const uniqueId = Math.random().toString(36).substring(2, 10);
  const mainBg = '#0c1e1c';
  const textColor = '#ffffff';
  const subTextColor = '#e2e8f0';
  const titleColor = '#39cc89';
  const borderColor = '#39cc89';
  const borderThickness = '4px'; // High prominence for announcement borders
  const borderRadius = '32px'; // Premium rounded corners

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
      <td align="center" valign="top" style="padding: 60px 10px;">
        
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        
        <table class="main-table" border="0" cellpadding="0" cellspacing="0" width="600" style="width: 600px; table-layout: fixed; border-collapse: collapse;">
          
          ${isAnnouncement ? `
          <!-- Row 1: Top Half of Bell (Outside Card) -->
          <tr>
            <td width="250" style="width: 250px; height: 50px;">&nbsp;</td>
            <td width="100" align="center" valign="bottom" style="width: 100px; height: 50px;">
               <table border="0" cellpadding="0" cellspacing="0" width="100" height="50" style="background-color: #ffde59; border-top-left-radius: 50px; border-top-right-radius: 50px;">
                  <tr>
                    <td align="center" valign="bottom">
                      <img src="https://img.icons8.com/ios-filled/100/000000/bell.png" alt="" width="54" height="40" style="display: block; margin-bottom: -1px;">
                    </td>
                  </tr>
               </table>
            </td>
            <td width="250" style="width: 250px; height: 50px;">&nbsp;</td>
          </tr>

          <!-- Row 2: Bottom Half of Bell + Breaking Top Border -->
          <tr>
            <td width="250" bgcolor="${mainBg}" style="width: 250px; height: 50px; background-color: ${mainBg}; border-top: ${borderThickness} solid ${borderColor}; border-left: ${borderThickness} solid ${borderColor}; border-top-left-radius: ${borderRadius};">&nbsp;</td>
            <td width="100" align="center" valign="top" style="width: 100px; height: 50px; background-color: ${mainBg};">
               <table border="0" cellpadding="0" cellspacing="0" width="100" height="50" style="background-color: #ffde59; border-bottom-left-radius: 50px; border-bottom-right-radius: 50px;">
                  <tr>
                    <td align="center" valign="top">
                      <img src="https://img.icons8.com/ios-filled/100/000000/bell.png" alt="" width="54" height="14" style="display: block; margin-top: -40px;">
                    </td>
                  </tr>
               </table>
            </td>
            <td width="250" bgcolor="${mainBg}" style="width: 250px; height: 50px; background-color: ${mainBg}; border-top: ${borderThickness} solid ${borderColor}; border-right: ${borderThickness} solid ${borderColor}; border-top-right-radius: ${borderRadius};">&nbsp;</td>
          </tr>

          <!-- Content Padding Row -->
          <tr>
            <td colspan="3" bgcolor="${mainBg}" style="background-color: ${mainBg}; border-left: ${borderThickness} solid ${borderColor}; border-right: ${borderThickness} solid ${borderColor}; padding-top: 20px; text-align: center;">
              <p style="color: #39cc89; font-family: Arial, sans-serif; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px;">Announcement</p>
              <h1 style="color: ${titleColor}; font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; margin: 0; line-height: 1.3; padding: 0 40px;">${title}</h1>
            </td>
          </tr>
          ` : `
          <!-- Default Template Header -->
          <tr>
            <td align="center" bgcolor="${mainBg}" style="background-color: ${mainBg}; padding: 50px 20px 30px; border: 1px solid #1a3a36; border-bottom: 0; border-top-left-radius: 24px; border-top-right-radius: 24px;">
              <img src="https://kfupm-venturecraft.org/logo.png" alt="Venture Craft" width="200" style="display: block; width: 200px; height: auto;">
            </td>
          </tr>
          <tr>
            <td align="center" bgcolor="${mainBg}" style="background-color: ${mainBg}; padding: 0 40px 30px; border-left: 1px solid #1a3a36; border-right: 1px solid #1a3a36;">
              <h1 style="color: ${titleColor}; font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; margin: 0; line-height: 1.3;">${title}</h1>
            </td>
          </tr>
          `}

          <!-- Main Content Body -->
          <tr>
            <td colspan="${isAnnouncement ? '3' : '1'}" bgcolor="${mainBg}" style="background-color: ${mainBg}; border-left: ${isAnnouncement ? borderThickness : '1px'} solid ${isAnnouncement ? borderColor : '#1a3a36'}; border-right: ${isAnnouncement ? borderThickness : '1px'} solid ${isAnnouncement ? borderColor : '#1a3a36'}; padding: 0 40px 40px; color: ${textColor}; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; word-break: break-word; overflow-wrap: break-word; text-align: left;">
              <div style="color: ${subTextColor};">
                ${content}
              </div>
              <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; color: ${mainBg}; line-height: 1px; mso-hide: all;">
                Ref: ${uniqueId}
              </div>
              ${buttonHtml}
            </td>
          </tr>

          ${isAnnouncement ? `
          <!-- Row 5: Breaking Bottom Border + Top Half of VC Logo -->
          <tr>
            <td width="200" bgcolor="${mainBg}" style="width: 200px; height: 50px; background-color: ${mainBg}; border-bottom: ${borderThickness} solid ${borderColor}; border-left: ${borderThickness} solid ${borderColor}; border-bottom-left-radius: ${borderRadius};">&nbsp;</td>
            <td width="200" align="center" valign="bottom" style="width: 200px; height: 50px; background-color: ${mainBg};">
               <img src="https://kfupm-venturecraft.org/logo.png" alt="Venture Craft" width="160" style="display: block; margin-bottom: -25px;">
            </td>
            <td width="200" bgcolor="${mainBg}" style="width: 200px; height: 50px; background-color: ${mainBg}; border-bottom: ${borderThickness} solid ${borderColor}; border-right: ${borderThickness} solid ${borderColor}; border-bottom-right-radius: ${borderRadius};">&nbsp;</td>
          </tr>

          <!-- Row 6: Bottom Half of VC Logo (Outside Card) -->
          <tr>
            <td width="200" style="width: 200px; height: 30px;">&nbsp;</td>
            <td width="200" align="center" valign="top" style="width: 100px; height: 30px; padding: 0;">
                <div style="height: 30px; overflow: hidden;">
                   <img src="https://kfupm-venturecraft.org/logo.png" alt="" width="160" style="display: block; margin-top: -30px;">
                </div>
            </td>
            <td width="200" style="width: 200px; height: 30px;">&nbsp;</td>
          </tr>
          ` : ''}

          <!-- Socials and Footer -->
          <tr>
            <td colspan="${isAnnouncement ? '3' : '1'}" align="center" bgcolor="${mainBg}" style="background-color: ${mainBg}; border: ${isAnnouncement ? '0' : '1px solid #1a3a36'}; border-top: 0; border-bottom-left-radius: 24px; border-bottom-right-radius: 24px; overflow: hidden;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding: 30px 40px 10px; border-top: 1px solid #1a3a36;">
                    <p style="color: #39cc89; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 20px;">Follow Our Journey</p>
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 0 10px;"><a href="https://x.com/venturecraft_sa" target="_blank"><img src="https://img.icons8.com/ios-filled/50/39cc89/x.png" width="24" height="24"></a></td>
                        <td style="padding: 0 10px;"><a href="https://www.linkedin.com/company/venturecraftsa/" target="_blank"><img src="https://img.icons8.com/ios-filled/50/39cc89/linkedin.png" width="24" height="24"></a></td>
                        <td style="padding: 0 10px;"><a href="https://www.instagram.com/venturecraft.sa" target="_blank"><img src="https://img.icons8.com/ios-filled/50/39cc89/instagram-new.png" width="24" height="24"></a></td>
                        <td style="padding: 0 10px;"><a href="https://www.tiktok.com/@venturecraft_sa" target="_blank"><img src="https://img.icons8.com/ios-filled/50/39cc89/tiktok.png" width="24" height="24"></a></td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" bgcolor="#081514" style="padding: 30px 40px; background-color: #081514; border-top: 1px solid #1a3a36;">
                    <p style="color: #4b6b66; font-family: Arial, sans-serif; font-size: 11px; line-height: 1.5; margin: 0 0 10px;">${footerMessage || 'This is an automated notification. Please do not reply.'}</p>
                    <p style="color: #39cc89; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; margin: 0 0 5px; letter-spacing: 1px;">VENTURE CRAFT</p>
                    <p style="color: #2c4a45; font-family: Arial, sans-serif; font-size: 11px; margin: 0; font-weight: bold;">Build Your Venture</p>
                  </td>
                </tr>
              </table>
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
