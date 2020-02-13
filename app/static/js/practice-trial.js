jsPsych.plugins['practice-trial'] = (function() {

  var plugin = {};

  // ask jsPsych to preload the images
  jsPsych.pluginAPI.registerPreload('practice-trial', 'robot_images', 'image');
  jsPsych.pluginAPI.registerPreload('practice-trial', 'feedback_images', 'image');

  plugin.info = {
    name: 'turk-pit',
    parameters: {
      robot_images: {
        type: jsPsych.plugins.parameterType.STRING,
        default: undefined,
        required: true,
        description: 'The array of robot images'
      },
      canvas_dimensions: {
        type:jsPsych.plugins.parameterType.INT, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: [600, 600],
        description: 'The dimensions [width, height] of the html canvas on which things are drawn'
      },
      background_colour: {
        type: jsPsych.plugins.parameterType.STRING,
        default: '#FFFFFF',
        description: 'The colour of the background'
      },
      stimulus_offset: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus offset',
        default: [0, 0],
        description: 'The offset [horizontal, vertica] of the centre of each stimulus from the centre of the canvas in pixels'
      },
      stimulus_dimensions: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus dimensions',
        default: [480, 360],
        description: 'Stimulus dimensions in pixels [width, height]'
      },
      press_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Choice key',
        default: 'space',
        description: 'The key to be pressed to select the robot'
      },
      choice_listen_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Choice window duration',
        default: 3000,
        description: 'How long to wait for a response (in milliseconds).'
      },
      feedback_display_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Feedback display duration',
        default: 2000,
        description: 'How long to display the feedback (in milliseconds).'
      },
      post_stimulus_pause_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Post-stimulus pause duration',
        default: 500,
        description: 'How long to wait before displaying feedback (in milliseconds).'
      },
      iti_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Duration of inter-trial interval',
        default: 1500,
        description: 'How long to display a blank screen between trials (in milliseconds).'
      },
      feedback_offset: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Feedback offset',
        default: [0, 0],
        description: 'The offset [horizontal, vertica] of the centre of the feedback from the centre of the canvas in pixels'
      },
      giver_colour: {
        type: jsPsych.plugins.parameterType.STRING,
        default: '#66C166',
        description: 'The colour of the background for gain-domain robots'
      },
      taker_colour: {
        type: jsPsych.plugins.parameterType.STRING,
        default: '#C16666',
        description: 'The colour of the background for loss-domain robots'
      },
      unpressed_colour: {
        type: jsPsych.plugins.parameterType.STRING,
        default: '#FFA343',
        description: 'The colour of the button when it is pressed'
      },
      pressed_colour: {
        type: jsPsych.plugins.parameterType.STRING,
        default: '#4D4E4F',
        description: 'The colour of the button when it is pressed'
      },
      correct_text: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Correct text',
        default: 'Great!',
        description: 'The string to display if the response was correct'
      },
      incorrect_text: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Correct text',
        default: 'Wrong!',
        description: 'The string to display if the response was incorrect'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // add a canvas to the HTML_STRING, store its context, and draw a blank background
    var new_html = '<canvas id="trial_canvas" width="'+trial.canvas_dimensions[0]+'" height="'+trial.canvas_dimensions[1]+'"></canvas>';
    display_element.innerHTML = new_html;
    var ctx = document.getElementById('trial_canvas').getContext('2d');
    DrawBackground(); // draw the background of the canvas

    // set up a container for key responses
    var response = {
      rt: null,
      key_char: null,
      pressed: false
    };

    ///// TRIAL LOOP /////
    var display = {
      robot_number: trial.robot_number,
      pressed: false,
      domain_colour:  (trial.robot_type == 'giver') ? trial.giver_colour:trial.taker_colour,
      button_colour: trial.unpressed_colour,
      feedback_image: null
    };

    // initial ITI
    jsPsych.pluginAPI.setTimeout(function() {

      // draw the robot to the screen
      DrawRobot();

      // start the response listener
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: AfterResponse,
        valid_responses: [trial.press_key],
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });

      // set a timeout to progress to feedback display
      jsPsych.pluginAPI.setTimeout(function() {

        // clear keyboard listener
        jsPsych.pluginAPI.cancelAllKeyboardResponses();

        // draw an empty background and then the feedback image on top
        DrawBackground();

        // set a timeout to progress to feedback display
        jsPsych.pluginAPI.setTimeout(function() {

          // work out which feedback image to show
          var feedback_text = GetFeedback();

          // draw the feedback to the screen
          DrawFeedback(feedback_text);

          // set a timeout to progress to feedback display
          jsPsych.pluginAPI.setTimeout(function() {

            EndTrial();

          }, trial.feedback_display_duration);

        }, trial.post_stimulus_pause_duration);

      }, trial.choice_listen_duration);

    }, trial.iti_duration);

    ///// MAIN FUNCTIONS /////

    // function to draw background
    function DrawBackground(){

      // draw the background
      ctx.fillStyle = trial.background_colour;
      ctx.fillRect(0, 0, trial.canvas_dimensions[0], trial.canvas_dimensions[1]);

    }; // end DrawBackground function

    function DrawRobot(robot){

      // // draw the big background rectangle (specifies the robot colour)
      // ctx.fillStyle = display.domain_colour;
      // ctx.fillRect(trial.canvas_dimensions[0]/2 - trial.stimulus_dimensions[0]/2, trial.canvas_dimensions[1]/2 - trial.stimulus_dimensions[1]/2, trial.stimulus_dimensions[0], trial.stimulus_dimensions[1]);
      //
      // // border
      // ctx.lineWidth = 5;
      // ctx.strokeStyle = "#000000";
      // ctx.strokeRect(trial.canvas_dimensions[0]/2 - trial.stimulus_dimensions[0]/2, trial.canvas_dimensions[1]/2 - trial.stimulus_dimensions[1]/2, trial.stimulus_dimensions[0], trial.stimulus_dimensions[1]);

      // draw the small background rectangle (specifies the button colour)
      if (display.pressed){
        ctx.fillStyle = trial.pressed_colour;
      } else {
        ctx.fillStyle = display.button_colour;
      };
      ctx.fillRect(trial.canvas_dimensions[0]/2 - trial.stimulus_dimensions[0]/18, trial.canvas_dimensions[1]/2 - trial.stimulus_dimensions[0]/18, trial.stimulus_dimensions[0]/9, trial.stimulus_dimensions[0]/9);

      // draw the robot image
      DrawStimulus([trial.robot_images[display.robot_number]], trial.stimulus_offset);


    }; // end DrawRobot function

    function DrawStimulus(stimulus_array, stimulus_offset) {

      // array sanity check: only draw a stimulus array if (a) the array exists, and (b) the array has a length greater than 0
      if (Array.isArray(stimulus_array) && stimulus_array.length > 0) {

        // create new image element
        var img = new Image();

        // specify that the image should be drawn once it is loaded
        img.onload = function(){_ImageOnload(img, trial.stimulus_dimensions, stimulus_offset)};

        // set the source path of the image; in JavaScript, this command also triggers the loading of the image
        img.src = stimulus_array[0];

      } // end array sanity check if-loop

    } // end DrawStimulus function

    // function to handle responses by the subject
    function AfterResponse(info) {

      // specify which key was pressed
      info.key_char = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(info.key);

      // assign response variables
      if (info.key_char == trial.press_key){

        // record response
        response.rt = info.rt;
        response.key_char = info.key_char;
        response.pressed = true;

        // clear keyboard listener
        jsPsych.pluginAPI.cancelAllKeyboardResponses();

        // update visual display
        display.pressed = true;
        DrawRobot();

      }

    }; // end AfterResponse

    function GetFeedback() {

      // specify the probabilities of each images
      if (response.pressed && trial.preferred_action == 'go'){
        outcome_text = trial.correct_text;
      } else if (response.pressed && trial.preferred_action == 'no go'){
        outcome_text = trial.incorrect_text;
      } else if (!(response.pressed) && trial.preferred_action == 'go'){
        outcome_text = trial.incorrect_text;
      } else if (!(response.pressed) && trial.preferred_action == 'no go'){
        outcome_text = trial.correct_text;
      }

      return outcome_text;

    }; // end GetFeedback

    // function to end trial when it is time
    function EndTrial() {

      // clear keyboard listener
      jsPsych.pluginAPI.cancelAllKeyboardResponses();

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // move on to the next trial
      jsPsych.finishTrial();

    }; // end EndTrial function

    function DrawFeedback(feedback_text) {

      ctx.font = "28px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(feedback_text, trial.canvas_dimensions[0]/2, trial.canvas_dimensions[1]/2);

    } // end DrawFeedback function

    function _ImageOnload(im, image_dimensions, image_offset){

      var stim_horiz_loc = (trial.canvas_dimensions[0]/2) + image_offset[0]  - (image_dimensions[0] / 2); // specifies the x coordinate of the top left corner of the stimulus
      var stim_vert_loc = (trial.canvas_dimensions[1]/2) + image_offset[1] - (image_dimensions[1] / 2); // specifies the y coordinate of the top left corner of the stimulus
      ctx.drawImage(im, stim_horiz_loc, stim_vert_loc, image_dimensions[0], image_dimensions[1]);

    } // end _ImageOnload function

  } // end plugin.trial

  return plugin;

})(); // end plugin function
