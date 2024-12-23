
// Not sure what these objects are doing at the moment
let currentSelect = [];
//let data = {};

// Get the desired goal state
//currentGoal = randomInit() // Randomly initialize for now

// Get the goal (we just make it here)
const currentGoal = {
  a : { id: 'fixed-obj-a', shape: 'square', color: '1', pattern: 'plain' },
  b : { id: 'fixed-obj-b', shape: 'square', color: '1', pattern: 'plain' },
  c : { id: 'fixed-obj-c', shape: 'square', color: '1', pattern: 'plain' }
};

// Call the function to create goal shapes
createGoalShapes(Object.values(currentGoal));

// Example state for clarity
// { 'a': {'color': '1', 'shape': 'square', 'pattern': 'plain'},
//   'b': {'color': '5', 'shape': 'circle', 'pattern': 'stripe'},
//   'c': {'color': '3', 'shape': 'triangle', 'pattern': 'plain'} };

// Initialize the starting state, this does not update when actions are taken
//let initialConfig = randomInit();
let initialConfig = {
  a : { id: 'state-obj-a', shape: 'square', color: '1', pattern: 'plain' },
  b : { id: 'state-obj-b', shape: 'square', color: '1', pattern: 'plain' },
  c : { id: 'state-obj-c', shape: 'square', color: '2', pattern: 'plain' }
}

// This is what updates when actions are taken
let currentConfig = initialConfig//Object.create(initialConfig);

// Display the starting state
getEl('demo-holder-a').append(makeShape('demo-obj-a', initialConfig['a']['shape'], initialConfig['a']['color'], initialConfig['a']['pattern']));
getEl('demo-holder-b').append(makeShape('demo-obj-b', initialConfig['b']['shape'], initialConfig['b']['color'], initialConfig['b']['pattern']));
getEl('demo-holder-c').append(makeShape('demo-obj-c', initialConfig['c']['shape'], initialConfig['c']['color'], initialConfig['c']['pattern']));

// Make outline around shape when the shapes are selected to be actors and recipients
getEl('demo-obj-a').onclick = () => selectObj('demo-obj-a', currentGoal);
getEl('demo-obj-b').onclick = () => selectObj('demo-obj-b', currentGoal);
getEl('demo-obj-c').onclick = () => selectObj('demo-obj-c', currentGoal);

// Add event listener to goal abandonment button
document.getElementById('large-red-button').addEventListener('click', abandonGoal);
