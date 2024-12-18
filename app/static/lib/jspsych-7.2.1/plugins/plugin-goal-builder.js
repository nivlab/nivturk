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
            border: 2px solid black;
            cursor: grab;
            user-select: none;
            }
            .shape.circle { border-radius: 50%; }
            .shape.square { }
            .shape.triangle {
            width: 0;
            height: 0;
            border-left: 30px solid transparent;
            border-right: 30px solid transparent;
            border-bottom: 60px solid black;
            background: none;
            }
            .shape.striped {
            background-image: linear-gradient(45deg, black 25%, transparent 25%, transparent 50%, black 50%, black 75%, transparent 75%, transparent);
            background-size: 20px 20px;
            }
            .shape.dotted {
            background-image: radial-gradient(black 10%, transparent 10%);
            background-size: 10px 10px;
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
                // Add shape properties to transfer data
                event.dataTransfer.setData("shape-data", JSON.stringify({
                    shape: event.target.dataset.shape,
                    texture: event.target.dataset.texture,
                    shade: event.target.dataset.shade
                }));
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
                
                // Create a clone of the shape instead of moving it
                if (!slot.firstChild) {
                    const clone = document.createElement('div');
                    clone.className = `shape ${shapeData.shape} ${shapeData.texture}`;
                    clone.style.backgroundColor = this.getShadeColor(shapeData.shade);
                    clone.dataset.shape = shapeData.shape;
                    clone.dataset.texture = shapeData.texture;
                    clone.dataset.shade = shapeData.shade;
                    clone.draggable = true;  // Make the clone draggable
                    
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
            let html = "";
            let id = 0;
        
            shapes.forEach((shape) => {
              textures.forEach((texture) => {
                shades.forEach((shade) => {
                  html += `
                    <div id="shape-${id}" 
                         class="shape ${shape} ${texture}" 
                         style="background-color: ${this.getShadeColor(shade)};" 
                         data-shape="${shape}" 
                         data-texture="${texture}" 
                         data-shade="${shade}">
                    </div>`;
                  id++;
                });
              });
            });
        
            return html;
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
  