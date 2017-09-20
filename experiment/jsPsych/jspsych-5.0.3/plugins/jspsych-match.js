/*
check not on mobile and screen > X
see which one first clicked on
check browers (e.g. IE>9)
*/
jsPsych.plugins['match'] = (function() {

  var plugin = {};


  //Preload stimuli http://docs.jspsych.org/features/media-preloading/

  // Check if a given stim is audio
  function isAudio(stimType){
    var audioTypes = ['Noise', 'Amp', 'Pitch', 'Sound'];
    if ( audioTypes.indexOf(stimType) > -1 ){
      return true;
    } else {
      return false;
    }
  }


  plugin.trial = function(display_element, trial) {

    $(document).unbind('keydown', continue_handler);

    var plugin_id_name = 'jspsych-match';
    var plugin_id_selector = '#' + plugin_id_name;

    // Default trial values
    trial.trial_index = trial.trial_index || 0;
    trial.inducer_stims = trial.inducer_stims || [];
    trial.concurrent_stims = trial.concurrent_stims || [];
    trial.is_html = (typeof trial.is_html == 'undefined') ? false : trial.is_html;
    trial.prompt = trial.prompt || '';
    trial.inducer_isAudio = isAudio(trial.inducer_type);
    trial.concurrent_isAudio = isAudio(trial.concurrent_type);
    trial.response_ends_trial = (typeof trial.response_ends_trial == 'undefined') ? false : trial.response_ends_trial;
    trial.timing_gap = trial.timing_gap || 0; //how long to wait until the concurrent stims are presented
    trial.correct = trial.correct || [];

    /*if any trial variables are functions
    this evaluates the function and replaces
    it with the output of the function */
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    /*this array holds handlers from setTimeout calls
    that need to be cleared if the trial ends early */
    var setTimeoutHandlers = [];

    // inject CSS for trial
    display_element.append('<style id="jspsych-match-css"></style>');
    $.get('jspsych-match.css', function(css_string){
      //console.log(css_string);
      $('#jspsych-match-css').html(css_string);
    });

    // Set up instruction div (if any)
    if(trial.prompt.length>0){
      display_element.append($('<div>', {
        class: 'instructions',
      }));
      $('.instructions').html(trial.prompt);
    };

    // Set up stim display area
    display_element.append($('<div>', {
      class: 'stim_display'
    }));

    $('.stim_display').html(
    "<div class='inducer'>"+
    "<div class='column left outside'><div class='content inducer_stim' side=0><img class='inducer_img' side=0></div></div>"+
    "<div class='column center'></div>"+
    "<div class='column right outside'><div class='content inducer_stim' side=1><img class='inducer_img' side=1></div></div></div>"+
    "<div class='break'></div>"+
    "<div class='concurrent'>"+
    "<div class='row first'><div class='column left outside'><div class='content'><label class='control control-radio'><input type='radio' class='myRadio' name='ConcurrentL' value=0 row=0 /><div class='control_indicator'></div></label></div></div>"+
    "<div class='column center'><div class='content concurrent_stim' row=0><img row=0 class='concurrent_img'></div></div>"+
    "<div class='column right outside'><div class='content'><label class='control control-radio'><input type='radio' class='myRadio' name='ConcurrentL' value=1 row=0 /><div class='control_indicator'></div></label></div></div></div>"+
    "<div class='row second'><div class='column left outside'><div class='content'><label class='control control-radio'><input type='radio' class='myRadio' name='ConcurrentR' value=0 row=1 /><div class='control_indicator'></div></label></div></div>"+
    "<div class='column center'><div class='content concurrent_stim' row=1><img row=1 class='concurrent_img'></div></div>"+
    "<div class='column right outside'><div class='content'><label class='control control-radio'><input type='radio' class='myRadio' name='ConcurrentR' value=1 row=1 /><div class='control_indicator'></div></label></div></div></div></div>"
);

// If there's a prompt, display it in the instruction box. Otherwise shrink the instruction box
    if(trial.prompt.length>0){
      $('.instructions').html(trial.prompt);
    } else {
      $('.instructions').css('height', '50px');
    }


// images
    // work out what file types are needed for inducer images
    if (trial.inducer_type == 'Speed') {
      inducer_suffix = '.gif';
    } else {
      inducer_suffix = '.png';
    }

    // display inducer images
    for (var i = 0; i < 2; i++){
      if (!trial.is_html) {
        if (trial.inducer_isAudio){
          var stim_img = 'stims/audioPlaceholder.png';
        } else {
          var stim_img = 'stims/' + trial.inducer_stims[i] + inducer_suffix;
        }
        $('.inducer_img[side='+i+']').prop('src',stim_img);
      } else {
        display_element.append($('<div>', {
          html: stim_filename
        }));
      }
    }

    // work out what file types are needed for concurrent images
    if (trial.concurrent_type == 'Speed') {
      concurrent_suffix = '.gif';
    } else {
      concurrent_suffix = '.png';
    }

    //display concurrent images
    for (var i = 0; i < 2; i++){
      if (!trial.is_html) {
        if (trial.concurrent_isAudio){
          var stim_img = 'stims/audioPlaceholder.png';
        } else {
          var stim_img = 'stims/' + trial.concurrent_stims[i] + concurrent_suffix;
        }
        $('.concurrent_img[row='+i+']').prop('src',stim_img);
      } else {
        display_element.append($('<div>', {
          html: stim_filename
        }));
      }
    }

// audio
    // add inducer audio
    if (trial.inducer_isAudio){
      for (var i = 0; i < 2; i++){
        $( '.inducer_stim[side='+i+']').append($('<audio>', {
          src: 'stims/'+trial.inducer_stims[i]+'.mp3',
          type: 'audio/mpeg',
          class: 'audio_stim',
          id: trial.trial_index+'_audio_inducer_'+i,
          isPlayed: 0,
          preload: 'auto'
        }));
      }
    }

    // add concurrent audio
    if (trial.concurrent_isAudio){
      for (var i = 0; i < 2; i++){
        $( '.concurrent_stim[row='+i+']').append($('<audio>', {
          src: 'stims/'+trial.concurrent_stims[i]+'.mp3',
          type: 'audio/mpeg',
          class: 'audio_stim',
          id: trial.trial_index+'_audio_inducer_'+i,
          isPlayed: 0,
          preload: 'auto'
        }));
      }
    }

    // Play and stop methods for audio
    $('.audio_stim').closest('.content').hover(

        // play audio on entering div
        function(e) {
        $(this).find('img').css('border-width', '3px');
        var audioElement = $(this).find('audio')[0];
        console.log(audioElement)
        audioElement.play();
      },

      // stop audio on leaving div
      function(e){
        $(this).find('img').css('border-width', '1px');
        var audioElement = $(this).find('audio')[0];
        audioElement.pause();
        audioElement.currentTime = 0;
    });

    //methods for when the audio file is finished playing
    $('audio').on('ended', function() {
      // update attribute 'isPlayed' to show that participant has finished listening to this audio file
      $(this).attr('isPlayed', 1);
      // make border green so participant knows what they've listened to it
      $(this).closest('.content').find('img').css('border-color', '#4ACA2B');
    });

// Inputs
    // event handler for radio buttons
    $('.myRadio').on('click', setButtons);

    // variable for tracking that a choice has been made
    var checked = 0;
    /* if choice made for one inducer, sets choice for other
    and prevents same concurrent being selected for both inducers*/
    function setButtons() {
      //ensure only one checked per side, auto-check other side
      checked = 1;
      var row = this.getAttribute('row');
      var value = this.getAttribute('value');
      $('.myRadio[row='+Math.abs(row-1)+'][value='+Math.abs(value-1)+']').prop('checked',true);
    }

    // add submit button
    display_element.append($('<button>', {
      id: 'jspsych-match-next',
      class: 'jspsych-match jspsych-btn right',
      text: 'Submit Answers'
    }));

    // what to do when submit button clicked
    $("#jspsych-match-next").click(function() {

    // Check how many audio have been played
    var unplayed = $('audio[isPlayed=0]');
    // check if response given (checked==1) and if all audio files have been played (unplayed.length==0)
      if (checked==1 & unplayed.length==0){
          // measure response time
          var endTime = (new Date()).getTime();
          var response_time = endTime - startTime;

          // create object to hold responses and assume there are no incorrect responses (because most questions are subjective)
          var question_data = {};
          var correct = true;

          // collect choices
          var responses = $(".myRadio").each(function(index, elem) {
           if(this.checked){
             var obje = {};
             // if a list of correct answers have been passed to this plugin, check the participant has answered correctly
             if(trial.correct.length>0){
               var row = $(this).attr('row');
               var correct_response = trial.correct[row];
               var response = this.value;
               if (response != correct_response){
                 endmessage = 'You answered the attention/sound check incorrectly so you will not be able to take part. ' +
                 'However, we will still pay you $0.25 for the time you spent reading these instructions. To claim this payment, enter the following code on Mechanical Turk: ' +
                 completion_code + 'aCa' +
                 ". The work will be rejected since you failed the attention check, and the $0.25 will be paid as a bonus. If you wish to complain, please email <a href='mailto:alan.nielsen@mpi.nl' target = '_top'>alan.nielsen@mpi.nl</a>";
                 jsPsych.endExperiment(endmessage);
               }
             }
             obje[this.name] = this.value;
             $.extend(question_data, obje);
           };
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
        if (unplayed.length>0){
          alertString += "Hover over all audio icons to play them before choosing. Once they've been played all the way through, the border will turn green. "
        }
        if (checked==0){
          alertString += "Don't click submit until you've matched the stimuli at the bottom with those at the top. Click in the grey boxes to make your choice. "
        }
        alert(alertString);
      }

     });

  var startTime = (new Date()).getTime();
  };
  return plugin;
})();
