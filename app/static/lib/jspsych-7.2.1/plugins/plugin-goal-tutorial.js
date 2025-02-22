var jsPsychGoalTutorial = (function (jspsych) {
    'use strict';
  
    const info = {
        name: "goal-tutorial",
        parameters: {
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

    // Rest of the code is identical to goal-display plugin except for the trial function
    // ... copy all helper functions from goal-display ...

    class GoalTutorialPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
            this.pursuitActions = [];
            this.startTime = null;
        }

        trial(display_element, trial) {
            this.startTime = performance.now();
            this.pursuitActions = [];

            // Predefined goal state
            const goalShapes = [
                { type: 'goal-square', shadeClass: 'shade-dark', textureClass: 'striped' },
                { type: 'goal-square', shadeClass: 'shade-light', textureClass: 'striped' },
                { type: 'goal-cloud', shadeClass: 'shade-medium', textureClass: 'dotted' }
            ];

            // Predefined initial workspace state
            const workspaceShapes = [
                { type: 'goal-square', shadeClass: 'shade-dark', textureClass: 'striped' },
                { type: 'goal-cloud', shadeClass: 'shade-light', textureClass: 'striped' },
                { type: 'goal-square', shadeClass: 'shade-light', textureClass: 'plain' }
            ];

            // Create the display HTML - same structure as goal-display
            display_element.innerHTML = `
                ${trial.preamble ? `<div class="jspsych-goal-display-preamble">${trial.preamble}</div>` : ''}
                <div class="instruction-text-container">
                    <div class="instruction-content">
                        <div class="instruction-text" data-page="1">
                            This is the screen you will see when you are trying to achieve a goal. Click the "Next" button to read all the instructions before trying this example. 
                        </div>
                        <div class="instruction-text hidden" data-page="2">
                            In the top left corner is a goal configuration. The task here is to make the below items match that configuration.
                        </div>
                        <div class="instruction-text hidden" data-page="3">
                            You can make the items below change by making them interact. 
                        </div>
                        <div class="instruction-text hidden" data-page="4">
                            The item you click first will be the actor, and the item you click second will be the recipient. The actor will change the recipient, but only for the feature (texture, shape, or shade) that is currently selected.
                        </div>
                        <div class="instruction-text hidden" data-page="5">
                            On the right is a menu that explains the rules for how recipient items change when they are acted on.
                        </div>
                        <div class="instruction-text hidden" data-page="6">
                            No matter what happens, you can always achieve a selected goal. It might just take some effort.
                        </div>
                        <div class="instruction-text hidden" data-page="7">
                            Later, you will be able to choose what goal configuration you want to achieve. For now, read the rules to the right and try to achieve the goal configuration in the top left corner.
                        </div>
                    </div>
                </div>
                <div class="jspsych-goal-display-container">
                    <div class="goal-display">
                        <h3>Goal Configuration:</h3>
                        <div class="goal-display-shapes">
                            <svg class="source-container" viewBox="0 0 100 100">
                                ${renderWorkspaceShape(goalShapes[0])}
                            </svg>
                            <div>
                                <svg class="source-container" viewBox="0 0 100 100">
                                    ${renderWorkspaceShape(goalShapes[1])}
                                </svg>
                                <svg class="source-container" viewBox="0 0 100 100">
                                    ${renderWorkspaceShape(goalShapes[2])}
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="workspace-container">
                    <div class="feature-menu">
                        <button class="feature-btn active" data-feature="texture">texture</button>
                        <button class="feature-btn" data-feature="shape">shape</button>
                        <button class="feature-btn" data-feature="color">shade</button>
                    </div>
                    <div class="workspace-shapes">
                        <svg class="workspace-shape" viewBox="0 0 100 100">
                            ${renderWorkspaceShape(workspaceShapes[0])}
                        </svg>
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
                        <h3>Rules:</h3>
                        
                        <h4>Texture:</h4>
                        <ul>
                            <li>The recipient item texture cycles between plain, striped, and dotted in that order when acted on.</li>
                        </ul>
                        
                        <h4>Shape:</h4>
                        <ul>
                            <li>Most of the time, the recipient item will take on the shape of the actor item.</li>
                            <li>Sometimes, the recipient item will change to a random shape that is not the actor shape.</li>
                        </ul>
                        
                        <h4>Shade:</h4>
                        <ul>
                            <li>If the two items have different shades, the recipient item will become more like the actor item by one step (e.g., dark to medium).</li>
                            <li>If the two items have the same shade, most of the time the recipient item will become medium shade, but sometimes:</li>
                            <ul>
                                <li>If both items are medium shade, the recipient will change to either high or low shade.</li>
                                <li>If both items are high shade or both are low shade, the recipient won't change.</li>
                            </ul>
                        </ul>
                    </div>
                </div>
                <div class="celebration-overlay hidden">
                    <div class="celebration-content">
                        <h2>Goal Achieved!</h2>
                        <p>Great work! You're ready for the main experiment.</p>
                    </div>
                </div>
                <div class="instruction-nav-container">
                    <div class="instruction-nav">
                        <button class="instruction-btn prev-btn" disabled>Previous</button>
                        <button class="instruction-btn next-btn">Next</button>
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
                        this.pursuitActions.push({
                            timestamp: Date.now(),
                            action: 'deselect_actor',
                            position: index
                        });
                        actorShape = null;
                    } else if (!actorShape) {
                        // Select actor
                        actorShape = shape;
                        shape.classList.add('actor-selected');
                        this.pursuitActions.push({
                            timestamp: Date.now(),
                            action: 'select_actor',
                            position: index
                        });
                    } else if (shape !== actorShape && !recipientShape) {
                        // Record interaction
                        recipientShape = shape;
                        shape.classList.add('recipient-selected');
                        
                        this.pursuitActions.push({
                            timestamp: Date.now(),
                            action: 'interaction',
                            actor_position: Array.from(shapeElements).indexOf(actorShape),
                            recipient_position: index,
                            feature: selectedFeature
                        });

                        // Get the active feature
                        const activeFeatureBtn = display_element.querySelector('.feature-btn.active');
                        if (activeFeatureBtn) {
                            const feature = activeFeatureBtn.dataset.feature;
                            
                            // Transfer the feature from actor to recipient
                            if (feature === 'texture') {
                                const recipientElement = recipientShape.querySelector('path, rect');
                                const currentTexture = Array.from(recipientElement.classList)
                                    .find(cls => ['plain', 'striped', 'dotted'].includes(cls));
                                
                                const textureCycle = ['striped', 'dotted', 'plain'];
                                let nextTexture;
                                const currentIndex = textureCycle.indexOf(currentTexture);
                                if (currentIndex === -1 || currentIndex === textureCycle.length - 1) {
                                    nextTexture = textureCycle[0];
                                } else {
                                    nextTexture = textureCycle[currentIndex + 1];
                                }
                                
                                recipientElement.classList.remove('plain', 'striped', 'dotted');
                                recipientElement.classList.add(nextTexture);
                            } else if (feature === 'color') {
                                const actorShade = Array.from(actorShape.querySelector('.shape-group').classList)
                                    .find(cls => cls.startsWith('shade-'));
                                const recipientShade = Array.from(recipientShape.querySelector('.shape-group').classList)
                                    .find(cls => cls.startsWith('shade-'));
                                const recipientGroup = recipientShape.querySelector('.shape-group');
                                
                                const shadeOrder = ['shade-light', 'shade-medium', 'shade-dark'];
                                
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
                                    if (Math.random() < 0.8) {
                                        newShade = 'shade-medium';
                                    } else {
                                        if (actorShade === 'shade-medium') {
                                            newShade = Math.random() < 0.5 ? 'shade-light' : 'shade-dark';
                                        } else {
                                            newShade = actorShade;
                                        }
                                    }
                                } else {
                                    newShade = getIncrementalShade(recipientShade, actorShade);
                                }
                                
                                recipientGroup.classList.remove('shade-light', 'shade-medium', 'shade-dark');
                                recipientGroup.classList.add(newShade);
                            } else if (feature === 'shape') {
                                const actorPath = actorShape.querySelector('path, rect');
                                const recipientPath = recipientShape.querySelector('path, rect');
                                
                                const actorShapeType = Array.from(actorPath.classList)
                                    .find(cls => cls.startsWith('goal-'));
                                
                                const allShapes = ['goal-star', 'goal-cloud', 'goal-square'];
                                
                                let newShapeType;
                                if (Math.random() < 0.7) {
                                    newShapeType = actorShapeType;
                                } else {
                                    const otherShapes = allShapes.filter(shape => shape !== actorShapeType);
                                    newShapeType = otherShapes[Math.floor(Math.random() * otherShapes.length)];
                                }
                                
                                const currentGroup = recipientPath.closest('.shape-group');
                                const currentShade = Array.from(currentGroup.classList)
                                    .find(cls => cls.startsWith('shade-'));
                                const currentClasses = Array.from(recipientPath.classList)
                                    .filter(cls => !cls.startsWith('goal-'))
                                    .join(' ');

                                if (newShapeType === 'goal-square') {
                                    currentGroup.innerHTML = `
                                        <rect x="20" y="20" width="60" height="60" rx="10" 
                                            class="${newShapeType} ${currentClasses}"/>
                                        <rect x="20" y="20" width="60" height="60" rx="10" 
                                            class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                                    `;
                                } else {
                                    const pathData = newShapeType === 'goal-star' 
                                        ? "M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z"
                                        : "M35,45 a20,20 1 0,0 0,40 h30 a20,20 1 0,0 0,-40 a10,10 1 0,0 -10,-10 a15,15 1 0,0 -20,10 z";
                                    
                                    currentGroup.innerHTML = `
                                        <path d="${pathData}" 
                                            class="${newShapeType} ${currentClasses}"/>
                                        <path d="${pathData}" 
                                            class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                                    `;
                                }
                            }
                            
                            shape.classList.add('interaction-animation');
                            
                            setTimeout(() => {
                                actorShape.classList.remove('actor-selected');
                                recipientShape.classList.remove('recipient-selected', 'interaction-animation');
                                
                                // Check if goal is achieved
                                if (this.checkGoalAchieved(display_element)) {
                                    const celebrationOverlay = display_element.querySelector('.celebration-overlay');
                                    celebrationOverlay.classList.remove('hidden');
                                    celebrationOverlay.classList.add('show');
                                    
                                    // Hide both instruction containers
                                    display_element.querySelector('.instruction-text-container').style.display = 'none';
                                    display_element.querySelector('.instruction-nav-container').style.display = 'none';
                                    
                                    // Add confetti animation
                                    for (let i = 0; i < 50; i++) {
                                        this.createConfetti(display_element);
                                    }
                                    
                                    // Save data and finish trial
                                    setTimeout(() => {
                                        const data = {
                                            trial_type: "goal-tutorial",
                                            rt: Math.round(performance.now() - this.startTime),
                                            goal: goalShapes.map(shape => ({
                                                type: shape.type,
                                                shade: shape.shadeClass,
                                                texture: shape.textureClass
                                            })),
                                            pursuit_array: this.pursuitActions,
                                            steps: this.pursuitActions.filter(a => a.action === 'interaction').length,
                                            goal_achieved: true
                                        };
                                        console.log('Goal Tutorial Trial Data:', data);
                                        this.jsPsych.finishTrial(data);
                                    }, 2000);
                                }
                                
                                actorShape = null;
                                recipientShape = null;
                            }, 1000);
                        }
                    }
                });
            });

            // Update the instruction navigation logic
            let currentPage = 1;
            const totalPages = 7;

            const prevBtn = display_element.querySelector('.prev-btn');
            const nextBtn = display_element.querySelector('.next-btn');

            function updateInstructionVisibility() {
                // Hide all instruction texts
                display_element.querySelectorAll('.instruction-text').forEach(text => {
                    text.classList.add('hidden');
                });
                
                // Show current page
                display_element.querySelector(`.instruction-text[data-page="${currentPage}"]`).classList.remove('hidden');
                
                // Update button states
                prevBtn.disabled = currentPage === 1;
                nextBtn.disabled = currentPage === totalPages;  // Disable next button on last page instead of changing text
            }

            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateInstructionVisibility();
                }
            });

            nextBtn.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    updateInstructionVisibility();
                }
            });
        }

        // Copy helper methods from goal-display
        checkGoalAchieved(display_element) {
            const workspaceShapes = Array.from(display_element.querySelectorAll('.workspace-shape'));
            const goalShapes = Array.from(display_element.querySelectorAll('.goal-display-shapes .source-container'));
            return workspaceShapes.every((workspaceShape, index) => 
                this.doShapesMatch(workspaceShape, goalShapes[index]));
        }

        doShapesMatch(shape1, shape2) {
            const shape1Classes = Array.from(shape1.querySelector('path, rect').classList);
            const shape2Classes = Array.from(shape2.querySelector('path, rect').classList);
            
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

        createConfetti(display_element) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.opacity = Math.random();
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            display_element.querySelector('.celebration-overlay').appendChild(confetti);
            
            confetti.addEventListener('animationend', () => confetti.remove());
        }
    }
    GoalTutorialPlugin.info = info;
  
    return GoalTutorialPlugin;
  
})(jsPsychModule);

// Copy all helper functions from goal-display plugin
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
