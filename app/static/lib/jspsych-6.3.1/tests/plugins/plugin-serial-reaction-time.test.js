const root = '../../';
const utils = require('../testing-utils.js');

jest.useFakeTimers();

describe('serial-reaction-time plugin', function(){

	beforeEach(function(){
		require(root + 'jspsych.js');
		require(root + 'plugins/jspsych-serial-reaction-time.js');
	});

	test('loads correctly', function(){
		expect(typeof window.jsPsych.plugins['serial-reaction-time']).not.toBe('undefined');
	});

	test('default behavior', function(){

		var trial = {
			type: 'serial-reaction-time',
			target: [0,0]
		}

		jsPsych.init({
			timeline: [trial]
		});

		expect(document.querySelector('#jspsych-serial-reaction-time-stimulus-cell-0-0').style.backgroundColor).toBe('rgb(153, 153, 153)');
		expect(document.querySelector('#jspsych-serial-reaction-time-stimulus-cell-0-1').style.backgroundColor).toBe('');
		expect(document.querySelector('#jspsych-serial-reaction-time-stimulus-cell-0-2').style.backgroundColor).toBe('');
		expect(document.querySelector('#jspsych-serial-reaction-time-stimulus-cell-0-3').style.backgroundColor).toBe('');

		utils.pressKey('3');

		expect(jsPsych.getDisplayElement().innerHTML).toBe('');
		expect(jsPsych.data.get().last(1).values()[0].correct).toBe(true);

	});

	test('response ends trial is false', function(){

		var trial = {
			type: 'serial-reaction-time',
			target: [0,0],
			response_ends_trial: false,
			trial_duration: 1000
		}

		jsPsych.init({
			timeline: [trial]
		});

		expect(document.querySelector('#jspsych-serial-reaction-time-stimulus-cell-0-0').style.backgroundColor).toBe('rgb(153, 153, 153)');
		expect(document.querySelector('#jspsych-serial-reaction-time-stimulus-cell-0-1').style.backgroundColor).toBe('');
		expect(document.querySelector('#jspsych-serial-reaction-time-stimulus-cell-0-2').style.backgroundColor).toBe('');
		expect(document.querySelector('#jspsych-serial-reaction-time-stimulus-cell-0-3').style.backgroundColor).toBe('');

		utils.pressKey('3');

		expect(jsPsych.getDisplayElement().innerHTML).not.toBe('');

		jest.runTimersToTime(1000);

		expect(jsPsych.getDisplayElement().innerHTML).toBe('');
		expect(jsPsych.data.get().last(1).values()[0].correct).toBe(true);

	});

	test('responses are scored correctly', function(){

		var trial1 = {
			type: 'serial-reaction-time',
			target: [0,0]
		}

		var trial2 = {
			type: 'serial-reaction-time',
			target: [0,1]
		}

		jsPsych.init({
			timeline: [trial1, trial2]
		});

		expect(document.querySelector('#jspsych-serial-reaction-time-stimulus-cell-0-0').style.backgroundColor).toBe('rgb(153, 153, 153)');
		expect(document.querySelector('#jspsych-serial-reaction-time-stimulus-cell-0-1').style.backgroundColor).toBe('');
		expect(document.querySelector('#jspsych-serial-reaction-time-stimulus-cell-0-2').style.backgroundColor).toBe('');
		expect(document.querySelector('#jspsych-serial-reaction-time-stimulus-cell-0-3').style.backgroundColor).toBe('');

		utils.pressKey('3');

		jest.runAllTimers();

		expect(document.querySelector('#jspsych-serial-reaction-time-stimulus-cell-0-0').style.backgroundColor).toBe('');
		expect(document.querySelector('#jspsych-serial-reaction-time-stimulus-cell-0-1').style.backgroundColor).toBe('rgb(153, 153, 153)');
		expect(document.querySelector('#jspsych-serial-reaction-time-stimulus-cell-0-2').style.backgroundColor).toBe('');
		expect(document.querySelector('#jspsych-serial-reaction-time-stimulus-cell-0-3').style.backgroundColor).toBe('');

		utils.pressKey('3');

		expect(jsPsych.getDisplayElement().innerHTML).toBe('');

		var trial_data = jsPsych.data.get().last(2).values();
		expect(trial_data[0].correct).toBe(true);
		expect(trial_data[1].correct).toBe(false);

	});

});
