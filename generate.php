<?php
require_once dirname(__FILE__) . "/../common/includes.php";
require_once dirname(__FILE__) . '/../common/AWS/aws-autoloader.php';
use Aws\S3\S3Client;

$img = 'https://s3.amazonaws.com/evme-static-assets/email-signature/default_logo.jpg';

if (!empty($_POST['logo'])) {
  $client = S3Client::factory(array(
    'key'    => AWS_KEY,
    'secret' => AWS_SECRET
  ));

  $base64 = explode(',', $_POST['logo']);
  $email = explode('@', $_POST['email']);

  $result = $client->putObject(array(
    'ACL' => 'public-read',
    'Bucket' => 'flyapps',
    'Key'    => DOAT_CLUSTER . '/sig/' . $email[0] . '.png',
    'Body'   => base64_decode($base64[1])
  ));

  if (!empty($result['ObjectURL'])) {
    $img = $result['ObjectURL'];
  }
}
?>
<!doctype html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title>EverythingMe Signature Generator</title>
  <link rel="stylesheet" href="/css/main.css">
</head>
<body>
  <div id="wrapper">
    <header>
      <h1><a href="/"></a></h1>
      <h2>EverythingMe mail signature generator</h2>
    </header>
    <h3>Preview: ( copy &amp; paste to gmail )</h3>
    <div class="clearfix" contenteditable>
      <?php include 'signature.php' ?>
    </div>
    <h3>HTML Code: ( for old clients )</h3>
    <textarea><?php include 'signature.php' ?></textarea>
  </div>
</body>
</html>