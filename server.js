const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Basic GET endpoint for testing
app.get("/", (req, res) => {
  res.json({
    message: "Node.js API Server is running!",
    timestamp: new Date().toISOString(),
    endpoints: {
      "POST /api/data": "Submit data to the server",
    },
  });
});

// POST API endpoint
app.post("/api/deeplink/url-parser", (req, res) => {
  try {
    // Get data from request body
    const { url } = req.body;
    if (url === "https://staging.babyquip.com/") {
      res.status(200).json({
        success: true,
        screen_name: "hd.HomeExplore",
        params: {
          user: {
            id: 777,
          },
        },
      });
    } else if (url === "https://staging.babyquip.com/p/777") {
      res.status(200).json({
        success: true,
        screen_name: "hd.QPShoppingScreen",
        params: {
          user: {
            id: 777,
          },
          isFromAffiliate: true,
        },
      });
    } else if (url === "https://staging.babyquip.com/p/777/carseats") {
      const getUrlNameParams = "car-seats";
      res.status(200).json({
        success: true,
        screen_name: "hd.QPShoppingScreen",
        params: {
          user: {
            id: 777,
          },
          modal: "CATEGORY_ITEM",
          getUrlParms: getUrlNameParams,
        },
      });
    } else {
      const getUrlNameParams = "baby-jogger-city-mini-2-double-stroller";
      res.status(200).json({
        success: true,
        screen_name: "hd.QPShoppingScreen",
        params: {
          user: {
            id: 777,
          },
          modal: "DETAIL_ITEM",
          modalId: 54014,
          getUrlParms: getUrlNameParams,
        },
      });
    }

    // Send success response
    // res.status(201).json({
    //   success: true,
    //   message: "Data received successfully",
    //   data: {
    //     id: Date.now(), // Simple ID generation
    //     name,
    //     email,
    //     message: message || "No message provided",
    //     receivedAt: new Date().toISOString(),
    //   },
    // });
  } catch (error) {
    console.error("Error processing POST request:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Something went wrong!",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`POST endpoint available at: http://localhost:${PORT}/api/data`);
});
