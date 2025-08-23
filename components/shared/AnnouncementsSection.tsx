"use client";

import { Button } from "@/components/ui/button";

interface Announcement {
    id: number;
    title: string;
    organization: string;
    description: string;
    location: string;
    daysLeft: number;
    volunteersJoined: number;
    totalVolunteers: number;
}

const announcements: Announcement[] = [
    {
        id: 1,
        title: "Emergency Medical Fund",
        organization: "Children's Hope Foundation",
        description:
            "Urgent medical assistance for children in need. Providing life-saving treatments and medications.",
        location: "New York, NY",
        daysLeft: 15,
        volunteersJoined: 32,
        totalVolunteers: 50,
    },
    {
        id: 2,
        title: "Educational Scholarships",
        organization: "Future Leaders Institute",
        description:
            "Supporting bright students from underprivileged backgrounds to pursue higher education.",
        location: "Los Angeles, CA",
        daysLeft: 30,
        volunteersJoined: 18,
        totalVolunteers: 25,
    },
    {
        id: 3,
        title: "Food Security Program",
        organization: "Community Care Network",
        description:
            "Providing nutritious meals to families facing food insecurity in rural communities.",
        location: "Rural Areas",
        daysLeft: 7,
        volunteersJoined: 74,
        totalVolunteers: 100,
    },
];

export default function AnnouncementsSection() {
    return (
        <section className=" py-16 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Featured Aid Announcements
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Discover urgent aid opportunities where your support can make an
                        immediate impact
                    </p>
                </div>

                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {announcements.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border border-gray-300 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-8 flex flex-col justify-between w-full h-[400px]"
                        >
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-900">
                                    {item.title}
                                </h3>
                                <p className="text-teal-600 font-medium mt-1">
                                    {item.organization}
                                </p>
                                <p className="text-gray-600 mt-3 text-base">
                                    {item.description}
                                </p>

                                <div className="mt-4 flex items-center text-gray-500 text-sm gap-2">
                                    <span>📍 {item.location}</span>
                                </div>
                                <div className="mt-1 flex items-center text-gray-500 text-sm gap-2">
                                    <span>⏳ {item.daysLeft} days left</span>
                                </div>
                                <div className="mt-1 flex items-center text-gray-500 text-sm gap-2">
                                    <span>
                                        👥 {item.volunteersJoined} of {item.totalVolunteers} volunteers joined
                                    </span>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                                    <div
                                        className="bg-teal-500 h-2 rounded-full"
                                        style={{
                                            width: `${(item.volunteersJoined / item.totalVolunteers) * 100
                                                }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-between gap-4">
                                <Button className="bg-teal-600 hover:bg-teal-700 text-white w-1/2">
                                    Apply Now
                                </Button>
                                <Button variant="outline" className="w-1/2">
                                    Read More →
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Button
                        className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg"
                    >
                        View All Announcements →
                    </Button>
                </div>
            </div>
        </section>
    );
}
