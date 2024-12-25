var jsPsychGoalPursuit = (function (jspsych) {
    'use strict';
    
    const info = {
        name: "goal-pursuit",
        parameters: {
            instruction: {
                type: jspsych.ParameterType.STRING,
                default: "Select your goal and take actions.",
                description: "Instructions displayed above the task."
            },
            goalState: {
                type: jspsych.ParameterType.OBJECT,
                default: null,
                description: "Goal state passed from the builder"
            }
        }
    };

    class GoalPursuitPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
            this.currentSelect = [];
            this.currentConfig = null;
            this.currentGoal = null;
            this.colorCode = {
                "1": "lightblue",
                "2": "blue",
                "3": "darkblue",
                "4": "purple",
                "5": "darkpurple"
            };
        }

        trial(display_element, trial) {
            // HTML Structure
            const html = `
                <div class="container">
                    <div class="goal-display">
                        <h2 class="current-state">Current Goal</h2>
                        <div class="innerworkspace-top">
                            <div class="holder" id="fixed-holder-a"></div>
                        </div>
                        <div class="innerworkspace-bot">
                            <div class="holder" id="fixed-holder-b"></div>
                            <div class="holder" id="fixed-holder-c"></div>
                        </div>
                    </div>
                    <div class="pursuit-container">
                        <div class="workspace">
                            <h2 class="current-state">Current State</h2>
                            <div class="innerworkspace-top">
                                <div class="holder" id="demo-holder-a"></div>
                            </div>
                            <div class="innerworkspace-bot">
                                <div class="holder" id="demo-holder-b"></div>
                                <div class="holder" id="demo-holder-c"></div>
                            </div>
                        </div>
                        <button id="large-red-button" class="abandon-button">Abandon Goal</button>
                    </div>
                </div>
            `;

            display_element.innerHTML = html;

            // CSS Styling
            const styles = document.createElement("style");
            styles.innerHTML = `
                .container {
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    gap: 40px;
                    padding: 20px;
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .pursuit-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }

                .holder {
                    height: 150px;
                    width: 150px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 10px;
                    padding: 5px;
                    box-sizing: border-box;
                }

                .innerworkspace-top {
                    height: 35%;
                    width: 90%;
                    margin: 10px auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .innerworkspace-bot {
                    height: 35%;
                    width: 90%;
                    margin: 10px auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                }

                .abandon-button {
                    padding: 10px 20px;
                    font-size: 16px;
                    background-color: #f0f0f0;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .abandon-button:hover {
                    background-color: #e0e0e0;
                }

                .current-state {
                    font-size: 24px;
                    text-align: center;
                    margin-bottom: 10px;
                    width: 100%;
                    font-family: 'Helvetica', sans-serif;
                }

                .red-button {
                    height: 100px;
                    width: 100px;
                    border-radius: 50%;
                    background-color: red;
                    color: white;
                    border: none;
                    font-size: 16px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.3s;
                }

                .red-button:hover {
                    background-color: darkred;
                }

                .square-obj {
                    height: 100px;
                    width: 100px;
                    background-color: yellow;
                    margin: auto;
                }

                .circle-obj {
                    height: 100px;
                    width: 100px;
                    border-radius: 50%;
                    background-color: red;
                    margin: auto;
                }

                .triangle-obj {
                    width: 0;
                    height: 0;
                    border-left: 50px solid transparent;
                    border-right: 50px solid transparent;
                    border-bottom: 100px solid blue;
                    margin: auto;
                }

                .goal-display, .workspace {
                    height: 400px;  /* Fixed height instead of vh */
                    width: 30%;
                    min-width: 300px;
                    padding: 20px;
                    box-sizing: border-box;
                }

                .square-obj, .circle-obj, .triangle-obj {
                    background-repeat: repeat !important;
                    background-size: 20px 20px;
                    position: relative;
                    overflow: hidden;
                }
                
                .circle-obj {
                    border-radius: 50%;
                    overflow: hidden;
                }
                
                .triangle-obj {
                    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                    overflow: hidden;
                }
            `;
            document.head.appendChild(styles);

            // Initialize the goal from the passed data
            this.currentGoal = {
                a: { 
                    id: 'fixed-obj-a', 
                    shape: trial.goalState[0].shape, 
                    color: trial.goalState[0].shade,
                    pattern: trial.goalState[0].texture === 'none' ? 'plain' : trial.goalState[0].texture 
                },
                b: { 
                    id: 'fixed-obj-b', 
                    shape: trial.goalState[1].shape, 
                    color: trial.goalState[1].shade,
                    pattern: trial.goalState[1].texture === 'none' ? 'plain' : trial.goalState[1].texture 
                },
                c: { 
                    id: 'fixed-obj-c', 
                    shape: trial.goalState[2].shape, 
                    color: trial.goalState[2].shade,
                    pattern: trial.goalState[2].texture === 'none' ? 'plain' : trial.goalState[2].texture 
                }
            };

            this.currentConfig = {
                a: { 
                    id: 'demo-obj-a', 
                    shape: 'square', 
                    color: '1',
                    pattern: 'striped' 
                },
                b: { 
                    id: 'demo-obj-b', 
                    shape: 'square', 
                    color: '1',
                    pattern: 'plain' 
                },
                c: { 
                    id: 'demo-obj-c', 
                    shape: 'square', 
                    color: '2',
                    pattern: 'dotted' 
                }
            };

            // Display both goal and current state
            this.createGoalShapes(Object.values(this.currentGoal));
            console.log("Current Goal after creation:", this.currentGoal);
            this.displayShapes(this.currentConfig);

            // Add event listeners to shapes in current state
            this.addSelectListeners();

            // Add event listener to goal abandonment button
            document.getElementById('large-red-button').addEventListener('click', () => {
                this.abandonGoal();
            });
        }

        displayShapes(config) {
            // Function to display shapes based on the configuration
            for (const key in config) {
                const shapeData = config[key];
                const holderId = `demo-holder-${key.charAt(key.length - 1)}`;
                const shapeElement = this.makeShape(shapeData.id, shapeData.shape, shapeData.color, shapeData.pattern);
                document.getElementById(holderId).appendChild(shapeElement);
            }
        }

        makeShape(id, shape, color, pattern) {
            const shapeDiv = document.createElement('div');
            shapeDiv.id = id;
            
            // Map shape names to match the goal builder's classes
            const shapeClass = shape === 'triangle' ? 'triangle' : 
                              shape === 'circle' ? 'circle' : 'square';
            
            shapeDiv.className = `${shapeClass}-obj`;
            
            // Base styling
            shapeDiv.style.backgroundColor = this.getShadeColor(color);
            shapeDiv.style.cursor = 'pointer';
            
            // Set base styles for all shapes
            shapeDiv.style.width = '100px';
            shapeDiv.style.height = '100px';
            shapeDiv.style.position = 'relative';
            shapeDiv.style.overflow = 'hidden';
            shapeDiv.style.backgroundRepeat = 'repeat';
            
            // Apply patterns
            if (pattern === 'striped' || pattern === 'stripe') {
                shapeDiv.style.backgroundImage = `repeating-linear-gradient(
                    45deg,
                    rgba(255, 255, 255, 0.8) 0px,
                    rgba(255, 255, 255, 0.8) 10px,
                    transparent 10px,
                    transparent 20px
                )`;
                shapeDiv.style.backgroundSize = '28px 28px';
            } else if (pattern === 'dotted') {
                shapeDiv.style.backgroundImage = `radial-gradient(
                    circle at center,
                    rgba(255, 255, 255, 0.8) 3px,
                    transparent 3px
                )`;
                shapeDiv.style.backgroundSize = '10px 10px';
                shapeDiv.style.backgroundPosition = 'center';
            }

            // Special handling for triangles
            if (shapeClass === 'triangle') {
                shapeDiv.style.width = '0';
                shapeDiv.style.height = '0';
                shapeDiv.style.borderLeft = '50px solid transparent';
                shapeDiv.style.borderRight = '50px solid transparent';
                shapeDiv.style.borderBottom = `100px solid ${this.getShadeColor(color)}`;
                if (pattern === 'striped' || pattern === 'dotted') {
                    shapeDiv.style.background = 'none';  // Clear background for triangle
                    shapeDiv.style.position = 'relative';
                    
                    // Create a pseudo-element for the pattern
                    const pseudoStyle = document.createElement('style');
                    pseudoStyle.textContent = `
                        #${id}::before {
                            content: '';
                            position: absolute;
                            width: 100px;
                            height: 100px;
                            left: -50px;
                            top: 0;
                            background-color: inherit;
                            ${pattern === 'striped' ? `
                                background-image: repeating-linear-gradient(
                                    45deg,
                                    rgba(255, 255, 255, 0.8) 0px,
                                    rgba(255, 255, 255, 0.8) 10px,
                                    transparent 10px,
                                    transparent 20px
                                );
                            ` : `
                                background-image: radial-gradient(
                                    circle at center,
                                    rgba(255, 255, 255, 0.8) 3px,
                                    transparent 3px
                                );
                                background-size: 10px 10px;
                            `}
                            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                        }
                    `;
                    document.head.appendChild(pseudoStyle);
                }
            }
            
            return shapeDiv;
        }

        getShadeColor(shade) {
            return this.colorCode[shade] || "white";
        }

        addSelectListeners() {
            // Add click listeners to shapes in current state
            ['a', 'b', 'c'].forEach(key => {
                const shapeId = `demo-obj-${key}`;
                const shape = document.getElementById(shapeId);
                if (shape) {
                    shape.onclick = () => this.selectObj(shapeId, this.currentGoal);
                }
            });
        }

        selectObj(id, goal) {
            // Function to handle object selection
            console.log(`Selected: ${id}`, goal[id]);
            
            if (this.currentSelect.length === 0) {
                this.currentSelect.push(id);
                this.getEl(this.getHolderId(id)).style.border = 'solid gold 5px';
            } else if (this.currentSelect.length === 1) {
                if (this.currentSelect[0] === id) {
                    // Deselect if the same shape is clicked
                    this.currentSelect = [];
                    this.getEl(this.getHolderId(id)).style.border = '';
                } else {
                    // Select the second shape
                    this.currentSelect.push(id);
                    this.getEl(this.getHolderId(id)).style.border = 'dashed grey 5px';
                    setTimeout(() => {
                        this.makeTransition(this.currentSelect[0], this.currentSelect[1], goal);
                    }, 1000);
                }
            }
        }

        abandonGoal() {
            // Function to handle goal abandonment
            console.log("Goal abandoned!");
            // Add your abandonment logic here
        }

        // Additional functions from temp_pursuit.js
        safeColorChange(color, direction) {
            let colorInt = parseInt(color);
            if (direction === '+') {
                colorInt = colorInt + 1;
                if (colorInt > 5) colorInt = 1;
            }
            if (direction === '-') {
                colorInt = colorInt - 1;
                if (colorInt < 1) colorInt = 5;
            }
            return colorInt.toString();
        }

        createGoalShapes(fixedShapes) {
            fixedShapes.forEach(({ id, shape, color, pattern }) => {
                const shapeElement = this.makeShape(id, shape, color, pattern);
                this.getEl('fixed-holder-' + id.split('-')[2]).append(shapeElement);
            });
        }

        getHolderId(id) {
            let [taskId, _, objId] = id.split('-');
            return [taskId, 'holder', objId].join('-');
        }

        getEl(elementID) {
            return document.getElementById(elementID);
        }

        createCustomElement(id, className, type = 'div') {
            let element = (["svg", "polygon"].indexOf(type) < 0) ?
                document.createElement(type) :
                document.createElementNS("http://www.w3.org/2000/svg", type);
            if (className.length > 0) element.setAttribute("class", className);
            if (id.length > 0) element.setAttribute("id", id);
            return element;
        }

        createText(h = "h1", text = 'hello') {
            let element = document.createElement(h);
            let tx = document.createTextNode(text);
            element.append(tx);
            return element;
        }

        createBtn(btnId, text = "Button", className = "task-button", on = true) {
            let btn = this.createCustomElement("button", className, btnId);
            btn.disabled = !on;
            if (text.length > 0) btn.append(document.createTextNode(text));
            return btn;
        }

        makeTransition(a, r, currentGoal) {
            // read agent properties
            let agent = a.split('-')[2];
            let agent_color = this.currentConfig[agent]['color'];
            let agent_shape = this.currentConfig[agent]['shape'];

            // read recipient properties
            let recipient = r.split('-')[2];
            let recipient_color = this.currentConfig[recipient]['color'];
            let recipient_shape = this.currentConfig[recipient]['shape'];
            let recipient_pattern = this.currentConfig[recipient]['pattern'];

            // decide transitions
            let ret_color, ret_shape, ret_pattern;

            // Color transition logic (unchanged)
            if (parseInt(agent_color) > parseInt(recipient_color)) {
                ret_color = this.safeColorChange(recipient_color, '+');
            } else if (parseInt(agent_color) < parseInt(recipient_color)) {
                ret_color = this.safeColorChange(recipient_color, '-');
            } else {
                ret_color = recipient_color;
            }

            // Shape transition logic (unchanged)
            ret_shape = (Math.random() < 0.8) ? agent_shape : recipient_shape;

            // Pattern transition logic - always alternate
            if (recipient_pattern === 'plain') {
                ret_pattern = Math.random() < 0.5 ? 'striped' : 'dotted';
            } else {
                ret_pattern = 'plain';
            }

            // Update the shape
            this.getEl(this.getHolderId(r)).innerHTML = '';
            this.getEl(this.getHolderId(r)).append(this.makeShape(r, ret_shape, ret_color, ret_pattern));
            this.getEl(r).onclick = () => this.selectObj(r, this.currentGoal);

            // register changes
            this.currentConfig[recipient] = {
                id: r,
                shape: ret_shape,
                color: ret_color,
                pattern: ret_pattern
            };

            // check goal fulfillment
            let goal_fulfilled = this.isGoalFulfilled(currentGoal);
            if (goal_fulfilled) {
                console.log("Goal fulfilled!");
                // You might want to add some visual feedback here
                alert("Congratulations! You've achieved the goal!");
            } else {
                console.log("Goal not yet fulfilled");
            }

            // clear up
            this.getEl(this.getHolderId(this.currentSelect[0])).style.border = '';
            this.getEl(this.getHolderId(this.currentSelect[1])).style.border = '';
            this.currentSelect = [];
        }

        isGoalFulfilled(currentState) {
            console.log('Checking goal fulfillment...');
            console.log('Current Goal:', this.currentGoal);
            console.log('Current State:', this.currentConfig);
            
            // Compare each property of each shape
            for (let key of ['a', 'b', 'c']) {
                if (this.currentGoal[key].shape !== this.currentConfig[key].shape ||
                    this.currentGoal[key].color !== this.currentConfig[key].color ||
                    this.currentGoal[key].pattern !== this.currentConfig[key].pattern) {
                    console.log(`Mismatch found in shape ${key}:`);
                    console.log(`Goal: ${JSON.stringify(this.currentGoal[key])}`);
                    console.log(`Current: ${JSON.stringify(this.currentConfig[key])}`);
                    return false;
                }
            }
            return true;
        }

        randomInit() {
            let config = {
                'a': {},
                'b': {},
                'c': {},
            };
            config['a']['color'] = this.sampleFromList(Object.keys(colorCode));
            config['b']['color'] = this.sampleFromList(Object.keys(colorCode));
            config['c']['color'] = this.sampleFromList(Object.keys(colorCode));

            config['a']['shape'] = this.sampleFromList(['square', 'circle', 'triangle']);
            config['b']['shape'] = this.sampleFromList(['square', 'circle', 'triangle']);
            config['c']['shape'] = this.sampleFromList(['square', 'circle', 'triangle']);

            config['a']['pattern'] = this.sampleFromList(['plain', 'stripe']);
            config['b']['pattern'] = this.sampleFromList(['plain', 'stripe']);
            config['c']['pattern'] = this.sampleFromList(['plain', 'stripe']);

            return config;
        }

        sampleFromList(arr, n = 1, replace = true) {
            if (n == 1) {
                return (arr[Math.floor(Math.random() * arr.length)]);
            } else {
                let sampled = [];
                for (let j = 0; j < n; j++) {
                    let randomIndex = Math.floor(Math.random() * arr.length);
                    sampled.push(arr[randomIndex]);
                    if (!replace) {
                        arr.splice(randomIndex, 1);
                    }
                }
                return sampled;
            }
        }
    }

    GoalPursuitPlugin.info = info;

    return GoalPursuitPlugin;

})(jsPsychModule);
  