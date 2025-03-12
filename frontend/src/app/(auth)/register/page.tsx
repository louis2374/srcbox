const page = () =>
{
    return (
        <div className="relative w-screen h-screen bg-black overflow-hidden">
            <svg
                className="absolute top-0 left-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
                preserveAspectRatio="none"
            >
                {/* First Triangle (Base) */}
                <polygon points="0,0 100,0 0,100" fill="#4B5563" />
                {/* Second Triangle (Slightly shifted and darker shade) */}
                <polygon points="0,100 100,0 100,100" fill="#374151" />
                {/* Third Triangle (Light shade, offset for 3D effect) */}
                <polygon points="100,0 200,0 100,100" fill="#6B7280" />
                {/* Fourth Triangle (Shifted to make it 3D with color variation) */}
                <polygon points="100,100 200,0 200,100" fill="#9CA3AF" />
            </svg>

            {/* Content */}
            <div className="flex items-center justify-center h-full text-white">
                <h1 className="text-3xl">3D Triangle Background</h1>
            </div>
        </div>
    );
}

export default page;