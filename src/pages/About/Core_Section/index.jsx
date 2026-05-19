import React from "react";
import { corePhilosophies } from "./data";

const CoreSection = ({ visibleSections }) => {
  return (
    <>
      <section
        id="philosophy"
        data-section
        className={`py-6 md:py-16 lg:py-18 px-6 md:px-8 transition-all duration-1000 ${
          visibleSections.has("philosophy")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-16"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold pb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 leading-snug">
              Bốn Phần Nội Dung Cốt Lõi
            </h2>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Bốn khối kiến thức dưới đây bao quát toàn bộ phép biện chứng duy vật:
              hai nguyên lý, sáu cặp phạm trù và ba quy luật cơ bản.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {corePhilosophies.map((philosophy, index) => (
              <div
                key={index}
                className={`group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-amber-400/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-400/10 ${
                  visibleSections.has("philosophy")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="text-amber-400 mb-6">{philosophy.icon}</div>

                <h3 className="text-2xl font-bold mb-2 text-slate-100 transition-colors duration-300">
                  {philosophy.title}
                </h3>

                <div className="text-gray-400/80 font-medium mb-4">
                  {philosophy.subtitle}
                </div>

                <p className="text-slate-300 mb-6 leading-relaxed">
                  {philosophy.description}
                </p>

                <div className="space-y-3">
                  {philosophy.principles.map((principle, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-slate-400">
                        {principle}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                  <div className="w-8 h-8 border-t-2 border-r-2 border-amber-400/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CoreSection;
