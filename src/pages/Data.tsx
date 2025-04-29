
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EntriesTable } from "@/components/EntriesTable";
import { readFromDatabase } from "@/utils/storage";
import { type Entry } from "@/utils/storage";

const Data = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showData, setShowData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    
    const loadEntries = async () => {
      const loadedEntries = await readFromDatabase();
      setEntries(loadedEntries);
    };
    
    loadEntries();
  }, [navigate]);

  const handleToggleData = () => {
    setShowData(!showData);
  };

  return (
    <div
      className="min-h-screen py-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/lovable-uploads/e86c45f7-76ea-4e52-9f70-07075333499f.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#f0f4f8",
        direction: "rtl"
      }}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <div className="bg-white/90 p-4 rounded-lg shadow-md inline-block mb-4">
            <img 
              src="/lovable-uploads/e86c45f7-76ea-4e52-9f70-07075333499f.png" 
              alt="حزب مستقبل وطن" 
              className="h-24 mx-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">البيانات المسجلة</h1>
          <h2 className="text-lg text-white drop-shadow-md">أمانة شباب قسم منتزة أول - 2025</h2>
        </div>

        <EntriesTable
          entries={entries}
          isAuthorized={true}
          showData={showData}
          onToggleData={handleToggleData}
          onPasswordSubmit={() => {}}
        />
      </div>
    </div>
  );
};

export default Data;
