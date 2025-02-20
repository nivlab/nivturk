var jsPsychGoalSelection = (function (jspsych) {
    'use strict';
  
    const info = {
        name: "goal-selection",
        parameters: {
            /** Array containing goals that should be shown on the page. */
            goals: {
                type: jspsych.ParameterType.COMPLEX,
                array: true,
                pretty_name: "Goals",
                default: undefined
            },
            /** HTML-formatted string to display at top of the page. */
            preamble: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Preamble",
                default: null
            }
        }
    };
    /**
     * **goal-selection**
     *
     * jsPsych plugin for goal selection interface
     *
     */
    class GoalSelectionPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }
        trial(display_element, trial) {
            const startTime = performance.now();
            
            // Create array of all shape configurations
            const shapeConfigs = [
                // Squares
                { shape: 'goal-square', shade: 'shade-light', texture: 'plain' },
                { shape: 'goal-square', shade: 'shade-medium', texture: 'plain' },
                { shape: 'goal-square', shade: 'shade-dark', texture: 'plain' },
                { shape: 'goal-square', shade: 'shade-light', texture: 'striped' },
                { shape: 'goal-square', shade: 'shade-medium', texture: 'striped' },
                { shape: 'goal-square', shade: 'shade-dark', texture: 'striped' },
                { shape: 'goal-square', shade: 'shade-light', texture: 'dotted' },
                { shape: 'goal-square', shade: 'shade-medium', texture: 'dotted' },
                { shape: 'goal-square', shade: 'shade-dark', texture: 'dotted' },
                // Clouds (replacing Circles)
                { shape: 'goal-cloud', shade: 'shade-light', texture: 'plain' },
                { shape: 'goal-cloud', shade: 'shade-medium', texture: 'plain' },
                { shape: 'goal-cloud', shade: 'shade-dark', texture: 'plain' },
                { shape: 'goal-cloud', shade: 'shade-light', texture: 'striped' },
                { shape: 'goal-cloud', shade: 'shade-medium', texture: 'striped' },
                { shape: 'goal-cloud', shade: 'shade-dark', texture: 'striped' },
                { shape: 'goal-cloud', shade: 'shade-light', texture: 'dotted' },
                { shape: 'goal-cloud', shade: 'shade-medium', texture: 'dotted' },
                { shape: 'goal-cloud', shade: 'shade-dark', texture: 'dotted' },
                // Stars
                { shape: 'goal-star', shade: 'shade-light', texture: 'plain' },
                { shape: 'goal-star', shade: 'shade-medium', texture: 'plain' },
                { shape: 'goal-star', shade: 'shade-dark', texture: 'plain' },
                { shape: 'goal-star', shade: 'shade-light', texture: 'striped' },
                { shape: 'goal-star', shade: 'shade-medium', texture: 'striped' },
                { shape: 'goal-star', shade: 'shade-dark', texture: 'striped' },
                { shape: 'goal-star', shade: 'shade-light', texture: 'dotted' },
                { shape: 'goal-star', shade: 'shade-medium', texture: 'dotted' },
                { shape: 'goal-star', shade: 'shade-dark', texture: 'dotted' }
            ];

            // Shuffle the configurations
            const shuffledConfigs = this.jsPsych.randomization.shuffle(shapeConfigs);
            
            // Store the randomized order with position indices
            const randomizedOrder = shuffledConfigs.map((config, index) => ({
                position: index,
                shape: config.shape,
                shade: config.shade,
                texture: config.texture
            }));

            // Create HTML with shuffled shapes
            display_element.innerHTML = `
                ${trial.preamble ? `<div class="jspsych-goal-selection-preamble">${trial.preamble}</div>` : ''}
                <div class="jspsych-goal-selection-container">
                    <div class="drag-instruction">Drag shapes to create a goal configuration. You can reuse shapes.</div>
                    <div class="shapes-container">
                        ${shuffledConfigs.map(config => `
                            <div class="source-wrapper">
                                <svg class="source-container" viewBox="0 0 100 100">
                                    ${config.shape === 'goal-star' 
                                        ? `<g class="shape-group ${config.shade}">
                                            <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                                                class="goal-star ${config.texture}"/>
                                            <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                                                class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                                           </g>`
                                        : config.shape === 'goal-cloud'
                                            ? `<g class="shape-group ${config.shade}">
                                                <path d="M35,45 a20,20 1 0,0 0,40 h30 a20,20 1 0,0 0,-40 a10,10 1 0,0 -10,-10 a15,15 1 0,0 -20,10 z" 
                                                    class="goal-cloud ${config.texture}"/>
                                                <path d="M35,45 a20,20 1 0,0 0,40 h30 a20,20 1 0,0 0,-40 a10,10 1 0,0 -10,-10 a15,15 1 0,0 -20,10 z" 
                                                    class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                                               </g>`
                                            : `<g class="shape-group ${config.shade}">
                                                <rect x="20" y="20" width="60" height="60" rx="10" 
                                                    class="goal-square ${config.texture}"/>
                                                <rect x="20" y="20" width="60" height="60" rx="10" 
                                                    class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                                               </g>`
                                    }
                                </svg>
                            </div>
                        `).join('')}
                    </div>
                    <div class="target-areas-container">
                        <div class="target-area-row">
                            <div class="target-area" data-position="top">
                                <div class="target-instruction">Drop here</div>
                            </div>
                        </div>
                        <div class="target-area-row">
                            <div class="target-area" data-position="bottom-left">
                                <div class="target-instruction">Drop here</div>
                            </div>
                            <div class="target-area" data-position="bottom-right">
                                <div class="target-instruction">Drop here</div>
                            </div>
                        </div>
                        <div class="remove-instruction">*Click a shape to remove it</div>
                    </div>
                    <button class="submit-btn" disabled>Submit Selection</button>
                </div>
            `;

            // Add interaction history array
            const interactionHistory = [];

            // Store initial configuration in interaction history
            interactionHistory.push({
                action: 'initial_configuration',
                randomized_order: randomizedOrder,
                timestamp: Date.now()
            });

            const sourceStar = display_element.querySelector('.goal-star');
            const sourceSquare = display_element.querySelector('.goal-square');
            const sourceCloud = display_element.querySelector('.goal-cloud');
            const submitBtn = display_element.querySelector('.submit-btn');
            let draggedElement = null;
            let offsetX, offsetY;

            // Helper function to create draggable shape
            function createDraggableShape(shape, shade, texture, e) {
                const clone = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                clone.setAttribute('width', '80');
                clone.setAttribute('height', '80');
                clone.setAttribute('viewBox', '0 0 100 100');
                
                if (shape === 'goal-star') {
                    clone.innerHTML = `
                        <g class="shape-group ${shade}">
                            <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                                class="goal-star ${texture} dragging"/>
                            <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                                class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                        </g>`;
                } else if (shape === 'goal-cloud') {
                    clone.innerHTML = `
                        <g class="shape-group ${shade}">
                            <path d="M35,45 a20,20 1 0,0 0,40 h30 a20,20 1 0,0 0,-40 a10,10 1 0,0 -10,-10 a15,15 1 0,0 -20,10 z" 
                                class="goal-cloud ${texture} dragging"/>
                            <path d="M35,45 a20,20 1 0,0 0,40 h30 a20,20 1 0,0 0,-40 a10,10 1 0,0 -10,-10 a15,15 1 0,0 -20,10 z" 
                                class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                        </g>`;
                } else {
                    clone.innerHTML = `
                        <g class="shape-group ${shade}">
                            <rect x="20" y="20" width="60" height="60" rx="10" 
                                class="goal-square ${texture} dragging"/>
                            <rect x="20" y="20" width="60" height="60" rx="10" 
                                class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                        </g>`;
                }
                
                const container = document.createElement('div');
                container.className = 'dragged-shape-container dragging';
                container.appendChild(clone);
                
                container.dataset.shapeId = Date.now().toString();
                container.dataset.shapeType = shape;
                container.dataset.shapeClass = `${shape} ${shade} ${texture}`; // Store full class info
                
                return container;
            }

            // Event listener code for shape dragging
            const shapeElements = display_element.querySelectorAll('.source-container');
            shapeElements.forEach((shapeElement, index) => {
                shapeElement.addEventListener('mousedown', (e) => {
                    // Find the shape element (either rect or circle) within the source container
                    const shape = shapeElement.querySelector('.goal-square, .goal-cloud, .goal-star');
                    if (!shape) return;

                    const shapeType = shape.tagName.toLowerCase() === 'path' 
                        ? (shape.classList.contains('goal-star') ? 'goal-star' : 'goal-cloud')
                        : 'goal-square';
                    const shadeClass = shape.closest('.shape-group').classList[1];  // Get shade from group
                    const textureClass = shape.classList[1]; // Get texture class
                    
                    // Add source position to interaction tracking
                    const sourceConfig = randomizedOrder[index];
                    
                    draggedElement = createDraggableShape(shapeType, shadeClass, textureClass, e);
                    draggedElement.dataset.sourcePosition = index;
                    
                    const rect = shapeElement.getBoundingClientRect();
                    offsetX = e.clientX - rect.left;
                    offsetY = e.clientY - rect.top;
                    
                    draggedElement.style.position = 'fixed';
                    draggedElement.style.left = (e.clientX - offsetX) + 'px';
                    draggedElement.style.top = (e.clientY - offsetY) + 'px';
                    
                    document.body.appendChild(draggedElement);
                    
                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);

                    // Record drag start in interaction history
                    interactionHistory.push({
                        action: 'drag_start',
                        shapeId: draggedElement.dataset.shapeId,
                        sourcePosition: index,
                        shapeConfig: sourceConfig,
                        timestamp: Date.now()
                    });
                });
            });

            function onMouseMove(e) {
                if (draggedElement) {
                    draggedElement.style.left = (e.clientX - offsetX) + 'px';
                    draggedElement.style.top = (e.clientY - offsetY) + 'px';
                }
            }

            function onMouseUp(e) {
                if (draggedElement) {
                    const targetAreas = display_element.querySelectorAll('.target-area');
                    let droppedInArea = false;

                    targetAreas.forEach(area => {
                        const rect = area.getBoundingClientRect();
                        if (e.clientX >= rect.left && e.clientX <= rect.right &&
                            e.clientY >= rect.top && e.clientY <= rect.bottom) {
                            
                            // Only allow drop if the area has less than 2 shapes (1 is the instruction div)
                            if (area.children.length <= 1) {
                                draggedElement.classList.remove('dragging');
                                draggedElement.style.position = 'static';
                                area.appendChild(draggedElement);
                                draggedElement.classList.add('dropped');
                                droppedInArea = true;

                                // Record drop with source position
                                interactionHistory.push({
                                    action: 'drop',
                                    shapeId: draggedElement.dataset.shapeId,
                                    sourcePosition: parseInt(draggedElement.dataset.sourcePosition),
                                    shapeType: draggedElement.dataset.shapeType,
                                    shapeClass: draggedElement.dataset.shapeClass,
                                    targetPosition: area.dataset.position,
                                    timestamp: Date.now()
                                });
                            }
                        }
                    });

                    if (!droppedInArea) {
                        interactionHistory.push({
                            action: 'failed_drop',
                            shapeId: draggedElement.dataset.shapeId,
                            sourcePosition: parseInt(draggedElement.dataset.sourcePosition),
                            shapeType: draggedElement.dataset.shapeType,
                            shapeClass: draggedElement.dataset.shapeClass,
                            timestamp: Date.now()
                        });
                        draggedElement.remove();
                    }
                    
                    updateSubmitButton();
                    draggedElement = null;
                }
                
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            // Add this function to check for duplicates
            function checkForDuplicateGoal(selections) {
                // Format current selections
                const currentGoal = selections
                    .filter(sel => sel.shape)
                    .map(sel => {
                        const shapeType = sel.shape.type;
                        const shadeClass = sel.shape.sourcePosition >= 0 ? 
                            Array.from(document.querySelectorAll('.source-container')[sel.shape.sourcePosition]
                                .querySelector('.shape-group').classList)
                                .find(cls => cls.startsWith('shade-')) : '';
                        const textureClass = sel.shape.sourcePosition >= 0 ?
                            Array.from(document.querySelectorAll('.source-container')[sel.shape.sourcePosition]
                                .querySelector('path, rect').classList)
                                .find(cls => ['plain', 'striped', 'dotted'].includes(cls)) : '';
                        
                        return {
                            type: shapeType,
                            shapeClass: `${shapeType} ${shadeClass} ${textureClass}`
                        };
                    });

                const goalString = JSON.stringify(currentGoal.sort((a, b) => 
                    a.shapeClass.localeCompare(b.shapeClass)));
                
                return window.previousGoals && window.previousGoals.includes(goalString);
            }

            // Modify the updateSubmitButton function
            function updateSubmitButton() {
                const targetAreas = display_element.querySelectorAll('.target-area');
                const filledAreas = Array.from(targetAreas)
                    .filter(area => area.children.length > 1).length;
                
                // Get current selections
                const selections = Array.from(targetAreas).map(area => ({
                    shape: area.children.length > 1 ? {
                        type: area.querySelector('.dragged-shape-container').dataset.shapeType,
                        sourcePosition: parseInt(area.querySelector('.dragged-shape-container').dataset.sourcePosition)
                    } : null
                }));

                // Check both conditions: 3 shapes and not duplicate
                const isDuplicate = filledAreas === 3 && checkForDuplicateGoal(selections);
                submitBtn.disabled = filledAreas !== 3 || isDuplicate;
                
                if (filledAreas === 3) {
                    if (isDuplicate) {
                        submitBtn.classList.remove('active');
                        submitBtn.setAttribute('data-error', 'This goal has already been selected');
                    } else {
                        submitBtn.classList.add('active');
                        submitBtn.removeAttribute('data-error');
                    }
                } else {
                    submitBtn.classList.remove('active');
                    submitBtn.removeAttribute('data-error');
                }
            }

            // Add click handler for removing shapes
            display_element.addEventListener('click', (e) => {
                const container = e.target.closest('.dragged-shape-container');
                if (container && !container.classList.contains('dragging')) {
                    // Record removal interaction
                    interactionHistory.push({
                        action: 'remove',
                        shapeId: container.dataset.shapeId,
                        shapeType: container.dataset.shapeType,
                        shapeClass: container.dataset.shapeClass,
                        position: container.parentElement.dataset.position,
                        timestamp: Date.now()
                    });

                    container.classList.add('removing');
                    setTimeout(() => {
                        container.remove();
                        updateSubmitButton();
                    }, 300);
                }
            });

            // Update submit handler to include the randomization information
            submitBtn.addEventListener('click', () => {
                const finalSelections = Array.from(display_element.querySelectorAll('.target-area'))
                    .map(area => ({
                        position: area.dataset.position,
                        shape: area.children.length > 1 ? {
                            type: area.querySelector('.dragged-shape-container').dataset.shapeType,
                            id: area.querySelector('.dragged-shape-container').dataset.shapeId,
                            sourcePosition: parseInt(area.querySelector('.dragged-shape-container').dataset.sourcePosition)
                        } : null
                    }));

                this.jsPsych.finishTrial({
                    rt: Math.round(performance.now() - startTime),
                    interactions: interactionHistory,
                    final_selections: finalSelections,
                    randomized_order: randomizedOrder
                });
            });
        }
    }
    GoalSelectionPlugin.info = info;
  
    return GoalSelectionPlugin;
  
  })(jsPsychModule);
  