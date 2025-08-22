"use client";

import { Button } from "@/components/ui/button";
import { motion, TargetAndTransition } from "framer-motion";

const floatAnimation: TargetAndTransition = {
    y: [0, -10, 0],
    transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
    }
};

export default function HeroSection() {
    return (
        <section className="relative flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 lg:px-12 py-16 bg-subtle-gradient rounded-2xl">
            {/* Left Side - Text Content */}
            <div className="max-w-xl text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    Connecting <span className="text-blue-500">Hearts & Hope</span>
                </h1>
                <p className="text-gray-600 mt-4 text-lg">
                    Bridge the gap between aid-giving institutions and individuals in need. Together, we create a world where help reaches everyone who needs it.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 text-lg">
                        Get Help Now →
                    </Button>
                    <Button variant="outline" className="px-6 py-3 text-lg">
                        Become a Partner
                    </Button>
                </div>

                {/* Stats */}
                <div className="mt-10 grid grid-cols-3 gap-4 text-center lg:text-left">
                    <div>
                        <p className="text-2xl font-bold text-gray-900">500+</p>
                        <p className="text-gray-500 text-sm">Institutions</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">10,000+</p>
                        <p className="text-gray-500 text-sm">People Helped</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">$2M+</p>
                        <p className="text-gray-500 text-sm">Aid Distributed</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Animated Cards */}
            <div className="mt-12 lg:mt-0 flex flex-col gap-6">
                <motion.div
                    className="bg-white shadow-xl rounded-xl p-4 w-90"
                    animate={floatAnimation}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-blue-500 text-2xl">💙</span>
                        <div>
                            <h3 className="font-semibold text-gray-800">Emergency Medical Aid</h3>
                            <p className="text-gray-500 text-sm">Available 24/7</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white shadow-xl rounded-xl p-4 w-90"
                    animate={floatAnimation}
                    transition={{ delay: 0.3, duration: 3, repeat: Infinity }}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-green-500 text-2xl">🛡️</span>
                        <div>
                            <h3 className="font-semibold text-gray-800">Verified Institutions</h3>
                            <p className="text-gray-500 text-sm">Trusted partners</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white shadow-xl rounded-xl p-4 w-90"
                    animate={floatAnimation}
                    transition={{ delay: 0.6, duration: 3, repeat: Infinity }}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-blue-400 text-2xl">👥</span>
                        <div>
                            <h3 className="font-semibold text-gray-800">Community Support</h3>
                            <p className="text-gray-500 text-sm">Stronger together</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
