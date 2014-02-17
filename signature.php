<div style="font-family: Arial, sans-serif; padding-top: 13px; padding-bottom: 13px; color: #0a1116;">
  <br/>
  <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
    <tr>
      <td style="width: 55px;" valign="top">
        <a href="http://everything.me/"><img width="55" height="55" border="0" style="width: 55px; height: 55px;" src="<?=$img?>" /></a>
      </td>
      <td>
        <div style="padding: 10px 0 0 10px;">
          <div style="margin: 0; padding: 0;">
            <span style="font-size: 18px;"><?=$_POST['name'];?></span><br />
            <span style="font-size: 13px; white-space: nowrap;"><?=$_POST['title'];?></span>,
            <a href="http://everything.me/" style="font-size: 13px; color: #0a1116; text-decoration: none;">EverythingMe</a>
          </div>
          <div style="margin: 2px 0 0 0; padding: 0; line-height: 18px; font-size: 12px; color: #737373;">
            <span style="white-space: nowrap; margin-right: 8px;"><a href="mailto:<?=$_POST['email'];?>" style="color: #737373; text-decoration: none;"><span><img src="https://s3.amazonaws.com/evme-static-assets/email-signature/mail_icon.png" border="0" valign="middle" height="16" style="height: 16px; margin-top: -1px; vertical-align: middle;"/></span>&nbsp;<span><?=$_POST['email'];?></span></a></span>
            <span style="white-space: nowrap; margin-right: 8px;"><span><img src="https://s3.amazonaws.com/evme-static-assets/email-signature/phone_icon.png" border="0" valign="middle" height="15" style="height: 15px; vertical-align: middle;"/></span>&nbsp;<span><a href="tel:<?=$_POST['phone'];?>" style="color: #737373; text-decoration: none;"><?=$_POST['phone'];?></a></span></span>
            <?php if (!empty($_POST['additionalPhone'])): ?>
            <span style="white-space: nowrap; margin-right: 8px;"><span><img src="https://s3.amazonaws.com/evme-static-assets/email-signature/phone_icon.png" border="0" valign="middle" height="15" style="height: 15px; vertical-align: middle;"/></span>&nbsp;<span><a href="tel:<?=$_POST['additionalPhone'];?>" style="color: #737373; text-decoration: none;"><?=$_POST['additionalPhone'];?></a></span></span>
            <?php endif; ?>
            <?php if (!empty($_POST['skype'])): ?>
            <span style="white-space: nowrap; margin-right: 8px;"><a href="skype:<?=$_POST['skype'];?>?call" style="color: #737373; text-decoration: none;"><span><img src="https://s3.amazonaws.com/evme-static-assets/email-signature/skype_icon.png" border="0" valign="middle" height="18" style="height: 18px; margin-top: -1px; vertical-align: middle;"/></span>&nbsp;<span><?=$_POST['skype'];?></span></a></span>
            <?php endif; ?>
            <?php if (!empty($_POST['facebook'])): ?>
            <span style="white-space: nowrap; margin-right: 8px;"><a href="http://www.facebook.com/<?=$_POST['facebook'];?>" style="color: #737373; text-decoration: none;"><span><img src="https://s3.amazonaws.com/evme-static-assets/email-signature/facebook_icon.png" border="0" valign="middle" height="18" style="height: 18px; margin-top: -3px; vertical-align: middle;"/></span>&nbsp;<span><?=$_POST['facebook'];?></span></a></span>
            <?php endif; ?>
            <?php if (!empty($_POST['twitter'])): ?>
            <span style="white-space: nowrap; margin-right: 8px;"><a href="http://www.twitter.com/<?=$_POST['twitter'];?>" style="color: #737373; text-decoration: none;"><span><img src="https://s3.amazonaws.com/evme-static-assets/email-signature/twitter_icon.png" border="0" valign="middle" height="18" style="height: 18px; margin-top: -3px; vertical-align: middle;"/></span>&nbsp;<span>@<?=$_POST['twitter'];?></span></a></span>
            <?php endif; ?>
          </div>
          <?php if (!empty($_POST['extraText'])): ?>
          <div style="margin: 10px 0 0 0; padding: 0; font-size: 12px; color: #737373;">
            <div style="width: 128px; height: 1px; background-color: #d0d0d0;"></div>
            <div style="margin: 5px 0 0 0; padding: 0;"><em><?=$_POST['extraText'];?></em></div>
          </div>
          <?php endif; ?>
        </div>
      </td>
    </tr>
  </table>
</div>