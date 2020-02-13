/**
 * comprehension-check
 * a jspsych plugin for delivering instructions followed by a comprehension checked
 *
 * based on existing jspsych plugings (jspsych-survey-multi-choice and jspsych-instructions)
 */


jsPsych.plugins['comprehension-check'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'comprehension-check',
    description: '',
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'The strings that will be associated with a group of options.'
          },
          options: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Options',
            array: true,
            default: undefined,
            description: 'Displays options for an individual question.'
          },
          required: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Required',
            default: false,
            description: 'Subject will be required to pick an option for each question.'
          },
          horizontal: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Horizontal',
            default: false,
            description: 'If true, then questions are centered and options are displayed horizontally.'
          },
          name: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Question Name',
            default: '',
            description: 'Controls the name of data values associated with this question'
          }
        }
      },
      randomize_question_order: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Randomize Question Order',
        default: false,
        description: 'If true, the order of the questions will be randomized'
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'Label of the button.'
      },
      instruction_pages: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Instruction pages',
        default: undefined,
        array: true,
        description: 'Each element of the array is the content for a single page.'
      },
      key_forward: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Key forward',
        default: 'rightarrow',
        description: 'The key the subject can press in order to advance to the next page.'
      },
      key_backward: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Key backward',
        default: 'leftarrow',
        description: 'The key that the subject can press to return to the previous page.'
      },
      allow_backward: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Allow backward',
        default: true,
        description: 'If true, the subject can return to the previous page of the instructions.'
      },
      allow_keys: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Allow keys',
        default: true,
        description: 'If true, the subject can use keyboard keys to navigate the pages.'
      },
      show_clickable_nav: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Show clickable nav',
        default: false,
        description: 'If true, then a "Previous" and "Next" button will be displayed beneath the instructions.'
      },
      show_page_number: {
          type: jsPsych.plugins.parameterType.BOOL,
          pretty_name: 'Show page number',
          default: false,
          description: 'If true, and clickable navigation is enabled, then Page x/y will be shown between the nav buttons.'
      },
      button_label_previous: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label previous',
        default: 'Previous',
        description: 'The text that appears on the button to go backwards.'
      },
      button_label_next: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label next',
        default: 'Next',
        description: 'The text that appears on the button to go forwards.'
      },
      failure_text: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Failure text',
        default: '',
        description: 'The text that is displayed if the participant fails the comprehension check.'
      }
    }
  }
  plugin.trial = function(display_element, trial) {
    var plugin_id_name = "comprehension-check";

    doComprehensionCheck();

    function showInstructions(){

      var current_page = 0;

      var view_history = [];

      var start_time = performance.now();

      var last_page_update_time = start_time;

      function btnListener(evt){
        evt.target.removeEventListener('click', btnListener);
        if(this.id === "jspsych-instructions-back"){
          back();
        }
        else if(this.id === 'jspsych-instructions-next'){
          next();
        }
      }

      function show_current_page() {


        // scroll to top of screen
        window.scrollTo(0,0);

        var html = trial.instruction_pages[current_page];

        var pagenum_display = "";
        if(trial.show_page_number) {
            pagenum_display = "<span style='margin: 0 1em;' class='"+
            "jspsych-instructions-pagenum'>Page "+(current_page+1)+"/"+trial.instruction_pages.length+"</span>";
        }

        if (trial.show_clickable_nav) {

          var nav_html = "<div class='jspsych-instructions-nav' style='padding: 10px 0px;'>";
          if (trial.allow_backward) {
            var allowed = (current_page > 0 )? '' : "disabled='disabled'";
            nav_html += "<button id='jspsych-instructions-back' class='jspsych-btn' style='margin-right: 5px;' "+allowed+">&lt; "+trial.button_label_previous+"</button>";
          }
          if (trial.instruction_pages.length > 1 && trial.show_page_number) {
              nav_html += pagenum_display;
          }
          nav_html += "<button id='jspsych-instructions-next' class='jspsych-btn'"+
              "style='margin-left: 5px;'>"+trial.button_label_next+
              " &gt;</button></div>";

          html += nav_html;
          display_element.innerHTML = html;
          if (current_page != 0 && trial.allow_backward) {
            display_element.querySelector('#jspsych-instructions-back').addEventListener('click', btnListener);
          }

          display_element.querySelector('#jspsych-instructions-next').addEventListener('click', btnListener);
        } else {
          if (trial.show_page_number && trial.instruction_pages.length > 1) {
            // page numbers for non-mouse navigation
            html += "<div class='jspsych-instructions-pagenum'>"+pagenum_display+"</div>"
          }
          display_element.innerHTML = html;
        }

      }

      function next() {

        add_current_page_to_view_history()

        current_page++;

        // if done, finish up...
        if (current_page >= trial.instruction_pages.length) {
          endInstruct();
        } else {
          show_current_page();
        }

      }

      function back() {

        add_current_page_to_view_history()

        current_page--;

        show_current_page();

      }

      function add_current_page_to_view_history() {

        var current_time = performance.now();

        var page_view_time = current_time - last_page_update_time;

        view_history.push({
          page_index: current_page,
          viewing_time: page_view_time
        });

        last_page_update_time = current_time;
      }

      function endInstruct() {

        if (trial.allow_keys) {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboard_listener);
        }

        doComprehensionCheck();

      }

      var after_response = function(info) {

        // have to reinitialize this instead of letting it persist to prevent accidental skips of pages by holding down keys too long
        keyboard_listener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_response,
          valid_responses: [trial.key_forward, trial.key_backward],
          rt_method: 'performance',
          persist: false,
          allow_held_key: false
        });
        // check if key is forwards or backwards and update page
        if (jsPsych.pluginAPI.compareKeys(info.key, trial.key_backward)) {
          if (current_page !== 0 && trial.allow_backward) {
            back();
          }
        }

        if (jsPsych.pluginAPI.compareKeys(info.key, trial.key_forward)) {
          next();
        }

      };

      show_current_page();

      if (trial.allow_keys) {
        var keyboard_listener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_response,
          valid_responses: [trial.key_forward, trial.key_backward],
          rt_method: 'performance',
          persist: false
        });
      }

    }; // end showInstructions

    function doComprehensionCheck(){

      var html = "";

      // inject CSS for trial
      html += '<style id="jspsych-survey-multi-choice-css">';
      html += ".jspsych-survey-multi-choice-question { margin-top: 2em; margin-bottom: 2em; text-align: center; }"+
        ".jspsych-survey-multi-choice-text span.required {color: darkred;}"+
        ".jspsych-survey-multi-choice-horizontal .jspsych-survey-multi-choice-text {  text-align: center;}"+
        ".jspsych-survey-multi-choice-option { line-height: 2;}"+
        ".jspsych-survey-multi-choice-horizontal .jspsych-survey-multi-choice-option {  display: inline-block;  margin-left: 1em;  margin-right: 1em;  vertical-align: top;}"+
        "label.jspsych-survey-multi-choice-text input[type='radio'] {margin-right: 1em;}";
      html += '</style>';

      // show preamble text
      if(trial.preamble !== null){
        html += '<div id="jspsych-survey-multi-choice-preamble" class="jspsych-survey-multi-choice-preamble">'+trial.preamble+'</div>';
      }

      // form element
      html += '<form id="jspsych-survey-multi-choice-form">';

      // generate question order. this is randomized here as opposed to randomizing the order of trial.questions
      // so that the data are always associated with the same question regardless of order
      var question_order = [];
      for(var i=0; i<trial.questions.length; i++){
        question_order.push(i);
      }
      if(trial.randomize_question_order){
        question_order = jsPsych.randomization.shuffle(question_order);
      }

      // add multiple-choice questions
      for (var i = 0; i < trial.questions.length; i++) {
        // get question based on question_order
        var question = trial.questions[question_order[i]];
        var question_id = question_order[i];

        // create question container
        var question_classes = ['jspsych-survey-multi-choice-question'];
        if (question.horizontal) {
          question_classes.push('jspsych-survey-multi-choice-horizontal');
        }

        html += '<div id="jspsych-survey-multi-choice-'+question_id+'" class="'+question_classes.join(' ')+'"  data-name="'+question.name+'">';

        // add question text
        html += '<p class="jspsych-survey-multi-choice-text survey-multi-choice">' + question.prompt
        if(question.required){
          html += "<span class='required'>*</span>";
        }
        html += '</p>';

        // create option radio buttons
        for (var j = 0; j < question.options.length; j++) {
          // add label and question text
          var option_id_name = "jspsych-survey-multi-choice-option-"+question_id+"-"+j;
          var input_name = 'jspsych-survey-multi-choice-response-'+question_id;
          var input_id = 'jspsych-survey-multi-choice-response-'+question_id+'-'+j;

          var required_attr = question.required ? 'required' : '';

          // add radio button container
          html += '<div id="'+option_id_name+'" class="jspsych-survey-multi-choice-option">';
          html += '<label class="jspsych-survey-multi-choice-text" for="'+input_id+'">'+question.options[j]+'</label>';
          html += '<input type="radio" name="'+input_name+'" id="'+input_id+'" value="'+question.options[j]+'" '+required_attr+'></input>';
          html += '</div>';
        }
        html += '<br><br><br>';
        html += '</div>';
      }

      // add submit button
      html += '<input type="submit" id="'+plugin_id_name+'-next" class="'+plugin_id_name+' jspsych-btn"' + (trial.button_label ? ' value="'+trial.button_label + '"': '') + '></input>';
      html += '</form>';

      // render
      display_element.innerHTML = html;

      document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();
        // measure response time
        var endTime = performance.now();
        var response_time = endTime - startTime;

        // create object to hold responses
        var question_data = {};
        for(var i=0; i<trial.questions.length; i++){
          var match = display_element.querySelector('#jspsych-survey-multi-choice-'+i);
          var id = "Q" + i;
          if(match.querySelector("input[type=radio]:checked") !== null){
            var val = match.querySelector("input[type=radio]:checked").value;
          } else {
            var val = "";
          }
          var obje = {};
          var name = id;
          if(match.attributes['data-name'].value !== ''){
            name = match.attributes['data-name'].value;
          }
          obje[name] = val;
          Object.assign(question_data, obje);

        }
        // save data
        var trial_data = {
          "rt": response_time,
          "responses": JSON.stringify(question_data),
          "question_order": JSON.stringify(question_order)
        };

        // check to see whether a correct response was entered
        var object_keys = Object.keys(question_data);
        var all_correct = true;

        for (var k = 0; k < object_keys.length; k++) {
            all_correct = all_correct && question_data[object_keys[k]] == trial.questions[k].correct_answer;
        }

        // proceed if all comprehension check questions are correct; otherwise, go back to the instructions
        if (all_correct){

          display_element.innerHTML = '';
          jsPsych.finishTrial(trial_data);

        } else{

          if (!(trial.instruction_pages[0] == trial.failure_text)){
            trial.instruction_pages.unshift(trial.failure_text);
          }
          showInstructions();

        }


      });

    }; // end doComprehensionCheck

    var startTime = performance.now();
  };


  return plugin;
})();
