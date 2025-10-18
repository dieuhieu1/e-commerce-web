import React, { useState, useRef, useEffect } from "react";

function Tabs({ data }) {
  const [activeTab, setActiveTab] = useState(data[0].id);
  const [sliderStyle, setSliderStyle] = useState({});
  const tabsRef = useRef([]);

  useEffect(() => {
    const activeTabIndex = data.findIndex((tab) => tab.id === activeTab);
    const activeTabElement = tabsRef.current[activeTabIndex];

    if (activeTabElement) {
      setSliderStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeTab, data]);
  if (!data || data.length === 0) return null;

  const activeContent = data.find((tab) => tab.id === activeTab)?.content;

  return (
    <>
      <div className="w-full max-w-full mx-auto border-b border-gray-200">
        <div className="relative">
          <div className="flex space-x-2">
            {data.map((tab, index) => (
              <button
                key={tab.id}
                ref={(el) => (tabsRef.current[index] = el)}
                onClick={() => setActiveTab(tab.id)}
                className={`
                px-5 py-3 text-base font-medium transition-colors duration-300 ease-in-out focus:outline-none rounded-t-lg
                ${
                  activeTab === tab.id
                    ? "text-red-600"
                    : "text-gray-500 hover:text-gray-900"
                }
                `}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                {tab.title}
              </button>
            ))}
          </div>
          <div
            className="absolute bottom-0 h-1 bg-red-500 rounded-full transition-all duration-300 ease-in-out"
            style={sliderStyle}
          />
        </div>
      </div>

      <div className="w-full max-w-5xl ">
        <div className="mt-10 mx-5 ">{activeContent}</div>
      </div>
    </>
  );
}

export default Tabs;
