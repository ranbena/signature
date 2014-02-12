function $(id) {
  return document.getElementById(id);
}
function $$(selector, scope) {
  return (scope || document).querySelector(selector);
}

function selectText(target) {
  if (document.selection) {
    var range = document.body.createTextRange();
    range.moveToElementText(document.getElementById(target));
    range.select();
  } else if (window.getSelection) {
    var range = document.createRange();
    range.selectNode(document.getElementById(target));
    window.getSelection().addRange(range);
  }
}

var Signature = new function() {

  var self = this,

      availableFields = {
        'phone': {
          'label': 'Additional Phone',
          'name': 'additionalPhone',
          'placeholder': 'e.g (+972) 54-3164060'
        },
        /*'facebook': {
          'label': 'Facebook',
          'name': 'facebook'
        },*/
        'twitter': {
          'label': 'Twitter',
          'name': 'twitter'
        },
        'skype': {
          'label': 'Skype',
          'name': 'skype'
        }
      },

      canvasSettings = {
        'blur': 1,
        'alpha': null,
        'iterations': 2,
        'width': 110,
        'height': 110,
        'centerImage': true
      },

      usedFields = [],

      $frmName = $('frm-name'),
      $frmTitle = $('frm-title'),
      $frmPhone = $('frm-phone'),
      $frmEmail = $('frm-email'),

      // $frmSNFacebook = $('frm-sn-facebook'),
      $frmSNTwitter = $('frm-sn-twitter'),
      $frmSNSkype = $('frm-sn-skype'),

      $frmCode = $('frm-code'),
      $fieldTemplate = $('field-tpl').innerHTML,
      $signatureTemplate = $('signature-tpl').innerHTML,
      // $facebookTemplate = $('sn-facebook-tpl').innerHTML,
      $twitterTemplate = $('sn-twitter-tpl').innerHTML,
      $skypeTemplate = $('sn-skype-tpl').innerHTML,

      $generator = $('generator'),

      $preview = $('preview'),
      $previewCode = $('preview-code'),

      $frmAddField = $('frm-addfield'),

      $frmAdditionalFieldset = $$('fieldset[role="additional"]'),

      $dropZone = $('drop-zone'),
      $frmCanvas = $('frm-canvas'),
      $frmLogo = $('frm-logo'),
      $clearCanvas = $('frm-clearCanvas');

  this.init = function() {
    $frmName.focus();

    var options = [];
    for (var field in availableFields) {
      options.push('<option value=' + field + '>' +
          availableFields[field].label + '</option>');
    }
    $frmAddField.innerHTML += options.join('\n');
    $frmAddField.addEventListener('change', self.addField.bind(self));

    $dropZone.addEventListener('dragover', self.handleDragOver.bind(self));
    $dropZone.addEventListener('dragleave', self.handleDragLeave.bind(self));
    $dropZone.addEventListener('drop', self.handleFileSelect.bind(self));

    $clearCanvas.addEventListener('click', self.clearCanvas.bind(self));
  };

  this.addField = function() {
    if ($frmAddField.value.length > 0) {
      if (usedFields.indexOf(availableFields[$frmAddField.value].name) > -1) {
        alert('Can\'t use same field more then once');
        $frmAddField.value = '';
        return;
      }
      usedFields.push(availableFields[$frmAddField.value].name);

      var newField = document.createElement('div');
      newField.innerHTML = $fieldTemplate.replace(/{name}/g,
          availableFields[$frmAddField.value].name);
      newField.innerHTML = newField.innerHTML.replace(/{label}/g,
          availableFields[$frmAddField.value].label);
      newField.innerHTML = newField.innerHTML.replace(/{placeholder}/g,
          availableFields[$frmAddField.value].placeholder||'');

      var button = $$('button', newField),
          input = $$('input', newField);
      button.addEventListener('click', self.removeField.bind(self));

      $frmAdditionalFieldset.insertBefore(newField.firstChild,
          $frmAddField.parentElement.previousElementSibling);

      input.focus();

      $frmAddField.value = '';
    }
  };

  this.removeField = function (e) {
    delete usedFields[usedFields.indexOf(e.target.getAttribute('rel'))];
    $frmAdditionalFieldset.removeChild(e.target.parentElement);
  };

  this.handleFileSelect = function (e) {
    $dropZone.classList.remove('drag-over');
    loadFile(e)
      .then(renderImg)
      .then(renderMask)
      .then(function(){
        $frmCanvas.classList.remove('hidden');
        $clearCanvas.classList.remove('hidden');
        $frmLogo.innerHTML = $frmCanvas.toDataURL();
      });
  };

  this.handleDragOver = function (e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    $dropZone.classList.add('drag-over');
  };

  this.handleDragLeave = function (e) {
    e.stopPropagation();
    e.preventDefault();
    $dropZone.classList.remove('drag-over');
  };

  function loadFile(e) {
    e.stopPropagation();
    e.preventDefault();

    var p = new Promise(function(resolve, reject){
      var reader = new FileReader();
      reader.onload = function(e) {
        resolve(e.target.result);
      }

      // Read in the image file as a base64 string.
      var f = e.dataTransfer.files[0];
      reader.readAsDataURL(f);
    });
    return p;
  };

  function renderImg(base64) {
    var img = new Image();
    var p = new Promise(function(resolve, reject){
      img.onload = function () {
        if (img.width > img.height) {
          var ratio = canvasSettings.height / img.height;
        } else {
          var ratio = canvasSettings.width / img.width;
        }
        img.width = img.width * ratio;
        img.height = img.height * ratio;

        boxBlurImage( img, $frmCanvas.id, canvasSettings.blur,
            canvasSettings.alpha, canvasSettings.iterations,
            canvasSettings.width, canvasSettings.height,
            canvasSettings.centerImage );

        resolve();
      }
    });
    img.src = base64;
    return p;
  };

  function renderMask() {
    var imgMask = new Image();
    var p = new Promise(function(resolve, reject){
      imgMask.onload = function () {
        var context = $frmCanvas.getContext('2d');

        context.fillStyle = "rgba(0,0,0,0.2)";
        context.fillRect(0, 0, canvasSettings.width,
            canvasSettings.height);
        context.drawImage(imgMask, 0, 0);

        resolve();
      }
      imgMask.src = '/img/iconMask.png';
    });
    return p;
  };

  this.clearCanvas = function() {
    $frmCanvas.getContext("2d").clearRect( 0, 0,
        canvasSettings.width, canvasSettings.height );

    $clearCanvas.classList.add('hidden');
    $frmLogo.innerHTML = '';
  };

  this.generate = function() {
    var template = $signatureTemplate;

    if ($frmName.value == "") {
      $frmName.focus();
      return;
    }

    if ($frmTitle.value == "") {
      $frmTitle.focus();
      return;
    }

    if ($frmPhone.value == "") {
      $frmPhone.focus();
      return;
    }

    if ($frmEmail.value == "") {
      $frmEmail.focus();
      return;
    }

    template = template.replace('{name}', $frmName.value);
    template = template.replace('{title}', $frmTitle.value);
    template = template.replace('{phone}', $frmPhone.value);
    template = template.replace(/{email}/g, $frmEmail.value);

    // if ($frmSNFacebook.value != '') {
    // template = template.replace('{facebook}',$facebookTemplate.replace(/{username}/g,$frmSNFacebook.value));
    // } else {
    template = template.replace('{facebook}', '');
    // }

    if ($frmSNTwitter.value != '') {
      template = template.replace('{twitter}', $twitterTemplate.replace(/{username}/g, $frmSNTwitter.value));
    } else {
      template = template.replace('{twitter}', '');
    }

    if ($frmSNSkype.value != '') {
      template = template.replace('{skype}', $skypeTemplate.replace(/{username}/g, $frmSNSkype.value));
    } else {
      template = template.replace('{skype}', '');
    }

    template = template.replace(/\s{2,}/g, '');
    $frmCode.value = '<!-- everything.me signature code -->' + "\n" + template;

    showPreview(template);
  };

  function showPreview(html) {

    $previewCode.innerHTML = html;
    $preview.style.display = 'block';
    $generator.style.display = 'block';
  }
}

Signature.init();