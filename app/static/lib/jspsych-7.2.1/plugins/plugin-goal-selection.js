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
            // Add interaction history array
            const interactionHistory = [];
            
            // Create HTML
            display_element.innerHTML = `
                ${trial.preamble ? `<div class="jspsych-goal-selection-preamble">${trial.preamble}</div>` : ''}
                <div class="jspsych-goal-selection-container">
                    <div class="shapes-container">
                        <!-- Square Shape 1 -->
                        <div class="source-wrapper">
                            <svg class="source-container" viewBox="0 0 100 100">
                                <rect x="20" y="20" width="60" height="60" rx="10" class="goal-square"/>
                            </svg>
                            <div class="drag-instruction">Drag to create a copy</div>
                        </div>
                        <!-- Square Shape 2 -->
                        <div class="source-wrapper">
                            <svg class="source-container" viewBox="0 0 100 100">
                                <rect x="20" y="20" width="60" height="60" rx="10" class="goal-square"/>
                            </svg>
                            <div class="drag-instruction">Drag to create a copy</div>
                        </div>
                        <!-- Square Shape 3 -->
                        <div class="source-wrapper">
                            <svg class="source-container" viewBox="0 0 100 100">
                                <rect x="20" y="20" width="60" height="60" rx="10" class="goal-square"/>
                            </svg>
                            <div class="drag-instruction">Drag to create a copy</div>
                        </div>
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
                    </div>
                    <button class="submit-btn" disabled>Submit Selection</button>
                </div>
            `;

            const sourceStar = display_element.querySelector('.goal-star');
            const sourceSquare = display_element.querySelector('.goal-square');
            const sourceCircle = display_element.querySelector('.goal-circle');
            const submitBtn = display_element.querySelector('.submit-btn');
            let draggedElement = null;
            let offsetX, offsetY;

            // Helper function to create draggable shape
            function createDraggableShape(shape, shade, texture, e) {
                const clone = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                clone.setAttribute('width', '80');
                clone.setAttribute('height', '80');
                clone.setAttribute('viewBox', '0 0 100 100');

                let shapeClass = `${shape} ${shade} ${texture}`;
                clone.innerHTML = `<rect x="20" y="20" width="60" height="60" rx="10" class="${shapeClass} dragging"/>`;
                
                const container = document.createElement('div');
                container.className = 'dragged-shape-container dragging';
                container.appendChild(clone);
                
                container.dataset.shapeId = Date.now().toString();
                container.dataset.shapeType = shape;
                container.dataset.shapeClass = shapeClass;
                
                return container;
            }

            // Add event listeners for all shapes
            const shapeElements = display_element.querySelectorAll('.source-container');
            shapeElements.forEach(shapeElement => {
                shapeElement.addEventListener('mousedown', (e) => {
                    const shapeType = shapeElement.querySelector('rect').classList[0];
                    const shade = shapeElement.querySelector('rect').classList[1];
                    const texture = shapeElement.querySelector('rect').classList[2];
                    draggedElement = createDraggableShape(shapeType, shade, texture, e);
                    const rect = shapeElement.getBoundingClientRect();
                    offsetX = e.clientX - rect.left;
                    offsetY = e.clientY - rect.top;
                    
                    draggedElement.style.position = 'fixed';
                    draggedElement.style.left = (e.clientX - offsetX) + 'px';
                    draggedElement.style.top = (e.clientY - offsetY) + 'px';
                    
                    document.body.appendChild(draggedElement);
                    
                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
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

                                // Record drop interaction
                                interactionHistory.push({
                                    action: 'drop',
                                    shapeId: draggedElement.dataset.shapeId,
                                    shapeType: draggedElement.dataset.shapeType,
                                    shapeClass: draggedElement.dataset.shapeClass,
                                    position: area.dataset.position,
                                    timestamp: Date.now()
                                });
                            }
                        }
                    });

                    if (!droppedInArea) {
                        // Record failed drop attempt
                        interactionHistory.push({
                            action: 'failed_drop',
                            shapeId: draggedElement.dataset.shapeId,
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

            function updateSubmitButton() {
                const targetAreas = display_element.querySelectorAll('.target-area');
                const hasSelections = Array.from(targetAreas).some(area => area.children.length > 1); // Account for instruction div
                submitBtn.disabled = !hasSelections;
                if (hasSelections) {
                    submitBtn.classList.add('active');
                } else {
                    submitBtn.classList.remove('active');
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

            // Update submit handler to include interaction history
            submitBtn.addEventListener('click', () => {
                // Get final state of selections
                const finalSelections = Array.from(display_element.querySelectorAll('.target-area'))
                    .map(area => ({
                        position: area.dataset.position,
                        shape: area.children.length > 1 ? {
                            type: area.querySelector('.dragged-shape-container').dataset.shapeType,
                            id: area.querySelector('.dragged-shape-container').dataset.shapeId
                        } : null
                    }));

                this.jsPsych.finishTrial({
                    rt: Math.round(performance.now() - startTime),
                    interactions: interactionHistory,
                    final_selections: finalSelections
                });
            });
        }
    }
    GoalSelectionPlugin.info = info;
  
    return GoalSelectionPlugin;
  
  })(jsPsychModule);
  