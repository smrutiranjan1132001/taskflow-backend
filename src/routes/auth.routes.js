const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");
const { registerSchema } = require("../validations/auth.validation");

const router = express.Router();

router.post("/register", async (req, res, next) => {
    try {
        // Validate and destructure in one line
        const { email, password, name } = registerSchema.parse(req.body);

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: "User registered" });
    } catch (err) {
        next(err);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });


        res.json({ accessToken, refreshToken });
    } catch (err) {
        next(err);
    }
});

router.post("/refresh", async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        const stored = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
        });

        if (!stored) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        next(err);
    }
});

router.post("/logout", async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        await prisma.refreshToken.delete({
            where: { token: refreshToken },
        });

        res.json({ message: "Logged out" });
    } catch (err) {
        next(err);
    }
});


module.exports = router;
