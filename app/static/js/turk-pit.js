jsPsych.plugins['turk-pit'] = (function() {

  var plugin = {};

  // ask jsPsych to preload the images
  jsPsych.pluginAPI.registerPreload('turk-pit', 'robot_images', 'image');
  jsPsych.pluginAPI.registerPreload('turk-pit', 'feedback_images', 'image');

  plugin.info = {
    name: 'turk-pit',
    parameters: {
      robot_images: {
        type: jsPsych.plugins.parameterType.STRING,
        default: undefined,
        required: true,
        description: 'The array of robot images'
      },
      feedback_images: {
        type: jsPsych.plugins.parameterType.STRING,
        default: undefined,
        required: true,
        description: 'The array of feedback images'
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
        default: 2500,
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
        default: 1000,
        description: 'How long to display a blank screen between trials (in milliseconds).'
      },
      feedback_offset: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Feedback offset',
        default: [0, 0],//[270, -200],
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
      preferred_action_win_prob: {
        type: jsPsych.plugins.parameterType.FLOAT,
        pretty_name: 'Preferred action win probability',
        default: 0.8,
        description: 'The probability of the better outcome if the preferred action is chosen'
      },
      display_progress:{
        type: jsPsych.plugins.parameterType.BOOL,
        default: false,
        description: 'Whether to display block and trial counter at the top of the screen'
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
      robot_number: trial.image_allocation[trial.robot_number],
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
          display.feedback_image = GetFeedback();

          // draw the feedback to the screen
          DrawFeedback(display.feedback_image);

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

      // draw the progress text
      if (trial.display_progress){
        ctx.font = "28px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        var info_text = "Block " + counter.block + " of " + counter.n_blocks + ", Trial " + counter.trial + " of " + counter.n_trials;
        ctx.fillText(info_text, trial.canvas_dimensions[0]/2, 3 * ctx.measureText('M').width/2);
      }

    }; // end DrawBackground function

    function DrawRobot(robot){

      // draw the big background rectangle (specifies the robot colour)
      ctx.fillStyle = display.domain_colour;
      ctx.fillRect(trial.canvas_dimensions[0]/2 - trial.stimulus_dimensions[0]/2, trial.canvas_dimensions[1]/2 - trial.stimulus_dimensions[1]/2, trial.stimulus_dimensions[0], trial.stimulus_dimensions[1]);

      // border
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#000000";
      ctx.strokeRect(trial.canvas_dimensions[0]/2 - trial.stimulus_dimensions[0]/2, trial.canvas_dimensions[1]/2 - trial.stimulus_dimensions[1]/2, trial.stimulus_dimensions[0], trial.stimulus_dimensions[1]);

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

      // set up containers
      var fb = [];
      var im_array = [];
      var outcome_prob = [];

      // specify the different images that can be shown
      if (trial.robot_type == 'giver'){
        im_array = [trial.feedback_images[0], trial.feedback_images[2]];
      } else if (trial.robot_type == 'taker'){
        im_array = [trial.feedback_images[2], trial.feedback_images[1]];
      };

      // specify the probabilities of each images
      if (response.pressed && trial.preferred_action == 'go'){
        outcome_prob = [trial.preferred_action_win_prob, 1 - trial.preferred_action_win_prob];
      } else if (response.pressed && trial.preferred_action == 'no go'){
        outcome_prob = [1 - trial.preferred_action_win_prob, trial.preferred_action_win_prob];
      } else if (!(response.pressed) && trial.preferred_action == 'go'){
        outcome_prob = [1 - trial.preferred_action_win_prob, trial.preferred_action_win_prob];
      } else if (!(response.pressed) && trial.preferred_action == 'no go'){
        outcome_prob = [trial.preferred_action_win_prob, 1 - trial.preferred_action_win_prob];
      }

      // sample the images with the specified probability
      fb = jsPsych.randomization.sampleWithReplacement(im_array, 1, outcome_prob)
      return fb;

    }; // end GetFeedback

    // function to end trial when it is time
    function EndTrial() {

      // clear keyboard listener
      jsPsych.pluginAPI.cancelAllKeyboardResponses();

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        'block': counter.block,
        'trial': counter.trial,
        'robot_number': display.robot_number,
        'ur_robot_number': trial.robot_number,
        'preferred_action': trial.preferred_action,
        'robot_type': trial.robot_type,
        'rt': response.rt,
        'key_char': response.key_char,
        'key': response.key,
        'pressed': response.pressed
      };

      if (display.feedback_image[0] == trial.feedback_images[0]){
        trial_data.outcome = 1;
      } else if (display.feedback_image[0] == trial.feedback_images[1]){
        trial_data.outcome = -1;
      } else if (display.feedback_image[0] == trial.feedback_images[2]){
        trial_data.outcome = 0;
      };

      // increment the trial counter
      counter.trial += 1;

      if (counter.trial > counter.n_trials){
        counter.block += 1;
        counter.trial = 1;
      }

      // move on to the next trial
      jsPsych.finishTrial(trial_data);

    }; // end EndTrial function

    function DrawFeedback(feedback_image) {

      // create new image element
      var img = new Image();

      // specify that the image should be drawn once it is loaded
      img.onload = function(){_FeedbackOnload(img, trial.feedback_offset)};

      // set the source path of the image; in JavaScript, this command also triggers the loading of the image
      img.src = feedback_image;

    } // end DrawFeedback function

    function _FeedbackOnload(im, image_offset){

      var stim_horiz_loc = (trial.canvas_dimensions[0]/2) + image_offset[0]  - (im.width / 2); // specifies the x coordinate of the top left corner of the stimulus
      var stim_vert_loc = (trial.canvas_dimensions[1]/2) + image_offset[1] - (im.height / 2); // specifies the y coordinate of the top left corner of the stimulus
      ctx.drawImage(im, stim_horiz_loc, stim_vert_loc, im.width, im.height);

    } // end _FeedbackOnload function

    function _ImageOnload(im, image_dimensions, image_offset){

      var stim_horiz_loc = (trial.canvas_dimensions[0]/2) + image_offset[0]  - (image_dimensions[0] / 2); // specifies the x coordinate of the top left corner of the stimulus
      var stim_vert_loc = (trial.canvas_dimensions[1]/2) + image_offset[1] - (image_dimensions[1] / 2); // specifies the y coordinate of the top left corner of the stimulus
      ctx.drawImage(im, stim_horiz_loc, stim_vert_loc, image_dimensions[0], image_dimensions[1]);

    } // end _ImageOnload function

  } // end plugin.trial

  return plugin;

})(); // end plugin function
