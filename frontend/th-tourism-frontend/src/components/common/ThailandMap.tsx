// src/components/common/ThailandMap.tsx
// Interactive Thailand Map Component
import { useState } from "react";

interface Province {
  id: number;
  name: string;
}

interface ThailandMapProps {
  selectedProvinceName?: string | null;
  onProvinceClick: (provinceName: string) => void;
  provinces: Province[];
}

// Province data with realistic positions matching actual Thailand map
const PROVINCES_DATA = [
  // Northern region (ภาคเหนือ) - บนสุดของแผนที่
  { id: 1, name: "เชียงใหม่", x: 28, y: 15, w: 6, h: 5, region: "north" },
  { id: 2, name: "เชียงราย", x: 35, y: 8, w: 6, h: 5, region: "north" },
  { id: 3, name: "แม่ฮ่องสอน", x: 18, y: 14, w: 7, h: 6, region: "north" },
  { id: 4, name: "พะเยา", x: 36, y: 13, w: 4, h: 4, region: "north" },
  { id: 5, name: "น่าน", x: 42, y: 12, w: 5, h: 6, region: "north" },
  { id: 6, name: "ลำปาง", x: 32, y: 19, w: 5, h: 4, region: "north" },
  { id: 7, name: "แพร่", x: 38, y: 17, w: 4, h: 4, region: "north" },
  { id: 8, name: "ลำพูน", x: 28, y: 21, w: 3, h: 3, region: "north" },
  { id: 9, name: "อุตรดิตถ์", x: 41, y: 21, w: 4, h: 4, region: "north" },
  
  // Northern - Lower (ภาคเหนือตอนล่าง)
  { id: 10, name: "ตาก", x: 22, y: 22, w: 5, h: 6, region: "north" },
  { id: 11, name: "สุโขทัย", x: 29, y: 25, w: 5, h: 4, region: "north" },
  { id: 12, name: "พิษณุโลก", x: 35, y: 24, w: 5, h: 5, region: "north" },
  { id: 13, name: "กำแพงเพชร", x: 29, y: 29, w: 4, h: 4, region: "central" },
  { id: 14, name: "เพชรบูรณ์", x: 37, y: 28, w: 5, h: 6, region: "central" },
  
  // Northeastern region (ภาคอีสาน) - ขวาบนถึงขวากลาง
  { id: 15, name: "เลย", x: 45, y: 22, w: 4, h: 4, region: "northeast" },
  { id: 16, name: "หนองคาย", x: 50, y: 18, w: 5, h: 3, region: "northeast" },
  { id: 17, name: "บึงกาฬ", x: 55, y: 19, w: 4, h: 3, region: "northeast" },
  { id: 18, name: "อุดรธานี", x: 50, y: 22, w: 6, h: 4, region: "northeast" },
  { id: 19, name: "หนองบัวลำภู", x: 48, y: 26, w: 4, h: 3, region: "northeast" },
  { id: 20, name: "สกลนคร", x: 60, y: 20, w: 6, h: 5, region: "northeast" },
  { id: 21, name: "นครพนม", x: 63, y: 26, w: 5, h: 5, region: "northeast" },
  { id: 22, name: "กาฬสินธุ์", x: 56, y: 29, w: 5, h: 4, region: "northeast" },
  { id: 23, name: "ขอนแก่น", x: 48, y: 30, w: 6, h: 5, region: "northeast" },
  { id: 24, name: "มหาสารคาม", x: 54, y: 34, w: 5, h: 4, region: "northeast" },
  { id: 25, name: "ร้อยเอ็ด", x: 59, y: 36, w: 6, h: 5, region: "northeast" },
  { id: 26, name: "มุกดาหาร", x: 66, y: 31, w: 4, h: 4, region: "northeast" },
  
  // Northeastern - Lower (อีสานตอนล่าง)
  { id: 27, name: "ชัยภูมิ", x: 43, y: 35, w: 5, h: 5, region: "northeast" },
  { id: 28, name: "นครราชสีมา", x: 42, y: 41, w: 8, h: 7, region: "northeast" },
  { id: 29, name: "บุรีรัมย์", x: 48, y: 47, w: 6, h: 5, region: "northeast" },
  { id: 30, name: "สุรินทร์", x: 54, y: 48, w: 6, h: 5, region: "northeast" },
  { id: 31, name: "ศรีสะเกษ", x: 60, y: 50, w: 6, h: 5, region: "northeast" },
  { id: 32, name: "ยโสธร", x: 60, y: 42, w: 5, h: 4, region: "northeast" },
  { id: 33, name: "อำนาจเจริญ", x: 65, y: 44, w: 4, h: 4, region: "northeast" },
  { id: 34, name: "อุบลราชธานี", x: 64, y: 49, w: 7, h: 6, region: "northeast" },
  
  // Central region (ภาคกลาง)
  { id: 35, name: "นครสวรรค์", x: 33, y: 34, w: 6, h: 5, region: "central" },
  { id: 36, name: "อุทัยธานี", x: 27, y: 34, w: 4, h: 4, region: "central" },
  { id: 37, name: "ชัยนาท", x: 30, y: 39, w: 3, h: 3, region: "central" },
  { id: 38, name: "สิงห์บุรี", x: 33, y: 40, w: 3, h: 2, region: "central" },
  { id: 39, name: "ลพบุรี", x: 36, y: 40, w: 5, h: 4, region: "central" },
  { id: 40, name: "สระบุรี", x: 40, y: 45, w: 4, h: 4, region: "central" },
  { id: 41, name: "พระนครศรีอยุธยา", x: 34, y: 43, w: 4, h: 3, region: "central" },
  { id: 42, name: "อ่างทอง", x: 31, y: 43, w: 3, h: 3, region: "central" },
  { id: 43, name: "นครนายก", x: 42, y: 49, w: 3, h: 3, region: "central" },
  { id: 44, name: "ปทุมธานี", x: 36, y: 47, w: 3, h: 3, region: "central" },
  { id: 45, name: "นนทบุรี", x: 34, y: 48, w: 2, h: 2, region: "central" },
  { id: 46, name: "กรุงเทพมหานคร", x: 34, y: 50, w: 3, h: 3, region: "central" },
  { id: 47, name: "สมุทรปราการ", x: 37, y: 51, w: 3, h: 3, region: "central" },
  { id: 48, name: "สมุทรสาคร", x: 32, y: 52, w: 3, h: 2, region: "central" },
  { id: 49, name: "นครปฐม", x: 31, y: 49, w: 3, h: 3, region: "central" },
  
  // Western region (ภาคตะวันตก)
  { id: 50, name: "กาญจนบุรี", x: 22, y: 42, w: 7, h: 8, region: "central" },
  { id: 51, name: "สุพรรณบุรี", x: 28, y: 44, w: 4, h: 4, region: "central" },
  { id: 52, name: "ราชบุรี", x: 26, y: 50, w: 5, h: 4, region: "central" },
  { id: 53, name: "เพชรบุรี", x: 27, y: 55, w: 5, h: 5, region: "central" },
  { id: 54, name: "ประจวบคีรีขันธ์", x: 25, y: 61, w: 4, h: 7, region: "south" },
  
  // Eastern region (ภาคตะวันออก)
  { id: 55, name: "ฉะเชิงเทรา", x: 39, y: 52, w: 4, h: 4, region: "east" },
  { id: 56, name: "ชลบุรี", x: 40, y: 56, w: 5, h: 4, region: "east" },
  { id: 57, name: "ระยอง", x: 43, y: 59, w: 4, h: 4, region: "east" },
  { id: 58, name: "จันทบุรี", x: 47, y: 59, w: 4, h: 4, region: "east" },
  { id: 59, name: "ตราด", x: 50, y: 61, w: 4, h: 4, region: "east" },
  { id: 60, name: "ปราจีนบุรี", x: 43, y: 52, w: 4, h: 4, region: "east" },
  { id: 61, name: "สระแก้ว", x: 47, y: 52, w: 5, h: 5, region: "east" },
  
  // Southern region (ภาคใต้) - ยาวลงมาด้านล่าง
  { id: 62, name: "ชุมพร", x: 27, y: 69, w: 4, h: 5, region: "south" },
  { id: 63, name: "ระนอง", x: 20, y: 71, w: 4, h: 5, region: "south" },
  { id: 64, name: "สุราษฎร์ธานี", x: 26, y: 75, w: 6, h: 6, region: "south" },
  { id: 65, name: "พังงา", x: 19, y: 77, w: 4, h: 4, region: "south" },
  { id: 66, name: "ภูเก็ต", x: 17, y: 81, w: 3, h: 3, region: "south" },
  { id: 67, name: "กระบี่", x: 21, y: 82, w: 4, h: 4, region: "south" },
  { id: 68, name: "นครศรีธรรมราช", x: 28, y: 82, w: 5, h: 5, region: "south" },
  { id: 69, name: "พัทลุง", x: 28, y: 88, w: 4, h: 4, region: "south" },
  { id: 70, name: "ตรัง", x: 24, y: 87, w: 4, h: 4, region: "south" },
  { id: 71, name: "สตูล", x: 24, y: 92, w: 4, h: 4, region: "south" },
  { id: 72, name: "สงขลา", x: 28, y: 93, w: 5, h: 5, region: "south" },
  { id: 73, name: "ปัตตานี", x: 32, y: 96, w: 4, h: 3, region: "south" },
  { id: 74, name: "ยะลา", x: 30, y: 98, w: 4, h: 4, region: "south" },
  { id: 75, name: "นราธิวาส", x: 34, y: 99, w: 5, h: 4, region: "south" },
];

const REGION_COLORS = {
  north: "#10b981",    // green
  northeast: "#f59e0b", // orange
  central: "#3b82f6",  // blue
  east: "#8b5cf6",     // purple
  south: "#ec4899",    // pink
};

export default function ThailandMap({
  selectedProvinceName,
  onProvinceClick,
}: ThailandMapProps) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  const handleProvinceClick = (provinceName: string) => {
    onProvinceClick(provinceName);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl border-2 border-blue-300 overflow-hidden w-full" style={{ minHeight: "700px", height: "calc(100vh - 200px)" }}>
      <div className="bg-linear-to-r from-blue-500 to-blue-600 px-4 py-3">
        <h3 className="text-white font-bold text-lg">🗺️ แผนที่ประเทศไทย</h3>
        <p className="text-blue-100 text-sm mt-1">คลิกที่จังหวัดเพื่อดูสถานที่ท่องเที่ยว</p>
      </div>
      
      <div className="p-4" style={{ height: "calc(100% - 140px)" }}>
        <svg
          viewBox="0 0 75 110"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background */}
          <rect width="75" height="110" fill="#f0f9ff" />
          
          {/* Province rectangles */}
          {PROVINCES_DATA.map((province) => {
            const isSelected = selectedProvinceName === province.name;
            const isHovered = hoveredProvince === province.name;
            const regionColor = REGION_COLORS[province.region as keyof typeof REGION_COLORS];
            
            return (
              <g key={province.id}>
                <rect
                  x={province.x}
                  y={province.y}
                  width={province.w}
                  height={province.h}
                  fill={isSelected ? "#f59e42" : isHovered ? "#60a5fa" : regionColor}
                  opacity={isSelected ? 0.9 : isHovered ? 0.85 : 0.7}
                  stroke="#fff"
                  strokeWidth="0.2"
                  rx="0.4"
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => handleProvinceClick(province.name)}
                  onMouseEnter={() => setHoveredProvince(province.name)}
                  onMouseLeave={() => setHoveredProvince(null)}
                />
                
                {/* Province name label */}
                {(isHovered || isSelected) && (
                  <text
                    x={province.x + province.w / 2}
                    y={province.y + province.h / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-bold fill-white pointer-events-none select-none"
                    style={{ 
                      fontSize: "1.2px",
                      textShadow: "0 0 3px rgba(0,0,0,0.8)"
                    }}
                  >
                    {province.name}
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Region labels */}
          <text x="32" y="12" textAnchor="middle" className="font-bold fill-gray-700 opacity-50" style={{ fontSize: "2px" }}>ภาคเหนือ</text>
          <text x="55" y="35" textAnchor="middle" className="font-bold fill-gray-700 opacity-50" style={{ fontSize: "2px" }}>ภาคอีสาน</text>
          <text x="32" y="48" textAnchor="middle" className="font-bold fill-gray-700 opacity-50" style={{ fontSize: "2px" }}>ภาคกลาง</text>
          <text x="45" y="58" textAnchor="middle" className="font-bold fill-gray-700 opacity-50" style={{ fontSize: "2px" }}>ภาคตะวันออก</text>
          <text x="27" y="85" textAnchor="middle" className="font-bold fill-gray-700 opacity-50" style={{ fontSize: "2px" }}>ภาคใต้</text>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="px-6 pb-4 flex flex-wrap gap-3 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: REGION_COLORS.north }}></div>
          <span className="text-xs text-gray-600">ภาคเหนือ</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: REGION_COLORS.northeast }}></div>
          <span className="text-xs text-gray-600">ภาคอีสาน</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: REGION_COLORS.central }}></div>
          <span className="text-xs text-gray-600">ภาคกลาง</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: REGION_COLORS.east }}></div>
          <span className="text-xs text-gray-600">ภาคตะวันออก</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: REGION_COLORS.south }}></div>
          <span className="text-xs text-gray-600">ภาคใต้</span>
        </div>
      </div>
    </div>
  );
}
