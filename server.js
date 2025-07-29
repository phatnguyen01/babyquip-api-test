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
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: "Missing URL" });
    }

    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean); // remove empty segments
    const [userId, subPath] = pathSegments;

    // CASE 1: Home page
    if (pathSegments.length === 0) {
      return res.status(200).json({
        success: true,
        screen_name: "hd.HomeExplore",
        params: {
          user: { id: 999 },
        },
      });
    }

    // CASE 2: User profile only (e.g., /p/777)
    if (
      pathSegments.length === 2 &&
      pathSegments[0] === "p" &&
      !subPath?.includes("/")
    ) {
      return res.status(200).json({
        success: true,
        screen_name: "hd.QPShoppingScreen",
        params: {
          user: { id: parseInt(pathSegments[1]) },
          isFromAffiliate: true,
          modal: "QP_SHOP",
        },
      });
    }

    // CASE 3: Category page (e.g., /p/777/carseats)
    if (pathSegments.length === 3 && pathSegments[0] === "p") {
      return res.status(200).json({
        success: true,
        screen_name: "hd.QPShoppingScreen",
        params: {
          user: { id: parseInt(pathSegments[1]) },
          modal: "CATEGORY_ITEM",
          getUrlParms: pathSegments[2],
        },
      });
    }

    // CASE 4: Product detail (default/fallback)
    if (pathSegments.length >= 4 && pathSegments[0] === "p") {
      return res.status(200).json({
        success: true,
        screen_name: "hd.QPShoppingScreen",
        params: {
          user: { id: parseInt(pathSegments[1]) },
          modal: "DETAIL_ITEM",
          getUrlParms: pathSegments.slice(3).join("/"), // allow nested slugs
        },
      });
    }

    // Unknown path
    return res.status(400).json({
      success: false,
      error: "Unsupported deeplink URL format",
    });
  } catch (error) {
    console.error("Error parsing deeplink:", error);
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
