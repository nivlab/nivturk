var instruction_pages_press = [
      "<div style='max-width:600px;'><p>In this game there are robots, like the ones shown here. As you can see, different robots have different colors.</p><br><img src='../static/img/trialRobots.png'></img><br><p>If you look at the robots, you will see that they all have an orange button in the middle. In the task, one robot will appear at the screen at a time. When it appears you will have two options: You can press on its button by pressing the space-bar (SPACE) or you can choose not to press its button by not pressing anything.</p><br><img src='../static/img/trialRobotsArrows.png'></img></div>",
      "<div style='max-width:600px;'><p>Some robots are <font style=\"color:#66C166\">Givers</font> and some are <font style=\"color:#FF6666\">Takers</font>. <font style=\"color:#66C166\">Givers appear on a GREEN background</font>, like this:</p><img src='../static/img/giver_instruct.png'></img><p><font style=\"color:#66C166\">Givers</font> will give you tickets if you choose the action they like (pressing or not pressing their button).</p><p><font style=\"color:#FF6666\"> Takers appear on a RED background</font>, like this:</p><img src='. ./static/img/taker_instruct.png'></img><p><font style=\"color:#FF6666\">Takers</font> will take your tickets UNLESS you do the action they like.</p><p>Your goal is to try to get as many tickets as possible -- your bonus depends on the number of tickets you obtain! So you have to learn which action each robot likes. This way you can make <font style=\"color:#66C166\">Givers</font> give you tickets, and prevent <font style=\"color:#FF6666\">Takers</font> from taking your tickets. Please note: pressing buttons other than SPACE will not increase your bonus, and may decrease your bonus.</p><p>Each time you see a robot, your job is to decide which action to take (pressing or not pressing their button). You have a couple of seconds to decide what to do.</p>",
      "<div style='max-width:600px;'><p>If you decide to press a robot's button, you want to make sure you press while the robot is on the screen. Please rest your dominant hand's pointer finger on the space bar throughout the experiment.</p><p>Now, let's practice pressing the robot's button. When you press \'Next\' below you will see four robots, one after another. Each time you see a robot, please press its button by pressing the space bar on your keyboard."
  ];

var instruction_pages_no_press = [
      "<div style='max-width:600px;'><p>Great job! Next, you will see another four robots. Practice not pressing the robot's button for each of these robots.</p></div>",
  ];

var instruction_pages_feedback = [
      "<div style='max-width:600px;'><p>During the task, after you either press or do not press a robot's button, you'll find out if the robot gave you a ticket, took a ticket from you, or the number of tickets stayed the same.</p><p>If the robot gave you a ticket you will see:</p><br> <img src='../static/img/goldenTicket.png'></img><p>If the robot took a ticket from you, you will see: </p><br> <img src='../static/img/goldenTicketRipped.png'></img><p>If the robot neither gave you a ticket nor took a ticket from you, you will see a black horizontal bar, like this:</p><br><img src='../static/img/horizontalBar.png'></img></div>",
      "<div style='max-width:600px;'><p>Now you have finished the practice. In the real game you will meet FOUR new robots. Two of them are <font style=\"color:#66C166\">Givers</font> and the other two are <font style=\"color:#FF6666\">Takers</font>. For each robot, you will have to figure out its favorite action so you can earn as many tickets as possible for your bonus.</p><p>However, there is another twist: The robots will sometimes malfunction. So, for example, a <font style=\"color:#66C166\">Giver</font> will sometimes not give you a ticket even when you make its favorite action, and will sometimes give you a ticket even when you make the wrong action. Similarly for <font style=\"color:#FF6666\">Takers</font>: they will sometimes take a ticket even when you make their favorite action, or not take it even if you don't make their favorite action. But these malfunctions are uncommon.</p><p>The game can be hard because you will have to learn and remember which robot is which, so you will need to concentrate. The robots disappear quickly, so please make sure to stay in the experiment window all the time. You will get a break approximately every 7 minutes, at the end of each block. All in all there are three blocks, and the favourite actions of each robot are the same in every block.</p><p>Remember: Try to earn as many tickets as possible by learning each robot’s favorite action! The more tickets you win, the more bonus money you will get.</p></div>"
  ];

var all_instruct = instruction_pages_press.concat(instruction_pages_feedback)
all_instruct.splice(2, 1)

// conditioning instructions
var comprehension_check = {
  type: 'comprehension-check',
  instruction_pages: all_instruct,
  questions: [{
      prompt: "Which key should you press to press a robot's button?",
      options: ["Left arrow key", "A", "None", "Space bar"],
      correct_answer: "Space bar",
      required: true,
      horizontal: false
    },{
        prompt: "If you want to NOT press a robot's button, what should you do?",
        options: ["Press left arrow key", "Press A", "Press no key", "Press space bar"],
        correct_answer: "Press no key",
        required: true,
        horizontal: false
    },{
      prompt: "What does a black horizontal bar mean?",
      options: ["The robot gave a ticket", "The robot took one of my tickets", "The robot neither gave a ticket nor took a ticket", "The robot malfunctioned"],
      correct_answer: "The robot neither gave a ticket nor took a ticket",
      required: true,
      horizontal: false
    }, {
      prompt: "What is the background color for GIVERS (that is, robots who will give a ticket if you do their favourite action)?",
      options: ["Green", "Red", "White", "Black"],
      correct_answer: "Green",
      required: true,
      horizontal: false
    }, {
      prompt: "What is the background color for TAKERS (that is, robots who will take a ticket if you don't do their favourite action)?",
      options: ["Green", "Red", "White", "Black"],
      correct_answer: "Red",
      required: true,
      horizontal: false
    }, {
      prompt: "How can you increase your bonus?",
      options: ["There is no bonus", "Win as many tickets as possible"],
      correct_answer: "Win as many tickets as possible",
      required: true,
      horizontal: false
    }
  ],
  show_clickable_nav: true,
  show_page_number: false,
  randomize_question_order: true,
  failure_text: "Unfortunately, you didn't answer all questions correctly. Please review the instructions and then try again."
};
