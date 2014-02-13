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
          'placeholder': 'e.g (+972) 54-3164060',
          'example': '(+972) 54-3164060'
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
        },
        'extraText': {
          'label': 'Additional Text',
          'name': 'extraText',
          'description': 'Here you can add an extra line of text to your signature.',
          'example': 'Coming to MWC? Drop me a line to meet up!'
        }
      },

      canvasSettings = {
        'blur': 3,
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
      $frmChoose = $('frm-choose'),
      $frmFile = $('frm-file'),
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
    $frmAddField.addEventListener('change', addField);

    $dropZone.addEventListener('dragover', handleDragOver);
    $dropZone.addEventListener('dragleave', handleDragLeave);
    $dropZone.addEventListener('drop', handleFileSelect);

    $frmChoose.addEventListener('click', invokeChooseFile);
    $frmFile.addEventListener('change', handleFileSelect);

    $clearCanvas.addEventListener('click', clearCanvas);
  };

  this.generate = function() {
    if ($frmName.value == "") {
      $frmName.focus();
      return false;
    }

    if ($frmTitle.value == "") {
      $frmTitle.focus();
      return false;
    }

    if ($frmPhone.value == "") {
      $frmPhone.focus();
      return false;
    }

    if ($frmEmail.value == "") {
      $frmEmail.focus();
      return false;
    }

    return true;
  };

  function invokeChooseFile() {
    $frmFile.click();
  }

  function addField() {
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

      if (availableFields[$frmAddField.value].example) {
        var small = document.createElement('small');
            small.innerHTML = 'Example: <em>' + availableFields[$frmAddField.value].example + '</em>';
        newField.firstChild.appendChild(small);
      }

      if (availableFields[$frmAddField.value].description) {
        var small = document.createElement('small');
            small.innerHTML = availableFields[$frmAddField.value].description;

        newField.firstChild.insertBefore(small, input);
      }

      button.addEventListener('click', removeField);

      $frmAdditionalFieldset.insertBefore(newField.firstChild,
          $frmAddField.parentElement.previousElementSibling);

      input.focus();

      $frmAddField.value = '';
    }
  }

  function removeField(e) {
    delete usedFields[usedFields.indexOf(e.target.getAttribute('rel'))];
    $frmAdditionalFieldset.removeChild(e.target.parentElement);
  }

  function handleFileSelect(e) {
    $dropZone.classList.remove('drag-over');
    loadFile(e)
      .then(renderImg)
      .then(renderMask)
      .then(function(){
        $frmCanvas.classList.remove('hidden');
        $clearCanvas.classList.remove('hide');
        $frmLogo.innerHTML = $frmCanvas.toDataURL('image/jpeg');
      });
  }

  function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    $dropZone.classList.add('drag-over');
  }

  function handleDragLeave(e) {
    e.stopPropagation();
    e.preventDefault();
    $dropZone.classList.remove('drag-over');
  }

  function loadFile(e) {
    e.stopPropagation();
    e.preventDefault();

    if (e.currentTarget.isEqualNode($frmFile)) {
      var f = $frmFile.files[0];
    } else {
      var f = e.dataTransfer.files[0];
    }

    var p = new Promise(function(resolve, reject){
      var reader = new FileReader();
      reader.onload = function(e) {
        resolve(e.target.result);
      }

      // Read in the image file as a base64 string.
      reader.readAsDataURL(f);
    });
    return p;
  }

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
  }

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
  }

  function clearCanvas() {
    $frmCanvas.getContext("2d").clearRect( 0, 0,
        canvasSettings.width, canvasSettings.height );

    $clearCanvas.classList.add('hide');
    $frmLogo.innerHTML = '';
  }
}

Signature.init();