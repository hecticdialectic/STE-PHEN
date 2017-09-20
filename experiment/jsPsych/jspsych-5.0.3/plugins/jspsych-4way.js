/*
check not on mobile and screen > X
see which one first clicked on
check browers (e.g. IE>9)
*/
jsPsych.plugins["4way"] = (function() {

  var plugin = {};

  //Preload stimuli http://docs.jspsych.org/features/media-preloading/

  // Check if a given stim is audio
  function isAudio(stimType){
    var audioTypes = ['Noise', 'Amp', 'Pitch'];
    if ( audioTypes.indexOf(stimType) > -1 ){
      return true;
    } else {
      return false;
    }
  }

  plugin.trial = function(display_element, trial) {

    var plugin_id_name = "jspsych-4way";
    var plugin_id_selector = '#' + plugin_id_name;

    // default trial values
    trial.trial_index = trial.trial_index || 0;
    trial.inducer_stims = trial.inducer_stims || [];
    trial.concurrent_stims = trial.concurrent_stims || [];
    trial.is_html = (typeof trial.is_html == 'undefined') ? false : trial.is_html;
    trial.prompt = trial.prompt || "";
    trial.inducer_isAudio = isAudio(trial.inducer_type);
    trial.concurrent_isAudio = isAudio(trial.concurrent_type);
    trial.response_ends_trial = (typeof trial.response_ends_trial == 'undefined') ? false : trial.response_ends_trial;
    trial.timing_gap = trial.timing_gap || 0; //how long to wait until the concurrent stims are presented

    /*if any trial variables are functions
    this evaluates the function and replaces
    it with the output of the function */
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    /*this array holds handlers from setTimeout calls
    that need to be cleared if the trial ends early */
    var setTimeoutHandlers = [];

    // inject CSS for trial
    display_element.append('<style id="jspsych-4way-css"></style>');
    var cssstr = ".jspsych-4way-inducers {height: 300px;}"+
      ".inducer-stim {width: 200px; border-style: solid; border-width: 2px}"+
      ".lh {float: left;}"+
      ".rh {float: right;}"+
      ".jspsych-4way-concurrent {height: 300px;}"+
      ".jspsych-4way-concurrent div {display: flex; justify-content: center; margin: auto;}"+
      ".concurrent-stim {width: 100px; border-style: solid; margin-bottom: 10px, border-width: 1px}"
    document.body.querySelector('#jspsych-4way-css').innerHTML = cssstr;

    // create divs for inducers, concurrent stims
    display_element.append($('<div>', {
      class: 'jspsych-4way-inducers',
      id: 'inducer-div',
      display: 'block'
    }));
    $("#inducer-div").html('<div class="lh"></div><div class="rh"></div>')
    display_element.append($('<div>', {
      class: 'jspsych-4way-concurrent',
      id: 'concurrent-div',
      display: 'block'
    }));
    $("#concurrent-div").html("<div class='row0'> <div class='lh'></div> <div class='mid'></div> <div class='rh'> </div></div>"+
    "<div class='row1'> <div class='lh'></div> <div class='mid'></div> <div class='rh'></div> </div>");

    // display inducer images
    if (trial.inducer_type == 'Speed') {
      inducer_suffix = '.gif';
    } else if (trial.inducer_type == 'Shape'){
      inducer_suffix = '.jpg';
    } else {
      inducer_suffix = '.png';
    }

    var horizontalPosition = ['lh', 'rh'];
    for (var i = 0; i < trial.inducer_stims.length; i++){
      if (!trial.is_html) {
        if (trial.inducer_isAudio){
          var stim_img = 'stims/audioPlaceholder.png';
        } else {
          var stim_img = 'stims/' + trial.inducer_stims[i] + inducer_suffix;
        }
        $( ".jspsych-4way-inducers ."+horizontalPosition[i]).append($('<img>', {
          src: stim_img,
          class: 'inducer-stim'
        }));
      } else {
        display_element.append($('<div>', {
          html: stim_filename
        }));sa
      }
    }

    // add inducer audio
    if (trial.inducer_isAudio){

      for (var i = 0; i < trial.inducer_stims.length; i++){
        $( ".jspsych-4way-inducers ."+horizontalPosition[i]).append($('<audio>', {
          src: 'stims/bell-ring-01.mp3',
          type: "audio/mpeg",
          class: 'inducer-stim audio '+horizontalPosition[i],
          id: trial.trial_index+"_audio_inducer_"+i,
          isPlayed: 0,
          preload: 'auto'
        }));

        // add play and stop methods
        $( ".jspsych-4way-inducers ."+horizontalPosition[i]).hover(
          // play audio on entering div
          function(e) {
          $(this).find('img').css("border-width", "3px");
          var audioElement = $(this).find('audio')[0];
          audioElement.play();
          // update attribute 'isPlayed' to show that participant has listened to this audio file
          $('#'+audioElement.id).attr('isPlayed', 1);
        },

        // stop audio on leaving div
        function(e){
          $(this).find('img').css("border-width", '2px');
          var audioElement = $(this).find('audio')[0];
          audioElement.pause();
          audioElement.currentTime = 0;
        })
      }
    }

    // display prompt?

    // wait before displaying concurrent?

    // display concurrent images
    if (trial.concurrent_type == 'Speed') {
      concurrent_suffix = '.gif';
    } else if (trial.concurrent_type == 'Shape'){
      concurrent_suffix = '.jpg';
    } else {
      concurrent_suffix = '.png';
    }

    for (var i = 0; i < trial.concurrent_stims.length; i++){
      if (!trial.is_html) {
          if (trial.concurrent_isAudio){
            var stim_img = 'stims/audioPlaceholder.png';
          } else {
            var stim_img = 'stims/' + trial.concurrent_stims[i] + concurrent_suffix;
          }
        $( ".jspsych-4way-concurrent .row"+i+" .mid").append($('<img>', {
          src: stim_img,
          class: 'concurrent-stim'
        }));
      } else {
        display_element.append($('<div>', {
          html: stim_filename
        }));
      }
    }

    // add concurrent audio
    if (trial.concurrent_isAudio){

      for (var i = 0; i < trial.concurrent_stims.length; i++){
        $( ".jspsych-4way-concurrent .row"+i+" .mid").append($('<audio>', {
          src: 'stims/bell-ring-01.mp3',
          type: "audio/mpeg",
          class: 'concurrent-stim audio',
          id: trial.trial_index+"_audio_concurrent_"+i,
          isPlayed: 0,
          preload: 'auto'
        }));
        // add play and stop methods
        $( ".jspsych-4way-concurrent .row"+i+" .mid").hover(
          // play audio on entering div
          function(e) {
          $(this).find('img').css("border-width", "3px");
          var audioElement = $(this).find('audio')[0];
          audioElement.play();
          // update attribute 'isPlayed' to show that participant has listened to this audio file
          $('#'+audioElement.id).attr('isPlayed', 1);
        },
        // stop audio on leaving div
        function(e){
          $(this).find('img').css("border-width", '2px');
          var audioElement = $(this).find('audio')[0];
          audioElement.pause();
          audioElement.currentTime = 0;
        })
      }
    }

    // add radio buttons
    for (var i = 0; i<2; i++){
      for (var j = 0; j<2; j++){
        $( ".jspsych-4way-concurrent .row"+j+" ."+horizontalPosition[i]).append($('<input>',{
          type: 'radio',
          class: 'myRadio',
          name: trial.trial_index+"_"+i,
          value: j,
          side: i,
        }));
      }
    }

    // event handler for radio buttons
    $(".myRadio").on("click", setButtons);

    var checked = 0;
    /* if choice made for one inducer, sets choice for other
    and prevents same concurrent being selected for both inducers*/
    function setButtons() {
      //ensure only one checked per side, auto-check other side
      checked = 1;
      var side = this.getAttribute('side');
      var value = this.getAttribute('value');
      $(".myRadio[side="+Math.abs(side-1)+"][value="+Math.abs(value-1)+"]").prop("checked",true);
    }

    // add submit button
    display_element.append($('<button>', {
      id: 'jspsych-4way-next',
      class: 'jspsych-4way jspsych-btn right',
      text: 'Submit Answers'
    }));

    // what to do when submit button clicked
    $("#jspsych-4way-next").click(function() {

      // check if all audio files have been played at least once
      function notPlayed(element, index, array) {
        return element == "0";
      }
      var listenedList = [];
      $(".audio").each(function(index) {
        $.merge(listenedList, this.getAttribute('isPlayed'))
      });
      var notListened = listenedList.some(notPlayed);

      // check if response given (checked==1) and if audio files have been played (notListened==false)
      if (checked==1 & notListened==false){

        // measure response time
          var endTime = (new Date()).getTime();
          var response_time = endTime - startTime;

          // create object to hold responses
          var question_data = {};

          $(".myRadio").each(function(index) {
            var response = $("input[name='"+this.name+"']:checked").val();
            if (typeof response == 'undefined') {
                response = -1;
            }
            var obje = {};
            obje[this.name] = response;
            $.extend(question_data, obje);
          });

          // save data
          var trial_data = {
            "rt": response_time,
            "responses": JSON.stringify(question_data)
          };
          display_element.html('');

          // next trial
          jsPsych.finishTrial(trial_data);

      // If no response given, prompt for response
      } else {
        var alertString = "";
        if (notListened==true){
          alertString += "Hover over all audio icons to play them before choosing. "
        }
        if (checked==0){
          alertString += "Don't click submit until you've made an answer. "
        }
        alert(alertString);
      }

     });

  var startTime = (new Date()).getTime();
  };
  return plugin;
})();
