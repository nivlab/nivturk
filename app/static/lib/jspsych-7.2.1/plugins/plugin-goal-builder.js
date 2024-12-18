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
   * **survey-likert**
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
            <div class="goal-slot" data-slot="1"></div>
            <div class="goal-slot" data-slot="2"></div>
            <div class="goal-slot" data-slot="3"></div>
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
                transform: rotate(45deg) scale(0.707);
                margin: 8px;
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
            .goal-slot {
            width: 80px;
            height: 80px;
            border: 2px dashed gray;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin: 0 10px;
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
                
                // Rotate if it's a triangle
                if (event.target.dataset.shape === 'triangle') {
                    ctx.rotate(Math.PI / 4);
                }
                
                // Draw the base shape
                ctx.fillStyle = this.getShadeColor(event.target.dataset.shade);
                
                if (event.target.dataset.shape === 'circle') {
                    ctx.beginPath();
                    ctx.arc(0, 0, 30, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Square or rotated square (triangle)
                    ctx.fillRect(-30, -30, 60, 60);
                }
                
                // Apply patterns based on texture
                if (event.target.dataset.texture === 'striped') {
                    ctx.save();
                    if (event.target.dataset.shape === 'circle') {
                        ctx.beginPath();
                        ctx.arc(0, 0, 30, 0, Math.PI * 2);
                        ctx.clip();
                    } else {
                        ctx.beginPath();
                        ctx.rect(-30, -30, 60, 60);
                        ctx.clip();
                    }
                    
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.lineWidth = 5;
                    
                    for (let i = -60; i < 60; i += 10) {
                        ctx.beginPath();
                        ctx.moveTo(i - 30, -30);
                        ctx.lineTo(i + 30, 30);
                        ctx.stroke();
                    }
                    
                    ctx.restore();
                } else if (event.target.dataset.texture === 'dotted') {
                    ctx.save();
                    if (event.target.dataset.shape === 'circle') {
                        ctx.beginPath();
                        ctx.arc(0, 0, 30, 0, Math.PI * 2);
                        ctx.clip();
                    }
                    
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    for (let x = -20; x <= 20; x += 10) {
                        for (let y = -20; y <= 20; y += 10) {
                            ctx.beginPath();
                            ctx.arc(x, y, 3, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                    ctx.restore();
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
                        // Create a canvas
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
                        ctx.rotate(Math.PI / 4);
                        
                        // Draw the base shape
                        ctx.fillStyle = this.getShadeColor(event.target.dataset.shade);
                        ctx.fillRect(-30, -30, 60, 60);
                        
                        // Apply patterns based on texture
                        if (event.target.dataset.texture === 'striped') {
                            ctx.save();
                            ctx.beginPath();
                            ctx.rect(-30, -30, 60, 60);
                            ctx.clip();
                            
                            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                            ctx.lineWidth = 5;
                            
                            for (let i = -60; i < 60; i += 10) {
                                ctx.beginPath();
                                ctx.moveTo(i - 30, -30);
                                ctx.lineTo(i + 30, 30);
                                ctx.stroke();
                            }
                            
                            ctx.restore();
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
                        
                        // Use the canvas as drag image
                        event.dataTransfer.setDragImage(canvas, 40, 40);
                        
                        // Remove the canvas after the drag starts
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
                        clone.style.transform = 'rotate(45deg) scale(0.707)';
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
            jsPsych.finishTrial({
            goal
            });
        });
        };

        generateShapesHTML() {
            const shapes = ["circle", "square", "triangle"];
            const textures = ["none", "striped", "dotted"];
            const shades = ["low", "medium", "high"];
            
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
                            ${shape === 'triangle' ? 'transform: rotate(45deg) scale(0.707); margin: 8px;' : ''}" 
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
              case "low": return "lightblue";
              case "medium": return "blue";
              case "high": return "darkblue";
              default: return "white";
            }
          }
        
    }
    
    // Make the BuilderPlugin Class
    BuilderPlugin.info = info;
    
    // Return that class
    return BuilderPlugin;
  
    
  })(jsPsychModule);
  