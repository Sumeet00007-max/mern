const Link = require("../models/urlModel")
const shortid = require("shortid");
const useragent = require("useragent");


module.exports.createUrl = async (req, res) => {
    const { destinationUrl, remarks, expirationDate } = req.body;
    // console.log(req.body)

    if (!destinationUrl ) {
        return res.status(400).json({
            status: 'error',
            message: "Destination URL is required."
        });
    }
    if (!remarks ) {
        return res.status(400).json({
            status: 'error',
            message: "remarks is required."
        });
    }

    try {
        // Generate a unique short URL
        const shortUrl = shortid.generate();

        // Create and save the link
        const newLink = new Link({
            destinationUrl,
            shortUrl,
            expirationDate: expirationDate ? new Date(expirationDate) : null,
            userId: req.user._id,
            remarks
        });

        await newLink.save();

        return res.status(201).json({
            status: 'success',
            message: "Short URL created successfully.",
            data: {
                destinationUrl: newLink.destinationUrl,
                shortUrl: `${req.headers.host}/${newLink.shortUrl}`,
                expirationDate: newLink.expirationDate,
                userId: newLink.userId,
            },
        });
    } catch (err) {
        console.error("Error creating short URL:", err);
        res.status(500).json({
            status: 'error',
            message: "Server error. Please try again later."
        });
    }
}

module.exports.editUrl = async (req, res) => {
    const { id } = req.params; // ID of the link to be updated
    const { destinationUrl, remarks, expirationDate } = req.body;

    if (!destinationUrl && !remarks && !expirationDate) {
        return res.status(400).json({
            status: 'error',
            message: "At least one field is required for update.",
        });
    }

    try {

        const link = await Link.findOne({ _id: id, userId: req.user.id });

        if (!link) {
            return res.status(404).json({
                status: 'error',
                message: "Link not found or you do not have permission to edit this link.",
            });
        }

        // Update fields only if they are provided
        if (destinationUrl) link.destinationUrl = destinationUrl;
        if (remarks) link.remarks = remarks; // Assumes a `remarks` field exists in the schema
        if (expirationDate) link.expirationDate = new Date(expirationDate);
        // Save the updated link
        await link.save();

        return res.status(200).json({
            status: 'success',
            message: "Link updated successfully.",
            data: {
                id: link._id,
                originalUrl: link.originalUrl,
                remarks: link.remarks,
                expirationDate: link.expirationDate,
                shortUrl: link.shortUrl,
            },
        });
    } catch (err) {
        console.error("Error updating link:", err);
        return res.status(500).json({
            status: 'error',
            message: "An error occurred while updating the link. Please try again later.",
        });
    }
}
module.exports.deleteUrl = async (req, res) => {
    const { id } = req.params;

    try {
        const link = await Link.findOne({ _id: id, userId: req.user.id });

        if (!link) {
            return res.status(404).json({
                status: 'error',
                message: "Link not found or you do not have permission to delete this link.",
            });
        }

        await Link.deleteOne({ _id: id });

        return res.status(200).json({
            status: 'success',
            message: "Link deleted successfully.",
            data: {
                id: link._id,
                originalUrl: link.originalUrl,
                shortUrl: link.shortUrl,
            },
        });
    } catch (err) {
        console.error("Error deleting link:", err);
        return res.status(500).json({
            status: 'error',
            message: "An error occurred while deleting the link. Please try again later.",
        });
    }
}
module.exports.getAllUrls = async (req, res) => {
    const { page = 1, limit = 9 } = req.query;
    console.log(req.query)
    try {
        const urls = await Link.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalLinks = await Link.countDocuments({ userId: req.user.id });

        return res.status(200).json({
            message: "Links fetched successfully.",
            data: {
                urls,
                pagination: {
                    totalLinks,
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalLinks / limit),
                },
            },
        });
    } catch (err) {
        console.error("Error fetching links:", err);
        return res.status(500).json({
            error: "An error occurred while fetching the links. Please try again later.",
        });
    }
}

module.exports.redirectToOriginalUrl = async (req, res) => {
    const { shortUrl } = req.params;
    console.log(req.ip);
    // console.log("Received short URL:", shortUrl); 
    try {
        const link = await Link.findOne({ shortUrl });
        console.log("Found link:", link);
        if (!link) {
            return res.status(404).json({
                status: 'error',
                message: "Short URL not found.",
            });
        }

        if (link.expirationDate && new Date() > link.expirationDate) {
            return res.status(410).json({
                status: 'error',
                message: "This link has expired.",
            });
        }

        const clickMetadata = {
            timestamp: new Date(),
            ip: req.ip, 
            os: req.headers["user-agent"],
            userAgent: req.device.type,
        };
        console.log(clickMetadata)

        link.clicks += 1;
        link.analytics.push(clickMetadata);
        await link.save();
        // console.log("Redirecting to:", link.destinationUrl);
        res.redirect(link.destinationUrl);

    } catch (err) {
        console.error("Error during redirect:", err);
        return res.status(500).json({
            status: 'error',
            message: "An error occurred while processing the request.",
            error: err.message,
        });
    }
};

module.exports.dashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        // console.log(req)
        const urls = await Link.find({ userId });

        let totalClicks = 0;
        const dateWiseClicks = {};
        const deviceTypeClicks = {
            desktop: 0,
            mobile: 0,
            tablet: 0,
        };

        if (!urls.length) {
            return res.status(202).json({ 
                status: 'error',
                message: "No URLs found for the user.",
                totalClicks,
                dateWiseClicks,
                deviceTypeClicks,
            });
        }

        
        urls.forEach((url) => {
            totalClicks += url.clicks;

            url.analytics.forEach((entry) => {
                const date = entry.timestamp.toISOString().split("T")[0]; 

                if (!dateWiseClicks[date]) {
                    dateWiseClicks[date] = 0;
                }
                dateWiseClicks[date] += 1;

                const userAgent = entry.userAgent.toLowerCase();
                if (userAgent.includes("phone")) {
                    deviceTypeClicks.mobile += 1;
                } else if (userAgent.includes("tablet")) {
                    deviceTypeClicks.tablet += 1;
                } else {
                    deviceTypeClicks.desktop += 1;
                }
            });
        });

        res.status(200).json({
            totalClicks,
            dateWiseClicks,
            deviceTypeClicks,
        });
    } catch (error) {
        console.error("Error fetching analytics:", error.message);
        res.status(500).json({ 
            status: 'error',
            message: "Internal server error."
        });
    }
} 

module.exports.getAllAnalytics = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Added pagination parameters
    try {
        const userId = req.user.id; // Ensure the user is authenticated

        // Find all URLs created by the logged-in user
        const urls = await Link.find({ userId });

        function formatDate(isoString) {
            const date = new Date(isoString);
            
            const options = { 
                month: "short", 
                day: "2-digit", 
                year: "numeric", 
                hour: "2-digit", 
                minute: "2-digit", 
                hour12: false 
            };
        
            return date.toLocaleString("en-US", options).replace(",", "");
        }

        if (!urls.length) {
            return res.status(404).json({
                status: "error",
                
                message: "No URLs found for the user."
            });
        }

        let analyticsData = [];

        urls.forEach((url) => {
            url.analytics.forEach((entry) => {
                console.log(entry)
                const agent = useragent.parse(entry.os); // Parse user agent
                analyticsData.push({
                    timestamp: formatDate(entry.timestamp),
                    destinationUrl: url.destinationUrl,
                    shortUrl: url.shortUrl,
                    ipAddress: entry.ip,
                    userOS: agent.os.toString(), // Extract OS from user agent
                });
            });
        });

        // Pagination logic
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedData = analyticsData.slice(startIndex, endIndex);

        // Return analytics data
        res.status(200).json({ 
            analytics: paginatedData,
            pagination: {
                totalItems: analyticsData.length,
                currentPage: parseInt(page),
                totalPages: Math.ceil(analyticsData.length / limit),
            }
        });
    } catch (error) {
        console.error("Error fetching analytics:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

module.exports.getSearchUrl = async (req, res) => {
    const { searchQuery } = req.params;
    const userId = req.user.id;

    try {
        const urls = await Link.find({
            userId,
            remarks: { $regex: searchQuery, $options: 'i' } // Case-insensitive search
        });

        if (!urls.length) {
            return res.status(404).json({
                status: 'error',
                message: "No URLs found matching the search query.",
            });
        }

        return res.status(200).json({
            status: 'success',
            message: "URLs fetched successfully.",
            data: urls,
        });
    } catch (err) {
        console.error("Error fetching search results:", err);
        return res.status(500).json({
            status: 'error',
            message: "An error occurred while fetching the search results. Please try again later.",
        });
    }
}


