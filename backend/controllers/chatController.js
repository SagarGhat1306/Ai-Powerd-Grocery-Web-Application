const genAI = require("../config/gemini");
const Product = require("../models/Product");

const userChat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message required"
            });
        }

        // ✅ Step 1: Smart DB search
        const products = await Product.find({
        // instead of regex only
            $or: [
            { name: { $regex: message, $options: "i" } },
            { category: { $regex: message, $options: "i" } },
            { description: { $regex: message, $options: "i" } }
            ]
                    }).limit(5);

        // ✅ Step 2: Build SAFE context
        const context = products.length > 0
            ? products.map((p) => `
            Product: ${p.name}
            Category: ${p.category}
            Price: ₹${p.offerPrice}
            Availability: ${p.inStock ? "In Stock" : "Out of Stock"}
            Description: ${p.description.join(" ")}
            `).join("\n")
                : "No relevant products found.";

        // ✅ Step 3: Proper Gemini call (NEW SDK)
        const result = await genAI.models.generateContent({
            model: "gemini-2.0-flash",
                contents: [
                {
                    role: "user",
                    parts: [
                    {
                        text: `
                You are a grocery shopping assistant.

                STRICT RULES:
                - Answer ONLY using provided context
                - Do NOT invent products
                - If no match, say "No matching products found"

                Context:
                ${context}

                User Question:
                ${message}
                `
                    }
                    ]
                }
                ],
            config: {
                temperature: 0.6,
                topP: 0.9,
                maxOutputTokens: 400
            }
        });

        const reply = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // ✅ Step 4: fallback
        if (!reply) {
            return res.json({
                success: true,
                reply: "Sorry, I couldn't find relevant products."
            });
        }

        res.json({
            success: true,
            reply
        });

    } catch (error) {
        console.log("ERROR:", error);

        res.status(500).json({
            success: false,
            message: "AI service temporarily unavailable"
        });
    }
};

module.exports = { userChat };