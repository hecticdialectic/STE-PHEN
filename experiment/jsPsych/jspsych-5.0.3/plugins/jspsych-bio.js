/*
check not on mobile and screen > X
see which one first clicked on
check browers (e.g. IE>9)
*/
jsPsych.plugins['bio'] = (function() {

  var plugin = {};

  plugin.trial = function(display_element, trial) {

    var plugin_id_name = 'jspsych-bio';
    var plugin_id_selector = '#' + plugin_id_name;

    // Set up survey css
    display_element.append($('<style id="jspsych-bio-css"></style>'));
    var css_string = '.bioRadio {padding-right: 30px}';
    $('#jspsych-bio-css').html(css_string);

    // Set up survey display area
    display_element.append($('<div>', {
      class: 'survey_display'
    }));

    $('.survey_display').html(
      "<p>Finally, 2 biographical questions.</p>"+
      "<div class='age'>"+
      "<label><p>What is your age?</p>"+
      "<input type='text' maxlength=2 class='numbersOnly' id='age_input'>"+
      "</input>"+
      "</label>"+
      "</div>"+
      "<div class='gender'><p>What is your gender?</p>"+
      "<label class='bioRadio'>"+
      "<input type='radio' name='gender' class='gender' value='m'> Male"+
      "</input>"+
      "</label>"+
      "<label class='bioRadio'>"+
      "<input type='radio' name='gender' class='gender' value='f'> Female"+
      "</input>"+
      "</label>"+
      "<label class='bioRadio'>"+
      "<input type='radio' name='gender' class='gender' value='o'> Other  "+
      "<input type='text' id='gender_specify' maxlength=10 placeholder='optionally specify'>"+
      "</input>"+
      "</label>"+
      "</div>"
    );

  $('.numbersOnly').keyup(function () {
      this.value = this.value.replace(/[^0-9\.]/g,'');
  });

    // add submit button
    display_element.append($('<button>', {
      id: 'jspsych-bio-submit',
      class: 'jspsych-bio jspsych-btn right',
      text: 'Finish survey'
    }));

    function htmlEncode(value){
      //create a in-memory div, set its inner text(which jQuery automatically encodes)
      //then grab the encoded contents back out.  The div never exists on the page.
      return $('<div/>').text(value).html();
    }

    //When 'submit' is clicked
    $("#jspsych-bio-submit").click(function() {
        var age = $('#age_input').val();
        var gender = $('input.gender:checked').val();
        var specify = $('#gender_specify').val();
        var question_data = {};
        question_data['age'] = age;
        question_data['gender'] = gender;
        question_data['specify'] = htmlEncode(specify);

        // Create data object
        var trial_data = {
          "responses": JSON.stringify(question_data)
        };

        // Clear display
        display_element.html('');

        // Finish trial, saving data first
        jsPsych.finishTrial(trial_data);

     });
  };
  return plugin;
})();
