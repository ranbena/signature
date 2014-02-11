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
    <h3>Preview: ( copy & paste to gmail )</h3>
    <div class="clearfix" contenteditable>
      <?php include 'signature.php' ?>
    </div>
    <h3>HTML Code: ( for old clients )</h3>
    <textarea><?php include 'signature.php' ?></textarea>
  </div>
</body>
</html>