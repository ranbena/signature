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
    <div id="form-wrapper">
      <form action="/generate.php" method="post" onsubmit="return Signature.generate();">
        <fieldset role="main" class="clearfix">
          <div class="field">
            <label for="name">Full Name *</label>
            <input type="text" name="name" id="frm-name" value="" />
          </div>
          <div class="field">
            <label for="title">Job Title *</label>
            <input type="text" name="title" id="frm-title" value="" />
          </div>
          <div class="field">
            <label for="email">Email *</label>
            <input type="email" name="email" id="frm-email" value="" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" />
          </div>
          <div class="field">
            <label for="phone">Phone *</label>
            <input type="text" name="phone" id="frm-phone" value="" placeholder="e.g (+972) 54-3164060" />
            <small>Example: <em>(+972) 54-3164060</em></small>
          </div>
          <div class="field clearfix">
            <input type="file" id="frm-file" class="hide" />
            <label for="logoBase64">Logo background image</label>
            <div id="drop-zone">Drop Image here</div>
            <canvas id="frm-canvas" class="hidden" width="110" height="110"></canvas>
            <button type="button" id="frm-choose">Choose image</button>
            <button type="button" id="frm-clearCanvas" class="hide">Remove image</button>
            <textarea name="logoBase64" id="frm-logo"></textarea>
          </div>
        </fieldset>
        <fieldset role="additional" class="clearfix">
          <div class="clearfix"></div>
          <div class="field">
            <label for="addfield">Add Field</label>
            <select name="addfield" id="frm-addfield">
              <option value="">...</option>
            </select>
          </div>
        </fieldset>
        <input type="submit" value="Generate" name="submit" class="submit" />
      </form>
    </div>
  </div>

  <script type="text/html" id="field-tpl"><div class="field">
    <button class="remove" rel="{name}">x</button>
    <label for="{name}">{label}</label>
    <input type="text" name="{name}" id="frm-{name}" value="" placeholder="{placeholder}" />
  </div></script>

  <script src="/js/FastBlur.js"></script>
  <script src="/js/main.js"></script>

</body>
</html>