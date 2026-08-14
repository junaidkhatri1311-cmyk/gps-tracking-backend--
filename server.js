const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let latestLocation = null;

app.get("/", (req, res) => {
    res.json({
        name: "GPS Tracking Backend",
        status: "online"
    });
});

app.post("/api/location", (req, res) => {

    const {
        deviceId,
        latitude,
        longitude,
        speed,
        accuracy
    } = req.body;

    if (
        !deviceId ||
        typeof latitude !== "number" ||
        typeof longitude !== "number"
    ) {
        return res.status(400).json({
            success: false,
            error: "Invalid GPS data"
        });
    }

    latestLocation = {
        deviceId,
        latitude,
        longitude,
        speed: speed || 0,
        accuracy: accuracy || null,
        timestamp: new Date().toISOString()
    };

    console.log("GPS UPDATE:", latestLocation);

    res.json({
        success: true,
        message: "Location received",
        location: latestLocation
    });
});

app.get("/api/location/:deviceId", (req, res) => {

    if (
        !latestLocation ||
        latestLocation.deviceId !== req.params.deviceId
    ) {
        return res.status(404).json({
            success: false,
            error: "Vehicle location not found"
        });
    }

    res.json(latestLocation);
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`GPS server running on port ${PORT}`);
});