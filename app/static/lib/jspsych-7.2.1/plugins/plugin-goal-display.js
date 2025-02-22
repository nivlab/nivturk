var jsPsychGoalDisplay = (function (jspsych) {
    'use strict';
  
    const info = {
        name: "goal-display",
        parameters: {
            /** The selected goal data to display */
            selected_goal: {
                type: jspsych.ParameterType.OBJECT,
                pretty_name: "Selected Goal",
                default: undefined
            },
            /** HTML-formatted string to display at top of the page. */
            preamble: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Preamble",
                default: null
            },
            /** Label for the continue button */
            button_label: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Button Label",
                default: "Next"
            }
        }
    };

    // Add generateRandomShape function here
    function generateRandomShape() {
        const shapes = ['goal-star', 'goal-cloud', 'goal-square'];
        const shades = ['shade-light', 'shade-medium', 'shade-dark'];
        const textures = ['plain', 'striped', 'dotted'];
        
        return {
            type: shapes[Math.floor(Math.random() * shapes.length)],
            shadeClass: shades[Math.floor(Math.random() * shades.length)],
            textureClass: textures[Math.floor(Math.random() * textures.length)]
        };
    }

    // Add after generateRandomShape function
    function renderWorkspaceShape(shapeData) {
        const pathData = {
            'goal-star': "M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z",
            'goal-cloud': "M35,45 a20,20 1 0,0 0,40 h30 a20,20 1 0,0 0,-40 a10,10 1 0,0 -10,-10 a15,15 1 0,0 -20,10 z"
        };

        if (shapeData.type === 'goal-square') {
            return `
                <g class="shape-group ${shapeData.shadeClass}">
                    <rect x="20" y="20" width="60" height="60" rx="10" 
                        class="${shapeData.type} ${shapeData.textureClass}"/>
                    <rect x="20" y="20" width="60" height="60" rx="10" 
                        class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                </g>`;
        } else {
            return `
                <g class="shape-group ${shapeData.shadeClass}">
                    <path d="${pathData[shapeData.type]}" 
                        class="${shapeData.type} ${shapeData.textureClass}"/>
                    <path d="${pathData[shapeData.type]}" 
                        class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                </g>`;
        }
    }

    // Add helper function to get shape state
    function getShapeState(shape) {
        const shapeElement = shape.querySelector('path, rect');
        const shapeGroup = shape.querySelector('.shape-group');
        
        return {
            type: Array.from(shapeElement.classList).find(cls => cls.startsWith('goal-')),
            shade: Array.from(shapeGroup.classList).find(cls => cls.startsWith('shade-')),
            texture: Array.from(shapeElement.classList).find(cls => ['plain', 'striped', 'dotted'].includes(cls))
        };
    }

    class GoalDisplayPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
            this.pursuitActions = [];
            this.startTime = null;
        }

        doShapesMatch(shape1, shape2) {
            const shape1Classes = Array.from(shape1.querySelector('path, rect').classList);
            const shape2Classes = Array.from(shape2.querySelector('path, rect').classList);
            
            // Check if all relevant classes match (shape type, texture, and shade)
            const shapeTypeMatch = shape1Classes.find(cls => cls.startsWith('goal-')) === 
                                  shape2Classes.find(cls => cls.startsWith('goal-'));
            const textureMatch = ['plain', 'striped', 'dotted'].some(texture => 
                shape1Classes.includes(texture) && shape2Classes.includes(texture));
            const shadeMatch = Array.from(shape1.querySelector('.shape-group').classList)
                .find(cls => cls.startsWith('shade-')) === 
                Array.from(shape2.querySelector('.shape-group').classList)
                .find(cls => cls.startsWith('shade-'));
            
            return shapeTypeMatch && textureMatch && shadeMatch;
        }

        checkGoalAchieved(display_element) {
            const workspaceShapes = Array.from(display_element.querySelectorAll('.workspace-shape'));
            const goalShapes = Array.from(display_element.querySelectorAll('.goal-display-shapes .source-container'));
            
            return workspaceShapes.every((workspaceShape, index) => 
                this.doShapesMatch(workspaceShape, goalShapes[index]));
        }

        createConfetti(display_element) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.opacity = Math.random();
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            // Random confetti color
            const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            display_element.querySelector('.celebration-overlay').appendChild(confetti);
            
            // Remove confetti after animation
            confetti.addEventListener('animationend', () => confetti.remove());
        }

        doShapesMatchGoal(workspaceShapes, goalShapes) {
            return workspaceShapes.every((workspaceShape, index) => {
                const goalShape = goalShapes[index];
                return workspaceShape.type === goalShape.type &&
                       workspaceShape.shadeClass === goalShape.shapeClass.split(' ')[1] &&
                       workspaceShape.textureClass === goalShape.shapeClass.split(' ')[2];
            });
        }

        trial(display_element, trial) {
            this.startTime = performance.now();
            this.pursuitActions = [];

            // Convert goal format to match state format
            const formattedGoal = trial.selected_goal.map(item => ({
                type: item.type,
                shade: item.shapeClass.split(' ')[1],
                texture: item.shapeClass.split(' ')[2]
            }));

            // Generate random initial state that doesn't match goal state
            let workspaceShapes;
            do {
                workspaceShapes = [
                    generateRandomShape(),
                    generateRandomShape(),
                    generateRandomShape()
                ];
            } while (this.doShapesMatchGoal(workspaceShapes, trial.selected_goal));

            // Create the display HTML
            display_element.innerHTML = `
                ${trial.preamble ? `<div class="jspsych-goal-display-preamble">${trial.preamble}</div>` : ''}
                <div class="jspsych-goal-display-container">
                    <div class="goal-display">
                        <h3>Your Selected Goal:</h3>
                        <div class="goal-display-shapes">
                            ${Array.isArray(trial.selected_goal) ? `
                                <!-- Top shape -->
                                <svg class="source-container" viewBox="0 0 100 100">
                                    ${renderShape(trial.selected_goal[0])}
                                </svg>
                                <!-- Container for bottom shapes -->
                                <div>
                                    <svg class="source-container" viewBox="0 0 100 100">
                                        ${renderShape(trial.selected_goal[1])}
                                    </svg>
                                    <svg class="source-container" viewBox="0 0 100 100">
                                        ${renderShape(trial.selected_goal[2])}
                                    </svg>
                                </div>
                            ` : trial.selected_goal.type === 'goal-star' 
                                ? `<svg class="source-container" viewBox="0 0 100 100">
                                    <g class="shape-group ${trial.selected_goal.shapeClass.split(' ')[1]}">
                                        <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                                            class="${trial.selected_goal.shapeClass}"/>
                                        <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                                            class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                                    </g>
                                </svg>`
                                : trial.selected_goal.type === 'goal-cloud'
                                    ? `<svg class="source-container" viewBox="0 0 100 100">
                                        <g class="shape-group ${trial.selected_goal.shapeClass.split(' ')[1]}">
                                            <path d="M35,45 a20,20 1 0,0 0,40 h30 a20,20 1 0,0 0,-40 a10,10 1 0,0 -10,-10 a15,15 1 0,0 -20,10 z" 
                                                class="${trial.selected_goal.shapeClass}"/>
                                            <path d="M35,45 a20,20 1 0,0 0,40 h30 a20,20 1 0,0 0,-40 a10,10 1 0,0 -10,-10 a15,15 1 0,0 -20,10 z" 
                                                class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                                        </g>
                                    </svg>`
                                    : `<svg class="source-container" viewBox="0 0 100 100">
                                        <rect x="20" y="20" width="60" height="60" rx="10" 
                                            class="${trial.selected_goal.shapeClass}"/>
                                        <rect x="20" y="20" width="60" height="60" rx="10" 
                                            class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                                    </svg>`
                        }
                    </div>
                    <button class="jspsych-btn give-up-btn">Give Up On This Goal</button>
                </div>
            </div>
            <div class="instruction-text">Achieve your selected goal by first choosing the feature you want to change. Then choose an actor and then a recipient shape.</div>
            <div class="workspace-container">
                <div class="feature-menu">
                    <button class="feature-btn active" data-feature="texture">texture</button>
                    <button class="feature-btn" data-feature="shape">shape</button>
                    <button class="feature-btn" data-feature="color">shade</button>
                </div>
                <div class="workspace-shapes">
                    <!-- Top shape -->
                    <svg class="workspace-shape" viewBox="0 0 100 100">
                        ${renderWorkspaceShape(workspaceShapes[0])}
                    </svg>
                    <!-- Container for bottom shapes -->
                    <div class="workspace-bottom-shapes">
                        <svg class="workspace-shape" viewBox="0 0 100 100">
                            ${renderWorkspaceShape(workspaceShapes[1])}
                        </svg>
                        <svg class="workspace-shape" viewBox="0 0 100 100">
                            ${renderWorkspaceShape(workspaceShapes[2])}
                        </svg>
                    </div>
                </div>
            </div>
            <div class="rules-container">
                <div class="rules-content">
                    <h3>Interaction Rules</h3>
                    
                    <h4>Texture:</h4>
                    <ul>
                        <li>cycle: plain &rarr; striped &rarr; dotted &rarr; plain</li>
                    </ul>
                    
                    <h4>Shape:</h4>
                    <ul>
                        <li>Mostly: copy actor</li>
                        <li>Sometimes: not actor</li>
                    </ul>
                    
                    <h4>Shade:</h4>
                    <ul>
                        <li>Become more like actor</li>
                        <li>If already same:</li>
                        <ul>
                            <li>Mostly become medium</li>
                            <li>Sometimes high or low</li>
                        </ul>
                    </ul>
                </div>
            </div>
            <div class="celebration-overlay hidden">
                <div class="celebration-content">
                    <h2>Goal Achieved!</h2>
                    <p>Great work!</p>
                </div>
            </div>
            `;

            // Add tracking for feature button clicks
            const featureButtons = display_element.querySelectorAll('.feature-btn');
            let selectedFeature = 'texture'; // Default feature
            featureButtons.forEach(button => {
                button.addEventListener('click', () => {
                    featureButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    selectedFeature = button.dataset.feature;
                });
            });

            // Add after the feature button click handlers
            let actorShape = null;
            let recipientShape = null;

            // Handle workspace shape clicks with action tracking
            const shapeElements = display_element.querySelectorAll('.workspace-shape');
            shapeElements.forEach((shape, index) => {
                shape.addEventListener('click', () => {
                    // Prevent interactions during animations
                    if (recipientShape?.classList.contains('interaction-animation')) {
                        return;
                    }

                    if (shape === actorShape) {
                        // Deselect actor
                        actorShape.classList.remove('actor-selected');
                        actorShape = null;
                    } else if (!actorShape) {
                        // Select actor
                        actorShape = shape;
                        shape.classList.add('actor-selected');
                    } else if (shape !== actorShape && !recipientShape) {
                        recipientShape = shape;
                        shape.classList.add('recipient-selected');
                        
                        this.pursuitActions.push({
                            timestamp: Date.now(),
                            actor_position: Array.from(shapeElements).indexOf(actorShape),
                            recipient_position: index,
                            feature: selectedFeature,
                            state: Array.from(shapeElements).map(shape => getShapeState(shape))
                        });

                        // Get the active feature
                        const activeFeatureBtn = display_element.querySelector('.feature-btn.active');
                        if (activeFeatureBtn) {
                            const feature = activeFeatureBtn.dataset.feature;
                            
                            // Transfer the feature from actor to recipient
                            if (feature === 'texture') {
                                // Get current texture of recipient
                                const recipientElement = recipientShape.querySelector('path, rect');
                                const currentTexture = Array.from(recipientElement.classList)
                                    .find(cls => ['plain', 'striped', 'dotted'].includes(cls));
                                
                                // Define texture cycle order
                                const textureCycle = ['striped', 'dotted', 'plain'];
                                
                                // Find next texture in cycle
                                let nextTexture;
                                const currentIndex = textureCycle.indexOf(currentTexture);
                                if (currentIndex === -1 || currentIndex === textureCycle.length - 1) {
                                    nextTexture = textureCycle[0]; // Start with stripes if current texture not found or at end
                                } else {
                                    nextTexture = textureCycle[currentIndex + 1];
                                }
                                
                                // Remove existing texture
                                recipientElement.classList.remove('plain', 'striped', 'dotted');
                                // Add next texture in cycle
                                recipientElement.classList.add(nextTexture);

                                // Add interaction animation
                                shape.classList.add('interaction-animation');
                                
                                // Reset selections after animation
                                setTimeout(() => {
                                    (async () => {
                                        actorShape.classList.remove('actor-selected');
                                        recipientShape.classList.remove('recipient-selected', 'interaction-animation');
                                        await new Promise(resolve => setTimeout(resolve, 0)); // Let DOM updates complete
                                        actorShape = null;
                                        recipientShape = null;
                                    })();

                                    // Check if goal is achieved
                                    if (this.checkGoalAchieved(display_element)) {
                                        // Show celebration
                                        const celebrationOverlay = display_element.querySelector('.celebration-overlay');
                                        celebrationOverlay.classList.remove('hidden');
                                        celebrationOverlay.classList.add('show');
                                        
                                        // Add confetti animation
                                        for (let i = 0; i < 50; i++) {
                                            this.createConfetti(display_element);
                                        }
                                        
                                        // Save data and finish trial
                                        setTimeout(() => {
                                            const data = {
                                                trial_type: "goal-display",
                                                rt: Math.round(performance.now() - this.startTime),
                                                goal: formattedGoal,
                                                pursuit_array: this.pursuitActions,
                                                abandoned: false,
                                                steps: this.pursuitActions.filter(a => a.action === 'interaction').length,
                                                goal_achieved: true
                                            };
                                            console.log('Goal Display Trial Data (Goal Achieved):', data);
                                            this.jsPsych.finishTrial(data);
                                        }, 2000);
                                    }
                                }, 1000);
                            } else if (feature === 'color') {
                                // Get shades from both shapes
                                const actorShade = Array.from(actorShape.querySelector('.shape-group').classList)
                                    .find(cls => cls.startsWith('shade-'));
                                const recipientShade = Array.from(recipientShape.querySelector('.shape-group').classList)
                                    .find(cls => cls.startsWith('shade-'));
                                const recipientGroup = recipientShape.querySelector('.shape-group');
                                
                                // Define shade order for incremental changes
                                const shadeOrder = ['shade-light', 'shade-medium', 'shade-dark'];
                                
                                // Function to get new shade when shades are different
                                function getIncrementalShade(currentShade, targetShade) {
                                    const currentIndex = shadeOrder.indexOf(currentShade);
                                    const targetIndex = shadeOrder.indexOf(targetShade);
                                    
                                    if (currentIndex < targetIndex) {
                                        return shadeOrder[currentIndex + 1];
                                    } else if (currentIndex > targetIndex) {
                                        return shadeOrder[currentIndex - 1];
                                    }
                                    return currentShade;
                                }
                                
                                let newShade;
                                
                                if (actorShade === recipientShade) {
                                    // Same shade rules (80/20)
                                    if (Math.random() < 0.8) {
                                        // 80% chance: become medium
                                        newShade = 'shade-medium';
                                    } else {
                                        // 20% chance
                                        if (actorShade === 'shade-medium') {
                                            // For medium: randomly jump to light or dark
                                            newShade = Math.random() < 0.5 ? 'shade-light' : 'shade-dark';
                                        } else {
                                            // For light or dark: stay the same
                                            newShade = actorShade;
                                        }
                                    }
                                } else {
                                    // Different shade rules: move one increment toward actor's shade
                                    newShade = getIncrementalShade(recipientShade, actorShade);
                                }
                                
                                // Remove existing shade
                                recipientGroup.classList.remove('shade-light', 'shade-medium', 'shade-dark');
                                // Add new shade
                                recipientGroup.classList.add(newShade);

                                // Add interaction animation
                                shape.classList.add('interaction-animation');
                                
                                // Reset selections after animation
                                setTimeout(() => {
                                    (async () => {
                                        actorShape.classList.remove('actor-selected');
                                        recipientShape.classList.remove('recipient-selected', 'interaction-animation');
                                        await new Promise(resolve => setTimeout(resolve, 0)); // Let DOM updates complete
                                        actorShape = null;
                                        recipientShape = null;
                                    })();

                                    // Check if goal is achieved
                                    if (this.checkGoalAchieved(display_element)) {
                                        // Show celebration
                                        const celebrationOverlay = display_element.querySelector('.celebration-overlay');
                                        celebrationOverlay.classList.remove('hidden');
                                        celebrationOverlay.classList.add('show');
                                        
                                        // Add confetti animation
                                        for (let i = 0; i < 50; i++) {
                                            this.createConfetti(display_element);
                                        }
                                        
                                        // Save data and finish trial
                                        setTimeout(() => {
                                            const data = {
                                                trial_type: "goal-display",
                                                rt: Math.round(performance.now() - this.startTime),
                                                goal: formattedGoal,
                                                pursuit_array: this.pursuitActions,
                                                abandoned: false,
                                                steps: this.pursuitActions.filter(a => a.action === 'interaction').length,
                                                goal_achieved: true
                                            };
                                            console.log('Goal Display Trial Data (Goal Achieved):', data);
                                            this.jsPsych.finishTrial(data);
                                        }, 2000);
                                    }
                                }, 1000);
                            } else if (feature === 'shape') {
                                // Get shape type and path data
                                const actorPath = actorShape.querySelector('path, rect');
                                const recipientPath = recipientShape.querySelector('path, rect');
                                
                                // Get actor's shape type
                                const actorShapeType = Array.from(actorPath.classList)
                                    .find(cls => cls.startsWith('goal-'));
                                
                                // Define all possible shapes
                                const allShapes = ['goal-star', 'goal-cloud', 'goal-square'];
                                
                                // Determine which shape to use (70% actor's shape, 30% random other shape)
                                let newShapeType;
                                if (Math.random() < 0.7) {
                                    // 70% chance: Use actor's shape
                                    newShapeType = actorShapeType;
                                } else {
                                    // 30% chance: Use random shape that's not actor's shape
                                    const otherShapes = allShapes.filter(shape => shape !== actorShapeType);
                                    newShapeType = otherShapes[Math.floor(Math.random() * otherShapes.length)];
                                }
                                
                                // Get the path data for the new shape
                                let newPathData;
                                if (newShapeType === 'goal-star') {
                                    newPathData = "M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z";
                                } else if (newShapeType === 'goal-cloud') {
                                    newPathData = "M35,45 a20,20 1 0,0 0,40 h30 a20,20 1 0,0 0,-40 a10,10 1 0,0 -10,-10 a15,15 1 0,0 -20,10 z";
                                } else {
                                    // For square, we'll use rect element instead of path
                                    newPathData = null;
                                }
                                
                                // Get current classes except shape type
                                const currentClasses = Array.from(recipientPath.classList)
                                    .filter(cls => !cls.startsWith('goal-'))
                                    .join(' ');
                                
                                // Apply new shape
                                if (newShapeType === 'goal-square') {
                                    // Handle square (rect element)
                                    const currentGroup = recipientPath.closest('.shape-group');
                                    const currentShade = Array.from(currentGroup.classList)
                                        .find(cls => cls.startsWith('shade-'));
                                    
                                    // Update the entire group's HTML for square
                                    currentGroup.innerHTML = `
                                        <rect x="20" y="20" width="60" height="60" rx="10" 
                                            class="${newShapeType} ${currentClasses}"/>
                                        <rect x="20" y="20" width="60" height="60" rx="10" 
                                            class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                                    `;
                                } else {
                                    // Handle star or cloud (path element)
                                    const currentGroup = recipientPath.closest('.shape-group');
                                    const currentShade = Array.from(currentGroup.classList)
                                        .find(cls => cls.startsWith('shade-'));
                                    
                                    // Update the entire group's HTML for star/cloud
                                    currentGroup.innerHTML = `
                                        <path d="${newPathData}" 
                                            class="${newShapeType} ${currentClasses}"/>
                                        <path d="${newPathData}" 
                                            class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                                    `;
                                }
                                
                                // Update outline path if it exists
                                const recipientOutline = recipientShape.querySelector('.shape-outline');
                                if (recipientOutline) {
                                    if (newShapeType === 'goal-square') {
                                        recipientOutline.removeAttribute('d');
                                        recipientOutline.setAttribute('x', '20');
                                        recipientOutline.setAttribute('y', '20');
                                        recipientOutline.setAttribute('width', '60');
                                        recipientOutline.setAttribute('height', '60');
                                        recipientOutline.setAttribute('rx', '10');
                                    } else {
                                        recipientOutline.setAttribute('d', newPathData);
                                        recipientOutline.removeAttribute('x');
                                        recipientOutline.removeAttribute('y');
                                        recipientOutline.removeAttribute('width');
                                        recipientOutline.removeAttribute('height');
                                        recipientOutline.removeAttribute('rx');
                                    }
                                }

                                // Add interaction animation
                                shape.classList.add('interaction-animation');
                                
                                // Reset selections after animation
                                setTimeout(() => {
                                    (async () => {
                                        actorShape.classList.remove('actor-selected');
                                        recipientShape.classList.remove('recipient-selected', 'interaction-animation');
                                        await new Promise(resolve => setTimeout(resolve, 0)); // Let DOM updates complete
                                        actorShape = null;
                                        recipientShape = null;
                                    })();

                                    // Check if goal is achieved
                                    if (this.checkGoalAchieved(display_element)) {
                                        // Show celebration
                                        const celebrationOverlay = display_element.querySelector('.celebration-overlay');
                                        celebrationOverlay.classList.remove('hidden');
                                        celebrationOverlay.classList.add('show');
                                        
                                        // Add confetti animation
                                        for (let i = 0; i < 50; i++) {
                                            this.createConfetti(display_element);
                                        }
                                        
                                        // Save data and finish trial
                                        setTimeout(() => {
                                            const data = {
                                                trial_type: "goal-display",
                                                rt: Math.round(performance.now() - this.startTime),
                                                goal: formattedGoal,
                                                pursuit_array: this.pursuitActions,
                                                abandoned: false,
                                                steps: this.pursuitActions.filter(a => a.action === 'interaction').length,
                                                goal_achieved: true
                                            };
                                            console.log('Goal Display Trial Data (Goal Achieved):', data);
                                            this.jsPsych.finishTrial(data);
                                        }, 2000);
                                    }
                                }, 1000);
                            }
                        }
                    }
                });
            });

            // Add give up button handler
            const giveUpBtn = display_element.querySelector('.give-up-btn');
            giveUpBtn.addEventListener('click', () => {
                const data = {
                    trial_type: "goal-display",
                    rt: Math.round(performance.now() - this.startTime),
                    goal: formattedGoal,
                    pursuit_array: this.pursuitActions,
                    abandoned: true,
                    steps: this.pursuitActions.filter(a => a.action === 'interaction').length,
                    goal_achieved: false
                };
                console.log('Goal Display Trial Data (Abandoned):', data);
                this.jsPsych.finishTrial(data);
            });
        }
    }
    GoalDisplayPlugin.info = info;
  
    return GoalDisplayPlugin;
  
})(jsPsychModule); 

// Helper function to render shape (add this to the class)
function renderShape(shapeData) {
    if (!shapeData) return '';
    
    const shapeType = shapeData.type;
    const shapeClasses = shapeData.shapeClass;
    const shadeClass = shapeClasses.split(' ')[1]; // Get the shade class

    if (shapeType === 'goal-star') {
        return `<g class="shape-group ${shadeClass}">
            <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                class="${shapeClasses}"/>
            <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
        </g>`;
    } else if (shapeType === 'goal-cloud') {
        return `<g class="shape-group ${shadeClass}">
            <path d="M35,45 a20,20 1 0,0 0,40 h30 a20,20 1 0,0 0,-40 a10,10 1 0,0 -10,-10 a15,15 1 0,0 -20,10 z" 
                class="${shapeClasses}"/>
            <path d="M35,45 a20,20 1 0,0 0,40 h30 a20,20 1 0,0 0,-40 a10,10 1 0,0 -10,-10 a15,15 1 0,0 -20,10 z" 
                class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
        </g>`;
    } else {
        return `<g class="shape-group ${shadeClass}">
            <rect x="20" y="20" width="60" height="60" rx="10" 
                class="${shapeClasses}"/>
            <rect x="20" y="20" width="60" height="60" rx="10" 
                class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
        </g>`;
    }
} 