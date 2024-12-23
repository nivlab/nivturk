var jsPsychGoalPursuit = (function (jspsych) {
    'use strict';
    
    const info = {
        name: "goal-pursuit",
        parameters: {
            instruction: {
                type: jspsych.ParameterType.STRING,
                default: "Select your goal and take actions.",
                description: "Instructions displayed above the task."
            }
        }
    };

    class GoalPursuitPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }

        trial(display_element, trial) {
            
        }

        
    }

    GoalPursuitPlugin.info = info;

    return GoalPursuitPlugin;

})(jsPsychModule);
