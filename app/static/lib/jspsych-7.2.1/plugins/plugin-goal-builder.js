var jsPsychBuilder = (function (jspsych) {
    'use strict';
    
    const info = {
        name: "build-goal",
        parameters: {
            instruction: {
                type: jspsych.ParameterType.STRING,
                default: "Drag and drop shapes to create your goal.",
                description: "Instructions displayed above the task."
            },
            participant_id: {
                type: jspsych.ParameterType.STRING,
                default: null,
                description: "Participant ID"
            }
        }
    };

    /**
   * **goal builder**
   *
   * jsPsych plugin for gathering responses to questions on a likert scale
   *
   * @author J. Branson Byers
   */

    class BuilderPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
            this.startTime = null;
            this.menuLayout = [];  // Store the 3x9 menu layout
            this.actionCount = 0;  // Track number of drag/drop actions
        }
        
        // Move generateShapesHTMLFromMenu out of trial method
        generateShapesHTMLFromMenu(menuLayout) {
            return menuLayout.flat().map(({shape, texture, shade, id}) => `
                <div id="${id}" 
                     class="shape ${shape} ${texture}" 
                     style="color: ${this.getShadeColor(shade)}; 
                            ${shape === 'triangle' ? 'margin: 8px;' : ''}" 
                     data-shape="${shape}" 
                     data-texture="${texture}" 
                     data-shade="${shade}">
                </div>`
            ).join('');
        }

        trial(display_element, trial) {
            this.startTime = Date.now();
            
            // Generate menu layout first
            this.menuLayout = this.getMenuLayout();
            
            // Create the HTML using the same shuffled order
            display_element.innerHTML = `
                <div class="jspsych-content-wrapper">
                    <div class="jspsych-content">
                        <h3 class="jspsych-builder-instruction">${trial.instruction}</h3>
                        
                        <!-- Shape selection grid -->
                        <div class="shapes-container">
                            ${this.generateShapesHTMLFromMenu(this.menuLayout)}
                        </div>

                        <!-- Goal slots structure -->
                        <div class="goal-slots-container">
                            <div class="goal-slot-row">
                                <div class="goal-slot" data-slot="1"></div>
                            </div>
                            <div class="goal-slot-row">
                                <div class="goal-slot" data-slot="2"></div>
                                <div class="goal-slot" data-slot="3"></div>
                            </div>
                        </div>

                        <button id="submit-btn" class="jspsych-btn" disabled>Submit</button>
                    </div>
                </div>
            `;

            // Save initial menu data
            const menuData = {
                participant_id: trial.participant_id,
                trial_type: 'goal_builder_menu',
                trial_index: this.jsPsych.getProgress().current_trial_global,
                goal_trial_number: Math.floor(this.jsPsych.getProgress().current_trial_global / 2),
                time_elapsed: this.jsPsych.getTotalTime(),
                timestamp: new Date().toISOString(),
                menu: this.menuLayout,
                action_number: 0,
                shape_selected: null,
                slot_filled: null,
                final_goal: null,
                completion_time: 0
            };
            
            console.log('Menu Layout Data:', JSON.stringify(menuData, null, 2));
            this.jsPsych.data.write(menuData);

            // CSS Styling
            const styles = document.createElement("style");
            styles.innerHTML = `
                /* Grid container */
                .shapes-container {
                    display: grid;
                    grid-template-columns: repeat(9, 70px);
                    grid-template-rows: repeat(3, 70px);
                    gap: 10px;
                    padding: 20px;
                    justify-content: center;
                    background-color: #f5f5f5;
                    border-radius: 8px;
                    margin: 0 auto;
                    overflow: hidden;
                }

                /* Base shape styles */
                .shape {
                    width: 60px;
                    height: 60px;
                    margin: auto;
                    cursor: grab;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* Square styles */
                .shape.square {
                    background-color: currentColor;
                }

                .shape.square.striped {
                    background-image: repeating-linear-gradient(
                        45deg,
                        currentColor 0px,
                        currentColor 10px,
                        rgba(255, 255, 255, 0.8) 10px,
                        rgba(255, 255, 255, 0.8) 20px
                    );
                }

                .shape.square.dotted {
                    background-image: radial-gradient(
                        circle at center,
                        rgba(255, 255, 255, 0.8) 3px,
                        transparent 3px
                    );
                    background-size: 10px 10px;
                    background-color: currentColor;
                }

                /* Circle styles */
                .shape.circle {
                    border-radius: 50%;
                    background-color: currentColor;
                }

                .shape.circle.striped {
                    background-image: repeating-linear-gradient(
                        45deg,
                        currentColor 0px,
                        currentColor 10px,
                        rgba(255, 255, 255, 0.8) 10px,
                        rgba(255, 255, 255, 0.8) 20px
                    );
                }

                .shape.circle.dotted {
                    background-image: radial-gradient(
                        circle at center,
                        rgba(255, 255, 255, 0.8) 3px,
                        transparent 3px
                    );
                    background-size: 10px 10px;
                }

                /* Triangle styles */
                .shape.triangle {
                    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
                    background-color: currentColor;
                    transform: scale(0.9);
                }

                .shape.triangle.striped {
                    background-image: repeating-linear-gradient(
                        45deg,
                        currentColor 0px,
                        currentColor 10px,
                        rgba(255, 255, 255, 0.8) 10px,
                        rgba(255, 255, 255, 0.8) 20px
                    );
                }

                .shape.triangle.dotted {
                    background-image: radial-gradient(
                        circle at center,
                        rgba(255, 255, 255, 0.8) 3px,
                        transparent 3px
                    );
                    background-size: 10px 10px;
                }

                .goal-slots-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-top: 30px;
                    margin-bottom: 20px;
                }

                .goal-slot-row {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin: 10px 0;
                }

                .goal-slot {
                    width: 70px;
                    height: 70px;
                    border: 2px dashed #999;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #fff;
                }

                .jspsych-builder-instruction {
                    margin-bottom: 20px;
                    text-align: center;
                }

                #submit-btn {
                    display: block;
                    margin: 20px auto;
                    padding: 10px 20px;
                }
            `;
            document.head.appendChild(styles);

            // Drag-and-Drop Logic
            const shapes = display_element.querySelectorAll(".shape");
            const slots = display_element.querySelectorAll(".goal-slot");
            let goal = [null, null, null];

            shapes.forEach((shape) => {
                shape.draggable = true;

                shape.addEventListener("dragstart", (event) => {
                    event.dataTransfer.setData("shape-id", event.target.id);
                    event.dataTransfer.setData("shape-data", JSON.stringify({
                        shape: event.target.dataset.shape,
                        texture: event.target.dataset.texture,
                        shade: event.target.dataset.shade
                    }));

                    // Create canvas drag image for all shapes
                    const canvas = document.createElement('canvas');
                    canvas.width = 80;
                    canvas.height = 80;
                    
                    // Hide the canvas but keep it in the document
                    canvas.style.position = 'absolute';
                    canvas.style.left = '-1000px';
                    canvas.style.top = '-1000px';
                    document.body.appendChild(canvas);
                    
                    const ctx = canvas.getContext('2d');
                    ctx.translate(40, 40);
                    
                    // Update the shape drawing code in both dragstart handlers
                    if (event.target.dataset.shape === 'triangle') {
                        // Draw star
                        ctx.beginPath();
                        const spikes = 5;
                        const outerRadius = 30;
                        const innerRadius = 15;
                        
                        // Create the star path
                        for (let i = 0; i < spikes * 2; i++) {
                            const radius = i % 2 === 0 ? outerRadius : innerRadius;
                            const angle = (i * Math.PI) / spikes - Math.PI / 2;
                            if (i === 0) {
                                ctx.moveTo(radius * Math.cos(angle), radius * Math.sin(angle));
                            } else {
                                ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
                            }
                        }
                        ctx.closePath();
                        
                        // Fill with base color
                        ctx.fillStyle = this.getShadeColor(event.target.dataset.shade);
                        ctx.fill();
                        
                        // Save the star path for clipping
                        ctx.save();
                        ctx.clip();
                        
                        // Apply patterns based on texture
                        if (event.target.dataset.texture === 'striped') {
                            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                            ctx.lineWidth = 5;
                            
                            for (let i = -60; i < 60; i += 10) {
                                ctx.beginPath();
                                ctx.moveTo(i - 30, -30);
                                ctx.lineTo(i + 30, 30);
                                ctx.stroke();
                            }
                        } else if (event.target.dataset.texture === 'dotted') {
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                            for (let x = -20; x <= 20; x += 10) {
                                for (let y = -20; y <= 20; y += 10) {
                                    ctx.beginPath();
                                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }
                        }
                        ctx.restore();
                    } else if (event.target.dataset.shape === 'circle') {
                        // Draw circle
                        ctx.beginPath();
                        ctx.arc(0, 0, 30, 0, Math.PI * 2);
                        ctx.closePath();
                        
                        // Fill with base color
                        ctx.fillStyle = this.getShadeColor(event.target.dataset.shade);
                        ctx.fill();
                        
                        // Save the circle path for clipping
                        ctx.save();
                        ctx.clip();
                        
                        // Apply patterns based on texture
                        if (event.target.dataset.texture === 'striped') {
                            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                            ctx.lineWidth = 5;
                            
                            for (let i = -60; i < 60; i += 10) {
                                ctx.beginPath();
                                ctx.moveTo(i - 30, -30);
                                ctx.lineTo(i + 30, 30);
                                ctx.stroke();
                            }
                        } else if (event.target.dataset.texture === 'dotted') {
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                            for (let x = -20; x <= 20; x += 10) {
                                for (let y = -20; y <= 20; y += 10) {
                                    ctx.beginPath();
                                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }
                        }
                        ctx.restore();
                    } else {
                        // Square drawing and patterns
                        ctx.fillStyle = this.getShadeColor(event.target.dataset.shade);
                        ctx.fillRect(-30, -30, 60, 60);
                        
                        // Apply patterns based on texture within the square
                        if (event.target.dataset.texture === 'striped' || event.target.dataset.texture === 'dotted') {
                            ctx.save();
                            ctx.beginPath();
                            ctx.rect(-30, -30, 60, 60);
                            ctx.clip();
                            
                            if (event.target.dataset.texture === 'striped') {
                                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                                ctx.lineWidth = 5;
                                
                                for (let i = -60; i < 60; i += 10) {
                                    ctx.beginPath();
                                    ctx.moveTo(i - 30, -30);
                                    ctx.lineTo(i + 30, 30);
                                    ctx.stroke();
                                }
                            } else if (event.target.dataset.texture === 'dotted') {
                                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                                for (let x = -20; x <= 20; x += 10) {
                                    for (let y = -20; y <= 20; y += 10) {
                                        ctx.beginPath();
                                        ctx.arc(x, y, 3, 0, Math.PI * 2);
                                        ctx.fill();
                                    }
                                }
                            }
                            ctx.restore();
                        }
                    }
                    
                    // Use the canvas as drag image
                    event.dataTransfer.setDragImage(canvas, 40, 40);
                    
                    // Remove the canvas after the drag starts
                    setTimeout(() => {
                        document.body.removeChild(canvas);
                    }, 0);
                });
            });

            slots.forEach((slot) => {
                slot.addEventListener("dragover", (event) => {
                    event.preventDefault();
                });

                // Add dragstart event for shapes in slots
                slot.addEventListener("dragstart", (event) => {
                    if (event.target.classList.contains('shape')) {
                        // Mark this shape for removal
                        event.target.dataset.remove = 'true';
                        
                        // Allow dragging out
                        event.dataTransfer.setData("text", "removing");
                        
                        // Create custom drag image for triangles being removed
                        if (event.target.classList.contains('triangle')) {
                            const canvas = document.createElement('canvas');
                            canvas.width = 80;
                            canvas.height = 80;
                            
                            canvas.style.position = 'absolute';
                            canvas.style.left = '-1000px';
                            canvas.style.top = '-1000px';
                            document.body.appendChild(canvas);
                            
                            const ctx = canvas.getContext('2d');
                            ctx.translate(40, 40);
                            
                            // Draw star
                            ctx.beginPath();
                            const spikes = 5;
                            const outerRadius = 30;
                            const innerRadius = 15;
                            
                            // Create the star path
                            for (let i = 0; i < spikes * 2; i++) {
                                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                                const angle = (i * Math.PI) / spikes - Math.PI / 2;
                                if (i === 0) {
                                    ctx.moveTo(radius * Math.cos(angle), radius * Math.sin(angle));
                                } else {
                                    ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
                                }
                            }
                            ctx.closePath();
                            
                            // Fill with base color
                            ctx.fillStyle = this.getShadeColor(event.target.dataset.shade);
                            ctx.fill();
                            
                            // Save the star path for clipping
                            ctx.save();
                            ctx.clip();
                            
                            // Apply patterns based on texture
                            if (event.target.dataset.texture === 'striped') {
                                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                                ctx.lineWidth = 5;
                                
                                for (let i = -60; i < 60; i += 10) {
                                    ctx.beginPath();
                                    ctx.moveTo(i - 30, -30);
                                    ctx.lineTo(i + 30, 30);
                                    ctx.stroke();
                                }
                            } else if (event.target.dataset.texture === 'dotted') {
                                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                                for (let x = -20; x <= 20; x += 10) {
                                    for (let y = -20; y <= 20; y += 10) {
                                        ctx.beginPath();
                                        ctx.arc(x, y, 3, 0, Math.PI * 2);
                                        ctx.fill();
                                    }
                                }
                            }
                            ctx.restore();
                            
                            event.dataTransfer.setDragImage(canvas, 40, 40);
                            
                            setTimeout(() => {
                                document.body.removeChild(canvas);
                            }, 0);
                        }
                    }
                });

                // Add dragend event to handle removal
                slot.addEventListener("dragend", (event) => {
                    if (event.target.classList.contains('shape') && event.target.dataset.remove === 'true') {
                        // Get the slot index
                        const slotIndex = parseInt(event.target.parentElement.dataset.slot) - 1;
                        
                        this.actionCount++;
                        
                        // Save removal interaction data
                        const removalData = {
                            participant_id: trial.participant_id,
                            trial_type: 'goal_builder_action',
                            trial_index: this.jsPsych.getProgress().current_trial_global,
                            goal_trial_number: Math.floor(this.jsPsych.getProgress().current_trial_global / 2),
                            time_elapsed: this.jsPsych.getTotalTime(),
                            timestamp: new Date().toISOString(),
                            menu: this.menuLayout,
                            action_number: this.actionCount,
                            shape_selected: {
                                id: event.target.id,
                                shape: event.target.dataset.shape,
                                texture: event.target.dataset.texture,
                                shade: event.target.dataset.shade
                            },
                            menu_position: { row: null, column: null },
                            slot_filled: parseInt(event.target.parentElement.dataset.slot),
                            shape_removed: true,
                            final_goal: null,
                            completion_time: Date.now() - this.startTime
                        };
                        
                        console.log('Removal Data:', JSON.stringify(removalData, null, 2));
                        this.jsPsych.data.write(removalData);
                        
                        // Remove the shape
                        event.target.remove();
                        
                        // Update the goal array
                        goal[slotIndex] = null;
                        
                        // Update submit button state
                        const filled = goal.every((g) => g !== null);
                        document.getElementById("submit-btn").disabled = !filled;
                    }
                });

                slot.addEventListener("drop", (event) => {
                    event.preventDefault();
                    if (!slot.firstChild) {
                        const shapeId = event.dataTransfer.getData("shape-id");
                        const shapeData = JSON.parse(event.dataTransfer.getData("shape-data"));
                        
                        // Find the position in the menu array
                        let menuPosition = { row: null, column: null };
                        this.menuLayout.forEach((row, rowIndex) => {
                            row.forEach((item, colIndex) => {
                                if (item.id === shapeId) {
                                    menuPosition.row = rowIndex;
                                    menuPosition.column = colIndex;
                                }
                            });
                        });
                        
                        this.actionCount++;
                        
                        // Save drag and drop interaction data
                        const interactionData = {
                            participant_id: trial.participant_id,
                            trial_type: 'goal_builder_action',
                            trial_index: this.jsPsych.getProgress().current_trial_global,
                            goal_trial_number: Math.floor(this.jsPsych.getProgress().current_trial_global / 2),
                            time_elapsed: this.jsPsych.getTotalTime(),
                            timestamp: new Date().toISOString(),
                            menu: this.menuLayout,
                            action_number: this.actionCount,
                            shape_selected: {
                                id: shapeId,
                                shape: shapeData.shape,
                                texture: shapeData.texture,
                                shade: shapeData.shade
                            },
                            menu_position: menuPosition,
                            slot_filled: parseInt(slot.dataset.slot),
                            shape_removed: false,
                            final_goal: null,
                            completion_time: Date.now() - this.startTime
                        };
                        
                        console.log('Interaction Data:', JSON.stringify(interactionData, null, 2));
                        this.jsPsych.data.write(interactionData);
                        
                        const clone = document.createElement('div');
                        clone.className = `shape ${shapeData.shape} ${shapeData.texture}`;
                        clone.style.color = this.getShadeColor(shapeData.shade);
                        clone.dataset.shape = shapeData.shape;
                        clone.dataset.texture = shapeData.texture;
                        clone.dataset.shade = shapeData.shade;
                        clone.draggable = true;

                        // Apply triangle styles immediately if it's a triangle
                        if (shapeData.shape === 'triangle') {
                            clone.style.transform = 'none';
                            clone.style.margin = '8px';
                        }
                        
                        slot.appendChild(clone);
                        const slotIndex = parseInt(slot.dataset.slot) - 1;
                        goal[slotIndex] = shapeData;
                    }

                    // Enable submit if all slots are filled
                    const filled = goal.every((g) => g !== null);
                    document.getElementById("submit-btn").disabled = !filled;
                });
            });

            // Add this to handle shapes being dragged out
            document.addEventListener("dragover", (event) => {
                event.preventDefault();
            });

            document.addEventListener("drop", (event) => {
                event.preventDefault();
                // If we're dropping outside of a slot, the shape will be removed by the dragend event
            });

            // Submit Button
            document.getElementById("submit-btn").addEventListener("click", () => {
                // Ensure goal data matches the structure expected by goal pursuit
                const goalData = [
                    {
                        shape: goal[0].shape,
                        shade: goal[0].shade,
                        texture: goal[0].texture
                    },
                    {
                        shape: goal[1].shape,
                        shade: goal[1].shade,
                        texture: goal[1].texture
                    },
                    {
                        shape: goal[2].shape,
                        shade: goal[2].shade,
                        texture: goal[2].texture
                    }
                ];
                
                const submitData = {
                    participant_id: trial.participant_id,
                    trial_type: 'goal_builder_submit',
                    trial_index: this.jsPsych.getProgress().current_trial_global,
                    goal_trial_number: Math.floor(this.jsPsych.getProgress().current_trial_global / 2),
                    time_elapsed: this.jsPsych.getTotalTime(),
                    timestamp: new Date().toISOString(),
                    menu: this.menuLayout,
                    action_number: this.actionCount + 1,
                    shape_selected: null,
                    slot_filled: null,
                    shape_removed: false,
                    final_goal: goalData,
                    menu_position: { row: null, column: null },
                    completion_time: Date.now() - this.startTime,
                    goal: goalData
                };
                
                console.log('Submit Data:', JSON.stringify(submitData, null, 2));
                this.jsPsych.finishTrial(submitData);
            });
        };

        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        getShadeColor(shade) {
            switch (shade) {
                case "1": return "lightblue";
                case "2": return "blue";
                case "3": return "darkblue";
                default: return "white";
            }
        }
        
        // New method to get menu layout as 3x9 array
        getMenuLayout() {
            const shapes = ["circle", "square", "triangle"];
            const textures = ["none", "striped", "dotted"];
            const shades = ["1", "2", "3"];
            
            let allShapes = [];
            shapes.forEach((shape) => {
                textures.forEach((texture) => {
                    shades.forEach((shade) => {
                        allShapes.push({
                            shape,
                            texture,
                            shade,
                            id: `shape-${allShapes.length}`
                        });
                    });
                });
            });
            
            // Shuffle and convert to 3x9 array
            allShapes = this.shuffleArray(allShapes);
            const menuArray = [];
            for (let i = 0; i < 3; i++) {
                menuArray.push(allShapes.slice(i * 9, (i + 1) * 9));
            }
            return menuArray;
        }
    }
    
    // Make the BuilderPlugin Class
    BuilderPlugin.info = info;
    
    // Return that class
    return BuilderPlugin;
  
    
  })(jsPsychModule);
  