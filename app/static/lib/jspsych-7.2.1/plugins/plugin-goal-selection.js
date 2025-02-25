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

        // Add the helper function as a method of the class
        getItemProperties(container, sourcePosition) {
            const shapeGroup = container.querySelector('.shape-group');
            const shapeElement = container.querySelector('path, rect');
            
            const item = {
                type: container.dataset.shapeType,
                source_position: parseInt(sourcePosition),
                shade: 'unknown-shade',
                texture: 'unknown-texture'
            };

            if (!shapeGroup) {
                console.error('Missing shape-group element in container:', container);
            } else {
                const shade = Array.from(shapeGroup.classList).find(cls => cls.startsWith('shade-'));
                if (!shade) {
                    console.error('No shade class found in shape-group:', shapeGroup.classList);
                } else {
                    item.shade = shade;
                }
            }

            if (!shapeElement) {
                console.error('Missing shape element (path/rect) in container:', container);
            } else {
                const texture = Array.from(shapeElement.classList).find(cls => ['plain', 'striped', 'dotted'].includes(cls));
                if (!texture) {
                    console.error('No texture class found in shape element:', shapeElement.classList);
                } else {
                    item.texture = texture;
                }
            }

            return item;
        }

        // Add a method to check for duplicate goals
        checkForDuplicateGoal(selections) {
            // Get previous goals from jsPsych data and convert to array
            const previousTrials = this.jsPsych.data.get().filter({trial_type: 'goal-selection'}).values();
            
            // Format current goal for comparison
            const currentGoal = selections
                .filter(sel => sel.position && sel.item)
                .map(sel => ({
                    type: sel.item.type,
                    shade: sel.item.shade,
                    texture: sel.item.texture
                }))
                .sort((a, b) => // Sort to ensure consistent comparison
                    `${a.type}${a.shade}${a.texture}`.localeCompare(`${b.type}${b.shade}${b.texture}`)
                );
                
            // Check against previous goals
            return previousTrials.some(trial => {
                if (!trial.final_goal) return false;
                
                const previousGoal = trial.final_goal
                    .filter(sel => sel.position && sel.item)
                    .map(sel => ({
                        type: sel.item.type,
                        shade: sel.item.shade,
                        texture: sel.item.texture
                    }))
                    .sort((a, b) => 
                        `${a.type}${a.shade}${a.texture}`.localeCompare(`${b.type}${b.shade}${b.texture}`)
                    );
                    
                return JSON.stringify(currentGoal) === JSON.stringify(previousGoal);
            });
        }

        trial(display_element, trial) {
            // Generate unique ID for this trial's patterns
            const uniqueId = Date.now();
            
            // Create patterns for each color shade
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
            
            // When setting fill on a shape, add debug logging
            const debugFill = (texture, shade) => {
                const fill = texture === 'striped' ? `url(#striped-pattern-${shade.split('-')[1]}-${uniqueId})` : 
                            texture === 'dotted' ? `url(#dotted-pattern-${shade.split('-')[1]}-${uniqueId})` : 
                            'currentColor';
                console.log('Setting fill:', {texture, shade, fill});
                return fill;
            };

            const startTime = performance.now();
            const plugin = this;  // Store reference to plugin instance
            
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
            
            // Store the randomized order with position indices and consistent item format
            const randomizedOrder = shuffledConfigs.map((config, index) => ({
                position: index,
                item: {
                    type: config.shape,
                    shade: config.shade,
                    texture: config.texture,
                    source_position: index
                }
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
                                        ? `<g class="shape-group ${config.shade}" style="fill: none;">
                                            <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                                                class="goal-star ${config.texture}"
                                                style="fill: ${debugFill(config.texture, config.shade)}"/>
                                            <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                                                class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                                           </g>`
                                        : config.shape === 'goal-cloud'
                                            ? `<g class="shape-group ${config.shade}" style="fill: none;">
                                                <path d="M35,45 a20,20 1 0,0 0,40 h30 a20,20 1 0,0 0,-40 a10,10 1 0,0 -10,-10 a15,15 1 0,0 -20,10 z" 
                                                    class="goal-cloud ${config.texture}"
                                                    style="fill: ${debugFill(config.texture, config.shade)}"/>
                                                <path d="M35,45 a20,20 1 0,0 0,40 h30 a20,20 1 0,0 0,-40 a10,10 1 0,0 -10,-10 a15,15 1 0,0 -20,10 z" 
                                                    class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                                               </g>`
                                            : `<g class="shape-group ${config.shade}" style="fill: none;">
                                                <rect x="20" y="20" width="60" height="60" rx="10" 
                                                    class="goal-square ${config.texture}"
                                                    style="fill: ${debugFill(config.texture, config.shade)}"/>
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

            // Add interaction history array with more detailed tracking
            const interactionHistory = [{
                action: 'initial_configuration',
                timestamp: Date.now(),
                item_array: randomizedOrder
            }];

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
                
                // Update the fill attribute in the shape creation
                if (shape === 'goal-star') {
                    clone.innerHTML = `
                        <g class="shape-group ${shade}" style="fill: none;">
                            <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                                class="goal-star ${texture} dragging"
                                style="fill: ${debugFill(texture, shade)}"/>
                            <path d="M50 10 L58 35 L85 35 L63 50 L72 75 L50 60 L28 75 L37 50 L15 35 L42 35 Z" 
                                class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                        </g>`;
                } else if (shape === 'goal-cloud') {
                    clone.innerHTML = `
                        <g class="shape-group ${shade}" style="fill: none;">
                            <path d="M35,45 a20,20 1 0,0 0,40 h30 a20,20 1 0,0 0,-40 a10,10 1 0,0 -10,-10 a15,15 1 0,0 -20,10 z" 
                                class="goal-cloud ${texture} dragging"
                                style="fill: ${debugFill(texture, shade)}"/>
                            <path d="M35,45 a20,20 1 0,0 0,40 h30 a20,20 1 0,0 0,-40 a10,10 1 0,0 -10,-10 a15,15 1 0,0 -20,10 z" 
                                class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                        </g>`;
                } else {
                    clone.innerHTML = `
                        <g class="shape-group ${shade}" style="fill: none;">
                            <rect x="20" y="20" width="60" height="60" rx="10" 
                                class="goal-square ${texture} dragging"
                                style="fill: ${debugFill(texture, shade)}"/>
                            <rect x="20" y="20" width="60" height="60" rx="10" 
                                class="shape-outline" fill="none" stroke="currentColor" stroke-width="2"/>
                        </g>`;
                }
                
                const container = document.createElement('div');
                container.className = 'dragged-shape-container dragging';
                container.appendChild(clone);
                
                container.dataset.shapeId = Date.now().toString();
                container.dataset.shapeType = shape;
                container.dataset.shapeClass = `${shape} ${shade} ${texture}`;
                
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
                        timestamp: Date.now(),
                        source_position: index,
                        item: {
                            type: shapeType,
                            shade: shadeClass,
                            texture: textureClass,
                            source_position: index
                        }
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
                            
                            if (area.children.length <= 1) {
                                draggedElement.classList.remove('dragging');
                                draggedElement.style.position = 'static';
                                area.appendChild(draggedElement);
                                draggedElement.classList.add('dropped');
                                droppedInArea = true;

                                interactionHistory.push({
                                    action: 'drop',
                                    timestamp: Date.now(),
                                    source_position: parseInt(draggedElement.dataset.sourcePosition),
                                    target_position: area.dataset.position,
                                    item: plugin.getItemProperties(draggedElement, draggedElement.dataset.sourcePosition)
                                });
                            }
                        }
                    });

                    if (!droppedInArea) {
                        interactionHistory.push({
                            action: 'failed_drop',
                            timestamp: Date.now(),
                            source_position: parseInt(draggedElement.dataset.sourcePosition),
                            item: plugin.getItemProperties(draggedElement, draggedElement.dataset.sourcePosition)
                        });
                        draggedElement.remove();
                    }
                    
                    updateSubmitButton();
                    draggedElement = null;
                }
                
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            // Update the updateSubmitButton function
            function updateSubmitButton() {
                const targetAreas = display_element.querySelectorAll('.target-area');
                const filledAreas = Array.from(targetAreas)
                    .filter(area => area.children.length > 1).length;
                
                // Get current selections
                const selections = Array.from(targetAreas).map(area => ({
                    position: area.dataset.position,
                    item: area.children.length > 1 ? plugin.getItemProperties(
                        area.querySelector('.dragged-shape-container'),
                        area.querySelector('.dragged-shape-container').dataset.sourcePosition
                    ) : null
                }));

                // Check both conditions: 3 shapes and not duplicate
                const isDuplicate = filledAreas === 3 && plugin.checkForDuplicateGoal(selections);
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

            // Update click handler for removing shapes
            display_element.addEventListener('click', (e) => {
                const container = e.target.closest('.dragged-shape-container');
                if (container && !container.classList.contains('dragging')) {
                    interactionHistory.push({
                        action: 'remove',
                        timestamp: Date.now(),
                        target_position: container.parentElement.dataset.position,
                        item: plugin.getItemProperties(container, container.dataset.sourcePosition)
                    });

                    container.classList.add('removing');
                    setTimeout(() => {
                        container.remove();
                        updateSubmitButton();
                    }, 300);
                }
            });

            // Update submit handler
            submitBtn.addEventListener('click', () => {
                const finalSelections = Array.from(display_element.querySelectorAll('.target-area'))
                    .map(area => {
                        const container = area.querySelector('.dragged-shape-container');
                        if (!container) {
                            return {
                                position: area.dataset.position,
                                item: null
                            };
                        }
                        
                        const shapeElement = container.querySelector('path, rect');
                        const shapeGroup = container.querySelector('.shape-group');
                        
                        return {
                            position: area.dataset.position,
                            item: {
                                type: Array.from(shapeElement.classList).find(cls => cls.startsWith('goal-')),
                                shade: Array.from(shapeGroup.classList).find(cls => cls.startsWith('shade-')),
                                texture: Array.from(shapeElement.classList).find(cls => ['plain', 'striped', 'dotted'].includes(cls))
                            }
                        };
                    });

                console.log('Final data:', {
                    trial_type: "goal-selection",
                    rt: Math.round(performance.now() - startTime),
                    item_array: randomizedOrder,
                    selection_actions: interactionHistory,
                    final_goal: finalSelections
                });

                plugin.jsPsych.finishTrial({
                    trial_type: "goal-selection",
                    rt: Math.round(performance.now() - startTime),
                    item_array: randomizedOrder,
                    selection_actions: interactionHistory,
                    final_goal: finalSelections
                });
            });
        }
    }
    GoalSelectionPlugin.info = info;
  
    return GoalSelectionPlugin;
  
  })(jsPsychModule);
  