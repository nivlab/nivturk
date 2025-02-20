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
        }

        trial(display_element, trial) {
            const startTime = performance.now();

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
                <div class="instruction-container">
                    <div class="instruction-content">
                        <div class="instruction-text" data-page="1">
                            Above is a configuration of three items. In the top left corner is the goal configuration that you are trying to match.
                        </div>
                        <div class="instruction-text hidden" data-page="2">
                            You can make the items change by choosing an "actor" item and a "recipient" item. The item you click first will be the actor, and the item you click second will be the recipient. The actor will change the recipient.
                        </div>
                        <div class="instruction-text hidden" data-page="3">
                            Notice that each item has a shape (star, cloud, square), a shade (dark, medium, light), and a texture (plain, striped, and dotted).
                        </div>
                        <div class="instruction-text hidden" data-page="4">
                            On the right is a menu that explains the rules for how recipient items change when they are acted on. Read the rules here, and try to exactly match the goal configuration in the top left corner. Note: it is always possible to achieve any goal.
                        </div>
                        <div class="instruction-nav">
                            <button class="instruction-btn prev-btn" disabled>Previous</button>
                            <button class="instruction-btn next-btn">Next</button>
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
                <div class="celebration-overlay hidden">
                    <div class="celebration-content">
                        <h2>Goal Achieved!</h2>
                        <p>Great work! You're ready for the main experiment.</p>
                    </div>
                </div>
            `;

            // Handle feature button clicks
            const featureButtons = display_element.querySelectorAll('.feature-btn');
            featureButtons.forEach(button => {
                button.addEventListener('click', () => {
                    featureButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                });
            });

            let actorShape = null;
            let recipientShape = null;

            // Handle workspace shape clicks
            const shapeElements = display_element.querySelectorAll('.workspace-shape');
            shapeElements.forEach(shape => {
                shape.addEventListener('click', () => {
                    // Prevent interactions during animations
                    if (recipientShape?.classList.contains('interaction-animation')) {
                        return;
                    }

                    if (shape === actorShape) {
                        actorShape.classList.remove('actor-selected');
                        actorShape = null;
                    } else if (!actorShape) {
                        actorShape = shape;
                        shape.classList.add('actor-selected');
                    } else if (shape !== actorShape && !recipientShape) {
                        recipientShape = shape;
                        shape.classList.add('recipient-selected');
                        
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
                                    
                                    // Add instruction container removal here
                                    display_element.querySelector('.instruction-container').style.display = 'none';
                                    
                                    for (let i = 0; i < 50; i++) {
                                        this.createConfetti(display_element);
                                    }
                                    
                                    setTimeout(() => {
                                        this.jsPsych.finishTrial({
                                            rt: Math.round(performance.now() - startTime),
                                            goal_achieved: true
                                        });
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
            const totalPages = 4;

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
