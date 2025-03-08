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

            // Add pattern definitions at the start
            const uniqueId = Date.now();
            const svgDefs = `
                <svg width="0" height="0" style="position: absolute;">
                    <defs>
                        <!-- Light shade patterns -->
                        <pattern id="striped-pattern-light-${uniqueId}" 
                            patternUnits="userSpaceOnUse"
                            width="20" height="20"
                            patternTransform="rotate(45)">
                            <rect width="10" height="20" fill="#b3d7ff"/>
                        </pattern>
                        <pattern id="dotted-pattern-light-${uniqueId}" 
                            patternUnits="userSpaceOnUse"
                            width="12" height="12">
                            <circle cx="6" cy="6" r="2.5" fill="#b3d7ff"/>
                        </pattern>

                        <!-- Medium shade patterns -->
                        <pattern id="striped-pattern-medium-${uniqueId}" 
                            patternUnits="userSpaceOnUse"
                            width="20" height="20"
                            patternTransform="rotate(45)">
                            <rect width="10" height="20" fill="#007bff"/>
                        </pattern>
                        <pattern id="dotted-pattern-medium-${uniqueId}" 
                            patternUnits="userSpaceOnUse"
                            width="12" height="12">
                            <circle cx="6" cy="6" r="2.5" fill="#007bff"/>
                        </pattern>

                        <!-- Dark shade patterns -->
                        <pattern id="striped-pattern-dark-${uniqueId}" 
                            patternUnits="userSpaceOnUse"
                            width="20" height="20"
                            patternTransform="rotate(45)">
                            <rect width="10" height="20" fill="#004080"/>
                        </pattern>
                        <pattern id="dotted-pattern-dark-${uniqueId}" 
                            patternUnits="userSpaceOnUse"
                            width="12" height="12">
                            <circle cx="6" cy="6" r="2.5" fill="#004080"/>
                        </pattern>
                    </defs>
                </svg>
            `;
            
            document.body.insertAdjacentHTML('afterbegin', svgDefs);

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
                <div class="content-area">
                    <div class="left-column">
                        <div class="jspsych-goal-display-container">
                            <div class="goal-display">
                                <h3>Goal Configuration:</h3>
                                <div class="goal-display-shapes">
                                    <svg class="source-container" viewBox="0 0 100 100">
                                        ${renderWorkspaceShape(goalShapes[0], uniqueId)}
                                    </svg>
                                    <div>
                                        <svg class="source-container" viewBox="0 0 100 100">
                                            ${renderWorkspaceShape(goalShapes[1], uniqueId)}
                                        </svg>
                                        <svg class="source-container" viewBox="0 0 100 100">
                                            ${renderWorkspaceShape(goalShapes[2], uniqueId)}
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="center-column">
                        <div class="workspace-container">
                            <div class="feature-menu">
                                <button class="feature-btn active" data-feature="texture">texture</button>
                                <button class="feature-btn" data-feature="shape">shape</button>
                                <button class="feature-btn" data-feature="color">shade</button>
                            </div>
                            <div class="workspace-shapes">
                                <div class="workspace-shape-wrapper">
                                    <svg class="workspace-shape" viewBox="0 0 100 100">
                                        ${renderWorkspaceShape(workspaceShapes[0], uniqueId)}
                                    </svg>
                                </div>
                                <div class="workspace-bottom-shapes">
                                    <div class="workspace-shape-wrapper">
                                        <svg class="workspace-shape" viewBox="0 0 100 100">
                                            ${renderWorkspaceShape(workspaceShapes[1], uniqueId)}
                                        </svg>
                                    </div>
                                    <div class="workspace-shape-wrapper">
                                        <svg class="workspace-shape" viewBox="0 0 100 100">
                                            ${renderWorkspaceShape(workspaceShapes[2], uniqueId)}
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="right-column">
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
            const shapeElements = display_element.querySelectorAll('.workspace-shape-wrapper');
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
                                // Get current texture of recipient
                                const recipientElement = recipientShape.querySelector('path, rect');
                                const currentTexture = Array.from(recipientElement.classList)
                                    .find(cls => ['plain', 'striped', 'dotted'].includes(cls));
                                
                                // Define texture cycle order
                                const textureCycle = ['plain', 'striped', 'dotted'];
                                
                                // Find next texture in cycle
                                let nextTexture;
                                const currentIndex = textureCycle.indexOf(currentTexture);
                                if (currentIndex === -1 || currentIndex === textureCycle.length - 1) {
                                    nextTexture = textureCycle[0];
                                } else {
                                    nextTexture = textureCycle[currentIndex + 1];
                                }
                                
                                // Remove existing texture class and add new one
                                recipientElement.classList.remove('plain', 'striped', 'dotted');
                                recipientElement.classList.add(nextTexture);
                                
                                // Update the fill style with the new pattern
                                const shadeClass = Array.from(recipientShape.querySelector('.shape-group').classList)
                                    .find(cls => cls.startsWith('shade-'));
                                recipientElement.style.fill = getPatternFill(nextTexture, shadeClass, uniqueId);

                                // Add to pursuit actions
                                this.pursuitActions.push({
                                    feature: 'texture',
                                    actor_index: Array.from(shapeElements).indexOf(actorShape),
                                    recipient_index: Array.from(shapeElements).indexOf(recipientShape),
                                    result: nextTexture
                                });
                            } else if (feature === 'color') {
                                // Get shades from both shapes
                                const actorShade = Array.from(actorShape.querySelector('.shape-group').classList)
                                    .find(cls => cls.startsWith('shade-'));
                                const recipientShade = Array.from(recipientShape.querySelector('.shape-group').classList)
                                    .find(cls => cls.startsWith('shade-'));
                                const recipientGroup = recipientShape.querySelector('.shape-group');
                                
                                // Get the recipient's texture for pattern update
                                const recipientElement = recipientShape.querySelector('path, rect');
                                const currentTexture = Array.from(recipientElement.classList)
                                    .find(cls => ['plain', 'striped', 'dotted'].includes(cls));

                                // Rest of the existing shade logic...
                                const shadeOrder = ['shade-light', 'shade-medium', 'shade-dark'];
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
                                
                                // Remove existing shade
                                recipientGroup.classList.remove('shade-light', 'shade-medium', 'shade-dark');
                                // Add new shade
                                recipientGroup.classList.add(newShade);

                                // Update the pattern fill with the new shade
                                recipientElement.style.fill = getPatternFill(currentTexture, newShade, uniqueId);
                            } else if (feature === 'shape') {
                                const actorPath = actorShape.querySelector('path, rect');
                                const recipientPath = recipientShape.querySelector('path, rect');
                                
                                // Get current texture and shade
                                const currentTexture = Array.from(recipientPath.classList)
                                    .find(cls => ['plain', 'striped', 'dotted'].includes(cls));
                                const currentShade = Array.from(recipientShape.querySelector('.shape-group').classList)
                                    .find(cls => cls.startsWith('shade-'));
                                
                                // Get actor's shape type
                                const actorShapeType = Array.from(actorPath.classList)
                                    .find(cls => cls.startsWith('goal-'));
                                
                                // Determine new shape
                                let newShapeType;
                                if (Math.random() < 0.7) {
                                    newShapeType = actorShapeType;
                                } else {
                                    const otherShapes = ['goal-star', 'goal-cloud', 'goal-square'].filter(shape => shape !== actorShapeType);
                                    newShapeType = otherShapes[Math.floor(Math.random() * otherShapes.length)];
                                }
                                
                                // Apply new shape while preserving texture and shade
                                const currentGroup = recipientPath.closest('.shape-group');
                                if (newShapeType === 'goal-square') {
                                    currentGroup.innerHTML = `
                                        <rect x="20" y="20" width="60" height="60" rx="10" 
                                            class="${newShapeType} ${currentTexture}"
                                            style="fill: ${getPatternFill(currentTexture, currentShade, uniqueId)}"/>
                                        <rect x="20" y="20" width="60" height="60" rx="10" 
                                            class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                                    `;
                                } else {
                                    const pathData = newShapeType === 'goal-star' 
                                        ? "M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z"
                                        : "M35,45 a20,20 1 0,0 0,40 h30 a20,20 1 0,0 0,-40 a10,10 1 0,0 -10,-10 a15,15 1 0,0 -20,10 z";
                                    
                                    currentGroup.innerHTML = `
                                        <path d="${pathData}" 
                                            class="${newShapeType} ${currentTexture}"
                                            style="fill: ${getPatternFill(currentTexture, currentShade, uniqueId)}"/>
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

            // Add pulsing effect to all instruction texts
            display_element.querySelectorAll('.instruction-text').forEach(text => {
                text.classList.add('pulse');
            });

            // Track if instructions have been completed
            let instructionsCompleted = false;

            // Update the instruction visibility function to handle the pulsing effect
            function updateInstructionVisibility() {
                // Hide all instruction texts
                display_element.querySelectorAll('.instruction-text').forEach(text => {
                    text.classList.add('hidden');
                });
                
                // Show current page
                const currentText = display_element.querySelector(`.instruction-text[data-page="${currentPage}"]`);
                if (currentText) {
                    currentText.classList.remove('hidden');
                    
                    // If we're on the last page and it's been viewed before, show completed style
                    if (currentPage === totalPages && instructionsCompleted) {
                        currentText.classList.remove('pulse');
                        currentText.classList.add('completed');
                    }
                }
                
                // Update button states
                prevBtn.disabled = currentPage === 1;
                nextBtn.disabled = currentPage === totalPages;
            }

            // Add pulsing effect to the Next button until instructions are completed
            nextBtn.classList.add('pulse-next');

            // Update the nextBtn click handler to check if we've reached the last page
            nextBtn.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    updateInstructionVisibility();
                }
                
                // If we've reached the last page, remove the pulsing effect and add completed class
                if (currentPage === totalPages) {
                    instructionContainer.classList.remove('pulse');
                    instructionContainer.classList.add('completed');
                    
                    // Update Next button styling
                    nextBtn.classList.remove('pulse-next');
                    nextBtn.classList.add('completed-next');
                }
                
                setTimeout(ensureButtonsVisible, 10);
            });

            // Also update the prevBtn click handler to restore pulsing if going back from last page
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    // If we're moving back from the last page, restore the pulse
                    if (currentPage === totalPages) {
                        instructionContainer.classList.remove('completed');
                        instructionContainer.classList.add('pulse');
                        
                        // Restore Next button pulsing
                        nextBtn.classList.remove('completed-next');
                        nextBtn.classList.add('pulse-next');
                    }
                    
                    currentPage--;
                    updateInstructionVisibility();
                }
                
                setTimeout(ensureButtonsVisible, 10);
            });

            // Initialize the visibility
            updateInstructionVisibility();

            // Function to adjust workspace scale based on available space
            function adjustWorkspaceScale() {
                const container = display_element.querySelector('.workspace-container');
                const goalContainer = display_element.querySelector('.jspsych-goal-display-container');
                const availableHeight = window.innerHeight - 
                    (display_element.querySelector('.instruction-text-container')?.offsetHeight || 0) - 
                    (display_element.querySelector('.instruction-nav-container')?.offsetHeight || 0) - 40;
                
                // Calculate workspace scale
                const containerWidth = container.offsetWidth;
                const containerHeight = container.offsetHeight;
                const widthScale = Math.min(1, window.innerWidth / (containerWidth + 40) * 0.9);
                const heightScale = Math.min(1, availableHeight / containerHeight * 0.9);
                const workspaceScale = Math.min(widthScale, heightScale);
                
                // Calculate goal display scale
                let goalScale = workspaceScale;
                if (goalContainer) {
                    const goalWidth = goalContainer.offsetWidth;
                    const goalHeight = goalContainer.offsetHeight;
                    const goalWidthScale = Math.min(1, window.innerWidth / (goalWidth + 40) * 0.9);
                    const goalHeightScale = Math.min(1, availableHeight / goalHeight * 0.9);
                    goalScale = Math.min(goalWidthScale, goalHeightScale, workspaceScale);
                }
                
                // Apply scales through CSS variables
                document.documentElement.style.setProperty('--workspace-scale', 
                    workspaceScale < 0.5 ? 0.5 : workspaceScale);
                document.documentElement.style.setProperty('--goal-display-scale', 
                    goalScale < 0.5 ? 0.5 : goalScale);
            }

            // Call initially and on window resize
            adjustWorkspaceScale();
            window.addEventListener('resize', adjustWorkspaceScale);

            // Function to ensure navigation buttons are visible
            function ensureButtonsVisible() {
                const navContainer = display_element.querySelector('.instruction-nav-container');
                const buttons = display_element.querySelectorAll('.instruction-btn');
                
                // Check if buttons are visible in the viewport
                const containerRect = navContainer.getBoundingClientRect();
                const isVisible = (
                    containerRect.top >= 0 &&
                    containerRect.left >= 0 &&
                    containerRect.bottom <= window.innerHeight &&
                    containerRect.right <= window.innerWidth
                );
                
                // If not fully visible, adjust the container
                if (!isVisible) {
                    // If we're at the bottom of the page, make the container sticky
                    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100) {
                        navContainer.style.position = 'sticky';
                    } else {
                        // Otherwise, make it fixed at the bottom
                        navContainer.style.position = 'fixed';
                        navContainer.style.bottom = '0';
                        navContainer.style.left = '0';
                    }
                    
                    // Add a highlight effect to make buttons more noticeable
                    buttons.forEach(btn => {
                        if (!btn.disabled) {
                            btn.classList.add('highlight');
                        }
                    });
                } else {
                    // Reset to default if visible
                    navContainer.style.position = 'sticky';
                    buttons.forEach(btn => btn.classList.remove('highlight'));
                }
            }

            // Call this function on scroll and resize
            window.addEventListener('scroll', ensureButtonsVisible);
            window.addEventListener('resize', ensureButtonsVisible);

            // Initial call
            ensureButtonsVisible();
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

// Add getPatternFill at the top level
function getPatternFill(texture, shade, uniqueId) {
    const shadeName = shade.split('-')[1];
    return texture === 'striped' ? `url(#striped-pattern-${shadeName}-${uniqueId})` : 
           texture === 'dotted' ? `url(#dotted-pattern-${shadeName}-${uniqueId})` : 
           'currentColor';
}

// Update renderWorkspaceShape to use patterns
function renderWorkspaceShape(shapeData, uniqueId) {
    const pathData = {
        'goal-star': "M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z",
        'goal-cloud': "M35,45 a20,20 1 0,0 0,40 h30 a20,20 1 0,0 0,-40 a10,10 1 0,0 -10,-10 a15,15 1 0,0 -20,10 z"
    };

    if (shapeData.type === 'goal-square') {
        return `
            <g class="shape-group ${shapeData.shadeClass}" style="fill: none;">
                <rect x="20" y="20" width="60" height="60" rx="10" 
                    class="${shapeData.type} ${shapeData.textureClass}"
                    style="fill: ${getPatternFill(shapeData.textureClass, shapeData.shadeClass, uniqueId)}"/>
                <rect x="20" y="20" width="60" height="60" rx="10" 
                    class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
            </g>`;
    } else {
        return `
            <g class="shape-group ${shapeData.shadeClass}" style="fill: none;">
                <path d="${pathData[shapeData.type]}" 
                    class="${shapeData.type} ${shapeData.textureClass}"
                    style="fill: ${getPatternFill(shapeData.textureClass, shapeData.shadeClass, uniqueId)}"/>
                <path d="${pathData[shapeData.type]}" 
                    class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
            </g>`;
    }
}

// Add this function back before the shade interaction code
function getIncrementalShade(currentShade, targetShade) {
    const shadeOrder = ['shade-light', 'shade-medium', 'shade-dark'];
    const currentIndex = shadeOrder.indexOf(currentShade);
    const targetIndex = shadeOrder.indexOf(targetShade);
    
    if (currentIndex < targetIndex) {
        return shadeOrder[currentIndex + 1];
    } else if (currentIndex > targetIndex) {
        return shadeOrder[currentIndex - 1];
    }
    return currentShade;
}
