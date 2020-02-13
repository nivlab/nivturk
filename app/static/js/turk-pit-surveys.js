var demographics_preamble = 'For each of the questions below, please choose the answer that best describes you or your experience of this HIT.'

var survey_introduction = {
    type: "html-keyboard-response",
    stimulus: '<div style="max-width:600px;"><p>Lastly, we would like you to answer several questions about yourself and about your experience of doing this HIT.</p><p>Press any key to move onto this portion of the HIT.</p></div>'
  };

var demographics_survey_partA = {
  type: 'survey-multi-choice',
  preamble: demographics_preamble,
  randomize_question_order: false,
  questions: [
    {prompt: "What is your sex?", options: ["Male", "Female", "Other", "Prefer not to answer"], required: true, horizontal: false, name: 'Sex'},
    {prompt: "What is your ethnicity?", options: ["Hispanic or Latino", "Not Hispanic or Latino", "Unknown", "Prefer not to answer"], required: true, horizontal: false, name: 'Ethnicity'},
    {prompt: "What is your race?", options: ["American Indian/Alaskan Native", "East Asian", "South Asian", "Native Hawaiian or other Pacific Islander", "Black or African American", "White", "More than one race", "Prefer not to answer"], required: true, horizontal: false, name: 'Race'},
    {prompt: "How did you feel about the clarity of the instructions?", options: ["I understood completely", "Pretty clear", "Somewhat clear", "Not very clear", "I didn't understand at all"], required: true, horizontal: false, name: 'Clarity'}
  ],
};

var demographics_survey_partB = {
  type: 'survey-text',
  questions: [
    {prompt: 'What is your age?', columns: 3, required: true, name: 'Age'},
    {prompt: 'Do you experience any form of color blindness? If so, please give details below', rows: 5, columns: 80, required: true, name: 'Colour blindness'},
    {prompt: 'Please describe any strategies that you used to perform the task, even if the strategy was not one we instructed you to use', rows:5, columns: 80, required: false, name: 'Strategy'},
    {prompt: 'Do you have any other feedback about the task?', rows: 5, columns: 80, required: false, name: 'Other feedback'}

  ],
  randomize_question_order: false
};
