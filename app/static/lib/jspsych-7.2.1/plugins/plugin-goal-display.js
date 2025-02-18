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

    class GoalDisplayPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
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
            
            // Check if each workspace shape matches corresponding goal shape
            console.log(workspaceShapes);
            console.log(goalShapes);
            console.log(workspaceShapes.every((workspaceShape, index) => 
                this.doShapesMatch(workspaceShape, goalShapes[index])));

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

        trial(display_element, trial) {
            const startTime = performance.now();

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
                    <button class="jspsych-btn">${trial.button_label}</button>
                </div>
            </div>
            <div class="workspace-container">
                <div class="feature-menu">
                    <button class="feature-btn active" data-feature="texture">texture</button>
                    <button class="feature-btn" data-feature="shape">shape</button>
                    <button class="feature-btn" data-feature="color">color</button>
                </div>
                <div class="workspace-shapes">
                    <!-- Top shape -->
                    <svg class="workspace-shape" viewBox="0 0 100 100">
                        <g class="shape-group shade-medium">
                            <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                                class="goal-star striped"/>
                            <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                                class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                        </g>
                    </svg>
                    <!-- Container for bottom shapes -->
                    <div class="workspace-bottom-shapes">
                        <svg class="workspace-shape" viewBox="0 0 100 100">
                            <g class="shape-group shade-light">
                                <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                                    class="goal-star dotted"/>
                                <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                                    class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                            </g>
                        </svg>
                        <svg class="workspace-shape" viewBox="0 0 100 100">
                            <g class="shape-group shade-dark">
                                <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                                    class="goal-star plain"/>
                                <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                                    class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="celebration-overlay hidden">
                <div class="celebration-content">
                    <h2>Goal Achieved!</h2>
                    <p>Great work!</p>
                </div>
            </div>
            `;

            // Add button click event
            const button = display_element.querySelector('.jspsych-btn');
            button.addEventListener('click', () => {
                this.jsPsych.finishTrial({
                    rt: Math.round(performance.now() - startTime)
                });
            });

            // Handle feature button clicks
            const featureButtons = display_element.querySelectorAll('.feature-btn');
            featureButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Remove active class from all buttons
                    featureButtons.forEach(btn => btn.classList.remove('active'));
                    // Add active class to clicked button
                    button.classList.add('active');
                    
                    // Store the active feature
                    const activeFeature = button.dataset.feature;
                    // You can use activeFeature later for shape interactions
                });
            });

            // Add after the feature button click handlers
            let actorShape = null;
            let recipientShape = null;

            // Handle workspace shape clicks
            const workspaceShapes = display_element.querySelectorAll('.workspace-shape');
            workspaceShapes.forEach(shape => {
                shape.addEventListener('click', () => {
                    if (!actorShape) {
                        // First click - select actor
                        actorShape = shape;
                        shape.classList.add('actor-selected');
                    } else if (shape !== actorShape && !recipientShape) {
                        // Second click - select recipient and perform interaction
                        recipientShape = shape;
                        shape.classList.add('recipient-selected');
                        
                        // Get the active feature
                        const activeFeatureBtn = display_element.querySelector('.feature-btn.active');
                        if (activeFeatureBtn) {
                            const feature = activeFeatureBtn.dataset.feature;
                            
                            // Transfer the feature from actor to recipient
                            if (feature === 'texture') {
                                // Get texture classes
                                const actorTexture = Array.from(actorShape.querySelector('path, rect').classList)
                                    .find(cls => ['plain', 'striped', 'dotted'].includes(cls));
                                const recipientElement = recipientShape.querySelector('path, rect');
                                
                                // Remove existing texture
                                recipientElement.classList.remove('plain', 'striped', 'dotted');
                                // Add actor's texture
                                recipientElement.classList.add(actorTexture);
                            } else if (feature === 'color') {
                                // Get color (shade) from actor's shape group
                                const actorShade = Array.from(actorShape.querySelector('.shape-group').classList)
                                    .find(cls => cls.startsWith('shade-'));
                                const recipientGroup = recipientShape.querySelector('.shape-group');
                                
                                // Remove existing shade
                                recipientGroup.classList.remove('shade-light', 'shade-medium', 'shade-dark');
                                // Add actor's shade
                                recipientGroup.classList.add(actorShade);
                            } else if (feature === 'shape') {
                                // Get shape type and path data
                                const actorPath = actorShape.querySelector('path, rect');
                                const recipientPath = recipientShape.querySelector('path, rect');
                                
                                // Copy shape type class and path data
                                const actorShapeType = Array.from(actorPath.classList)
                                    .find(cls => cls.startsWith('goal-'));
                                recipientPath.className = actorPath.className;
                                recipientPath.setAttribute('d', actorPath.getAttribute('d'));
                                
                                // Update outline path if it exists
                                const actorOutline = actorShape.querySelector('.shape-outline');
                                const recipientOutline = recipientShape.querySelector('.shape-outline');
                                if (actorOutline && recipientOutline) {
                                    recipientOutline.setAttribute('d', actorOutline.getAttribute('d'));
                                }
                            }
                            
                            // Add interaction animation
                            shape.classList.add('interaction-animation');
                            
                            // Reset selections after animation
                            setTimeout(() => {
                                actorShape.classList.remove('actor-selected');
                                recipientShape.classList.remove('recipient-selected', 'interaction-animation');
                                actorShape = null;
                                recipientShape = null;

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
                                    
                                    // Wait for celebration animation then move to next trial
                                    setTimeout(() => {
                                        this.jsPsych.finishTrial({
                                            rt: Math.round(performance.now() - startTime),
                                            goal_achieved: true
                                        });
                                    }, 2000);
                                }
                            }, 1000);
                        }
                    }
                });
            });
        }
    }
    GoalDisplayPlugin.info = info;
  
    return GoalDisplayPlugin;
  
})(jsPsychModule); 

// Helper function to render shape (add this to the class)
function renderShape(goal) {
    if (goal.type === 'goal-star') {
        return `<g class="shape-group ${goal.shapeClass.split(' ')[1]}">
            <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                class="${goal.shapeClass}"/>
            <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
           </g>`;
    } else if (goal.type === 'goal-cloud') {
        return `<g class="shape-group ${goal.shapeClass.split(' ')[1]}">
            <path d="M35,45 a20,20 1 0,0 0,40 h30 a20,20 1 0,0 0,-40 a10,10 1 0,0 -10,-10 a15,15 1 0,0 -20,10 z" 
                class="${goal.shapeClass}"/>
            <path d="M35,45 a20,20 1 0,0 0,40 h30 a20,20 1 0,0 0,-40 a10,10 1 0,0 -10,-10 a15,15 1 0,0 -20,10 z" 
                class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
           </g>`;
    } else {
        return `<g class="shape-group ${goal.shapeClass.split(' ')[1]}">
            <rect x="20" y="20" width="60" height="60" rx="10" 
                class="${goal.shapeClass}"/>
            <rect x="20" y="20" width="60" height="60" rx="10" 
                class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
           </g>`;
    }
} 