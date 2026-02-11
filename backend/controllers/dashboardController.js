exports.getSidebar = (req, res) => {
  res.json({
    menu: [
      "Feed",
      "My Tasks",
      "Requests",
      "My Requests",
      "Add Task",
      "Settings"
    ]
  });
};

exports.getFeed = (req, res) => {
  res.json({
    dashboard: {
      welcomeMessage: "Welcome to HirePro Dashboard",

      summary: {
        activeTasks: 5,
        pendingRequests: 3,
        completedTasks: 2
      },

      recentActivity: [
        "You created a new task",
        "You received a request",
        "Your profile was updated"
      ],

      notifications: 2
    }
  });
};
