import React from 'react';
import { GraduationCap, Stethoscope, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ✅ import

const EduTutor = () => {
    const navigate = useNavigate(); // ✅ React Router hook

    const courses = [
        { name: 'Engineering', icon: <GraduationCap className="w-16 h-16 text-blue-500" />, page: '/engineering' },
        { name: 'MBBS', icon: <Stethoscope className="w-16 h-16 text-red-500" />, page: '/mbbs' },
        { name: 'MBA', icon: <Briefcase className="w-16 h-16 text-green-500" />, page: '/mba' },
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center bg-white rounded-2xl shadow-lg p-8 mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    Welcome to the Course Catalog
                </h1>
                <p className="text-lg text-gray-600">
                    Select a field of study to explore available courses and build your curriculum.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                    <div
                        key={course.name}
                        onClick={() => navigate(course.page)} // ✅ use navigate
                        className="bg-white p-8 rounded-2xl border-2 border-gray-100 cursor-pointer transition-all duration-300 ease-in-out transform hover:shadow-2xl hover:-translate-y-2 hover:border-blue-400"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            {course.icon}
                            <h2 className="text-2xl font-bold text-gray-800">{course.name}</h2>
                            <p className="text-gray-500">Click to view all {course.name} courses.</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EduTutor;
