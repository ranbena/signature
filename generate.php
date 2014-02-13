<?php
require_once dirname(__FILE__) . "/../common/includes.php";
require_once dirname(__FILE__) . '/../common/AWS/aws-autoloader.php';
use Aws\S3\S3Client;

// default img for the signature
$img = 'https://s3.amazonaws.com/evme-static-assets/email-signature/default_logo.jpg';

// if custom image was uploaded
if (!empty($_POST['logoBase64'])) {
  $client = S3Client::factory(array(
    'key'    => AWS_KEY,
    'secret' => AWS_SECRET
  ));

  // get base64 data and image type
  $base64 = explode(',', $_POST['logoBase64']);
  $base64Data = $base64[1];
  $imgType = explode('/', $base64[0]);
  $imgType = str_replace(';base64', '', $imgType[1]);

  // generate a unique image id from the email address
  $uniqueimgid = str_replace(array('@','.'), '', $_POST['email']);

  // img path on s3 bucket
  $path = DOAT_CLUSTER . '/sig/' . $uniqueimgid . '.' . $imgType;

  $result = $client->putObject(array(
    'ACL' => 'public-read',
    'Bucket' => 'flyapps',
    'Key'    => $path,
    'Body'   => base64_decode($base64Data) // send base 64 as binary to s3
  ));

  // if upload was succesfull replace $img with the uploaded one
  if (!empty($result['ObjectURL'])) {
    $img = $result['ObjectURL'];
  }
}

// remove @ from twitter username in case someone posted it (will be added later on signature.php when generating the signature itself)
$_POST['twitter'] = str_replace('@', '', $_POST['twitter']);
?>
<!doctype html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title>EverythingMe Email Signature Generator</title>
  <link rel="stylesheet" href="/css/main.css">
</head>
<body>
  <div id="wrapper">
    <header>
      <h1><a href="/"></a></h1>
      <h2>Email Signature Generator</h2>
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