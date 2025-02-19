var jsPsychTutorialDisplay = (function (jspsych) {
    'use strict';

    const info = {
        name: "tutorial-display",
        parameters: {
            button_label_next: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Next button label",
                default: "Next"
            }
        }
    };

    // Copy the helper functions from goal-display
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

    class TutorialDisplayPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
            this.currentInstructionPage = 0;
            this.instructions = [
                "Below is a configuration of three items. In the top left corner is the goal configuration that you are trying to match.",
                "You can make the items change by choosing an \"actor\" item and a \"recipient\" item. The item you click first will be the actor, and the item you click second will be the recipient. The actor will change the recipient.",
                "Notice that each item has a shape (star, cloud, square), a shade (dark, medium, light), and a texture (plain, striped, and dotted)."
            ];
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
            
            const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            display_element.querySelector('.celebration-overlay').appendChild(confetti);
            confetti.addEventListener('animationend', () => confetti.remove());
        }

        trial(display_element, trial) {
            const startTime = performance.now();

            // Define fixed goal and starting states
            const goalState = [
                { type: 'goal-square', shadeClass: 'shade-dark', textureClass: 'striped' },
                { type: 'goal-square', shadeClass: 'shade-light', textureClass: 'striped' },
                { type: 'goal-cloud', shadeClass: 'shade-medium', textureClass: 'dotted' }
            ];

            const startingState = [
                { type: 'goal-square', shadeClass: 'shade-dark', textureClass: 'striped' },
                { type: 'goal-cloud', shadeClass: 'shade-light', textureClass: 'striped' },
                { type: 'goal-square', shadeClass: 'shade-light', textureClass: 'plain' }
            ];

            // Create the display HTML
            display_element.innerHTML = `
                <div class="tutorial-instruction-panel">
                    <p class="instruction-text">${this.instructions[this.currentInstructionPage]}</p>
                    <button class="tutorial-next-btn">${trial.button_label_next}</button>
                </div>
                <div class="jspsych-goal-display-container">
                    <div class="goal-display">
                        <h3>Goal Configuration:</h3>
                        <div class="goal-display-shapes">
                            <!-- Top shape -->
                            <svg class="source-container" viewBox="0 0 100 100">
                                ${renderWorkspaceShape(goalState[0])}
                            </svg>
                            <!-- Container for bottom shapes -->
                            <div>
                                <svg class="source-container" viewBox="0 0 100 100">
                                    ${renderWorkspaceShape(goalState[1])}
                                </svg>
                                <svg class="source-container" viewBox="0 0 100 100">
                                    ${renderWorkspaceShape(goalState[2])}
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
                        <!-- Top shape -->
                        <svg class="workspace-shape" viewBox="0 0 100 100">
                            ${renderWorkspaceShape(startingState[0])}
                        </svg>
                        <!-- Container for bottom shapes -->
                        <div class="workspace-bottom-shapes">
                            <svg class="workspace-shape" viewBox="0 0 100 100">
                                ${renderWorkspaceShape(startingState[1])}
                            </svg>
                            <svg class="workspace-shape" viewBox="0 0 100 100">
                                ${renderWorkspaceShape(startingState[2])}
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

            // Add instruction navigation
            const nextButton = display_element.querySelector('.tutorial-next-btn');
            nextButton.addEventListener('click', () => {
                this.currentInstructionPage++;
                if (this.currentInstructionPage >= this.instructions.length) {
                    this.jsPsych.finishTrial({
                        completed: true
                    });
                } else {
                    display_element.querySelector('.instruction-text').textContent = 
                        this.instructions[this.currentInstructionPage];
                }
            });

            // Handle feature button clicks
            const featureButtons = display_element.querySelectorAll('.feature-btn');
            featureButtons.forEach(button => {
                button.addEventListener('click', () => {
                    featureButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                });
            });

            // Handle shape interactions
            let actorShape = null;
            let recipientShape = null;

            const shapeElements = display_element.querySelectorAll('.workspace-shape');
            shapeElements.forEach(shape => {
                shape.addEventListener('click', () => {
                    // Prevent any interactions during animations
                    if (recipientShape?.classList.contains('interaction-animation')) {
                        return;
                    }

                    if (shape === actorShape) {
                        // Only allow deselection if no animation is in progress
                        actorShape.classList.remove('actor-selected');
                        actorShape = null;
                    } else if (!actorShape) {
                        // First click - select actor
                        actorShape = shape;
                        shape.classList.add('actor-selected');
                    } else if (shape !== actorShape && !recipientShape) {
                        // Second click - select recipient and perform interaction
                        recipientShape = shape;
                        shape.classList.add('recipient-selected');
                        
                        // Get the active feature and perform interaction
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
                                    nextTexture = textureCycle[0];
                                } else {
                                    nextTexture = textureCycle[currentIndex + 1];
                                }
                                
                                // Remove existing texture
                                recipientElement.classList.remove('plain', 'striped', 'dotted');
                                // Add next texture in cycle
                                recipientElement.classList.add(nextTexture);
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
                            }
                        }
                        
                        // Add interaction animation
                        shape.classList.add('interaction-animation');
                        
                        // Reset selections after animation
                        setTimeout(() => {
                            actorShape.classList.remove('actor-selected');
                            recipientShape.classList.remove('recipient-selected', 'interaction-animation');
                            
                            // Check if goal is achieved
                            if (this.checkGoalAchieved(display_element)) {
                                const celebrationOverlay = display_element.querySelector('.celebration-overlay');
                                celebrationOverlay.classList.remove('hidden');
                                celebrationOverlay.classList.add('show');
                                
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
                });
            });
        }
    }

    TutorialDisplayPlugin.info = info;
    return TutorialDisplayPlugin;

})(jsPsychModule); 