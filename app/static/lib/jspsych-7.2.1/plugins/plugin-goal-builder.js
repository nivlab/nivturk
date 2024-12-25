var jsPsychBuilder = (function (jspsych) {
    'use strict';
    
    const info = {
        name: "build-goal",
    parameters: {
      instruction: {
        type: jspsych.ParameterType.STRING,
        default: "Drag and drop shapes to create your goal.",
        description: "Instructions displayed above the task."
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
        }
        
        trial(display_element, trial) {
            // HTML Structure
            const html = `
            <div id="instructions">${trial.instruction}</div>
            <div id="shape-container">
            ${this.generateShapesHTML()}
            </div>
            <div id="goal-slots">
                <div class="goal-row">
                    <div class="goal-slot" data-slot="1"></div>
                </div>
                <div class="goal-row">
                    <div class="goal-slot" data-slot="2"></div>
                    <div class="goal-slot" data-slot="3"></div>
                </div>
            </div>
            <button id="submit-btn" disabled>Submit</button>
        `;

        display_element.innerHTML = html;

        // CSS Styling
        const styles = document.createElement("style");
        styles.innerHTML = `
            #instructions {
            margin-bottom: 20px;
            font-size: 18px;
            text-align: center;
            }
            #shape-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin-bottom: 30px;
            }
            .shape {
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: grab;
            user-select: none;
            background-clip: padding-box;
            border: none;
            border-radius: 3px;
            background-color: currentColor;
            }
            .shape.circle { 
                border-radius: 50%;
            }
            .shape.triangle {
                clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
                margin: 8px;
                transform: none;
            }
            .shape.striped {
                position: relative;
                overflow: hidden;
            }
            .shape.striped::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.8) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0.8) 75%, transparent 75%, transparent);
                background-size: 10px 10px;
            }
            .shape.dotted {
                position: relative;
                overflow: hidden;
            }
            
            .shape.circle.dotted::before,
            .shape.square.dotted::before,
            .shape.triangle.dotted::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: radial-gradient(white 30%, transparent 30%);
                background-size: 10px 10px;
            }

            .shape.circle.dotted::before {
                border-radius: 50%;
            }
            
            .shape.triangle.dotted::before {
                transform: rotate(-45deg) scale(1.414);
            }
            #goal-slots {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;  /* Space between rows */
            }
            
            .goal-row {
                display: flex;
                justify-content: center;
                gap: 20px;  /* Space between slots in the same row */
            }
            
            .goal-slot {
                width: 80px;
                height: 80px;
                border: 2px dashed gray;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #submit-btn {
            margin-top: 20px;
            display: block;
            margin-left: auto;
            margin-right: auto;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            }
            #submit-btn:disabled {
            background: gray;
            cursor: not-allowed;
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
                const shapeId = event.dataTransfer.getData("shape-id");
                const shapeData = JSON.parse(event.dataTransfer.getData("shape-data"));
                
                if (!slot.firstChild) {
                    const clone = document.createElement('div');
                    clone.className = `shape ${shapeData.shape} ${shapeData.texture}`;
                    clone.style.backgroundColor = this.getShadeColor(shapeData.shade);
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
            const goalData = goal.map(g => ({
                shape: g.shape,
                shade: g.shade,
                texture: g.texture
            }));
            
            jsPsych.finishTrial({
                goal: goalData
            });
        });
        };

        generateShapesHTML() {
            const shapes = ["circle", "square", "triangle"];
            const textures = ["none", "striped", "dotted"];
            const shades = ["1", "2", "3"];
            
            // Create array of all possible combinations
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
            
            // Shuffle the array
            allShapes = this.shuffleArray(allShapes);
            
            // Generate HTML from shuffled array
            return allShapes.map(({shape, texture, shade, id}) => `
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
        
    }
    
    // Make the BuilderPlugin Class
    BuilderPlugin.info = info;
    
    // Return that class
    return BuilderPlugin;
  
    
  })(jsPsychModule);
  